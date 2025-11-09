import { ModuleBase } from './modulebase.js';

import Matter from 'matter-js';

export class Engine extends ModuleBase
{
    #thrust = null;
    #inclination = null;

    #body = null;
    #abstructModel = null;

    #id = null;

    #isEngineEnabled = false;

    constructor(rocketBody, abstructModel, conf, engId)
    {
        super()

        this.#thrust = conf.thrust;
        this.#inclination = conf.inclination;

        this.#body = rocketBody;
        this.#abstructModel = abstructModel

        this.#id = conf.id + engId; // "eng" + endId

        abstructModel.addNewVector(this.#id);

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
        let forceAngle = -this.#body.angle * 180 / Math.PI + 90

        let forceVecX = Math.cos(forceAngle * Math.PI / 180) * 0.0001;
        let forceVecY = -Math.sin(forceAngle * Math.PI / 180) * 0.0001;

        Matter.Body.applyForce(this.#body, {x: this.#body.position.x, 
                                            y: this.#body.position.y},
                                           {x: forceVecX, // брати значення з конфігу
                                            y: forceVecY});
    }

    #applyForceAbs()
    {
        let f = 0.01;
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

    start()
    {
        if (this.#isEngineEnabled)
            return;

        this.#isEngineEnabled = true;
    }

    stop()
    {
        if (!this.#isEngineEnabled)
            return;

        this.#abstructModel.setVectorForId(this.#id, {x: 0, y: 0});
        this.#isEngineEnabled = false;
    }
}