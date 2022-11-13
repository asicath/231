const {mixHexColors, halfBrightness } = require('./color');

let cells = null;

function initTriangle(width, height, margin, rows) {

    //console.log('generating points');
    allPointOfTheTriangle(width, height, margin, rows);

    // for mouse
    for (const cell of Object.values(cells)) {
        cell.polygon = cell.points.map(p => [p.x, p.y]);
        cell.selected = false;
    }

    return cells;
}

function allPointOfTheTriangle(width, height, margin, rows) {

    const yOffsetGlobal = -height*0.07;

    // reset the cells
    cells = {};

    const tri = {
        center: {x: width / 2, y: height / 2},
    };

    // find the lowest point
    tri.p2 = {x: width / 2, y: height - margin};

    // find the other two points based on the radius implied by this point
    const radius = tri.p2.y - tri.center.y;
    // upper left
    const angle0 = Math.PI * 0.5 + Math.PI * 2 * (1/3);
    tri.p0 = {
        x: Math.cos(angle0) * radius + tri.center.x,
        y: Math.sin(angle0) * radius + tri.center.y
    };
    // upper right
    const angle1 = Math.PI * 0.5 + Math.PI * 2 * (2/3);
    tri.p1 = {
        x: Math.cos(angle1) * radius + tri.center.x,
        y: Math.sin(angle1) * radius + tri.center.y
    };

    tri.edge = [[],[],[]]; // TOP, LEFT, RIGHT

    tri.edge[0] = getPointsBetween(tri.p0, tri.p1); // left to right
    tri.edge[1] = getPointsBetween(tri.p0, tri.p2); // moving down to the bottom from left
    tri.edge[2] = getPointsBetween(tri.p2, tri.p1); // moving up to the right

    // now find the diamond dimensions
    const diamond = {
        width: tri.edge[0][1].x - tri.edge[0][0].x,
        height: tri.edge[1][2].y - tri.edge[0][1].y,
    }

    tri.rows = []; // 22 rows, from left to right - 0 has 21 cells, 1 has 20, etc

    for (let row = 0; row < 22; row++) {
        tri.rows[row] = [];

        const xOffset = tri.edge[0][row].x;
        const yOffset = tri.edge[0][row].y - diamond.height * 0.5;

        for (let i = 0; i < (22-row); i++) {
            const x = xOffset + diamond.width * 0.5 * i;
            const y = yOffset + diamond.height * 0.5 * i;

            const points = [];

            const extra = 0.5;

            // diamonds start with a top point
            if (i > 0) {
                points.push({x: x + diamond.width * 0.5, y: y - extra}); // TOP
            }

            points.push({x: x + diamond.width + extra, y: y + diamond.height * 0.5}); // RIGHT
            points.push({x: x + diamond.width * 0.5, y: y + diamond.height + extra}); // BOTTOM
            points.push({x: x - extra, y: y + diamond.height * 0.5}); // LEFT

            // individual atus, add a tab on top
            if (i === 0) {
                points.push({x: x - extra, y: y - diamond.height * 0.5}); // LEFT top
                points.push({x: x + diamond.width + extra, y: y - diamond.height * 0.5}); // RIGHT top
            }

            tri.rows[row].push(points);

            // find the color of this gate
            const card0 = rows[row];
            const card1 = rows[row + i];
            const mixed = mixHexColors(card0.color, card1.color);
            const textBackgroundColor = mixHexColors(mixed, 'FFFFFF');
            const borderColor = halfBrightness(mixed);

            const numMin = Math.min(card0.number, card1.number);
            const numMax = Math.max(card0.number, card1.number);

            // create and store the cell
            const cell = {
                points: points.map(p => {
                    return {x: p.x, y: p.y + yOffsetGlobal}
                }),
                key: `${row}-${i}`,
                clickKey: `${numMin}-${numMax}`,
                color: mixed,
                textBackgroundColor,
                borderColor
            };
            cells[cell.key] = cell;
        }
    }
}

function getPointsBetween(p0, p1) {
    const points = [];
    const delta = {
        x: p1.x - p0.x,
        y: p1.y - p0.y
    }

    // TOP
    for (let i = 0; i <= 22; i++) {
        const percent = i / 22;
        const point = {
            x: p0.x + delta.x * percent,
            y: p0.y + delta.y * percent,
        }

        points.push(point)
    }

    return points;
}

module.exports = {initTriangle};
