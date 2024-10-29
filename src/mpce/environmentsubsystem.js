import { PhysicalEnvironmentModel } from "./physicalenvironmentmodel";
import { AbstractEnvironmentModel } from "./abstractenvironmentmodel";
import { VisualisationBase } from "../ed/visualisationbase";
import { Configurationsfactory } from "./configurationsfactory.js";
//import { set } from "rsuite/esm/utils/dateUtils";

export class EnvironmentSubSystem
{
    #mConfiguration = null;
    #mPhysicalEnvironmentModel = null;
    #mAbstractEnvironmentModel = null;
    #mVisualisationBase = null;

    constructor(configuration)
    {
        this.#mConfiguration = Configurationsfactory.getConfiguration(configuration);
        this.displayApp = null;
    }

    initialize(container)
    {        
        this.#mPhysicalEnvironmentModel = new PhysicalEnvironmentModel(this.#mConfiguration);

        if (this.#mPhysicalEnvironmentModel == null)
        {
            console.log("Помилка при створені фізичного середовища");
            return false;
        }

        this.#mAbstractEnvironmentModel = new AbstractEnvironmentModel();

        if (this.#mAbstractEnvironmentModel == null)
        {
            console.log("Помилка при створені абстрактної моделі середовища");
            return false;
        }

        this.#mVisualisationBase = new VisualisationBase();

        if (this.#mVisualisationBase == null)
        {
            console.log("Помилка при створенні графічної моделі");
            return false;
        }

        this.#mPhysicalEnvironmentModel.initialize(this.#mAbstractEnvironmentModel.update.bind(
                                                    this.#mAbstractEnvironmentModel));
        this.#mVisualisationBase.initialize(container);

        this.createInitialConfiguration();

        this.#mVisualisationBase.setScale(0.000005)

        this.start()

        return true;
    }

    createInitialConfiguration()
    {
        for (const item of this.#mConfiguration.spaceCrafts)
        {
            this.addObject(item);
        }

        for (const item of this.#mConfiguration.spaceObjects)
        {
            this.addObject(item)
        }

        this.setFocusObj(0);
    }

    addObject(item)
    {
        let physicalObj = this.#mPhysicalEnvironmentModel.addObject(item);
        let abstractObj = this.#mAbstractEnvironmentModel.addObject(item, physicalObj);
        let visualObj   = this.#mVisualisationBase.addObject(item, physicalObj, abstractObj);
    }

    removeObject()
    {
        //TODO
    }

    setFocusObj(id)
    {
        this.#mVisualisationBase.setFocusObject(id)
    }

    start()
    {
        this.#mVisualisationBase.start();
        this.#mPhysicalEnvironmentModel.start()

    }

    stopRendering()
    {
        this.#mVisualisationBase.stop();
    }
}