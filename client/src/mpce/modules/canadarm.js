import { ModuleBase } from './modulebase.js';

import Matter from 'matter-js';

export class Canadarm
{
    #joints = null;
    #locks = [];
    #physicalModel = null;
    #mainModule = null;

    #directions = new Map();

    #isEnabled = false;

    constructor(physicalModel)
    {
        this.#physicalModel = physicalModel;
        this.#mainModule = physicalModel.bodies.find(item => item.name === "stage");
        
        this.#directions.set(-1, -0.001);
        this.#directions.set(0, 0);
        this.#directions.set(1, 0.001);

        let joints = [physicalModel.bodies.find(item => item.name === "canadarm1"),
                        physicalModel.bodies.find(item => item.name === "canadarm2"),
                        physicalModel.bodies.find(item => item.name === "canadarm3"),
                        physicalModel.bodies.find(item => item.name === "canadarm4")];
        
        this.#joints = joints.map(joint => ({joint: joint, direction: 0, angle: 0, vel: 0}));

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        if (this.#isEnabled)
        {

        }

        Matter.Body.setAngularVelocity(this.#joints[1].joint, this.#joints[0].joint.angularVelocity + this.#joints[1].vel);
        Matter.Body.setAngularVelocity(this.#joints[2].joint, this.#joints[1].joint.angularVelocity + this.#joints[2].vel);
        Matter.Body.setAngularVelocity(this.#joints[3].joint, this.#joints[2].joint.angularVelocity + + this.#joints[3].vel);
    }

    // ================ interface ================

    moveJoint(index, direction)
    {
        if (index >= 0 && index < this.#joints.length && this.#directions.has(direction))
        {
            this.#joints[index].vel = this.#directions.get(direction);
        }
    }

    stopJoint(index)
    {
        if (index >= 1 && index < this.#joints.length)
        {
            if (this.#joints[index].vel !== 0)
            {
                this.#joints[index].vel = 0;
            }
        }
    }

    lock(index)
    {
        if (index >= 1 && index <= 3)
        {
            let lock = Matter.Constraint.create({
                bodyA: this.#joints[index].joint,
                bodyB: this.#joints[index - 1].joint,
                pointA: { x: 0, y: 0 },
                pointB: { x: 0, y: 0 },
                stiffness: 1,
                index: index
            });

            Matter.Composite.add(this.#physicalModel, lock);

            return true;
        }
        else
        {
            return false;
        }
    }

    unlock(index)
    {
        let constraint = this.#physicalModel.constraints.find(item => item.index === index);
        Matter.Composite.remove(this.#physicalModel, constraint);
    }

    info()
    {
        return {
            x: ((this.#joints[3].joint.position.x - this.#mainModule.position.x) / 10).toFixed(1),
            y: ((this.#joints[3].joint.position.y - this.#mainModule.position.y) / 10).toFixed(1),
            active: this.#isEnabled
        }
    }

    enable()
    {
        if (!this.#isEnabled)
        {
            this.#isEnabled = true;
        }
    }

    disable()
    {
        if (this.#isEnabled)
        {
            this.#isEnabled = false;
        }
    }
}