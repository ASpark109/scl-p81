const AC = 0.0000000095 // маса тіла при цьому має бути в тоннах;

export class EngineType1
{
    #body = null;
    #updateStatePhysCallback = null;
    #updateStateAbsCallback = null;
    #fuelTank = null;
    #id = null;

    #thrust = 0;
    #maxThrust = null;
    #isActive = false;
    #currentInclination = 0;

    #flowSec = 350;

    #visualEffect = null;

    constructor(rocketBody, abstructModel, conf, engId, fuelTank, physCallback, absCallback, visualEffect)
    {
        this.#id = engId; // "eng" + endId
        this.#maxThrust = conf.maxThrust;

        this.#body = rocketBody;

        this.#updateStatePhysCallback = physCallback;
        this.#updateStateAbsCallback = absCallback;
        this.#fuelTank = fuelTank;

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

        this.#updateStatePhysCallback(this.#id, {x: forceVecX, y: forceVecY / 5}); // ділим на 5 бо ракета дуже швидко розручується
    }

    #updateForceAbs()
    {
        let f = this.#isActive ? this.#thrust : 0;
        
        // let angle = 90 - this.#body.angle * 180 / Math.PI;
        // console.log(angle)

        this.#updateStateAbsCallback(this.#id, {x: f, y: 0}); // вказується вектор двигуна відносно ракети.
    }

    // ================ interface ================

    start()
    {
        this.#isActive = true;

        this.#thrust = this.#maxThrust;

        this.#visualEffect.setVisualAndPlay("thrustFlameL", true, true);
        this.#visualEffect.setVisualAndPlay("thrustFlameR", true, true);
        this.#updateState()
    }

    stop()
    {
        this.#isActive = false;

        this.#thrust = 0;

        this.#visualEffect.setVisualAndPlay("thrustFlameL", false, false);
        this.#visualEffect.setVisualAndPlay("thrustFlameR", false, false);
        this.#updateState()
    }

    isActive()
    {
        return this.#isActive;
    }
}