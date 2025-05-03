import { logger } from "../utils/userlogger";

export class UserInteractionInterface
{
    static #spacecrafts = [];

    static controlModel = null;
    static n = -1;

    static addSpacecraft(controllModel)
    {
        this.#spacecrafts.push(controllModel);
        console.log(this.#spacecrafts.length)
    }

    static setControlModel(n)
    {
        this.controlModel = this.#spacecrafts[n];
        this.n = n;
        console.log(this.n)
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

//export const userInteractionInterface = new UserInteractionInterface();