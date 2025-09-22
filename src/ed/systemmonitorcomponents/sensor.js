import * as PIXI from 'pixi.js';

import { styles } from './monitorstyle';

export class Sensor extends PIXI.Container
{
    #sensorName = "";
    #unit = "";
    #value = 0;

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

        rect.lineStyle(1, styles.green, 1);   // товщина 2px, зелений колір
        rect.drawRect(0, 0, styles.sensorFrameWidth, styles.sensorFrameHeight);   // (x, y, width, height)

        rect.pivot.set( rect.width / 2,
                        rect.height / 2);

        const sensorName = new PIXI.Text(this.#sensorName, {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,   // зелений колір тексту
            align: "center"
        });

        const message = new PIXI.Text(this.#value + " " + this.#unit, {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,   // зелений колір тексту
            align: "center"
        });

        sensorName.anchor.set(0.5);
        sensorName.y = -rect.height / 5;

        message.anchor.set(0.5);
        message.y = rect.height / 5;

        this.addChild(rect);
        this.addChild(sensorName);
        this.addChild(message);
    }

    update(newValue)
    {
        if (this.#value === newValue)
            return;

        this.#value = newValue;
    }
}