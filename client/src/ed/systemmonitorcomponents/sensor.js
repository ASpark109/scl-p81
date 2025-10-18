import * as PIXI from 'pixi.js';

import { styles } from './monitorstyle';

export class Sensor extends PIXI.Container
{
    #sensorName = "";
    #unit = "";
    #value = 0;
    #displayValue = null;

    constructor(name, unit)
    {
        super();

        this.#sensorName = name;
        this.#unit = unit;

        this.create();
    }

    create()
    {
        const rect = new PIXI.Graphics();

        rect.lineStyle(1, styles.green, 1);
        rect.drawRect(0, 0, styles.sensorFrameWidth, styles.sensorFrameHeight);

        rect.pivot.set( rect.width / 2,
                        rect.height / 2);

        const sensorName = new PIXI.Text(this.#sensorName, {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });

        this.#displayValue = new PIXI.Text(this.#value + " " + this.#unit, {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });

        sensorName.anchor.set(0.5);
        sensorName.y = -rect.height / 5;

        this.#displayValue.anchor.set(0.5);
        this.#displayValue.y = rect.height / 5;

        this.addChild(rect);
        this.addChild(sensorName);
        this.addChild(this.#displayValue);
    }

    update(newValue)
    {
        if (this.#value === newValue)
            return;

        this.#value = newValue;
        this.#displayValue.text = Math.round(this.#value) + " " + this.#unit;
    }
}