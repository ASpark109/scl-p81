export class ElectricalDevice
{
    #power = 0;
    #availablePower = 0
    #minPower = 0;
    #maxPower = 0;

    constructor(minPower = 100, maxPower = 100) // подумати що тут можна зробити
    {
        this.#maxPower = maxPower;
        this.#minPower = minPower;
    }

    setAvailablePower(e)
    {
        // if (this.#minPower == 500)
        //     console.log(e)

        if (e > this.#power)
            e = this.#power;
        this.#availablePower = e;
    }

    // ========================

    requiredPower()
    {
        return this.#power;
    }

    currentPower()
    {
        return this.#availablePower;
    }

    setPower(power)
    {
        console.log("wtf " + power)
        this.#power = Math.max(0, Math.min(power, this.#maxPower));
    }
}