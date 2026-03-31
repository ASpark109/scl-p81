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
        
        this.#joints = joints.map(joint => ({joint: joint, direction: 0, angle: 0}));

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        if (this.#isEnabled)
        {
            for (let joint of this.#joints)
            {
                if (joint.direction === 1)
                {
                    joint.angle += this.#directions.get(1)

                }
                else if (joint.direction === -1)
                {
                    joint.angle += this.#directions.get(-1)
                }
            }
        }

        Matter.Body.setAngle(this.#joints[1].joint, this.#joints[1].angle);
        Matter.Body.setAngle(this.#joints[2].joint, this.#joints[1].angle + this.#joints[2].angle);
        Matter.Body.setAngle(this.#joints[3].joint, this.#joints[1].angle + this.#joints[2].angle + this.#joints[3].angle);
    }

    // ================ interface ================

    moveJoint(index, direction)
    {
        if (index >= 0 && index < this.#joints.length && this.#directions.has(direction))
        {
            this.#joints[index].direction = direction;
        }
    }

    stopJoint(index)
    {
        if (index >= 1 && index < this.#joints.length)
        {
            if (this.#joints[index].direction !== 0)
                this.#joints[index].direction = 0;
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