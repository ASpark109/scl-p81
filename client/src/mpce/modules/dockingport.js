export class DockingPort
{
    #id = null;
    #type = null;
    #info = "test info"
    #undockf = null;
    #spacecraftId = null;

    constructor(conf, undockf, spacecraftId)
    {
        this.#id = conf.id;
        this.#type = conf.type;
        this.#undockf = undockf;
        this.#spacecraftId = spacecraftId;
    }

    info()
    {
        return this.#info;
    }

    undockPort()
    {
        this.#undockf(this.#spacecraftId, this.#id);
    }
}