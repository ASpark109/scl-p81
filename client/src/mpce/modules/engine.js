const AC = 0.0000000095 // маса тіла при цьому має бути в тоннах;

export class Engine
{
    #maxInclination = null;

    #body = null;
    #updateStatePhysCallback = null;
    #updateStateAbsCallback = null;
    #id = null;

    #thrust = 0;
    #maxThrust = null;
    #isActive = false;
    #fuelFlow = 0;
    #currentInclination = 0;

    constructor(rocketBody, abstructModel, conf, engId, physCallback, absCallback)
    {
        this.#id = engId; // "eng" + endId
        this.#maxThrust = conf.maxThrust;

        this.#maxInclination = conf.inclination;

        this.#body = rocketBody;

        this.#updateStatePhysCallback = physCallback;
        this.#updateStateAbsCallback = absCallback;
    }

    #updateState()
    {
        this.#updateForceInter();
        this.#updateForceAbs();
    }

    #updateForceInter()
    {
        console.log(this.#thrust)
        let engineForce = this.#isActive ? AC * this.#thrust : 0;

        //console.log((acceleration * this.#body.mass * 1000) + " " + this.#thrust)

        let forceVecX = Math.cos(this.#currentInclination * Math.PI / 180) * engineForce;
        let forceVecY = Math.sin(this.#currentInclination * Math.PI / 180) * engineForce;

        console.log(forceVecX / AC + " " + forceVecY / AC + " " + engineForce);

        this.#updateStatePhysCallback(this.#id, {x: forceVecX, y: forceVecY / 5}); // ділим на 5 бо ракета дуже швидко розручується
    }

    #updateForceAbs()
    {
        let f = this.#isActive ? this.#thrust : 0;
        let angle = 90 - this.#body.angle * 180 / Math.PI;
        let forceV = {x: Math.cos(angle * Math.PI / 180) * f,
                                     y: -Math.sin(angle * Math.PI / 180) * f}
        
        //console.log(forceV)
        this.#updateStateAbsCallback(this.#id, forceV);
    }

    // ================ interface ================

    _setFuelFlow(flow)
    {
        //console.log("FLOW FOR ENGINE: " + flow)
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
            //console.log(this.#thrust + " OOOOO ")
        }
        
        this.#updateState()
    }

    setInclination(newInclination)
    {
        if (newInclination <= this.#maxInclination && newInclination >= -this.#maxInclination)
        {
            this.#currentInclination = newInclination;
            this.#updateState()
        }
    }

    inclination()
    {
        console.log("hello " + this.#currentInclination)
        return this.#currentInclination;
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