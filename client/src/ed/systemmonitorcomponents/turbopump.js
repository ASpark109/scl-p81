import * as PIXI from 'pixi.js'

import { styles } from './monitorstyle'

export class TurboPump extends PIXI.Container
{
    #conf = null

    constructor(conf)
    {
        super()

        this.#conf = conf

        this.#create();
    }

    #create()
    {
        const turboPumpInfo = new PIXI.Graphics();

        turboPumpInfo.lineStyle(1, styles.blue, 1);
        turboPumpInfo.drawRect(0, 0,  this.#conf.dimensions.x, this.#conf.dimensions.y);

        const titel = new PIXI.Text("TurboPump", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });

        titel.anchor.set(0.5)
        titel.x = turboPumpInfo.width / 2
        titel.y = 15

        // ----------------
        this.state = new PIXI.Text("active: false", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.state.y = titel.y + 20;
        this.state.x = 10;

        this.flow = new PIXI.Text("RP1 flow: 210 kg/s", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.flow.y = this.state.y + 20;
        this.flow.x = 10;

        // ----------------

        this.addChild(turboPumpInfo);

        this.addChild(titel);
        this.addChild(this.state);
        this.addChild(this.flow);
    }

    update(info)
    {
        this.state.text = "Active: " + info.active;
        this.flow.text = "Flow: " + info.flow + " kg/s";
    }
}