import test from "ava";
import evepaste from "../dist/index.js";

test("inventory-item", (t) => {
  const text_input =
    "Platinum	24.647	Moon Materials	Material			1.232,35 m3		None	221.440.478,56 ISK";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Platinum",
        quantity: 24647,
      },
    ],
    failed: [],
  });
});

test("inventory-item-missing-cols", (t) => {
  const text_input =
    "Platinum	1.232,35 m3		None	221.440.478,56 ISK\nPlatinum	221.440.478,56 ISK";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [],
    failed: [
      "Platinum	1.232,35 m3		None	221.440.478,56 ISK",
      "Platinum	221.440.478,56 ISK",
    ],
  });
});

test("inventory-unpacked-item", (t) => {
  const text_input =
    "10MN Afterburner II		Propulsion Module	Module			5 m3	5	2	2.361.084,25 ISK";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [],
    failed: [
      "10MN Afterburner II		Propulsion Module	Module			5 m3	5	2	2.361.084,25 ISK",
    ],
  });
});

test("inventory-used-ammo", (t) => {
  const text_input =
    "Aurora S		Advanced Beam Laser Crystal	Charge	Small		1 m3	5	2	77.892,89 ISK";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [],
    failed: [
      "Aurora S		Advanced Beam Laser Crystal	Charge	Small		1 m3	5	2	77.892,89 ISK",
    ],
  });
});

test("inventory-assembled-ship", (t) => {
  const text_input =
    "Fulanos's Revelation Navy Issue		Dreadnought	Ship			18.500.000 m3	7	1	5.418.428.571,43 ISK";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [],
    failed: [
      "Fulanos's Revelation Navy Issue		Dreadnought	Ship			18.500.000 m3	7	1	5.418.428.571,43 ISK",
    ],
  });
});

test("inventory-bpo", (t) => {
  const text_input =
    "Antimatter Reactor Unit Blueprint		Construction Component Blueprints			0,01 m3	5.119.396,66 ISK";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Antimatter Reactor Unit Blueprint",
        quantity: 1,
      },
    ],
    failed: [],
  });
});

test("inventory-bpc", (t) => {
  const text_input = "Ares Blueprint		Frigate Blueprint			0,01 m3	";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [],
    failed: ["Ares Blueprint		Frigate Blueprint			0,01 m3"],
  });
});

test("inventory-formula", (t) => {
  const text_input =
    "Axosomatic Neurolink Enhancer Reaction Formula		Molecular-Forged Reaction Formulas	Blueprint			0,01 m3		1	10.000.000,00 ISK";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Axosomatic Neurolink Enhancer Reaction Formula",
        quantity: 1,
      },
    ],
    failed: [],
  });
});

test("contract-item", (t) => {
  const text_input = "Batch Compressed Golden Omber	4.187	Omber	Asteroid	";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Batch Compressed Golden Omber",
        quantity: 4187,
      },
    ],
    failed: [],
  });
});

test("contract-assembled-ship", (t) => {
  const text_input =
    " Warrior II	5	Combat Drone	Drone	Drone Bay\nEagle	1	Heavy Assault Cruiser	Ship	";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Warrior II",
        quantity: 5,
      },
      {
        type_name: "Eagle",
        quantity: 1,
      },
    ],
    failed: [],
  });
});

test("contract-bpo", (t) => {
  const text_input =
    " Augoror Blueprint	1	Cruiser Blueprint	Blueprint	ORIGINAL BLUEPRINT - Material Efficiency: 6 - Time Efficiency: 12\nSmall Standard Container	1	Cargo Container	Celestial	";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Augoror Blueprint",
        quantity: 1,
      },
      {
        type_name: "Small Standard Container",
        quantity: 1,
      },
    ],
    failed: [],
  });
});

test("contract-bpc", (t) => {
  const text_input =
    " Capital Ancillary Remote Armor Repairer Blueprint	1	Remote Armor Repairer Blueprint	Blueprint	BLUEPRINT COPY - Runs: 20 - Material Efficiency: 0 - Time Efficiency: 0\nSmall Standard Container	1	Cargo Container	Celestial	";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Small Standard Container",
        quantity: 1,
      },
    ],
    failed: [
      "Capital Ancillary Remote Armor Repairer Blueprint	1	Remote Armor Repairer Blueprint	Blueprint	BLUEPRINT COPY - Runs: 20 - Material Efficiency: 0 - Time Efficiency: 0",
    ],
  });
});

test("contract-formula", (t) => {
  const text_input =
    " Axosomatic Neurolink Enhancer Reaction Formula	1	Molecular-Forged Reaction Formulas	Blueprint			0,01 m3		1	10.000.000,00 ISK";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Axosomatic Neurolink Enhancer Reaction Formula",
        quantity: 1,
      },
    ],
    failed: [],
  });
});

test("multibuy", (t) => {
  const text_input = "Co-Processor II	1	964.900,00	964.900,00\nTotal:			964.900,00";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Co-Processor II",
        quantity: 1,
      },
    ],
    failed: ["Total:			964.900,00"],
  });
});

test("brave-moon-ping", (t) => {
  const text_input =
    "Cobaltite: 15,828,569 m³\nChromite: 8,115,740 m³\nMonazite: 13,232,691 m³";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Cobaltite",
        volume: 15828569,
      },
      {
        type_name: "Chromite",
        volume: 8115740,
      },
      {
        type_name: "Monazite",
        volume: 13232691,
      },
    ],
    failed: [],
  });
});

test("manual-entry", (t) => {
  const text_input = "Tritanium 3269\nCo-Processor II 1";
  const parsed_result = evepaste(text_input);
  t.deepEqual(parsed_result, {
    items: [
      {
        type_name: "Tritanium",
        quantity: 3269,
      },
      {
        type_name: "Co-Processor II",
        quantity: 1,
      },
    ],
    failed: [],
  });
});
