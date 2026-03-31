export class DockingPort
{
    #id = null;
    #type = null;
    #spacecraftId = null;
    #undockf = null;
    #dockedSpacraftName = null;

    constructor(conf, undockf, spacecraftId)
    {
        this.#id = conf.id;
        this.#type = conf.type;
        this.#undockf = undockf;
        this.#spacecraftId = spacecraftId;
    }

    info()
    {
        return {id: this.#id, name: this.#dockedSpacraftName};
    }

    undockPort()
    {
        this.#undockf(this.#spacecraftId, this.#id);
        this.#dockedSpacraftName = null;
    }

    onPortDocked(spacecraftName)
    {
        this.#dockedSpacraftName = spacecraftName;
    }

    onSeparationRequested()
    {
        this.#dockedSpacraftName = null;
    }
}