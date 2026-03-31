export class Navigation
{
    #abstructModel = null;
    #physicalModel = null;

    constructor(abstructModel, physicalModel)
    {
        this.#abstructModel = abstructModel;
        this.#physicalModel = physicalModel;
    }

    info()
    {
        return {
            vel: Math.hypot(this.#abstructModel.velocity.x, this.#abstructModel.velocity.y).toFixed(2),
            alt: ((Math.hypot(this.#abstructModel.position.x, this.#abstructModel.position.y) - 6371000) / 1000).toFixed(2),
            angVel: (this.#physicalModel.angularVelocity * 60 * 180 / Math.PI).toFixed(1),
            theta: (Math.atan2(this.#abstructModel.position.x, -this.#abstructModel.position.y) * 180 / Math.PI).toFixed(1)
        };
    }
}