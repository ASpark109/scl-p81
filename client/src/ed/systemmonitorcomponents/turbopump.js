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
        this.state.x = 5;

        this.flowRP1 = new PIXI.Text("RP1 flow: 210 kg/s", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.flowRP1.y = this.state.y + 20;
        this.flowRP1.x = 5;

        this.flowLOX = new PIXI.Text("LOX flow: 210 kg/s", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.flowLOX.y = this.flowRP1.y + 20;
        this.flowLOX.x = 5;

        // ----------------

        this.addChild(turboPumpInfo);

        this.addChild(titel);
        this.addChild(this.state);
        this.addChild(this.flowRP1);
        this.addChild(this.flowLOX);
    }

    update(info)
    {
        this.state.text = "active: " + info.active;
        this.flowRP1.text = "RP: " + info.flowRP1 + " kg/s";
        this.flowLOX.text = "LOX: " + info.flowLOX + " kg/s";
    }
}