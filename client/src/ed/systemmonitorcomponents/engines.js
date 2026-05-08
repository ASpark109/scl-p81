import * as PIXI from 'pixi.js'

import { styles } from './monitorstyle'

export class Engines extends PIXI.Container
{
    #conf = null
    #engines = [];

    constructor(conf)
    {
        super()

        this.#conf = conf

        this.#create();
    }

    #create()
    {
        const enginesInfo = new PIXI.Graphics();

        enginesInfo.lineStyle(1, styles.blue, 1);
        enginesInfo.drawRect(0, 0,  this.#conf.dimensions.x, this.#conf.dimensions.y);
        
        const titel = new PIXI.Text("Engines", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });

        titel.anchor.set(0.5)
        titel.x = enginesInfo.width / 2
        titel.y = 15

        // ----------------
        for (let i = 0; i < this.#conf.engines; i++)
        {
            let state = new PIXI.Text("Eng 1: false", {
                fontFamily: "B612 Mono, monospace",
                fontSize: styles.fontSizeDefault,
                fill: styles.yellow,
                align: "center"
            });

            state.x = 10;
            state.y = titel.y + (i+1) * 20;

            this.addChild(state)

            this.#engines.push(state);
        }

        this.addChild(enginesInfo);
        this.addChild(titel);
    }

    update(info)
    {
        for (let i = 0; i < this.#engines.length; i++)
        {
            this.#engines[i].text = "Eng" + i + ": " + info[i].isActive + " " + info[i].thrust + "%";
        }
    }
}