
function calcSonSquares(a) {
    let sum = 0;

    // center cross of 5 squares
    sum += a[1][1];
    sum += a[3][1];
    sum += a[1][3];
    sum += a[3][3];

    return sum;
}

function calcMiddleCross(a) {
    let sum = 0;

    // center cross of 5 squares
    sum += a[1][2];
    sum += a[2][2];
    sum += a[3][2];
    sum += a[2][1];
    sum += a[2][3];

    return sum;
}

function calcRightHandS(a) {

    let sum = 0;

    // center cross of 5 squares
    sum += a[1][2];
    sum += a[2][2];
    sum += a[3][2];
    sum += a[2][1];
    sum += a[2][3];

    // top
    sum += a[0][2];
    sum += a[0][3];
    sum += a[0][4];

    // right
    sum += a[2][4];
    sum += a[3][4];
    sum += a[4][4];

    // bottom
    sum += a[4][2];
    sum += a[4][1];
    sum += a[4][0];

    // left
    sum += a[2][0];
    sum += a[1][0];
    sum += a[0][0];

    return sum;
}


function calcLeftHandS(a) {

    let sum = 0;

    // center cross of 5 squares
    sum += a[1][2];
    sum += a[2][2];
    sum += a[3][2];
    sum += a[2][1];
    sum += a[2][3];

    // top
    sum += a[0][2];
    sum += a[0][1];
    sum += a[0][0];

    // right
    sum += a[2][4];
    sum += a[1][4];
    sum += a[0][4];

    // bottom
    sum += a[4][2];
    sum += a[4][3];
    sum += a[4][4];

    // left
    sum += a[2][0];
    sum += a[3][0];
    sum += a[4][0];

    return sum;
}

module.exports = {
    calcSonSquares,
    calcMiddleCross,
    calcRightHandSwastika,
    calcLeftHandSwastika
}