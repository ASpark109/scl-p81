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

    #visualEffect = null;

    constructor(rocketBody, abstructModel, conf, engId, physCallback, absCallback, visualEffect)
    {
        this.#id = engId; // "eng" + endId
        this.#maxThrust = conf.maxThrust;

        this.#maxInclination = conf.inclination;

        this.#body = rocketBody;

        this.#updateStatePhysCallback = physCallback;
        this.#updateStateAbsCallback = absCallback;

        this.#visualEffect = visualEffect;
    }

    #updateState()
    {
        this.#updateForceInter();
        this.#updateForceAbs();
    }

    #updateForceInter()
    {
        let engineForce = this.#isActive ? AC * this.#thrust : 0;

        let forceVecX = Math.cos(this.#currentInclination * Math.PI / 180) * engineForce;
        let forceVecY = Math.sin(this.#currentInclination * Math.PI / 180) * engineForce;

        //console.log(forceVecX / AC + " " + forceVecY / AC + " " + engineForce);

        this.#updateStatePhysCallback(this.#id, {x: forceVecX, y: forceVecY / 1}); // ділим на 5 бо ракета дуже швидко розручується
    }

    #updateForceAbs()
    {
        let f = this.#isActive ? this.#thrust : 0;
        let forceV = {x: Math.cos(this.#currentInclination * Math.PI / 180) * f,
                      y: -Math.sin(this.#currentInclination * Math.PI / 180) * f}
        
        console.log(forceV)
        
        this.#updateStateAbsCallback(this.#id, {x: forceV.x, y: forceV.y});
    }

    // ================ interface ================

    _setFuelFlow(flow)
    {
        if (flow === this.#fuelFlow)
        {
            return;
        }

        this.#fuelFlow = flow;
        if (this.#fuelFlow < 100)
        {
            this.#thrust = 0;
            this.#isActive = false;
            this.#visualEffect.setVisualAndPlay("thrustFlame", false, false);
        }
        else
        {
            this.#thrust = this.#fuelFlow * this.#maxThrust / 270;
        }
        
        this.#updateState()
    }

    _fuelFlow()
    {
        return this.#fuelFlow;
    }

    setInclination(newInclination)
    {
        if (newInclination <= this.#maxInclination && newInclination >= -this.#maxInclination)
        {
            this.#currentInclination = newInclination;
            this.#updateState()

            this.#visualEffect.setEffectAngle("thrustFlame", newInclination);
        }
    }

    thrust()
    {
        return Math.floor(this.#thrust / this.#maxThrust * 100);
    }

    inclination()
    {
        console.log("hello " + this.#currentInclination)
        return this.#currentInclination;
    }

    start()
    {
        console.log("want to start engine")
        if (this.#fuelFlow > 100)
        {
            console.log("engine is started")
            this.#isActive = true;
            this.#visualEffect.setVisualAndPlay("thrustFlame", true, true);
            this.#updateState()
        }
        else
        {
            console.log("fuel flow is too low: " + this.#fuelFlow);
        }
    }

    isActive()
    {
        return this.#isActive;
    }
}