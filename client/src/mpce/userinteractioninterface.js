import { logger } from "../utils/userlogger";

export class UserInteractionInterface
{
    static #spacecrafts = new Map();

    static controlModel = null;
    static n = -1;

    static addControlModel(controllModel, displayName)
    {
        this.#spacecrafts.set(displayName, controllModel);
    }

    static setControlModel(displayName)
    {
        this.controlModel = this.#spacecrafts.get(displayName);
    }

    static getControlModel(displayName)
    {
        return this.#spacecrafts.get(displayName);
    }

    static showN()
    {
        console.log(this.n);
    }

    static getModelsCount()
    {
        return this.#spacecrafts.length;
    }

    static testUserInteractionInterface()
    {
        logger("hello interface");
        return {"x": 112, "y": 53}
    }
}