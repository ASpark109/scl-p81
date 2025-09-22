import { AbstractEnvironmentModel } from "./abstractenvironmentmodel";
import { Configurationsfactory } from "./configurationsfactory.js";
import { PhysicalEnvironmentModel } from "./physicalenvironmentmodel";
import { SignalSlotDispatcher } from "./signalslotdispatcher.js";
import { SystemControllModel } from "./systemcontrollmodel.js";
import { UserInteractionInterface } from "./userinteractioninterface.js";
import { VisualisationBase } from "../ed/visualisationbase";

export class EnvironmentSubSystem
{
    #mConfiguration = null;
    #mPhysicalEnvironmentModel = null;
    #mAbstractEnvironmentModel = null;
    #mVisualisationBase = null;
    #mSystemControllModel = null;
    #scale = 1;

    constructor(configuration)
    {
        this.#mConfiguration = Configurationsfactory.getConfiguration(configuration);
        this.displayApp = null;
    }

    initialize(container, pixiSpaceCraftsSystemStateContainer, containerM, matterContainerPhys)
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

        this.#mSystemControllModel = new SystemControllModel();

        if (this.#mSystemControllModel == null)
        {
            console.log("Create SystemControllModel failed");
            return false;
        }

        
        SignalSlotDispatcher.connect("objectsApproaching", this.#mPhysicalEnvironmentModel,
                        this.#mPhysicalEnvironmentModel.objectsApproaching);
        SignalSlotDispatcher.connect("objectsDistancing", this.#mPhysicalEnvironmentModel,
                        this.#mPhysicalEnvironmentModel.objectsDistancing);
        SignalSlotDispatcher.connect("objectsDocked", this.#mAbstractEnvironmentModel,
                        this.#mAbstractEnvironmentModel.objectsDocked);

        this.#mPhysicalEnvironmentModel.initialize(this.#mAbstractEnvironmentModel.update.bind(
                                                    this.#mAbstractEnvironmentModel), containerM, matterContainerPhys);
        this.#mVisualisationBase.initialize(container, pixiSpaceCraftsSystemStateContainer);

        this.createInitialConfiguration();

        this.start();

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

        this.onSetFocusObj(0); // Id може починатися не з 0
    }

    addObject(item)
    {
        let physicalObj = this.#mPhysicalEnvironmentModel.addObject(item);
        let abstractObj = this.#mAbstractEnvironmentModel.addObject(item, physicalObj);
        let visualObj   = this.#mVisualisationBase.addObject(item, physicalObj, abstractObj);
        let systemControl = this.#mSystemControllModel.addObject(physicalObj, item) // пізніше передавати візуальну модель
    }

    removeObject()
    {
        //TODO
    }

    onSetFocusObj(id)
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

    onScaleChanged(scale)
    {
        this.#mVisualisationBase.setScale(scale)
    }

    onViewModeChanged(isMapViewEnabled)
    {
        this.#mVisualisationBase.setViewMode(isMapViewEnabled)
    }
}