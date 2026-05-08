import { AbstractEnvironmentModel } from "./abstractenvironmentmodel";
import { Configurationsfactory } from "./configurationsfactory.js";
import { PhysicalEnvironmentModel } from "./physicalenvironmentmodel";
import { SystemControllModel } from "./systemcontrollmodel.js";
import { UserInteractionInterface } from "./userinteractioninterface.js";
import { VisualisationBase } from "../ed/visualisationbase";
import { ModuleBase } from "./modules/modulebase.js";

export class EnvironmentSubSystem
{
    #mConfiguration = null;
    #mPhysicalEnvironmentModel = null;
    #mAbstractEnvironmentModel = null;
    #mVisualisationBase = null;
    #mSystemControllModel = null;
    #scale = 1;

    constructor(configuration, mode)
    {
        this.#mConfiguration = configuration//Configurationsfactory.getConfiguration(configuration);
        this.displayApp = null;
        this.mode = mode;
    }

    initialize(container, pixiSpaceCraftsSystemStateContainer, containerM, matterContainerPhys, isMapView)
    {   

        this.#mPhysicalEnvironmentModel = new PhysicalEnvironmentModel(this.#mConfiguration, this.mode);

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

        this.#mVisualisationBase = new VisualisationBase(this.mode);

        if (this.#mVisualisationBase == null)
        {
            console.log("Помилка при створенні графічної моделі");
            return false;
        }

        this.#mSystemControllModel = new SystemControllModel(this.mode);

        if (this.#mSystemControllModel == null)
        {
            console.log("Create SystemControllModel failed");
            return false;
        }

        {
            const callbacksAbs = new Map();
            callbacksAbs.set("objectsApproaching", ((data) => this.#mPhysicalEnvironmentModel.objectsApproaching(data)));
            callbacksAbs.set("objectsDistancing", ((data) => this.#mPhysicalEnvironmentModel.objectsDistancing(data)));
            this.#mAbstractEnvironmentModel.setCallbacks(callbacksAbs);

            const callbacksVisual = new Map();
            callbacksVisual.set("objectsApproaching", ((data) => this.#mVisualisationBase.objectsApproaching(data)));
            callbacksVisual.set("objectsDistancing", ((data) => this.#mVisualisationBase.objectsDistancing(data)));
            this.#mPhysicalEnvironmentModel.setCallbacks(callbacksVisual)
        }

        this.testRender = this.#mPhysicalEnvironmentModel.initialize(this.#mAbstractEnvironmentModel.update.bind(
                                                       this.#mAbstractEnvironmentModel),
                                                   containerM,
                                                   matterContainerPhys);

        this.#mVisualisationBase.initialize(container, pixiSpaceCraftsSystemStateContainer, isMapView, this.mode);

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

        for (const item of this.#mConfiguration.groundCommunicationSystem)
        {
            this.addGroundCommunicationSystem(item)
        }

        // this.onSetFocusObj(0); // Id може починатися не з 0
    }

    async addObject(item)
    {
        let physicalObj = this.#mPhysicalEnvironmentModel.addObject(item);
        let abstractObj = this.#mAbstractEnvironmentModel.addObject(item, physicalObj);
        let visualObj   = await this.#mVisualisationBase.addObject(item, physicalObj, abstractObj);

        let monitorInter = this.#mSystemControllModel.addObject(physicalObj, abstractObj, visualObj.visualEffects, item, this.testRender)
        if (monitorInter !== null)
        {
            this.#mVisualisationBase.setMonitoringInterfaceForId(physicalObj.id, monitorInter);
        }
    }

    addGroundCommunicationSystem(item)
    {
        this.#mSystemControllModel.addObject(null, null, null, item)
    }

    removeObject()
    {
        //TODO
    }

    resetEnvironment()
    {
        UserInteractionInterface.resetIframe();
        UserInteractionInterface.resetControlModels();
        ModuleBase.updateList.length = 0;
        this.#mVisualisationBase.reset();
        this.#mPhysicalEnvironmentModel.reset();
    }

    onSetFocusObj(name)
    {
        this.#mVisualisationBase.setFocusObject(name);
    }

    onSetTargetObject(name)
    {
        this.#mVisualisationBase.setTargetObject(name)
    }

    start()
    {
        this.#mVisualisationBase.start();
        // this.#mPhysicalEnvironmentModel.start()

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

    setOrbitsVisible()
    {
        this.#mVisualisationBase.setOrbitsVisible();
    }

    setInfoOverlayVisible()
    {
        this.#mVisualisationBase.setOverlayInfoVisible();
    }

    interiorView()
    {
        this.#mVisualisationBase.setInteriorView();
    }
}