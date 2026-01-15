import { ElectricalDevice } from "../electricaldevice";

export class ProximityRadar
{
    #abstract = null

    #distance = null;
    #viewAngle = null;

    _electricalDevice = null;

    #isEnabled = false;

    constructor(conf, abstract)
    {
        this.#abstract = abstract;

        this.#distance = conf.distance;
        this.#viewAngle = conf.viewAngle;

        this._electricalDevice = new ElectricalDevice(conf.minP, conf.maxP);
    }

    // ================ interface ================

    scan()
    {
        if (this.#isEnabled)
        {
            return this.#abstract.isInView(this.#distance, this.#viewAngle);
        }
        else
        {
            return false;
        }
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
}