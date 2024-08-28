import { EnvironmentBase } from "../mpce/environmentbase"
import { VisualisationBase } from "./visualisationbase";
import { Logger } from "../logger.js"

export class ComponentDisplayOperator
{
    constructor()
    {
        this.displayApp = null;
    }

    init(container)
    {
        // Пізніще init повинен приймати стартову конфігурацію оточення
        // Потрібно навести порядок в цьому класі
        
        this.testEnv = new EnvironmentBase();

        if (!(this.testEnv instanceof EnvironmentBase))
        {
            return false;
        }

        this.displayApp = new VisualisationBase();

        if (!(this.displayApp instanceof VisualisationBase))
        {
            return false;
        }

        this.testEnv.init()
        this.displayApp.init(container)

        this.displayApp.createRenderingObjects(this.testEnv.getAllComponents())

        return true;
    }

    runRendering()
    {
        this.displayApp.start();
    }

    stopRendering()
    {
        this.displayApp.stop();
    }
}