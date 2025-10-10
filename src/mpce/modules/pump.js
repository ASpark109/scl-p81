import { ModuleBase } from './modulebase.js';

export class Pump extends ModuleBase
{
    #connection1 = null;
    #connection2 = null;

    #isEnabled = false;
    #amount = 0;
    #direction = "LR"; // LR - left to right, RL - right to left
    #rpm = 0;
    #maxRPM = 100;

    constructor(connection1, connection2)
    {
        super();

        this.#connection1 = connection1;
        this.#connection2 = connection2;

        if (connection1 === null || connection2 === null)
            return;

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        if (this.#isEnabled)
        {
            if (this.#direction === "LR")
            {
                if (this.#connection1.removeFuel(this.#rpm / 100))
                    this.#connection2.addFuel(this.#rpm / 100);   
            }
            else
            {
                if (this.#connection2.removeFuel(this.#rpm / 100))
                    this.#connection1.addFuel(this.#rpm / 100);
            }
        }
    }

    // ================ interface ================

    enable()
    {
        if (this.#isEnabled)
            return;

        this.#isEnabled = true;
    }

    disable()
    {
        if (!this.#isEnabled)
            return;

        this.#isEnabled = false;
    }

    changeDirection(dir)
    {
        if (dir === "LR" || dir === "RL")
        {

            if (dir === this.#direction)
                return;

            this.#direction = dir;
        }
    }

    setRPM(rpm)
    {
        if (rpm > this.#maxRPM)
            rpm = this.#maxRPM;

        this.#rpm = rpm;
    }
}