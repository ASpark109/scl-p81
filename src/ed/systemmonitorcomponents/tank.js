import * as PIXI from 'pixi.js';

import { styles } from './monitorstyle';

export class Tank extends PIXI.Container
{
    #value = 0;
    #name = "";
    #width = 0;
    #height = 0;

    constructor(name, width, height)
    {
        super();

        this.#name = name;
        this.#width = width;
        this.#height = height;

        this.create();
    }

    create()
    {
        const rect = new PIXI.Graphics();

        rect.lineStyle(1, 0x00FF00, 1);   // товщина 2px, зелений колір
        rect.drawRoundedRect(0, 0, this.#width, this.#height, 8);

        rect.pivot.set(this.#width / 2, this.#height / 2)

        const header = new PIXI.Text(this.#name, {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });

        let value = new PIXI.Text(0 + " kg.", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });

        header.anchor.set(0.5);
        header.x = rect.x;
        header.y = rect.y;
        
        value.anchor.set(0.5);
        value.x = rect.x;
        value.y = rect.y + 20;

        this.addChild(rect);
        this.addChild(header);
        this.addChild(value);
    }

    update(newValue)
    {
        if (this.#value === newValue)
            return;

        this.#value = newValue;
    }
}