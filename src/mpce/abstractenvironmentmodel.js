import { SignalSlotDispatcher } from "../mpce/signalslotdispatcher";

class Spacecraft
{
    constructor(position, velocity, physicalObj)
    {
        this.position = position;
        this.velocity = velocity;
        this.velocityPhys = {x: 0, y: 0};
        this.id = physicalObj.id;
        this.force = {};

        //Композити не мають поки маси, якось потрібно вирішити
        this.mass = 12//physicalObj;
        this.isClose = false
        this.closeGroupIndex = -1
    }
}

class SpaceObject
{
    constructor(position, velocity, mass, radius, id = 0)
    {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.radius = radius;
        this.id = id;
    }
}

//=======================================================

export class AbstractEnvironmentModel
{
    G_CONST = 6.67430E-11;

    #mSpaceBodies = [];
    #mSpacecrafts = [];

    #deltaTime = 1;

    #closeGroupCount = 0;

    flag = true;

//: public
    addObject(conf, physicalObj)
    {

        if (conf.type == "spacecraft")
        {
            let newSpacecraft = new Spacecraft(conf.Position, conf.Velocity, physicalObj);
            this.#mSpacecrafts.push(newSpacecraft);
            return newSpacecraft;
        }
        else if (conf.type == "spaceobject")
        {
            let newSpaceObject = new SpaceObject(conf.Position, conf.Velocity, conf.Mass, conf.Radius)
            this.#mSpaceBodies.push(newSpaceObject)
            return newSpaceObject;
        }
    }

    removeObject(id)
    {
        const index = this.#mSpacecrafts.findIndex(item => item.id === id);

        if (index !== -1)
        {
            this.#mSpacecrafts.splice(index, 1);
        }
    }

    joinObjects()
    {
        //! TODO
        return this.#mSpacecrafts;
    }

    separateObjects()
    {
        //! TODO
    }

    update()
    {
        this.#calculateNewSystemState();
        this.calculateDistances();
    }

