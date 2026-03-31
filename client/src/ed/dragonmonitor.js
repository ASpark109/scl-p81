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
import { DockingSystem } from './systemmonitorcomponents/dockingsystem';
import { Telemetry } from './systemmonitorcomponents/telemetry';
import { Indicator } from './systemmonitorcomponents/indicator';
import { ECLSS } from './systemmonitorcomponents/eclss';

export class DragonMonitor extends PIXI.Container
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
        this.#createRPOPage();
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

        // *** Module ***
        const module = new PIXI.Graphics();

        module.lineStyle(1, 0x00ff00, 1);

        module.moveTo(this.#config.moduleVertices[0].x * 5, this.#config.moduleVertices[0].y * 5);
        module.lineTo(this.#config.moduleVertices[1].x * 5, this.#config.moduleVertices[1].y * 5);
        module.lineTo(this.#config.moduleVertices[2].x * 5, this.#config.moduleVertices[2].y * 5);
        module.lineTo(this.#config.moduleVertices[3].x * 5, this.#config.moduleVertices[3].y * 5);

        module.closePath();

        module.pivot.set(100, -80);
        module.position.set(250, 400);

        mainPageContainer.addChild(module);

        // -------
        const trunc = new PIXI.Graphics();

        trunc.pivot.set(95, 95);

        trunc.x = this.#config.trunc.position.x;
        trunc.y = this.#config.trunc.position.y;

        trunc.lineStyle(1, 0x00FF00, 1);
        trunc.drawRect(0, 0, this.#config.trunc.dimensions.x,
                             this.#config.trunc.dimensions.y);

        mainPageContainer.addChild(trunc);

        // *** Docking Ports ***
        let dockingSystem = new DockingSystem(this.#config.dockingPorts);
        mainPageContainer.addChild(dockingSystem);
        this.#updateList.set("dockInfo", dockingSystem);

        // *** Temperatures ***
        let indicator = new Indicator(this.#config.temperature)
        
        indicator.y = 180

        this.#updateList.set("tcsInfo", indicator);

        mainPageContainer.addChild(indicator);

        // *** Radio ***
        let radio = new Radio(this.#config.radio);

        radio.x = this.#config.radio.position.x;
        radio.y = this.#config.radio.position.y;
        
        mainPageContainer.addChild(radio);

        this.#updateList.set("radioCommunicationStatus", radio);

        // *** Power supply system ***

        let powerSuplySystemInfo = new PowerSuplySystemInfo(this.#config.powerSuplySystem);

        mainPageContainer.addChild(powerSuplySystemInfo);

        this.#updateList.set("PSSInfo", powerSuplySystemInfo);

        // *** Telemetry ***
        let telemetry = new Telemetry(this.#config.telemetry)
        
        telemetry.x = this.#config.telemetry.position.x;
        telemetry.y = this.#config.telemetry.position.y;

        mainPageContainer.addChild(telemetry);
        
        this.#updateList.set("navInfo", telemetry);

        // *** ECLSS ***
        let eclss = new ECLSS(this.#config.ECLSS)

        mainPageContainer.addChild(eclss);

        this.#updateList.set("ECLSSInfo", eclss);

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

    #createRPOPage()
    {
        let rpoPageContainer = new PIXI.Container();

        // *** MAIN FRAME ***
        const mainFrame = new PIXI.Graphics();

        mainFrame.lineStyle(1, styles.blue, 1);

        // ліва сторона
        mainFrame.moveTo(0, 0);
        mainFrame.lineTo(0, this.#config.mainFrameDimensions.y);

        // права сторона
        mainFrame.moveTo(this.#config.mainFrameDimensions.x, 0);
        mainFrame.lineTo(this.#config.mainFrameDimensions.x, this.#config.mainFrameDimensions.y);

        rpoPageContainer.addChild(mainFrame);

        // *** monitor ***
        let monitor = new RPO(this.#config.rpoMonitor)
        rpoPageContainer.addChild(monitor);
        // monitor.pivot.set(225, 250)
        monitor.x = this.#config.mainFrameDimensions.x / 2;
        monitor.y = this.#config.mainFrameDimensions.y / 2;

        // this.#updateList.set("proximityRadar", monitor);

        // ******
        rpoPageContainer.visible = false;
        this.addChild(rpoPageContainer);
        this.#pages.push(rpoPageContainer);
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