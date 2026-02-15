import { ModuleBase } from './modulebase.js';

import Matter from 'matter-js';

const AC = 0.0000000102;

export class EnginesForceSink
{
    #physical = null;
    #abstract = null;
    #enginesPhys = [];
    #enginesAbs = [];
    #forcePhysV = {x: 0, y: 0};
    #forceAbsV = {x: 0, y: 0};
    #id = null;

    constructor(physical, abstract, enginesNr)
    {
        this.#physical = physical
        this.#abstract = abstract;
        this.#enginesPhys = new Array(enginesNr).fill({x: 0, y: 0});
        this.#enginesAbs = new Array(enginesNr).fill({x: 0, y: 0});
        this.#id = physical.id;

        this.#abstract.addNewVector(this.#id);

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        if (this.#abstract.isClose)
        {
            this.#applyForceInter();
        }
        else
        {
            this.#applyForceAbs();
        }
    }

    #applyForceInter()
    {
        Matter.Body.applyForce(this.#physical, {x: this.#physical.position.x, 
                                                y: this.#physical.position.y},
                                               {x: this.#forcePhysV.x,
                                                y: this.#forcePhysV.y});
    }

    #applyForceAbs()
    {
        this.#abstract.setVectorForId(this.#id, this.#forceAbsV);
    }

    updatePhysState(engineId, forceV)
    {
        //console.log("hello " + engineId + " " + forceV.y + " " + forceV.x)
        if (this.#enginesPhys[engineId] !== undefined)
        {
            this.#enginesPhys[engineId] = forceV;

            this.#forcePhysV = this.#enginesPhys.reduce(
                (acc, { x, y }) => {
                    acc.x += x;
                    acc.y += y;
                    return acc;
                },
                { x: 0, y: 0 }
            );

            //console.log(this.#forcePhysV)
        }
    }

    updateAbsState(engineId, forceV)
    {
        if (this.#enginesAbs[engineId] !== undefined)
        {
            //console.log(forceV)
            this.#enginesAbs[engineId] = forceV;
            //console.log(this.#enginesAbs)

            this.#forceAbsV = this.#enginesAbs.reduce(
                (acc, { x, y }) => {
                    acc.x += x;
                    acc.y += y;
                    return acc;
                },
                { x: 0, y: 0 }
            );

            //console.log(this.#forceAbsV.x + " " + this.#forceAbsV.y + " <<<<<<<<<<<<<<<")
        }
    }
}