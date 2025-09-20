

function isValidMagicSquare(squareText) {
    const root = Math.sqrt(squareText.length);

    // verify that it is square
    if (root !== Math.floor(root)) return false;

    const a = convertToArray(squareText);

    
}

function convertToArray(squareText) {
    const root = Math.sqrt(squareText.length);

    const a = [];
    let i = 0;
    for (let y = 0; y < root.length; y++) {
        const row = [];
        a.push(row);
        for (let x = 0; x < root.length; x++) {
            row.push(squareText.charAt(i));
            i++;
        }
    }
    return a;
}