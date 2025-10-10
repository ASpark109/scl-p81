import { ModuleBase } from './modulebase.js';
import { Sensor } from './sensor.js';

export class Tank extends ModuleBase
{
    #maxCapacity = null;
    #fuelWeight = null;

    constructor(conf)
    {
        super()

        this.#maxCapacity = conf.maxCapacity;
        this.#fuelWeight = conf.fuelWeight;

        this.FillLevelSensor = new Sensor(() => {
            return this.#fuelWeight.toFixed(2);
        });
        //ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {

    }

    addFuel(weight)
    {
        if (this.#fuelWeight <= this.#maxCapacity)
        {
            this.#fuelWeight += weight;
            return true;
        }
        return false;
    }

    removeFuel(weight)
    {
        if (this.#fuelWeight > 0)
        {
            this.#fuelWeight -= weight;
            console.log(this.#fuelWeight + " " + weight)
            return true;
        }
        return false;
    }
}