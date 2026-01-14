import { ModuleBase } from './modulebase.js';
import { Vector } from '../../utils/vector.js';

import Matter from 'matter-js';

const AC = 0.0000000102;

class Unit
{
    constructor(id)
    {
        this.id = id;
    }
    isEnabled = false;
}

export class RCSBlock extends ModuleBase
{
    #body = null;
    #abstructModel = null;

    #blockPositionVector = null;
    #thetaV = null;

    #direction = null;
    #thrust = null;

    #forcaAppliedToCenter = {x: 0, y: 0};
    #id = null

    #visualEffects = null;

    #unitsState = null;

    constructor(rocketBody, abstructModel, conf, visualEffects)
    {
        super()

        this.#unitsState = {
            A: new Unit("rcsThrusterA" + (conf.direction === "left" ? "L" : "R")),
            B: new Unit("rcsThrusterB" + (conf.direction === "left" ? "L" : "R")),
            C: new Unit("rcsThrusterC" + (conf.direction === "left" ? "L" : "R"))
        };

        this.#body = rocketBody;
        this.#abstructModel = abstructModel;
        this.#direction = conf.direction;
        this.#thrust = conf.thrust;
        this.#blockPositionVector = Math.sqrt(Math.pow(conf.position.x, 2) +
                                              Math.pow(conf.position.y, 2))
        this.#thetaV = this.#calculateAngle(conf.position)

        this.#id = conf.id;

        this.#visualEffects = visualEffects;

        abstructModel.addNewVector(conf.id);

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        if (this.#unitsState.A.isEnabled)
        {
            this.#applyForceInter(180)
            
            if (!this.#abstructModel.isClose)
                this.#applyForceAbs(180);
        }
        if (this.#unitsState.B.isEnabled)
        {
            this.#applyForceInter(0)
            
            if (!this.#abstructModel.isClose)
                this.#applyForceAbs(0);    
        }
        if (this.#unitsState.C.isEnabled)
        {
            this.#applyForceInter(this.#direction === "left" ? 270 : 90)
            
            if (!this.#abstructModel.isClose)
                this.#applyForceAbs(this.#direction === "left" ? 270 : 90);
        }

        if (this.#forcaAppliedToCenter.x !== 0 || this.#forcaAppliedToCenter.y !== 0)
        {
            this.#abstructModel.setVectorForId(this.#id, this.#forcaAppliedToCenter)
            this.#forcaAppliedToCenter = {x: 0, y: 0};
        }
    }

    #applyForceInter(direction)
    {
        let angle = ((90 - this.#body.angle * 180 / Math.PI) - this.#thetaV);
        let forceAngle = -this.#body.angle * 180 / Math.PI + 90 + direction

        let forceX = this.#body.position.x + Math.cos(angle * Math.PI / 180) * this.#blockPositionVector;
        let forceY = this.#body.position.y - Math.sin(angle * Math.PI / 180) * this.#blockPositionVector;

        let acceleration = this.#thrust / (this.#body.mass * 1000);
        let engineForce = AC * acceleration * this.#body.mass * 1000;

        let forceVecX = Math.cos(forceAngle * Math.PI / 180) * engineForce;
        let forceVecY = -Math.sin(forceAngle * Math.PI / 180) * engineForce;

        Matter.Body.applyForce(this.#body, {x: forceX, 
                                    y: forceY},
                                    {x: forceVecX, // брати значення з конфігу
                                    y: forceVecY});
    }

    #applyForceAbs(direction)
    {
        let angle = 90 - this.#body.angle * 180 / Math.PI + direction;

        let forceV = {x: Math.cos(angle * Math.PI / 180) * this.#thrust,
                      y: -Math.sin(angle * Math.PI / 180) * this.#thrust}
        
        this.#forcaAppliedToCenter = Vector.add(forceV, this.#forcaAppliedToCenter);
    }

    #calculateAngle(blockPosition)
    {
        let A = {x: 0, y: 1};
        let B = blockPosition;

        // B.y зі знаком мінус, бо в фізичному двіжку вісь Y інвертована
        let dot = A.x * B.x + A.y * -B.y;
        let det = A.x * -B.y - A.y * B.x;
        return -Math.atan2(det, dot) * 180 / Math.PI;
    }

    #activateUnit(unit, duration)
    {
        if (duration <= 0 || unit.isEnabled)
            return false;

        unit.isEnabled = true;
        this.#visualEffects.setVisible(unit.id, true);

        setTimeout(() => {
            unit.isEnabled = false;

            this.#visualEffects.setVisible(unit.id, false);

            this.#abstructModel.setVectorForId(this.#id, {x: 0, y: 0});

            console.log(this.#body.angularVelocity * 60 * (180 / Math.PI))
            console.log(this.#abstructModel.velocity.x)
        }, duration)

        return true;
    }

    // ================ interface ================

    activateUnitAFor(duration)
    {
        return this.#activateUnit(this.#unitsState.A, duration);
    }

    activateUnitBFor(duration)
    {
        return this.#activateUnit(this.#unitsState.B, duration);
    }

    activateUnitCFor(duration)
    {
        return this.#activateUnit(this.#unitsState.C, duration);
    }
}