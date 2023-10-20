export default function evepaste(paste) {

    if (typeof paste !== "string")
        return;

    const rows = paste.split("\n").map((r) => r.split("\t"));

    return rows
        .map(r => parseRow(r))
        .filter(r => r !== undefined)
        .reduce((aggregated, item) => {
            const existingItem = aggregated.find((aggItem) => aggItem.typeName === item.typeName)
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                aggregated.push({ ...item })
            }
            return aggregated
        }, []);
}

function parseRow(row) {

    if (typeof row[0] === "string" && row[0] !== '') {

        // Multibuy totals
        if (row[0] === "Total:")
            return

        //  Unpacked or Used charge
        if (row[1] === '')
            return

        // Item or Ship
        const quantity = parseInt(row[1].replace('.', ''));
        if (!isNaN(quantity) && !/[a-z]/i.test(row[1]))
            return {
                typeName: row[0].trim(), // trim to remove space padding in contracts of fitted ships
                quantity: quantity
            }
    }

}