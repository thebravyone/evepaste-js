import test from "ava";
import evepaste from "./index.js";

test("parse-inventory-item", (t) => {
  const item =
    "Platinum	24.647	Moon Materials	Material			1.232,35 m3		None	221.440.478,56 ISK";
  const parsedItem = evepaste(item);
  t.deepEqual(parsedItem, [
    {
      typeName: "Platinum",
      quantity: 24647,
    },
  ]);
});

test("parse-contract-item", (t) => {
  const item = "Batch Compressed Golden Omber	4.187	Omber	Asteroid	";
  const parsedItem = evepaste(item);
  t.deepEqual(parsedItem, [
    {
      typeName: "Batch Compressed Golden Omber",
      quantity: 4187,
    },
  ]);
});

test("parse-contract-ship", (t) => {
  const content =
    " Warrior II	5	Combat Drone	Drone	Drone Bay\nEagle	1	Heavy Assault Cruiser	Ship	";
  const parsedContent = evepaste(content);
  t.deepEqual(parsedContent, [
    {
      typeName: "Warrior II",
      quantity: 5,
    },
    {
      typeName: "Eagle",
      quantity: 1,
    },
  ]);
});

test("parse-multibuy", (t) => {
  const item = "Co-Processor II	1	964.900,00	964.900,00\nTotal:			964.900,00";
  const parsedItem = evepaste(item);
  t.is(parsedItem.length, 1);
  t.deepEqual(parsedItem, [
    {
      typeName: "Co-Processor II",
      quantity: 1,
    },
  ]);
});

test("discard-unpacked-item", (t) => {
  const item =
    "10MN Afterburner II		Propulsion Module	Module			5 m3	5	2	2.361.084,25 ISK";
  t.is(evepaste(item).length, 0);
});

test("discard-used-ammo", (t) => {
  const item =
    "Aurora S		Advanced Beam Laser Crystal	Charge	Small		1 m3	5	2	77.892,89 ISK";
  t.is(evepaste(item).length, 0);
});

test("discard-fitted-ship", (t) => {
  const item = "[DOC] Eagle		Heavy Assault Cruiser	Ship	";
  t.is(evepaste(item).length, 0);
});

test("discard-multibuy-totals", (t) => {
  const totals = "Total:			194.766.900,00";
  t.is(evepaste(totals).length, 0);
});

test("discard-missing-col-name", (t) => {
  const missing = "1	Combat Recon Ship	Ship			10.000 m3	5	2	181.716.445,62 ISK";
  t.is(evepaste(missing).length, 0);
});

test("discard-missing-col-quantity", (t) => {
  const missing = "Huginn	Combat Recon Ship	Ship			10.000 m3	5	2	181.716.445,62 ISK";
  t.is(evepaste(missing).length, 0);
});
