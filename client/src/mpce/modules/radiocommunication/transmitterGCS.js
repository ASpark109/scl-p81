export class TransmitterGCM
{
    #signalHub = null;
    #isEnabled = false;
    #carrierFreq = 0;

    #isBusy = false;

    #maxCarrierFreq = 0;
    #minCarrierFreq = 0;

    #bitRate = 0;
    #maxBr = 0;
    #minBr = 0;

    #absObj = null;

    constructor(maxCf, minCf, maxBr, minBr, maxP, minP, absObj)
    {
        this.#maxCarrierFreq = maxCf;
        this.#minCarrierFreq = minCf;

        this.#maxBr = maxBr;
        this.#minBr = minBr;
        
        this.#absObj = absObj;

        this.setCarrierFreq(this.#minCarrierFreq);
        this.setBitRate(this.#minBr);
    }

    setCarrierFreq(cf)
    {
        this.#carrierFreq = Math.max(this.#minCarrierFreq, Math.min(cf, this.#maxCarrierFreq));
    }

    setBitRate(newBitRate)
    {
        this.#bitRate = Math.max(this.#minBr, Math.min(newBitRate, this.#maxBr));
    }

    carrierFreq()
    {
        console.log(this.#carrierFreq)
        return this.#carrierFreq;
    }

    bitRate()
    {
        return this.#bitRate;
    }

    sendMessage(msg) // bits 0b10100101000101
    {
        if (this.#isBusy || !this.#isEnabled)
        {
            console.log("error")
            return false;
        }

        this.#signalHub.sendSignal(this.#carrierFreq, msg, this.#absObj.position, this.#bitRate);

        return true;
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
        }
    }
    // =============== SIGNAL HUB ===============
    setSignalHub(signalHub)
    {
        if (this.#signalHub === null)
            this.#signalHub = signalHub;
    }
}