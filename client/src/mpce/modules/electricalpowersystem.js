import { ModuleBase } from './modulebase.js';

export class ElectricalPowerSystem
{
    #totalEnergyProduction = 0;
    #totalMaxEnergyProduction = 0;
    #totalEnergyConsumption = 0;
    #totalEnergyAccumulated = 0;
    #totalBatteryCapacity = 0;

    #consumers = [];
    #suppliers = [];
    #batteries = [];

    constructor(consumers, suppliers, batteries)
    {
        this.#consumers = consumers;
        this.#suppliers = suppliers;
        this.#batteries = batteries;

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        this.#totalMaxEnergyProduction = this.#suppliers.reduce((acc, item) => acc + item.powerGeneration(), 0);
        this.#totalEnergyConsumption = this.#consumers.reduce((acc, item) => acc + item.energyConsumption(), 0);
        this.#totalEnergyAccumulated = this.#batteries.reduce((acc, item) => acc + item.storedEnergy(), 0);
        this.#totalBatteryCapacity = this.#batteries.reduce((acc, item) => acc + item.capacity(), 0);

        let availableForCharg = this.#totalMaxEnergyProduction - this.#totalEnergyConsumption;
        if (availableForCharg > 0)
        {
            let chagre = availableForCharg / this.#batteries.length;

            for (let battery of this.#batteries)
            {
                this.#totalEnergyConsumption += battery.charge(chagre);
            }
        }
        if (availableForCharg < 0)
        {
            let chagre = -availableForCharg / this.#batteries.length;
            for (let battery of this.#batteries)
            {
                this.#totalMaxEnergyProduction += battery.discharge(chagre);
            }
        }
        this.#totalEnergyProduction = Math.min(this.#totalEnergyConsumption, this.#totalMaxEnergyProduction);

        let a = (this.#totalEnergyProduction / this.#totalEnergyConsumption);

        for (let item of this.#consumers)
        {
            item.setAvailableEnergy(Math.floor(item.energyConsumption() * a));
        }
    }

    // ================ interface ================

    energyProduction()
    {
        return {current: this.#totalEnergyProduction, max: this.#totalMaxEnergyProduction};
    }

    energyConsumption()
    {
        return this.#totalEnergyConsumption;
    }

    energyAccumulated()
    {
        return this.#totalEnergyAccumulated;
    }

    setPowerForComponent(consumer, power)
    {
        if (power < 0)
            return;

        this.#consumers.push(consumer);
    }

    info()
    {
        let info = {
            production:
            {
                current: this.#totalEnergyProduction,
                max: this.#totalMaxEnergyProduction
            },
            consumption: this.#totalEnergyConsumption,
            accumulated: {
                current: this.#totalEnergyAccumulated,
                max: this.#totalBatteryCapacity
            }
        };

        return info;
    }

    consumers()
    {
        return this.#batteries
    }
}