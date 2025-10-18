export class ElectricalDevice
{
    #energyConsumption = null;
    #availableEnergy = 0

    constructor(minEnergyConsumption = 5, energyConsumption = 300) // подумати що тут можна зробити
    {
        this.#energyConsumption = energyConsumption;
    }

    energyConsumption()
    {
        return this.#energyConsumption;
    }

    setEnergiCons(e)
    {
        this.#energyConsumption = e;
    }

    setAvailableEnergy(e)
    {
        if (e > this.#energyConsumption)
            e = this.#energyConsumption;
        this.#availableEnergy = e;
    }

    availableEnergy()
    {
        return this.#availableEnergy + "(" + Math.round(this.#availableEnergy * 100 / this.#energyConsumption) + "%)";
    }
}