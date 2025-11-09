import { Configurationsfactory } from "./configurationsfactory.js";

import { PneumaticActuator } from "./modules/pneumaticactuator";
import { UserInteractionInterface } from "./userinteractioninterface.js"
import { SignalsHub } from "./modules/radiocommunication/signalhub.js";

import { buildSt1_falcon9 } from "./spacecraftsystemmodels/st1_falcon9.js";

/* eslint-disable no-useless-constructor */
export class SystemControllModel
{
    #spacecrafts = []
    #signalHub = new SignalsHub();

    constructor()
    {

    }

    initializa()
    {

    }

    update()
    {

    }

    addObject(physicalmodel, abstructModel, visualEffects, configuration)
    {
        if (configuration.type !== "spacecraft")
        {
            return null;
        }

        let spacecraftName = configuration.Name;

        let conf = Configurationsfactory.getConfiguration(spacecraftName, "spaceCraftData");

        switch(spacecraftName)
        {
        case "FALCON9_ST1":
            let {spaceCraft, monitorInter} = buildSt1_falcon9(physicalmodel, abstructModel, visualEffects, this.#signalHub, conf);
            this.#spacecrafts.push(spaceCraft);

            let {obj, map} = this.generateAbsModel(spaceCraft);

            UserInteractionInterface.addControlModel(map, configuration.displayName);
            Configurationsfactory.addGeneratedAbsConfiguration("FALCON9_ST1", obj);
            
            return monitorInter;
        default:
            break;
        }
    }

    generateAbsModel(object)
    {
        let systemAndAbstructConnectionMap = new Map();
        let messageCounter = 1;

        function getParamNames(fn) {
            const fnStr = fn.toString().replace(/\n/g, " ");
            const result = fnStr.match(/\(([^)]*)\)/);
            if (!result) return [];
            return result[1]
                .split(",")
                .map(p => p.trim())
                .filter(p => p.length > 0);
        }

        function serializeObject(obj)
        {
            if (obj === null || typeof obj !== "object") return obj;

            const result = {};

            // 1. Власні властивості
            for (const key of Object.keys(obj))
            {
                if (key === "_electricalDevice")
                    continue;
                
                const value = obj[key];

                if (typeof value === "object" && value !== null)
                {
                    result[key] = serializeObject(value);
                }
                else if (typeof value === "function")
                {

                    // походу це треба робити тут
                    result[key] = {
                        method: {
                            name: key,
                            messageId: messageCounter++,
                            params: getParamNames(value)
                        }
                    };
                }
            }

            // 2. Методи з прототипу
            const proto = Object.getPrototypeOf(obj);
            if (proto)
            {
                for (const key of Object.getOwnPropertyNames(proto))
                {
                    if (key === "constructor") continue; // пропускаємо конструктор
                    
                    if (typeof proto[key] === "function")
                    {
                        const id = messageCounter++;
                        systemAndAbstructConnectionMap.set(id, proto[key].bind(obj));

                        result[key] = {
                            method: {
                                name: key,
                                messageId: id,
                                params: getParamNames(proto[key])
                            }
                        };
                    }
                }
            }

            return result;
        }

        return {obj: serializeObject(object), map: systemAndAbstructConnectionMap};
    }
}