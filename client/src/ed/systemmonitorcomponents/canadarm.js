import * as PIXI from 'pixi.js'

import { styles } from './monitorstyle'

export class Canadarm extends PIXI.Container
{
    #conf = null;
    
    constructor(conf)
    {
        super()

        this.#conf = conf

        this.#create();
    }

    #create()
    {        
        const canadarmInfo = new PIXI.Graphics();

        canadarmInfo.lineStyle(1, styles.blue, 1);
        canadarmInfo.drawRect(0, 0,  this.#conf.dimensions.x, this.#conf.dimensions.y);

        const titel = new PIXI.Text("Canadarm", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.green,
            align: "center"
        });

        titel.anchor.set(0.5)
        titel.x = canadarmInfo.width / 2
        titel.y = 15

        // ----------------
        this.status = new PIXI.Text("Enabled: N/A", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.status.y = titel.y + 20;
        this.status.x = 25;
 
        this.dockPointPosition = new PIXI.Text("X: N/A, Y: N/A", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });
        this.dockPointPosition.y = this.status.y + 30;
        this.dockPointPosition.x = 25;

        this.addChild(canadarmInfo);
        this.addChild(titel);

        this.addChild(this.status);
        this.addChild(this.dockPointPosition);
    }

    update(info)
    {
        this.dockPointPosition.text = "X: " + info.x + " Y: " + info.y;
        this.status.text = "Enabled:" + info.active;
    }
}