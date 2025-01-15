interface Item {
  type_name: string;
  quantity?: number;
  volume?: number;
}

interface ParsedResult {
  items: Item[];
  failed: string[];
}
