import { DockingTree } from "../mpce/dockingtree";
import { Vector } from "../utils/vector";

class Spacecraft
{
    #forceVectors = new Map();

    constructor(position, velocity, physicalObj = null, isInSector)
    {
        this.physicalObj = physicalObj;

        this.position = position;
        this.velocity = velocity;
        this.velocityPhys = {x: 0, y: 0};
        this.id = physicalObj.id;
        this.force = {x: 0, y: 0};

        //Композити не мають поки маси, якось потрібно вирішити
        this.mass = 420//physicalObj.mass;
        this.isClose = false
        this.closeGroupIndex = -1
        this.composit = false
        this.compositRef = -1;
        this.dockedSpacecrafts = [];
        this.callback = isInSector;

        console.log(physicalObj.bodies[0].mass)
    }

    isInView(dis, viewAngle)
    {
        return this.callback(this.position, this.physicalObj.bodies[0].angle, dis, viewAngle, this.id)
    }

    addNewVector(id)
    {
        if (this.#forceVectors.has(id))
        {
            console.log("ERROR: id " + id + " already exists")
            return false;
        }

        //console.log(id)
        
        this.#forceVectors.set(id, {x: 0, y: 0});
    }

    setVectorForId(id, vector)
    {
        if (this.#forceVectors.has(id))
        {
            this.#forceVectors.set(id, vector);

            let totalV = {x: 0, y: 0};
            for (const [key, vec] of this.#forceVectors)
            {
                totalV.x += vec.x;
                totalV.y += vec.y;
            }

            this.force = totalV;
        }
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
    #mDockedSpaceCrafts = [];

    #deltaTime = 0.01666;

    #closeGroupCount = 0;

    #callbacks = null;

    count = 0

    //: public
    addObject(conf, physicalObj)
    {
        if (conf.type == "spacecraft")
        {
            let newSpacecraft = new Spacecraft(conf.Position, conf.Velocity, physicalObj, (pos, angle, dis, viewAngle, id) => {return this.isInSector(pos, angle, dis, viewAngle, id)});
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

    isInSector(
        position,
        rocketAngleDeg,
        radarRange,
        radarFovDeg,
        id)
    {
        let result = [];

        for(const item of this.#mSpacecrafts)
        {
            if (item.id === id)
                continue;

            const dx = item.position.x - position.x;
            const dy = item.position.y - position.y;

            const distance = Math.hypot(dx, dy);
            if (distance > radarRange) {
                continue;
            }

            const shipAngleDeg = Math.atan2(dx, -dy) * 180 / Math.PI;

            let angleDiff = shipAngleDeg - rocketAngleDeg * 180 / Math.PI;

            angleDiff = ((angleDiff + 180) % 360 + 360) % 360 - 180

            if (Math.abs(angleDiff) <= radarFovDeg / 2)
            {
                result.push({x: dx, y: dy});
            }
        }

        return result;
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

        if (this.count === 100)
        {
            this.calculateDistances();
            this.count = 0
        }

        this.count++

    }

    objectsDocked(objectId)
    {
        //TODO
    }

    setCallbacks(callbacks)
    {
        this.#callbacks = callbacks;
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
                            console.log("DIS_2")
                            let func = this.#callbacks.get("objectsDistancing");
                            if (func)
                            {
                                func(this.#mSpacecrafts[i])
                            }

                            this.#mSpacecrafts[i].isClose = false;
                        }
                        if (flag2)
                        {
                            console.log("DIS_1")
                            let func = this.#callbacks.get("objectsDistancing");
                            if (func)
                            {
                                func(this.#mSpacecrafts[q])
                            }

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

                    let func = this.#callbacks.get("objectsApproaching");
                    if (func)
                    {
                        func(arr)
                    }
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
    
        const spacecraftMass = spacecraft.physicalObj.bodies[0].mass * 1000;

        for (let i = 0; i < this.#mSpaceBodies.length; i++)
        {
            let v = Vector.sub(this.#mSpaceBodies[i].position, {x: x, y: y});
            let f = this.G_CONST * spacecraftMass * this.#mSpaceBodies[i].mass / Math.pow(Vector.magnitude(v), 2);
    
            fv = Vector.add(Vector.mult(Vector.normalise(v), f), fv);
        }
    
        //spacecraft.force = fv;
        fv = Vector.add(spacecraft.force, fv);

        return Vector.div(fv, spacecraftMass);
    }
}