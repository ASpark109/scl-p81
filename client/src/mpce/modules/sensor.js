import { ElectricalDevice } from "./electricaldevice";

export class Sensor
{
    #readValueCallback = null;

    _electricalDevice = null;

    constructor(callback)
    {
        this.#readValueCallback = callback;

        this._electricalDevice = new ElectricalDevice();
    }

    readValue()
    {
        if (this.#readValueCallback !== null)
        {
            return this.#readValueCallback();
        }
    }
}