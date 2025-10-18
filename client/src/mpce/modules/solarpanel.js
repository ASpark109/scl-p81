export class SolarPanel
{
    #powerGeneration = null

    constructor(pg)
    {
        this.#powerGeneration = pg;
    }

    powerGeneration()
    {
        return this.#powerGeneration;
    }
}