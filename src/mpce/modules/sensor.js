export class Sensor
{
    #readValueCallback = null;

    constructor(callback)
    {
        this.#readValueCallback = callback;
    }

    readValue()
    {
        if (this.#readValueCallback !== null)
        {
            console.log("WTF it works ??? " + this.#readValueCallback())
            return this.#readValueCallback();
        }
    }
}