import * as PIXI from 'pixi.js'

import { styles } from './monitorstyle'

export class Telemetry extends PIXI.Container
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
        const radioInfo = new PIXI.Graphics();

        radioInfo.lineStyle(1, styles.blue, 1);
        radioInfo.drawRect(0, 0,  this.#conf.dimensions.x, this.#conf.dimensions.y);

        const titel = new PIXI.Text("NAV", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });

        titel.anchor.set(0.5)
        titel.x = radioInfo.width / 2
        titel.y = 15

        // ----------------
        this.rfr = new PIXI.Text("vel: N/A", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.rfr.y = titel.y + 20;
        this.rfr.x = 15;

        this.renabled = new PIXI.Text("alt: N/A", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.renabled.y = this.rfr.y + 20;
        this.renabled.x = 15;

        this.rpower = new PIXI.Text("ang vel: N/A", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.rpower.y = this.renabled.y + 20;
        this.rpower.x = 15;

        // ----------------
        this.tfr = new PIXI.Text("theta: N/A", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.tfr.y = this.rpower.y + 20;
        this.tfr.x = 15;

        this.addChild(radioInfo);
        this.addChild(titel);

        this.addChild(this.rfr);
        this.addChild(this.renabled);
        this.addChild(this.rpower);

        this.addChild(this.tfr);
    }

    update(info)
    {
        this.rfr.text = "vel: " + info.vel + " m/s";
        this.renabled.text = "alt: " + info.alt + " km";
        this.rpower.text = "aVel: " + info.angVel + " deg/s";
        this.tfr.text = "theta: " + info.theta + " deg";
    }
}