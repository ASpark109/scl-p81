import * as PIXI from 'pixi.js'

import { styles } from './monitorstyle'

export class ECLSS extends PIXI.Container
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
        const titel = new PIXI.Text("ECLSS", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });

        titel.anchor.set(0.5)
        titel.x = this.#conf.position.x;
        titel.y = this.#conf.position.y;

        // ----------------
        this.temperature = new PIXI.Text("T: NA", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });
        this.temperature.x = this.#conf.positionT.x;
        this.temperature.y = this.#conf.positionT.y;

        this.pressure = new PIXI.Text("P: NA", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });
        this.pressure.x = this.#conf.positionP.x;
        this.pressure.y = this.#conf.positionP.y;

        this.humidity = new PIXI.Text("H: NA", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });
        this.humidity.x = this.#conf.positionH.x;
        this.humidity.y = this.#conf.positionH.y;

        this.addChild(titel);

        this.addChild(this.temperature);
        this.addChild(this.pressure);
        this.addChild(this.humidity);
    }

    update(info)
    {
        this.temperature.text = "T: " + info.temperature + " ℃";
        this.pressure.text = "P: " + info.pressure + " kPa";
        this.humidity.text = "H: " + info.humidity + " %";
    }
}