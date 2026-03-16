import * as PIXI from 'pixi.js';

import { Configurationsfactory } from "../mpce/configurationsfactory";
import { F9Monitor } from './f9monitor';
import { Sat1Monitor } from './sat1monitor';
import { HarmonyModuleMonitor } from './harmonymodulemonitor';
import { UnityModuleMonitor } from './unitymodulemonitor';

const DISPLAY_WIDTH = 2000;
const DISPLAY_HEIGHT = 1170;

export class SystemStateMonitor
{
    #pixiContainter = null;
    #monitors = null;
    systemStateApplication = null;
    systemStateContainer = null;

    #runner = null;

    constructor(pixiSpaceCraftsSystemStateContainer)
    {
        this.#pixiContainter = pixiSpaceCraftsSystemStateContainer;

        this.initialize();
    }

    initialize()
    {
        this.systemStateApplication = new PIXI.Application({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            backgroundColor: 0x020D19,
            antialias: true
        });

        this.systemStateContainer = new PIXI.Container(); // main container

        this.systemStateApplication.stage.addChild(this.systemStateContainer);

        this.#pixiContainter.current.appendChild(this.systemStateApplication.view);
    }

    start()
    {
        if (this.#runner) return;

        this.#runner = setInterval(() => {
            this.#update()
        }, 500);
    }

    stop()
    {
        if (this.#runner) {
            clearInterval(this.#runner);
            this.#runner = null;
        }
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
            case "SAT1":
                newMonitor = new Sat1Monitor(configuration);
                break;
            case "HARMONY_MODULE":
                newMonitor = new HarmonyModuleMonitor(configuration);
                break;
            case "UNITY_MODULE":
                newMonitor = new UnityModuleMonitor(configuration);
                break;
            default:
                break;
        }

        let totalWidth = this.systemStateContainer.children.reduce((sum, child) => sum + child.width + 30, 0);

        newMonitor.x = 100 + totalWidth;
        newMonitor.y = 150;

        newMonitor.id = id;

        this.systemStateContainer.addChild(newMonitor);
    }

    setInterfaceForId(id, i)
    {
        let monitor = this.systemStateContainer.children.find(item => item.id === id);
        monitor.setInterface(i);
    }

    reset()
    {
        this.stop();
        this.systemStateApplication.destroy(true);
    }

    #update()
    {
        for (const child of this.systemStateContainer.children)
        {
            child.update();
        }
    }
}