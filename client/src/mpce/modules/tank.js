import Matter from 'matter-js';

import { Sensor } from './sensor.js';

export class Tank
{
    #abstract = null;
    #physical = null;

    #maxCapacity = null;
    #fuelWeight = null;

    constructor(conf, abstract, physical)
    {
        this.#abstract = abstract;
        this.#physical = physical;

        this.#maxCapacity = conf.maxCapacity;
        this.#fuelWeight = conf.capacity;

        this.FillLevelSensor = new Sensor(() => {
            return this.#fuelWeight;
        });
    }

    #update()
    {

    }

    addFuel(weight)
    {
        if (this.#fuelWeight <= this.#maxCapacity)
        {
            this.#fuelWeight += weight;

            Matter.Body.setMass(this.#physical, this.#physical.mass + weight / 1000);

            return true;
        }
        return false;
    }

    removeFuel(weight)
    {
        if (this.#fuelWeight > 0)
        {
            this.#fuelWeight -= weight;
            
            Matter.Body.setMass(this.#physical, this.#physical.mass - weight / 1000);

            return true;
        }
        return false;
    }
}