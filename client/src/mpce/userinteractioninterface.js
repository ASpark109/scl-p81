export class UserInteractionInterface
{
    static #controlModelsDev = new Map();
    static #controlModelsRt = new Map();

    static #iframesDev = new Map();
    static #iframesRt = new Map();

    static #spaceCraftIdsDev = new Map();
    static #spaceCraftIdsRt = new Map();

    static controlModel = null;
    static n = -1;

    static addControlModel(controllModel, displayName, mode)
    {
        if (mode === "dev")
            this.#controlModelsDev.set(displayName, controllModel)
        else if (mode === "rt")
            this.#controlModelsRt.set(displayName, controllModel)
    }

    static resetControlModels()
    {
        this.#controlModelsDev.length = 0;
    }

    static getControlModel(displayName, mode)
    {
        if (mode === "dev")
            return this.#controlModelsDev.get(displayName);
        else if (mode === "rt")
            return this.#controlModelsRt.get(displayName);

        return null;
    }

    static addIframe(displayName, iframe, mode)
    {
        if (mode === "dev")
            this.#iframesDev.set(displayName, iframe);
        else if (mode === "rt")
            this.#iframesRt.set(displayName, iframe);
    }

    static getIframe(displayName, mode)
    {
        if (mode === "dev")
            return this.#iframesDev.get(displayName);
        else if (mode === "rt")
            return this.#iframesRt.get(displayName);

        return null;
    }

    static addSpacecraftId(id, displayName, mode)
    {
        if (mode === "dev")
            this.#spaceCraftIdsDev.set(id, displayName);
        else if (mode === "rt")
            this.#spaceCraftIdsRt.set(id, displayName);
    }

    static getIframeWithId(id, mode)
    {
        if (mode === "dev")
            return this.#iframesDev.get(this.#spaceCraftIdsDev.get(id));
        else if (mode === "rt")
            return this.#iframesRt.get(this.#spaceCraftIdsRt.get(id));

        return null;
    }

    static resetIframe()
    {
        this.#iframesDev.length = 0;
    }
}