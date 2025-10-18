import * as PIXI from 'pixi.js';

import { styles } from './monitorstyle';

export class Pump extends PIXI.Container
{
    #value = 0;
    #displayValueRPM = null;
    #conf = null;
    #icon = null;

    constructor(conf)
    {
        super();

        this.#conf = conf;

        //this.pivot.set(0.5)

        this.create();
    }

    create()
    {
        const circle = new PIXI.Graphics();

        circle.lineStyle(1, styles.green, 1);
        circle.drawCircle(0, 0, 17);

        circle.x = this.#conf.position.x;
        circle.y = this.#conf.position.y;


        this.#icon = new PIXI.Graphics();
        this.#icon.lineStyle(1, styles.green, 1);

        const size = 15;
        const half = size / 2;
        const height = Math.sqrt(3) * half;

        this.#icon.drawPolygon([
        0, -height/2,
        -half, height/2,
        half, height/2
        ]);

        this.#icon.x = this.#conf.position.x;
        this.#icon.y = this.#conf.position.y;

        const bounds = this.#icon.getLocalBounds();

        this.#icon.pivot.set(
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2
        );

        this.#displayValueRPM = new PIXI.Text(10000 + "rpm", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });

        this.#displayValueRPM.anchor.set(0, 0.5);
        this.#displayValueRPM.x = this.#conf.position.x + 25
        this.#displayValueRPM.y = this.#conf.position.y

        this.addChild(this.#displayValueRPM);
        this.addChild(circle);
        this.addChild(this.#icon);
    }

    update(info)
    {
        this.#displayValueRPM.text = info.rpm + "rpm";
        if (info.dir === "LR")
        {
            this.#icon.rotation = 2 * Math.PI;
        }
        else
        {
            this.#icon.rotation = Math.PI;
        }
    }
}