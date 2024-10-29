class Spacecraft
{
    constructor(position, velocity, physicalObj)
    {
        this.position = position;
        this.velocity = velocity;
        this.id = physicalObj.id;

        //Композити не мають поки маси, якось потрібно вирішити
        this.mass = 25//physicalObj;
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

    #deltaTime = 5;

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
            let state = [this.#mSpacecrafts[i].position.x,
                     this.#mSpacecrafts[i].position.y,
                     this.#mSpacecrafts[i].velocity.x,
                     this.#mSpacecrafts[i].velocity.y];
    
            let newState = this.#rk4Step(state, this.#mSpacecrafts[i], this.#deltaTime);
    
            //Body.setPosition(physicalObjects[i], {x: newState[0]/pxScale + 1000, y: newState[1]/pxScale + 500});
    
            this.#mSpacecrafts[i].position = {x: newState[0], y: newState[1]};
            this.#mSpacecrafts[i].velocity = {x: newState[2], y: newState[3]};
        }

        //console.log(this.#mSpacecrafts[0].position)
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