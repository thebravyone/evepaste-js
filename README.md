# evepaste-js

`evepaste-js` is a Node.js library that parses copied and pasted data from [EVE Online](https://www.eveonline.com/). It was inspired by [evepraisal/evepaste](https://github.com/evepraisal/evepaste), but with a different parsing strategy.

## Install

```sh
npm install evepaste-js
```

## Usage

```typescript
import evepaste from "evepaste-js";

const parsedItems = evepaste("Tritanium\t1\nTotal:\t4,50");
console.log(parsedItems);
//=> { items: [{ type_name: "Tritanium", quantity: 1 }], failed: ["Total:\t4,50"] }
```

## API

### `evepaste(text_input)`

Splits `text_input` into lines and parses each one.

Returns an object containing:

- `items` (Array): An array of parsed items. Each item is an object with the following structure:

  ```json
  {
    "type_name": "string",
    "quantity"?: "number",
    "volume"?: "number"
  }
  ```

  - **`type_name`** (string): The name of the item, always returned.
  - **`quantity`** (number, optional): The quantity of the item.
  - **`volume`** (number, optional): The volume in m³.

  Note: `quantity` and `volume` are optional fields and will only be included if they can be inferred from the input data. **If neither is parsed, the line will be marked as failed**.

- `failed` (Array): An array of strings representing lines that could not be parsed.

### Parameters

#### `text_input`

Type: `string`

The text input to parse, usually copied from EVE Online.

## Notes

Output names follow Python-style conventions so it can easily integrate with [ESI](https://esi.evetech.net/ui/) or [EveRef](https://docs.everef.net/datasets/).