    calculateDistances()
    {
        for (let i = 0; i < this.#mSpacecrafts.length - 1; i++)
        {
            for (let q = i + 1; q < this.#mSpacecrafts.length; q++)
            {
                let x = this.#mSpacecrafts[i].position.x - this.#mSpacecrafts[q].position.x;
                let y = this.#mSpacecrafts[i].position.y - this.#mSpacecrafts[q].position.y;

                let d = Math.sqrt(x*x + y*y);

                if (this.#mSpacecrafts[i].isClose && this.#mSpacecrafts[q].isClose &&
                    this.#mSpacecrafts[i].closeGroupIndex === this.#mSpacecrafts[q].closeGroupIndex)
                {
                    if (d > 70)
                    {
                        let flag1 = false;
                        let flag2 = false;
                        
                        for (let n = 0; n < this.#mSpacecrafts.length; n++)
                        {
                            let x = this.#mSpacecrafts[n].position.x - this.#mSpacecrafts[i].position.x;
                            let y = this.#mSpacecrafts[n].position.y - this.#mSpacecrafts[i].position.y;

                            let d = Math.sqrt(x*x + y*y);

                            if (d <= 50)
                            {
                                flag1 = true;
                            }
                        }

                        for (let n = 0; n < this.#mSpacecrafts.length; n++)
                            {
                                let x = this.#mSpacecrafts[n].position.x - this.#mSpacecrafts[q].position.x;
                                let y = this.#mSpacecrafts[n].position.y - this.#mSpacecrafts[q].position.y;
    
                                let d = Math.sqrt(x*x + y*y);
    
                                if (d <= 50)
                                {
                                    flag2 = true;
                                }
                            }

                        if (flag1)
                        {
                            SignalSlotDispatcher.emit("objectsDistancing", 
                                    this.#mSpacecrafts[i]
                                );
                            this.#mSpacecrafts[i].isClose = false;
                        }
                        if (flag2)
                        {
                            SignalSlotDispatcher.emit("objectsDistancing", 
                                    this.#mSpacecrafts[q]
                                );
                            this.#mSpacecrafts[q].isClose = false;
                        }
                    }
                }
                else if (d <= 70)
                {
                    let arr =
                    [
                        this.#mSpacecrafts[i],
                        this.#mSpacecrafts[q]
                    ];

                    if (arr[1].isClose)
                    {
                        arr.reverse();
                    }

                    if (arr[0].closeGroupIndex === -1) //! Цей блок можна перемістити в if, який знаходиться вище
                    {
                        this.#closeGroupCount++;
                        arr[0].closeGroupIndex = this.#closeGroupCount;
                        arr[1].closeGroupIndex = this.#closeGroupCount;
                    }
                    else
                    {
                        arr[1].closeGroupIndex = arr[0].closeGroupIndex;
                    }

                    this.#mSpacecrafts[i].isClose = true;
                    this.#mSpacecrafts[q].isClose = true;

                    SignalSlotDispatcher.emit("objectsApproaching", arr);
                }
            }
        }
    }

    start()
    {
        //! TODO
    }

    stop()
    {
        //! TODO
    }

//: private
    #calculateNewSystemState()
    {
        for (let i = 0; i < this.#mSpacecrafts.length; i++)
        {
            let state =
                    [
                        this.#mSpacecrafts[i].position.x,
                        this.#mSpacecrafts[i].position.y,
                        this.#mSpacecrafts[i].velocity.x,
                        this.#mSpacecrafts[i].velocity.y 
                    ];
            
            let newState = this.#rk4Step(state, this.#mSpacecrafts[i], this.#deltaTime);
        
            this.#mSpacecrafts[i].position = {x: newState[0], y: newState[1]};
            this.#mSpacecrafts[i].velocity = {x: newState[2], y: newState[3]};
        }
    }

    #rk4Step(state, spacecraft, dt) {
        const k1 = this.#derivatives(state, spacecraft);
        const k2 = this.#derivatives(state.map((v, i) => v + dt / 2 * k1[i]), spacecraft);
        const k3 = this.#derivatives(state.map((v, i) => v + dt / 2 * k2[i]), spacecraft);
        const k4 = this.#derivatives(state.map((v, i) => v + dt * k3[i]), spacecraft);
    
        return state.map((v, i) => v + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    }

    #derivatives(state, spacecraft) {
        const [x, y, vx, vy] = state;
        const acc = this.#force(spacecraft, x, y);
        const ax = acc.x;
        const ay = acc.y;
    
        return [vx, vy, ax, ay];
    }

    #force(spacecraft, x, y)
    {
        let fv = {x: 0, y: 0};

        for (let i = 0; i < this.#mSpaceBodies.length; i++)
        {
            //if (spacecraft.id !== this.#mSpaceBodies[i].id)
            //{
            let v = Vector.sub(this.#mSpaceBodies[i].position, {x: x, y: y});
            let f = this.G_CONST * spacecraft.mass * this.#mSpaceBodies[i].mass / Math.pow(Vector.magnitude(v), 2);
            
            //console.log(f)

            fv = Vector.add(Vector.mult(Vector.normalise(v), f), fv);
            //}
        }

        spacecraft.force = fv;

        //! Тут можна додавати оновлювати прискорення для обєкта, або сили

        return Vector.div(fv, spacecraft.mass);
    }

}

//=============================================

class Vector
{
    static add(v1, v2)
    {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        };
    }

    static sub(v1, v2)
    {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        };
    }

    static mult(v, a)
    {
        return {
            x: v.x * a,
            y: v.y * a
        };
    }

    static div(v, a)
    {
        if (a === 0) {
            throw new Error("Division by zero is not allowed.");
        }
    
        return {
            x: v.x / a,
            y: v.y / a
        };
    }

    static normalise(v)
    {
        const length = Math.sqrt(v.x * v.x + v.y * v.y);
    
        if (length === 0) {
            throw new Error("Cannot normalize a zero-length vector.");
        }
    
        return {
            x: v.x / length,
            y: v.y / length
        };
    }

    static magnitude(v)
    {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
}