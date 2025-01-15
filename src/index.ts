interface Item {
  type_name: string;
  quantity?: number;
  volume?: number;
}

interface ParsedResult {
  items: Item[];
  failed: string[];
}

export default function evepaste(text_input: string): ParsedResult {
  // Parsers should be ordered from most specific to least specific
  const parsers = [
    inventoryOrContract, // should always be first
    braveMoonPing,
    manualEntryItem,
  ];

  const parsed_result = text_input.split(/\r?\n/).reduce(
    (acc_result, line) => {
      const line_trimmed = line.trim();
      let parsed = null;

      for (const parser of parsers) {
        parsed = parser(line_trimmed);
        if (parsed !== null) {
          break;
        }
      }

      if (parsed !== null) {
        acc_result.items.push(parsed);
      } else {
        acc_result.failed.push(line_trimmed);
      }

      return acc_result;
    },
    {
      items: [] as Item[],
      failed: [] as string[],
    }
  );

  return parsed_result;
}

function inventoryOrContract(line: string) {
  const fields = line.split(/\t/);

  if (fields.length < 2) {
    return null;
  }

  let [type_name, quantity] = fields;
  quantity = quantity.replace(/\./g, ""); // remove thousand separators for convenience

  // if type_name has no letters or is multibuy's totals
  if (!/[A-Za-z]/.test(type_name) || type_name.startsWith("Total:")) {
    return null;
  }

  // if the item is a Blueprint or a Formula
  if (type_name.includes("Blueprint") || type_name.includes("Formula")) {
    if (
      !fields[fields.length - 1].includes(" ISK") &&
      !line.includes("ORIGINAL BLUEPRINT")
    ) {
      return null;
    }

    if (quantity === "") {
      quantity = "1";
    }
  }

  // if quantity contains a comma or is not an integer
  if (quantity.includes(",") || !/^\d+$/.test(quantity)) {
    return null;
  }

  return {
    type_name,
    quantity: parseInt(quantity, 10),
  };
}

function braveMoonPing(line: string) {
  const fields = line.split(" ");

  if (fields.length < 3) {
    return null;
  }

  let [type_name, volume, unit] = fields;
  type_name = type_name.replace(":", ""); // remove eventual colon
  volume = volume.replace(/,/g, ""); // remove thousand separators for convenience

  // if type_name has no letters
  if (!/[A-Za-z]/.test(type_name)) {
    return null;
  }

  // if volume is not a number
  if (!/^\d+$/.test(volume)) {
    return null;
  }

  // if unit is not cubic meters
  const validUnits = new Set(["m³", "m3"]);
  if (!validUnits.has(unit)) {
    return null;
  }

  return {
    type_name,
    volume: parseFloat(volume),
  };
}

function manualEntryItem(line: string) {
  // if is a tab-separated it is not considered a manual entry
  if (line.includes("\t")) {
    return null;
  }

  const lastSpaceIndex = line.lastIndexOf(" ");

  if (lastSpaceIndex === -1) {
    return null;
  }

  let type_name = line.substring(0, lastSpaceIndex);
  let quantity = line.substring(lastSpaceIndex + 1);

  // if type_name has no letters
  if (!/[A-Za-z]/.test(type_name)) {
    return null;
  }

  // if quantity contains a comma or is not an integer
  if (quantity.includes(",") || !/^\d+$/.test(quantity)) {
    return null;
  }

  return {
    type_name,
    quantity: parseInt(quantity, 10),
  };
}
