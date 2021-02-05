/// <reference lib="webworker" />

import { IColRow } from "../../coloring/models/col-row.interface";
import { IRecColor } from "../../coloring/models/rec-color.interface";

addEventListener('message', (message: MessageEvent) => {
    const recColor: IRecColor = message.data;
    const colorPoint: { [key: string]: IColRow[] } = {};
    const cells = recColor.cells;
    const cellsColor = recColor.cellsColor;
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