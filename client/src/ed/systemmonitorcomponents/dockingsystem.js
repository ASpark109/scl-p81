import * as PIXI from 'pixi.js'

import { styles } from './monitorstyle'

export class DockingSystem extends PIXI.Container
{
    #conf = null;
    #ports = []
    
    constructor(conf)
    {
        super()

        this.#conf = conf

        this.#create();
    }

    #create()
    {        
        for (let item of this.#conf)
        {
            let id = new PIXI.Text("( spacecraft id )", {
                    fontFamily: "B612 Mono, monospace",
                    fontSize: styles.fontSizeDefault + 1,
                    fill: styles.green,
                    align: "center"
                });
            id.x = item.idPosition.x;
            id.y = item.idPosition.y;
            id.rotation = item.idPosition.r / 180 * Math.PI;
            id.anchor.set(0.5);

            const g1 = new PIXI.Graphics();
            g1.lineStyle(1, styles.blue, 1);
            g1.drawRect(item.position.x, item.position.y,  item.dimensions.x, item.dimensions.y);
            g1.visible = false;
            this.addChild(g1);

            const g2 = new PIXI.Graphics();
            g2.beginFill(styles.yellow, 1);
            g2.drawRect(item.position.x, item.position.y,  item.dimensions.x, item.dimensions.y);
            g2.endFill();
            g2.visible = false;
            this.addChild(g2);
            
            this.addChild(id);

            this.#ports.push({g1: g1, g2: g2, id: id});
        }
    }

    update(portsInfo)
    {
        for (let i = 0; i < this.#ports.length; i++)
        {
            const isDocked = portsInfo[i].name !== null;
            this.#ports[i].id.text = isDocked ? `( ${portsInfo[i].name} )` : "( spacecraft id )";
            this.#ports[i].g1.visible = !isDocked;
            this.#ports[i].g2.visible = isDocked;
        }
    }
}