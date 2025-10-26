import { logger } from "../utils/userlogger";

export class UserInteractionInterface
{
    static #controlModels = new Map();
    static #iframes = new Map();

    static controlModel = null;
    static n = -1;

    static addControlModel(controllModel, displayName)
    {
        this.#controlModels.set(displayName, controllModel);
    }

    static resetControlModels()
    {
        this.#controlModels.length = 0;
    }

    static setControlModel(displayName)
    {
        this.controlModel = this.#controlModels.get(displayName);
    }

    static getControlModel(displayName)
    {
        return this.#controlModels.get(displayName);
    }

    static addIframe(displayName, iframe)
    {
        this.#iframes.set(displayName, iframe);
    }

    static getIframe(displayName)
    {
        return this.#iframes.get(displayName);
    }

    static resetIframe()
    {
        this.#iframes.length = 0;
    }

    static showN()
    {
        console.log(this.n);
    }

    static getModelsCount()
    {
        return this.#controlModels.length;
    }

    static testUserInteractionInterface()
    {
        logger("hello interface");
        return {"x": 112, "y": 53}
    }
}