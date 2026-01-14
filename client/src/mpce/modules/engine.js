import { ModuleBase } from './modulebase.js';

import Matter from 'matter-js';

const AC = 0.0000000102;

export class Engine extends ModuleBase
{
    #maxThrust = null;
    #inclination = null;
    #minThrottle = null;
    #maxThrottle = null;

    #currentThrottle = null;

    #body = null;
    #abstructModel = null;

    #id = null;

    #isEngineEnabled = false;

    constructor(rocketBody, abstructModel, conf, engId)
    {
        super()

        this.#id = conf.id + engId; // "eng" + endId

        this.#maxThrust = conf.thrust;
        this.#minThrottle = conf.minThrust;
        this.#maxThrottle = conf.maxThrust;

        this.#inclination = conf.inclination;

        this.#body = rocketBody;
        this.#abstructModel = abstructModel

        this.#currentThrottle = this.#maxThrottle;
        
        abstructModel.addNewVector(this.#id);

        this.timeS = null
        this.timeF = null

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        if (this.#isEngineEnabled)
        {
            if (this.#abstructModel.isClose)
            {
                this.#applyForceInter();
            }
            else
            {
                this.#applyForceAbs();
            }

            
        }
    }

    #applyForceInter()
    {
        let acceleration = this.#currentThrottle * this.#maxThrust / (this.#body.mass * 1000);

        let engineForce = AC * acceleration * this.#body.mass * 1000;
        let forceAngle = -this.#body.angle * 180 / Math.PI + 90

        let forceVecX = Math.cos(forceAngle * Math.PI / 180) * engineForce;
        let forceVecY = -Math.sin(forceAngle * Math.PI / 180) * engineForce;

        Matter.Body.applyForce(this.#body, {x: this.#body.position.x, 
                                            y: this.#body.position.y},
                                           {x: forceVecX, // брати значення з конфігу
                                            y: forceVecY});
    }

    #applyForceAbs()
    {
        let f = this.#currentThrottle * this.#maxThrust;
        let angle = 90 - this.#body.angle * 180 / Math.PI;
        let forceV = {x: Math.cos(angle * Math.PI / 180) * f,
                                     y: -Math.sin(angle * Math.PI / 180) * f}

        this.#abstructModel.setVectorForId(this.#id, forceV);
    }

    // ================ interface ================

    test()
    {
        console.log("Engine " + this.#id + " is fine")
    }

    setThrust(newThrottle)
    {
        if (newThrottle >= this.#minThrottle && newThrottle <= this.#maxThrottle &&
            newThrottle !== this.#currentThrottle)
        {
            this.#currentThrottle = newThrottle;
        }
    }

    start()
    {
        if (this.#isEngineEnabled)
            return;

        this.#isEngineEnabled = true;

        this.timeS = Date.now();
    }

    stop()
    {
        if (!this.#isEngineEnabled)
            return;

        this.#abstructModel.setVectorForId(this.#id, {x: 0, y: 0});
        this.#isEngineEnabled = false;

        this.timeF = Date.now();
        const deltaMs = this.timeF - this.timeS;
        const deltaSec = deltaMs / 1000.0;
    }
}