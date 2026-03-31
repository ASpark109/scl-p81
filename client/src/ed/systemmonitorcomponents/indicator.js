import * as PIXI from 'pixi.js'

import { styles } from './monitorstyle'

export class Indicator extends PIXI.Container
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
        this.temperature1 = new PIXI.Text("Bat: N/A ℃", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });
        this.temperature1.anchor.set(0.5)

        this.temperature1.x = this.#conf[0].x;
        this.temperature1.y = this.#conf[0].y;

        this.temperature2 = new PIXI.Text("AVN: N/A ℃", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });
        this.temperature2.anchor.set(0.5)

        this.temperature2.x = this.#conf[1].x;
        this.temperature2.y = this.#conf[1].y;

        this.temperature3 = new PIXI.Text("SArr: N/A ℃", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });
        this.temperature3.anchor.set(0.5)

        this.temperature3.x = this.#conf[2].x;
        this.temperature3.y = this.#conf[2].y;

        this.temperature4 = new PIXI.Text("THR: N/A ℃", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });
        this.temperature4.anchor.set(0.5)

        this.temperature4.x = this.#conf[3].x;
        this.temperature4.y = this.#conf[3].y;

        this.addChild(this.temperature1);
        this.addChild(this.temperature2);
        this.addChild(this.temperature3);
        this.addChild(this.temperature4);
    }

    update(info)
    {
        this.temperature1.text = "Bat:\n\n" + info.batteries + " ℃";
        this.temperature2.text = "AVN:\n\n" + info.avionics + " ℃";
        this.temperature3.text = "SArr:\n\n" + info.solarPanels + " ℃";
        this.temperature4.text = "THR:\n\n" + info.thrusters + " ℃";
    }
}