import { ModuleBase } from './modulebase.js';

export class TurboPump
{
    #engines = [];
    #RP1TankConnection = null;
    #LOXTankConnection = null;
    
    #fuelFlowLOX = 0;
    #fuelFlowRP1 = 0;

    #MAXRP1PerSec = 0; // max throttle (100%)
    #MAXLOXPerSec = 0; // max throttle (100%)

    #isEnabled = false;

    constructor(engines, rp1Connection, loxConnection, conf)
    {
        this.#engines = engines;
        this.#RP1TankConnection = rp1Connection;
        this.#LOXTankConnection = loxConnection;

        this.#MAXRP1PerSec = conf.maxRP1PerSec;
        this.#MAXLOXPerSec = conf.maxLOXPerSec;

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        if (this.#isEnabled)
        {
            if (!this.#LOXTankConnection.removeFuel(this.#fuelFlowLOX / 60) ||
                !this.#RP1TankConnection.removeFuel(this.#fuelFlowRP1 / 60))
            {
                this.#updateEnginesState(0)
                this.#isEnabled = false;
            }
        }
    }

    #updateEnginesState(fuelFlow)
    {
        for(let engine of this.#engines)
        {
            // Доробити в майбутньому щоб паливо витрачалося тільки на активні двигуни
            engine._setFuelFlow(fuelFlow / 9)
        }
    }

    setValveThrottle(newValveThrottle)
    {
        if (!newValveThrottle)
            return;
        
        const newValue = Math.min(100, Math.max(40, newValveThrottle));

        this.#fuelFlowRP1 = this.#MAXRP1PerSec * newValue / 100;
        this.#fuelFlowLOX = this.#MAXLOXPerSec * newValue / 100;

        //console.log("Set Valve Throttle: " + this.#fuelFlowRP1 + " : " + this.#fuelFlowLOX)

        if (this.#isEnabled)
        {
            this.#updateEnginesState(this.#fuelFlowRP1 + this.#fuelFlowLOX);
        }
    }

    status()
    {
        return {
            active: this.#isEnabled,
            flowRP1: this.#fuelFlowRP1,
            flowLOX: this.#fuelFlowLOX
        };
    }

    enable()
    {
        if (!this.#isEnabled)
        {
            //console.log("Trubopump enabled")
            this.#isEnabled = true;
            this.#updateEnginesState(this.#fuelFlowRP1 + this.#fuelFlowLOX);
        }
    }

    disable()
    {
        if (this.#isEnabled)
        {
            //console.log("Trubopump disabled")
            this.#isEnabled = false;
            this.#updateEnginesState(0);
        }
    }
}