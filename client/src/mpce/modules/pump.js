import { ModuleBase } from './modulebase.js';
import { ElectricalDevice } from './electricaldevice.js';

export class Pump
{
    #connection1 = null;
    #connection2 = null;

    #isEnabled = false;
    #amount = 0;
    #direction = "LR"; // LR - left to right, RL - right to left
    #rpm = 0;
    #maxRPM = 100;

    _electricalDevice = null;

    constructor(connection1 = null, connection2 = null)
    {
        this.#connection1 = connection1;
        this.#connection2 = connection2;

        this._electricalDevice = new ElectricalDevice(300, 5000);

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
        if (!this.#isEnabled && this.#connection1 && this.#connection2)
        {
            this.#isEnabled = true;
            this._electricalDevice.setPower(5000);
        }
        else
        {
            return -1
        }
    }

    disable()
    {
        if (!this.#isEnabled)
            return;

        this.#rpm = 0;
        this.#isEnabled = false;
        this._electricalDevice.setPower(300);
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

    availablePower()
    {
        return this._electricalDevice.currentPower()
    }

    setPowerConsumption(e)
    {
        return this._electricalDevice.setPower(e)
    }

    readStatus()
    {
        return {rpm: this.#rpm, dir: this.#direction}
    }

    connect(connection)
    {
        this.#connection2 = connection;
    }

    disconnect()
    {
        this.#connection2 = null;
    }
}