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
        
        this.#directions.set(-1, -0.0002);
        this.#directions.set(0, 0);
        this.#directions.set(1, 0.0002);

        let joints = [physicalModel.bodies.find(item => item.name === "canadarm1"),
                        physicalModel.bodies.find(item => item.name === "canadarm2"),
                        physicalModel.bodies.find(item => item.name === "canadarm3"),
                        physicalModel.bodies.find(item => item.name === "canadarm4")];
        
        this.#joints = joints.map(joint => ({joint: joint, direction: 0, angle: 0, vel: 0}));

        this.#lock(1)
        this.#lock(2)
        this.#lock(3)

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        if (this.#isEnabled)
        {

        }

        Matter.Body.setAngularVelocity(this.#joints[1].joint, this.#joints[0].joint.angularVelocity + this.#joints[1].vel);
        Matter.Body.setAngularVelocity(this.#joints[2].joint, this.#joints[1].joint.angularVelocity + this.#joints[2].vel);
        Matter.Body.setAngularVelocity(this.#joints[3].joint, this.#joints[2].joint.angularVelocity + this.#joints[3].vel);

        //console.log((this.#joints[3].joint.position.x - this.#joints[0].joint.position.x) + " " + (this.#joints[3].joint.position.y - this.#joints[0].joint.position.y))
    }

    matterToMathDeg(angle)
    {
        const deg = (angle * 180 / Math.PI);
        return (((-deg + 270) % 360) + 360) % 360;
    }

    #lock(index)
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

    #unlock(index)
    {
        let constraint = this.#physicalModel.constraints.find(item => item.index === index);
        Matter.Composite.remove(this.#physicalModel, constraint);
    }

    // ================ interface ================

    moveJoint(index, direction)
    {
        if (index >= 1 && index < this.#joints.length && this.#directions.has(direction))
        {
            this.#unlock(index)
            this.#joints[index].vel = this.#directions.get(direction);

            //Matter.Body.setAngularVelocity(this.#joints[index].joint, this.#joints[index - 1].joint.angularVelocity + this.#joints[index].vel);
        }
    }

    stopJoint(index)
    {
        if (index >= 1 && index < this.#joints.length)
        {
            if (this.#joints[index].vel !== 0)
            {
                this.#joints[index].vel = 0;

                // Matter.Body.setAngularVelocity(this.#joints[index].joint, this.#joints[index - 1].joint.angularVelocity + this.#joints[index].vel);
                
                setTimeout(() => {
                    this.#lock(index)
                }, 100);
            }
        }
    }

    jointsAngle()
    {
        return {
            theta2: this.matterToMathDeg(this.#joints[1].joint.angle),
            theta3: this.matterToMathDeg(this.#joints[2].joint.angle),
            theta4: this.matterToMathDeg(this.#joints[3].joint.angle)
        };
    }

    info()
    {
        return {
            x: ((this.#joints[3].joint.position.x - this.#joints[0].joint.position.x) / 10).toFixed(1),
            y: ((this.#joints[3].joint.position.y - this.#joints[0].joint.position.y) / 10).toFixed(1),
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