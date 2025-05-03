import { ModuleBase } from './modulebase.js';

export class PneumaticActuator extends ModuleBase
{
    #pressureTank;
    #maxPistonDisplacement;
    #actuator;
    #throttle;
    #isValveOpen = false;

    constructor(actuator, config)
    {
        super()

        this.#actuator = actuator;
        this.#pressureTank = config.pressureTank;
        this.#maxPistonDisplacement = config.maxPistonDisplacement;
        this.#throttle = config.throttle;

        ModuleBase.updateList.push(this.update.bind(this));
    }

    update()
    {
        if (this.#isValveOpen &&
            this.#actuator.length <= this.#maxPistonDisplacement &&
            this.#pressureTank >= 0)
        {
            this.#actuator.length += this.#disFunc();
            this.#pressureTank -= this.#throttle
        }
    }

    setValveState(isOpen)
    {
        if (isOpen !== this.#isValveOpen)
        {
            this.#isValveOpen = isOpen;
        }
    }

    pressureTank()
    {
        return this.#pressureTank;
    }

    pistonDisplacement()
    {
        return this.#actuator.length;
    }

    #disFunc()
    {
        return (Math.pow(this.#pressureTank, 2) - Math.pow(this.#pressureTank - this.#throttle, 2))/ 10; // y = x / 5
    }
}