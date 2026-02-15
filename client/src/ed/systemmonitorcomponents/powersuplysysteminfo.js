import * as PIXI from 'pixi.js';

import { styles } from './monitorstyle';

export class PowerSuplySystemInfo extends PIXI.Container
{
    #value = 0;
    #displayValue = null;
    #conf = null;

    #productionDisplayValue = 0;
    #cunsumptionDisplayValue = 0;
    #accumulatedDisplayValue = 0;

    constructor(conf)
    {
        super();

        this.#conf = conf;



        this.#create();
    }

    #create()
    {
        const pssInfo = new PIXI.Graphics();

        pssInfo.pivot.set(this.#conf.dimensions.x / 2,
                          this.#conf.dimensions.y / 2);

        pssInfo.lineStyle(1, styles.blue, 1);
        pssInfo.drawRect(0, 0,  this.#conf.dimensions.x,
                                this.#conf.dimensions.y);

        pssInfo.x = this.#conf.position.x;
        pssInfo.y = this.#conf.position.y;

        const sensorName = new PIXI.Text(this.#conf.name, {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,   // зелений колір тексту
            align: "center"
        });

        sensorName.anchor.set(0.5)
        sensorName.x = pssInfo.x
        sensorName.y = pssInfo.y - 40

        this.#productionDisplayValue = new PIXI.Text(0, {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,   // зелений колір тексту
            align: "center"
        });

        this.#productionDisplayValue.anchor.set(0.5)
        this.#productionDisplayValue.x = pssInfo.x - 125;
        this.#productionDisplayValue.y = pssInfo.y;

        this.#cunsumptionDisplayValue = new PIXI.Text(0, {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,   // зелений колір тексту
            align: "center"
        });

        this.#cunsumptionDisplayValue.anchor.set(0.5)
        this.#cunsumptionDisplayValue.x = pssInfo.x;
        this.#cunsumptionDisplayValue.y = pssInfo.y;

        this.#accumulatedDisplayValue = new PIXI.Text(0, {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,   // зелений колір тексту
            align: "center"
        });

        this.#accumulatedDisplayValue.anchor.set(0.5)
        this.#accumulatedDisplayValue.x = pssInfo.x + 125;
        this.#accumulatedDisplayValue.y = pssInfo.y;

        this.addChild(pssInfo);
        this.addChild(sensorName);
        
        this.addChild(this.#productionDisplayValue);
        this.addChild(this.#cunsumptionDisplayValue);
        this.addChild(this.#accumulatedDisplayValue);
    }

    update(info)
    {
        this.#productionDisplayValue.text = "Production: \n" + Math.round(info.production.current) + "/" + Math.round(info.production.max) + "W";
        this.#cunsumptionDisplayValue.text = "Consumption: \n" + Math.round(info.consumption) + "W";
        this.#accumulatedDisplayValue.text = "Accumulated: \n" + Math.round(info.accumulated.current) + "/" + Math.round(info.accumulated.max) + "J";
    }
}