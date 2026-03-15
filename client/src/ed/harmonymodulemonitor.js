import * as PIXI from 'pixi.js';

import { styles } from '../ed/systemmonitorcomponents/monitorstyle';

import { Sensor } from './systemmonitorcomponents/sensor';
import { Tank } from './systemmonitorcomponents/tank';
import { PowerSuplySystemInfo } from './systemmonitorcomponents/powersuplysysteminfo';
import { Pump } from './systemmonitorcomponents/pump';
import { Radio } from './systemmonitorcomponents/radio';
import { TurboPump } from './systemmonitorcomponents/turbopump';
import { Engines } from './systemmonitorcomponents/engines';
import { RPO } from './systemmonitorcomponents/rpo';

export class HarmonyModuleMonitor extends PIXI.Container
{
    #config = null;
    #monitorInterface = null;
    #updateList = new Map();
    #currentPageIndex = 0;

    #pages = []

    constructor(configuration)
    {
        super();

        this.#config = configuration;

        this.#createMainPage();
        this.#createNavigationButtons();

        if (this.#pages.length > 0)
        {
            this.#pages[0].visible = true;
            this.#currentPageIndex = 0;
        }
    }

    #createMainPage()
    {
        let mainPageContainer = new PIXI.Container();

        // *** MAIN FRAME ***
        const mainFrame = new PIXI.Graphics();

        mainFrame.lineStyle(1, styles.blue, 1);

        // ліва сторона
        mainFrame.moveTo(0, 0);
        mainFrame.lineTo(0, this.#config.mainFrameDimensions.y);

        // права сторона
        mainFrame.moveTo(this.#config.mainFrameDimensions.x, 0);
        mainFrame.lineTo(this.#config.mainFrameDimensions.x, this.#config.mainFrameDimensions.y);

        mainPageContainer.addChild(mainFrame);

        // ******
        mainPageContainer.visible = false;
        this.addChild(mainPageContainer)
        this.#pages.push(mainPageContainer);
    }

    #createNavigationButtons()
    {
        let left = new PIXI.Text(" < ", {
                    fontFamily: "B612 Mono, monospace",
                    fontSize: 30,
                    fill: styles.yellow,
                    align: "center"
        });

        let right = new PIXI.Text(" > ", {
                    fontFamily: "B612 Mono, monospace",
                    fontSize: 30,
                    fill: styles.yellow,
                    align: "center"
        });

        left.anchor.set(0.5);
        right.anchor.set(0.5);

        left.x = this.#config.mainFrameDimensions.x / 2 - 20;
        left.y = this.#config.mainFrameDimensions.y;

        right.x = this.#config.mainFrameDimensions.x / 2 + 20;
        right.y = this.#config.mainFrameDimensions.y;

        left.eventMode = 'static';
        left.on('pointerdown', () => {
            if (this.#currentPageIndex - 1 === -1)
            {
                this.#pages[this.#currentPageIndex].visible = false;
                this.#currentPageIndex = this.#pages.length - 1;
                this.#pages[this.#currentPageIndex].visible = true;
            }
            else
            {
                this.#pages[this.#currentPageIndex].visible = false;
                this.#currentPageIndex--;
                this.#pages[this.#currentPageIndex].visible = true;
            }
        });

        right.eventMode = 'static';
        right.on('pointerdown', () => {
            if (this.#currentPageIndex + 1 === this.#pages.length)
            {
                this.#pages[this.#currentPageIndex].visible = false;
                this.#currentPageIndex = 0;
                this.#pages[this.#currentPageIndex].visible = true;
            }
            else
            {
                this.#pages[this.#currentPageIndex].visible = false;
                this.#currentPageIndex++;
                this.#pages[this.#currentPageIndex].visible = true;
            }
        });

        this.addChild(left, right)
    }

    update()
    {
        for (const [key, monitorComponent] of this.#updateList)
        {

            let f = this.#monitorInterface.has(key);
            if (f)
            {
                monitorComponent.update(this.#monitorInterface.get(key)());
            }
        }
    }

    setInterface(i)
    {
        if (i.size === 0)
        {
            console.log("\x1b[33m%s\x1b[0m", "WARNING: Monitoring interface is empty");
            return;
        }
        this.#monitorInterface = i;
    }
}