export class LaserRangeFinder
{
    #physicalModel = null;

    #isEnabled = false;
    #dockingPort = 1;
    #distance = null;

    constructor(conf, physicalModel)
    {
        this.#physicalModel = physicalModel;
        this.#distance = conf.distance;
    }

    scan()
    {
        if (this.#isEnabled)
        {
            return this.#physicalModel.scanArea(this.#distance, this.#dockingPort);
        }
    }

    setDockongPort(id)
    {
        this.#dockingPort = id;
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