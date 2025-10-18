import * as PIXI from 'pixi.js';

import { styles } from '../ed/systemmonitorcomponents/monitorstyle';

import { Sensor } from './systemmonitorcomponents/sensor';
import { Tank } from './systemmonitorcomponents/tank';
import { PowerSuplySystemInfo } from './systemmonitorcomponents/powersuplysysteminfo';
import { Pump } from './systemmonitorcomponents/pump';

export class F9Monitor extends PIXI.Container
{
    #config = null;
    #monitorInterface = null;
    #updateList = new Map();

    constructor(configuration)
    {
        super();

        this.#config = configuration;

        this.#create();
    }

    #create()
    {
        // *** MAIN FRAME ***
        const mainFrame = new PIXI.Graphics();

        mainFrame.lineStyle(1, styles.blue, 1);

        // ліва сторона
        mainFrame.moveTo(0, 0);
        mainFrame.lineTo(0, this.#config.mainFrameDimensions.y);

        // права сторона
        mainFrame.moveTo(this.#config.mainFrameDimensions.x, 0);
        mainFrame.lineTo(this.#config.mainFrameDimensions.x, this.#config.mainFrameDimensions.y);

        this.addChild(mainFrame);


        // *** MAIN STAGE ***
        const mainStage = new PIXI.Graphics();

        mainStage.pivot.set(this.#config.mainStageDimensions.x / 2,
                            this.#config.mainStageDimensions.y / 2);

        mainStage.x = this.#config.mainFrameDimensions.x / 2;
        mainStage.y = this.#config.mainFrameDimensions.y / 2;

        mainStage.lineStyle(1, 0x00FF00, 1);
        mainStage.drawRect(0, 0, this.#config.mainStageDimensions.x,
                                 this.#config.mainStageDimensions.y);

        this.addChild(mainStage);


        // *** LEGS ***
        const leftLeg = new PIXI.Graphics();

        leftLeg.pivot.set(this.#config.legs.dimensions.x / 2,
                          this.#config.legs.dimensions.y / 2);

        leftLeg.lineStyle(1, 0x006e00, 1);
        leftLeg.drawRect(0, 0,  this.#config.legs.dimensions.x,
                                this.#config.legs.dimensions.y);

        leftLeg.x = mainStage.x + this.#config.legs.position.x1;
        leftLeg.y = mainStage.y + this.#config.legs.position.y1;
        
        this.addChild(leftLeg);

        
        const righttLeg = new PIXI.Graphics();

        righttLeg.pivot.set(this.#config.legs.dimensions.x / 2,
                          this.#config.legs.dimensions.y / 2);

        righttLeg.lineStyle(1, 0x006e00, 1);
        righttLeg.drawRect(0, 0,  this.#config.legs.dimensions.x,
                                this.#config.legs.dimensions.y);

        righttLeg.x = mainStage.x + this.#config.legs.position.x2;
        righttLeg.y = mainStage.y + this.#config.legs.position.y2;

        this.addChild(righttLeg);

        
        // *** Fuel Tank ***

        let fuelTank = new Tank(this.#config.fuelTank.name,
                                this.#config.fuelTank.dimensions.x,
                                this.#config.fuelTank.dimensions.y);
        
        fuelTank.x = this.#config.fuelTank.position.x + mainStage.x;
        fuelTank.y = this.#config.fuelTank.position.y + mainStage.y;

        this.addChild(fuelTank);

        this.#updateList.set("Tank1", fuelTank);


        // *** Oxidiser Tank ***

        let oxidiserTank = new Tank(this.#config.oxidiserTank.name,
                                this.#config.oxidiserTank.dimensions.x,
                                this.#config.oxidiserTank.dimensions.y);
        
        oxidiserTank.x = this.#config.oxidiserTank.position.x + mainStage.x;
        oxidiserTank.y = this.#config.oxidiserTank.position.y + mainStage.y;

        this.addChild(oxidiserTank)

        this.#updateList.set("Tank2", oxidiserTank);

        
        // *** Pneumatic sensor left leg ***

        let pneumSensorLeftLeg = new Sensor(this.#config.pressureSensorLeftLeg.name,
                                            this.#config.pressureSensorRightLeg.unit);

        pneumSensorLeftLeg.x = mainStage.x + this.#config.pressureSensorLeftLeg.position.x;
        pneumSensorLeftLeg.y = mainStage.y + this.#config.pressureSensorLeftLeg.position.y;

        this.addChild(pneumSensorLeftLeg);

        this.#updateList.set("Leg1PneumPress", pneumSensorLeftLeg);


        // *** Pneumatic sensor right leg ***

        let pneumSensorRightLeg = new Sensor(this.#config.pressureSensorRightLeg.name,
                                             this.#config.pressureSensorRightLeg.unit);

        pneumSensorRightLeg.x = mainStage.x + this.#config.pressureSensorRightLeg.position.x;
        pneumSensorRightLeg.y = mainStage.y + this.#config.pressureSensorRightLeg.position.y;

        this.addChild(pneumSensorRightLeg);

        this.#updateList.set("Leg2PneumPress", pneumSensorRightLeg);

        // *** Power supply system ***

        let powerSuplySystemInfo = new PowerSuplySystemInfo(this.#config.powerSuplySystem);

        this.addChild(powerSuplySystemInfo);

        this.#updateList.set("PSSInfo", powerSuplySystemInfo);

        // *** Pump ***

        let pump = new Pump(this.#config.pump);

        pump.x = this.#config.pump.position.x + mainStage.x;
        pump.y = this.#config.pump.position.y + mainStage.y;
        
        this.addChild(pump);
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

        this.addChild(line1);
        this.addChild(line2);
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