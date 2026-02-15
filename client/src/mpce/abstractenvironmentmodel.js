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
        this.grav = {x: 0, y: 0};

        //Композити не мають поки маси, якось потрібно вирішити
        this.mass = physicalObj.mass;
        this.isClose = false
        this.isCloseToSurf = false
        this.closeGroupIndex = -1
        this.composit = false
        this.compositRef = -1;
        this.dockedSpacecrafts = [];
        this.callback = isInSector;
        this.type = "sc";
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
    constructor(position, velocity, mass, radius, id = 100) // id зараз фіксоване, потім потрібно виправити
    {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.radius = radius;
        this.id = id;
        this.isClose = false;
        this.type = "sb";
    }
}

//=======================================================

export class AbstractEnvironmentModel
{
    G_CONST = 6.67430E-11;

    #mSpaceBodies = [];
    #mSpacecrafts = [];
    #mDockedSpaceCrafts = [];

    #deltaTime = 1; // 0.01666

    #closeGroupCount = 0;
    #isGroupExists = false;
    #groupLieder = null;

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
        this.integratePhysics()

        if (this.count === 30)
        {
            this.calculateDistances1();
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

    calculateDistances1()
    {
        const closeDis = 100;

        if (!this.#isGroupExists)
        {
            for (let i = 0; i < this.#mSpacecrafts.length; i++) //  я видалив -1
            {
                for (let q = i + 1; q < this.#mSpacecrafts.length; q++)
                {
                    let sc1 = this.#mSpacecrafts[i];
                    let sc2 = this.#mSpacecrafts[q];

                    let x = sc1.position.x - sc2.position.x;
                    let y = sc1.position.y - sc2.position.y;

                    let dis = Math.sqrt(x*x + y*y);

                    if (dis < closeDis)
                    {
                        this.#closeGroupCount = 2;
                        this.#groupLieder = sc1;
                        this.#isGroupExists = true;

                        sc1.isClose = true;
                        sc2.isClose = true;

                        let func = this.#callbacks.get("objectsApproaching");
                        if (func)
                        {
                            func([sc1, sc2]);
                        }
                        return;
                    }
                }
            }
            for (let i = 0; i < this.#mSpacecrafts.length; i++)
            {
                for (let s = 0; s < this.#mSpaceBodies.length; s++)
                {
                    let sc = this.#mSpacecrafts[i];
                    let sb = this.#mSpaceBodies[s];

                    let x = sc.position.x - sb.position.x;
                    let y = sc.position.y - sb.position.y;

                    let dis = Math.sqrt(x*x + y*y);

                    if ((dis-6371000) < closeDis)
                    {
                        this.#closeGroupCount = 2;
                        this.#groupLieder = sb;
                        this.#isGroupExists = true;

                        sc.isClose = true;
                        sb.isClose = true;

                        let func = this.#callbacks.get("objectsApproaching");
                        if (func)
                        {
                            func([sb, sc]);
                        }
                        return;
                    }
                }
            }
        }
        else
        {
            for (let sc of [...this.#mSpacecrafts, ...this.#mSpaceBodies])
            {
                if (this.#groupLieder.id !== sc.id)
                {
                    let x = this.#groupLieder.position.x - sc.position.x;
                    let y = this.#groupLieder.position.y - sc.position.y;

                    let dis = Math.sqrt(x*x + y*y);
                    if (this.#groupLieder.type === "sb")
                        dis = dis - 6371000;

                    if (dis < closeDis && sc.isClose === false)
                    {
                        this.#closeGroupCount++;
                        sc.isClose = true;

                        let func = this.#callbacks.get("objectsApproaching");
                        if (func)
                        {
                            func([sc]);
                        }
                    }
                    else if (dis > closeDis && sc.isClose === true)
                    {
                        this.#closeGroupCount--;
                        sc.isClose = false;
                        let func = this.#callbacks.get("objectsDistancing");
                        if (func)
                        {
                            func(sc);
                        }
                    }
                }
            }
            if (this.#closeGroupCount === 1)
            {                
                let func = this.#callbacks.get("objectsDistancing");
                if (func)
                {
                    func(this.#groupLieder);
                }
                this.#isGroupExists = false;
                this.#groupLieder.isClose = false;
                this.#groupLieder = null;

                console.log("Group not exists")
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
    integratePhysics(dt)
    {
        for (let i = 0; i < this.#mSpacecrafts.length; i++)
        {
            let spacecraft = this.#mSpacecrafts[i];

            const r2 = spacecraft.position.x ** 2 + spacecraft.position.y ** 2;
            const r = Math.sqrt(r2);

            if (r < 1e4) return;

            const factor = -this.#mSpaceBodies[0].mass * this.G_CONST / (r2 * r); // -μ / r³

            const ax = spacecraft.position.x * factor;
            const ay = spacecraft.position.y * factor;

            const tx = spacecraft.force.x / (spacecraft.physicalObj.bodies[0].mass * 1000)
            const ty = spacecraft.force.y / (spacecraft.physicalObj.bodies[0].mass * 1000)

            const accX = ax + tx;
            const accY = ay + ty;

            spacecraft.velocity.x += accX * this.#deltaTime;
            spacecraft.velocity.y += accY * this.#deltaTime;

            spacecraft.position.x += spacecraft.velocity.x * this.#deltaTime;
            spacecraft.position.y += spacecraft.velocity.y * this.#deltaTime;
        }
    }
}