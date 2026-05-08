import { ModuleBase } from './modulebase.js';

export class TurboPump
{
    #engines = [];
    #RP1TankConnection = null;
    #LOXTankConnection = null;
    
    #totalFuelFlow = 0;

    #maxFuelFlowPerSec = 0; // max throttle (100%)
    #LOXRatio = 0;
    #RP1Ratio = 0;

    #isEnabled = false;

    constructor(engines, rp1Connection, loxConnection, conf)
    {
        this.#engines = engines;
        this.#RP1TankConnection = rp1Connection;
        this.#LOXTankConnection = loxConnection;

        this.#maxFuelFlowPerSec = conf.maxFuelFlowPerSec;

        this.#LOXRatio = conf.LOXRatio;
        this.#RP1Ratio = conf.RP1Ratio;

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        //console.log(this.#engines.reduce((sum, engine) => sum + engine._fuelFlow(), 0))
        if (this.#isEnabled)
        {
            this.#totalFuelFlow = Math.floor(this.#engines.reduce((sum, engine) => sum + engine._fuelFlow(), 0));
            
            if (!this.#LOXTankConnection.removeFuel(this.#totalFuelFlow * this.#LOXRatio / 60) ||
                !this.#RP1TankConnection.removeFuel(this.#totalFuelFlow * this.#RP1Ratio / 60))
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
            engine._setFuelFlow(fuelFlow)
        }
    }

    setValveThrottle(newValveThrottle, engineId)
    {
        if ((newValveThrottle < 0 || newValveThrottle > 100) || !this.#engines[engineId])
            return;
        
        const newValue = newValveThrottle === 0 ? 0 : Math.min(100, Math.max(40, newValveThrottle));

        const fuelFlow = this.#maxFuelFlowPerSec * newValue / 100;

        console.log("Set Valve Throttle: " + fuelFlow + " eng:" + engineId);

        if (this.#isEnabled)
        {
            this.#engines[engineId]._setFuelFlow(fuelFlow);
        }
    }

    status()
    {
        return {
            active: this.#isEnabled,
            flow: this.#totalFuelFlow,
        };
    }

    enable()
    {
        if (!this.#isEnabled)
        {
            this.#isEnabled = true;
        }
    }

    disable()
    {
        if (this.#isEnabled)
        {
            this.#isEnabled = false;
            this.#updateEnginesState(0);
        }
    }
}