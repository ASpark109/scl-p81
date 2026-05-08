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

    constructor(physical, abstract, enginesNr, render)
    {
        this.#physical = physical
        this.#abstract = abstract;
        this.#enginesPhys = new Array(enginesNr).fill({x: 0, y: 0});
        this.#enginesAbs = new Array(enginesNr).fill({x: 0, y: 0});
        this.#id = physical.id;

        this.#abstract.addNewVector(this.#id);

        this.render = render
        ModuleBase.updateList.push(this.#update.bind(this));

        this.forceX = 0;
        this.forceY = 0;

        Matter.Events.on(this.render, "afterRender", () => {
            const ctx = this.render.context;
            ctx.beginPath();
            ctx.arc(this.forceX,
                    this.forceY,
                    3, 0, 2 * Math.PI);
            ctx.fillStyle = "green";
            ctx.fill();

            let forceAngle = this.#physical.angle * 180 / Math.PI

            let a = Math.cos((forceAngle - 90) * Math.PI / 180) * this.#forcePhysV.x
            let b = Math.sin((forceAngle - 90) * Math.PI / 180) * this.#forcePhysV.x

            let c = Math.cos((forceAngle) * Math.PI / 180) * this.#forcePhysV.y
            let d = Math.sin((forceAngle) * Math.PI / 180) * this.#forcePhysV.y

            ctx.beginPath();
            ctx.moveTo(this.forceX,
                       this.forceY);
            ctx.lineTo(this.forceX + a * 100000,
                       this.forceY + b *  100000);
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.forceX,
                       this.forceY);
            ctx.lineTo(this.forceX + c * 100000,
                       this.forceY + d * 100000);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.forceX,
                       this.forceY);
            ctx.lineTo(this.forceX + (a + c) * 100000,
                       this.forceY + (b + d) * 100000);
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    #update()
    {
        // if (this.#abstract.isClose)
        {
            this.#applyForceInter();
        }
        
        if (!this.#abstract.isClose)
        {
            this.#applyForceAbs();
        }
    }

    #applyForceInter()
    {
        let angle = (90 - this.#physical.angle * 180 / Math.PI);
        
        this.forceX = this.#physical.position.x + Math.cos(angle * Math.PI / 180) * -240;
        this.forceY = this.#physical.position.y - Math.sin(angle * Math.PI / 180) * -240;

        let forceAngle = this.#physical.angle * 180 / Math.PI

        let a = Math.cos((forceAngle - 90) * Math.PI / 180) * this.#forcePhysV.x
        let b = Math.sin((forceAngle - 90) * Math.PI / 180) * this.#forcePhysV.x

        let c = Math.cos((forceAngle) * Math.PI / 180) * this.#forcePhysV.y
        let d = Math.sin((forceAngle) * Math.PI / 180) * this.#forcePhysV.y

        Matter.Body.applyForce(this.#physical, {x: this.forceX, 
                                                y: this.forceY},
                                               {x: (a + c),
                                                y: (b + d)});
    }
    
    #applyForceAbs()
    {
        let angle = 90 - this.#physical.angle * 180 / Math.PI;

        let forceV = {x: this.#forceAbsV.x * Math.cos(angle * Math.PI / 180) - this.#forceAbsV.y * Math.sin(angle * Math.PI / 180),
                      y: -(this.#forceAbsV.x * Math.sin(angle * Math.PI / 180) + this.#forceAbsV.y * Math.cos(angle * Math.PI / 180))};

        this.#abstract.setVectorForId(this.#id, forceV);
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

            // console.log(this.#forcePhysV)
        }
    }

    updateAbsState(engineId, forceV)
    {
        if (this.#enginesAbs[engineId] !== undefined)
        {
            this.#enginesAbs[engineId] = forceV;
                  
            this.#forceAbsV = this.#enginesAbs.reduce(
                (acc, { x, y }) => {
                    acc.x += x;
                    acc.y += y;
                    return acc;
                },
                { x: 0, y: 0 }
            );
        }
    }
}