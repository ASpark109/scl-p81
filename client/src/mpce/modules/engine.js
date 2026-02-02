const AC = 0.0000000102;

export class Engine
{
    #inclination = null;

    #body = null;
    #updateStatePhysCallback = null;
    #updateStateAbsCallback = null;
    #id = null;

    #thrust = 0;
    #maxThrust = null;
    #isActive = false;
    #fuelFlow = 0;

    constructor(rocketBody, abstructModel, conf, engId, physCallback, absCallback)
    {
        this.#id = engId; // "eng" + endId
        this.#maxThrust = conf.maxThrust;

        this.#inclination = conf.inclination;

        this.#body = rocketBody;

        this.#updateStatePhysCallback = physCallback;
        this.#updateStateAbsCallback = absCallback;
    }

    #updateState()
    {
        this.#updateForceInter();
        this.#updateForceAbs();

        console.log(this.#thrust)
    }

    #updateForceInter()
    {
        let engineForce = this.#isActive ? AC * this.#thrust : 0;

        //console.log((acceleration * this.#body.mass * 1000) + " " + this.#thrust)

        let forceAngle = -this.#body.angle * 180 / Math.PI + 90

        let forceVecX = Math.cos(forceAngle * Math.PI / 180) * engineForce;
        let forceVecY = -Math.sin(forceAngle * Math.PI / 180) * engineForce;

        this.#updateStatePhysCallback(this.#id, {x: forceVecX, y: forceVecY});
    }

    #updateForceAbs()
    {
        let f = this.#isActive ? this.#thrust : 0;
        let angle = 90 - this.#body.angle * 180 / Math.PI;
        let forceV = {x: Math.cos(angle * Math.PI / 180) * f,
                                     y: -Math.sin(angle * Math.PI / 180) * f}
        
        console.log(forceV)
        this.#updateStateAbsCallback(this.#id, forceV);
    }

    // ================ interface ================

    _setFuelFlow(flow)
    {
        console.log("FLOW FOR ENGINE: " + flow)
        if (flow === this.#fuelFlow)
        {
            return;
        }

        this.#fuelFlow = flow;
        if (this.#fuelFlow < 100)
        {
            this.#thrust = 0;
            this.#isActive = false;
        }
        else
        {
            this.#thrust = this.#fuelFlow * this.#maxThrust / 270;
            console.log(this.#thrust + " OOOOO ")
        }
        
        this.#updateState()
    }

    start()
    {
        if (this.#fuelFlow > 100)
        {
            //console.log("engine is started")
            this.#isActive = true;
            this.#updateState()
        }
    }

    isActive()
    {
        return this.#isActive;
    }
}