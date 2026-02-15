import * as PIXI from 'pixi.js'

import { styles } from './monitorstyle'

export class Radio extends PIXI.Container
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

        const titel = new PIXI.Text("Radio com", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });

        titel.anchor.set(0.5)
        titel.x = radioInfo.width / 2
        titel.y = 15

        // ----------------
        let receiver = new PIXI.Text("Reciever", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });
        receiver.y = titel.y + 20;
        receiver.x = 5;

        this.rfr = new PIXI.Text("freq: 45 MHz", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.rfr.y = receiver.y + 20;
        this.rfr.x = 25;

        this.renabled = new PIXI.Text("enebled: true", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.renabled.y = this.rfr.y + 20;
        this.renabled.x = 25;

        this.rpower = new PIXI.Text("power: 1000 W", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.rpower.y = this.renabled.y + 20;
        this.rpower.x = 25;

        // ----------------

        let transmitter = new PIXI.Text("Transmitter", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });
        transmitter.y = this.rpower.y + 30;
        transmitter.x = 5;

        this.tfr = new PIXI.Text("freq: 45 MHz", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.tfr.y = transmitter.y + 20;
        this.tfr.x = 25;

        this.tenabled = new PIXI.Text("enebled: true", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.tenabled.y = this.tfr.y + 20;
        this.tenabled.x = 25;

        this.tpower = new PIXI.Text("power: 1000 W", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.tpower.y = this.tenabled.y + 20;
        this.tpower.x = 25;

        this.addChild(radioInfo);
        this.addChild(titel);

        this.addChild(receiver);
        this.addChild(this.rfr);
        this.addChild(this.renabled);
        this.addChild(this.rpower);

        this.addChild(transmitter);
        this.addChild(this.tfr);
        this.addChild(this.tenabled);
        this.addChild(this.tpower);
    }

    update(info)
    {
        this.rfr.text = "freq: " + info.receiver.freq + " Hz";
        this.renabled.text = "active: " + info.receiver.state;
        this.rpower.text = "power: " + info.receiver.power + " W";

        this.tfr.text = "freq: " + info.transmitter.freq + " Hz";
        this.tenabled.text = "active: " + info.transmitter.state;
        this.tpower.text = "power: " + info.transmitter.power + " W";
    }
}