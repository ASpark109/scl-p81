import { ElectricalDevice } from "../electricaldevice";
import { UserInteractionInterface } from "../../userinteractioninterface";

export class Receiver
{
    #signalHub = null;
    #signalsStorage = [];
    #isEnabled = false;
    #carrierFreq = 0;

    #maxCarrierFreq = 0;
    #minCarrierFreq = 0;

    #absObj = null;

    _electricalDevice = null;

    constructor(maxCf, minCf, maxP, minP, absObj)
    {
        this.#maxCarrierFreq = maxCf;
        this.#minCarrierFreq = minCf;

        this.#absObj = absObj;

        this._electricalDevice = new ElectricalDevice();
        this._iframe = UserInteractionInterface.getIframeWithId(absObj.id, null);

        console.log(this._iframe)

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

    status()
    {
        return {
            freq: this.#carrierFreq,
            state: this.#isEnabled,
            power: "N/A"
        };
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

    iframe()
    {
        console.log(this._iframe)
        return this._iframe;
    }

    position()
    {
        return this.#absObj.position;
    }

    setSignalHub(signalHub)
    {
        this.#signalHub = signalHub;
    }

    // =============== ELECTRICAL DEVICE ===============
}