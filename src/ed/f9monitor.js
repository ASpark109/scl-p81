import * as PIXI from 'pixi.js';

import { styles } from '../ed/systemmonitorcomponents/monitorstyle';

import { Sensor } from './systemmonitorcomponents/sensor';
import { Tank } from './systemmonitorcomponents/tank';

export class F9Monitor extends PIXI.Container
{
    #config = null;

    constructor(configuration)
    {
        super();

        this.#config = configuration;

        this.create();
    }

    create()
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


        // *** Oxidiser Tank ***

        let oxidiserTank = new Tank(this.#config.oxidiserTank.name,
                                this.#config.oxidiserTank.dimensions.x,
                                this.#config.oxidiserTank.dimensions.y);
        
        oxidiserTank.x = this.#config.oxidiserTank.position.x + mainStage.x;
        oxidiserTank.y = this.#config.oxidiserTank.position.y + mainStage.y;

        this.addChild(oxidiserTank)

        
        // *** Pneumatic sensor left lef ***

        let pneumSensorLeftLeg = new Sensor(this.#config.pressureSensorLeftLeg.name,
                                            this.#config.pressureSensorRightLeg.unit);

        pneumSensorLeftLeg.x = mainStage.x + this.#config.pressureSensorLeftLeg.position.x;
        pneumSensorLeftLeg.y = mainStage.y + this.#config.pressureSensorLeftLeg.position.y;

        this.addChild(pneumSensorLeftLeg);


        // *** Pneumatic sensor left lef ***

        let pneumSensorRightLeg = new Sensor(this.#config.pressureSensorRightLeg.name,
                                             this.#config.pressureSensorRightLeg.unit);

        pneumSensorRightLeg.x = mainStage.x + this.#config.pressureSensorRightLeg.position.x;
        pneumSensorRightLeg.y = mainStage.y + this.#config.pressureSensorRightLeg.position.y;

        this.addChild(pneumSensorRightLeg);
    }
}