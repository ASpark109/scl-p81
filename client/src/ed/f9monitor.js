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
import { Telemetry } from './systemmonitorcomponents/telemetry';

export class F9Monitor extends PIXI.Container
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


        // *** MAIN STAGE ***
        const mainStage = new PIXI.Graphics();

        mainStage.pivot.set(this.#config.mainStageDimensions.x / 2,
                            this.#config.mainStageDimensions.y / 2);

        mainStage.x = this.#config.mainFrameDimensions.x / 2;
        mainStage.y = this.#config.mainFrameDimensions.y / 2;

        mainStage.lineStyle(1, 0x00FF00, 1);
        mainStage.drawRect(0, 0, this.#config.mainStageDimensions.x,
                                 this.#config.mainStageDimensions.y);

        mainPageContainer.addChild(mainStage);


        // *** LEGS ***
        const leftLeg = new PIXI.Graphics();

        leftLeg.pivot.set(this.#config.legs.dimensions.x / 2,
                          this.#config.legs.dimensions.y / 2);

        leftLeg.lineStyle(1, 0x006e00, 1);
        leftLeg.drawRect(0, 0,  this.#config.legs.dimensions.x,
                                this.#config.legs.dimensions.y);

        leftLeg.x = mainStage.x + this.#config.legs.position.x1;
        leftLeg.y = mainStage.y + this.#config.legs.position.y1;
        
        mainPageContainer.addChild(leftLeg);

        
        const righttLeg = new PIXI.Graphics();

        righttLeg.pivot.set(this.#config.legs.dimensions.x / 2,
                          this.#config.legs.dimensions.y / 2);

        righttLeg.lineStyle(1, 0x006e00, 1);
        righttLeg.drawRect(0, 0,  this.#config.legs.dimensions.x,
                                this.#config.legs.dimensions.y);

        righttLeg.x = mainStage.x + this.#config.legs.position.x2;
        righttLeg.y = mainStage.y + this.#config.legs.position.y2;

        mainPageContainer.addChild(righttLeg);

        
        // *** Fuel Tank ***

        let fuelTank = new Tank(this.#config.fuelTank.name,
                                this.#config.fuelTank.dimensions.x,
                                this.#config.fuelTank.dimensions.y);
        
        fuelTank.x = this.#config.fuelTank.position.x + mainStage.x;
        fuelTank.y = this.#config.fuelTank.position.y + mainStage.y;

        mainPageContainer.addChild(fuelTank);

        this.#updateList.set("Tank1", fuelTank);


        // *** Oxidiser Tank ***

        let oxidiserTank = new Tank(this.#config.oxidiserTank.name,
                                this.#config.oxidiserTank.dimensions.x,
                                this.#config.oxidiserTank.dimensions.y);
        
        oxidiserTank.x = this.#config.oxidiserTank.position.x + mainStage.x;
        oxidiserTank.y = this.#config.oxidiserTank.position.y + mainStage.y;

        mainPageContainer.addChild(oxidiserTank)

        this.#updateList.set("Tank2", oxidiserTank);

        
        // *** Pneumatic sensor left leg ***

        let pneumSensorLeftLeg = new Sensor(this.#config.pressureSensorLeftLeg.name,
                                            this.#config.pressureSensorRightLeg.unit);

        pneumSensorLeftLeg.x = mainStage.x + this.#config.pressureSensorLeftLeg.position.x;
        pneumSensorLeftLeg.y = mainStage.y + this.#config.pressureSensorLeftLeg.position.y;

        mainPageContainer.addChild(pneumSensorLeftLeg);

        this.#updateList.set("Leg1PneumPress", pneumSensorLeftLeg);


        // *** Pneumatic sensor right leg ***

        let pneumSensorRightLeg = new Sensor(this.#config.pressureSensorRightLeg.name,
                                             this.#config.pressureSensorRightLeg.unit);

        pneumSensorRightLeg.x = mainStage.x + this.#config.pressureSensorRightLeg.position.x;
        pneumSensorRightLeg.y = mainStage.y + this.#config.pressureSensorRightLeg.position.y;

        mainPageContainer.addChild(pneumSensorRightLeg);

        this.#updateList.set("Leg2PneumPress", pneumSensorRightLeg);

        // *** Power supply system ***

        let powerSuplySystemInfo = new PowerSuplySystemInfo(this.#config.powerSuplySystem);

        mainPageContainer.addChild(powerSuplySystemInfo);

        this.#updateList.set("PSSInfo", powerSuplySystemInfo);

        // *** Pump ***

        let pump = new Pump(this.#config.pump);

        pump.x = this.#config.pump.position.x + mainStage.x;
        pump.y = this.#config.pump.position.y + mainStage.y;
        
        mainPageContainer.addChild(pump);
        this.#updateList.set("PumpStatus", pump);
        // *** Pipe ***

        const line1 = new PIXI.Graphics();

        line1.lineStyle(1, styles.green, 1);
        line1.moveTo(oxidiserTank.x + 35, oxidiserTank.y);
        line1.lineTo(oxidiserTank.x + 100, oxidiserTank.y);
        line1.lineTo(oxidiserTank.x + 100, pump.y + 20);

        const line2 = new PIXI.Graphics();

        line2.lineStyle(1, styles.green, 1);
        line2.moveTo(fuelTank.x + 35, fuelTank.y);
        line2.lineTo(fuelTank.x + 100, fuelTank.y);
        line2.lineTo(fuelTank.x + 100, pump.y + 50);

        mainPageContainer.addChild(line1);
        mainPageContainer.addChild(line2);

        // *** Radio ***
        let radio = new Radio(this.#config.radio);

        radio.x = this.#config.radio.position.x;
        radio.y = this.#config.radio.position.y;
        
        mainPageContainer.addChild(radio);

        this.#updateList.set("radioCommunicationStatus", radio);

        // *** TurboPump ***
        let turboPump = new TurboPump(this.#config.turboPump)
        turboPump.x = this.#config.turboPump.position.x;
        turboPump.y = this.#config.turboPump.position.y;
        
        mainPageContainer.addChild(turboPump);

        this.#updateList.set("turboPump", turboPump);

        // *** Engines ***
        let enginesInfo = new Engines(this.#config.engines)
        enginesInfo.x = this.#config.engines.position.x;
        enginesInfo.y = this.#config.engines.position.y;

        mainPageContainer.addChild(enginesInfo);

        this.#updateList.set("enginesStatus", enginesInfo);

        // *** Telemetry ***
        let telemetry = new Telemetry(this.#config.telemetry)
        
        telemetry.x = this.#config.telemetry.position.x;
        telemetry.y = this.#config.telemetry.position.y;
        
        this.#updateList.set("navInfo", telemetry);

        mainPageContainer.addChild(telemetry);

        // ******
        mainPageContainer.visible = false;
        this.addChild(mainPageContainer)
        this.#pages.push(mainPageContainer);
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

        this.#updateList.set("proximityRadar", monitor);

        // ******
        rpoPageContainer.visible = false;
        this.addChild(rpoPageContainer);
        this.#pages.push(rpoPageContainer);
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