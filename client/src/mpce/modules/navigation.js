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
            // angl: this.#physicalModel.angle * 180 / Math.PI,
            alt: ((Math.hypot(this.#abstructModel.position.x, this.#abstructModel.position.y) - 6371000) / 1000).toFixed(2),
            angVel: (this.#physicalModel.angularVelocity * 60 * 180 / Math.PI).toFixed(1),
            theta: ((Math.atan2(-this.#abstructModel.position.y, this.#abstructModel.position.x) * 180 / Math.PI + 360) % 360).toFixed(2)
        };
    }

    position()
    {
        return {x: this.#abstructModel.position.x, y: this.#abstructModel.position.y}
    }

    velocity()
    {
        return Math.hypot(this.#abstructModel.velocity.x, this.#abstructModel.velocity.y).toFixed(3);
    }

    velocityAX()
    {
        return {x: this.#abstructModel.velocity.x, y: this.#abstructModel.velocity.y};
    }

    angle()
    {
        return this.#physicalModel.angle * 180 / Math.PI;
    }

    altitude()
    {
        return ((Math.hypot(this.#abstructModel.position.x, this.#abstructModel.position.y) - 6371000) / 1000).toFixed(2);
    }

    angularVelocity()
    {
        return (this.#physicalModel.angularVelocity * 60 * 180 / Math.PI).toFixed(2);
    }

    theta()
    {
        return ((Math.atan2(-this.#abstructModel.position.y, this.#abstructModel.position.x) * 180 / Math.PI + 360) % 360).toFixed(2);
    }
}