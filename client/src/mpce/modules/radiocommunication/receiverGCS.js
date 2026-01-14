export class ReceiverGCS
{
    #signalHub = null;
    #signalsStorage = [];
    #isEnabled = false;
    #carrierFreq = 0;

    #maxCarrierFreq = 0;
    #minCarrierFreq = 0;

    #absObj = null;

    constructor(maxCf, minCf, maxP, minP, absObj)
    {
        this.#maxCarrierFreq = maxCf;
        this.#minCarrierFreq = minCf;

        this.#absObj = absObj;

        this.setCarrierFreq(this.#minCarrierFreq);
    }

    setCarrierFreq(cf)
    {
        this.#carrierFreq = Math.max(this.#minCarrierFreq, Math.min(cf, this.#maxCarrierFreq));
    }

    setOnSignal(func)
    {
        this.onSignalReceived = func;
    }

    signalReceived(signal)
    {
        this.#signalsStorage.push(signal);
    }

    signalsStorage()
    {
        return this.#signalsStorage;
    }

    enable()
    {
        if (!this.#isEnabled)
        {
            this.#isEnabled = true;
            this.#signalHub.startListenChannel(this.#carrierFreq, this);
        }
    }

    disable()
    {
        if (this.#isEnabled)
        {
            this.#isEnabled = false;
            this.#signalHub.stopListenChannel(this.#carrierFreq, this);
        }
    }

    // =============== SIGNAL HUB ===============

    position()
    {
        return this.#absObj.position;
    }

    setSignalHub(signalHub)
    {
        this.#signalHub = signalHub;
    }
}