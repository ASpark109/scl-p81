import { ElectricalDevice } from "../electricaldevice";

export class Transmitter
{
    #signalHub = null;
    #isEnabled = false;
    #carrierFreq = 0;

    #isBusy = false;

    #maxCarrierFreq = 0;
    #minCarrierFreq = 0;

    #minPower = 0;
    #maxPower = 0;

    #bitRate = 0;
    #maxBr = 0;
    #minBr = 0;

    #powerBrRatio = 0;

    #absObj = null;

    _electricalDevice = null;

    constructor(maxCf, minCf, maxBr, minBr, maxP, minP, absObj)
    {
        this.#maxCarrierFreq = maxCf;
        this.#minCarrierFreq = minCf;

        this.#maxBr = maxBr;
        this.#minBr = minBr;

        this.#maxPower = maxP;
        this.#minPower = minP;

        let ratio = (this.#maxPower - this.#minPower) / (this.#maxBr - this.#minBr);
        this.#powerBrRatio = ratio === NaN ? 1 : ratio;
        
        this.#absObj = absObj;

        this._electricalDevice = new ElectricalDevice(minP, maxP);

        this.setCarrierFreq(this.#minCarrierFreq);
        this.setBitRate(this.#minBr);
    }

    setCarrierFreq(cf)
    {
        this.#carrierFreq = Math.max(this.#minCarrierFreq, Math.min(cf, this.#maxCarrierFreq));
    }

    frequency()
    {
        return this.#carrierFreq;
    }

    setBitRate(newBitRate)
    {
        this.#bitRate = Math.max(this.#minBr, Math.min(newBitRate, this.#maxBr));
    }

    sendMessage(msg) // bits 0b10100101000101
    {
        console.log(this._electricalDevice.currentPower() + " " +this.#minPower)
        if (this.#isBusy || !this.#isEnabled) // this._electricalDevice.currentPower() < this.#minPower
        {
            return false;
        }

        this.#signalHub.sendSignal(this.#carrierFreq, msg, this.#absObj.position, this.#bitRate);
        
        // console.log(this.#powerBrRatio)
        // console.log(this.#minPower + this.#powerBrRatio * this.#bitRate)

        this._electricalDevice.setPower(this.#minPower + this.#powerBrRatio * this.#bitRate);

        // фактична потужність може бути меншою за затребувану, в такому разі напевно треба додавати шум в сигнал
        // або автоматично зменшувати бітрейт

        // setTimeout(() => {
        //     this._electricalDevice.setPower(this.#minPower);
        // }, msg.length * 1000 / this.#bitRate);

        return true;
    }

    status()
    {
        return {
            freq: this.#carrierFreq,
            state: this.#isEnabled,
            power: this.power()
        };
    }

    enable()
    {
        if (!this.#isEnabled)
        {
            this._electricalDevice.setPower(this.#minPower);
            this.#isEnabled = true;
        }
    }

    disable()
    {
        if (this.#isEnabled)
        {
            this._electricalDevice.setPower(0);
            this.#isEnabled = false;
        }
    }
    // =============== SIGNAL HUB ===============
    setSignalHub(signalHub)
    {
        if (this.#signalHub === null)
            this.#signalHub = signalHub;
    }

    // =============== ELECTRICAL DEVICE ===============

    setPower(power)
    {
        this._electricalDevice.setPower(power);
    }

    power()
    {
        return this._electricalDevice.currentPower();
    }

    requiredPower()
    {
        return this._electricalDevice.requiredPower();
    }
}