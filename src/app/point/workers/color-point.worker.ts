/// <reference lib="webworker" />

import { IColRow } from "src/app/models/col-row.interface";

addEventListener('message', (message: MessageEvent) => {
    const colorPoint: { [key: string]: IColRow[] } = {};
    const cells = message.data.recColor.cells;
    const cellsColor = message.data.recColor.cellsColor;
    for (let row = 0; row < cells.length; row++) {
        for (let col = 0; col < cells[row].length; col++) {
            const num = cells[row][col];
            const color = cellsColor[num];
            !colorPoint[color] && (colorPoint[color] = []);
            colorPoint[color].push({ col, row, num });
        }
    }

    postMessage(colorPoint);
});