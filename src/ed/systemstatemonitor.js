import * as PIXI from 'pixi.js';

import { Configurationsfactory } from "../mpce/configurationsfactory";
import { F9Monitor } from './f9monitor';

const DISPLAY_WIDTH = 2000;
const DISPLAY_HEIGHT = 1500;

export class SystemStateMonitor
{
    #pixiContainter = null;
    #monitors = null;
    systemStateApplication = null;
    systemStateContainer = null;

    constructor(pixiSpaceCraftsSystemStateContainer)
    {
        this.#pixiContainter = pixiSpaceCraftsSystemStateContainer;

        this.initialize();
    }

    initialize()
    {
        this.systemStateApplication = new PIXI.Application({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT * 3 / 4,
            backgroundColor: 0x020D19,
            antialias: true
        });

        this.systemStateContainer = new PIXI.Container(); // main container

        this.systemStateApplication.stage.addChild(this.systemStateContainer);

        this.#pixiContainter.current.appendChild(this.systemStateApplication.view);
    }

    addObject(spaceCraftName, id)
    {
        const configuration = Configurationsfactory.getConfiguration(spaceCraftName, "monitorDisplayData");

        let newMonitor = null;

        switch (spaceCraftName)
        {
            case "FALCON9_ST1":
                newMonitor = new F9Monitor(configuration);
                break;
            default:
                break;
        }

        let totalWidth = this.systemStateContainer.children.reduce((sum, child) => sum + child.width + 30, 0);

        newMonitor.x = 100 + totalWidth;
        newMonitor.y = 150;

        this.systemStateContainer.addChild(newMonitor);
        //console.log(configuration)
    }
}