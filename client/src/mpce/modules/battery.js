export class Battery
{
    #capacity = null;
    #storedEnergy = 0;

    #maxInput = null;
    #maxOutput = null;

    constructor(a, b, c)
    {
        this.#capacity = a;
        this.#maxInput = b;
        this.#maxOutput = c;
    }

    charge(amount)
    {
        let charge = Math.min(amount, this.#maxInput, this.#capacity - this.#storedEnergy) / 60;
        this.#storedEnergy += charge;

        return charge * 60;
    }

    discharge(amount) {
        const dischargeAmount = Math.min(amount, this.#maxOutput, this.#storedEnergy);
        this.#storedEnergy -= dischargeAmount / 60;

        return dischargeAmount;
    }

    storedEnergy()
    {
        return this.#storedEnergy;
    }

    capacity()
    {
        return this.#capacity;
    }
}