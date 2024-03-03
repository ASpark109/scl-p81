import { EnvironmentBase } from "../mpce/environmentbase"
import { VisualisationBase } from "./visualisationbase";

export class ComponentDisplayOperator
{
    constructor()
    {
        this.displayApp = null;
    }

    init(container)
    {
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

        console.log("Wow")

        this.displayApp.createRenderingModel(this.testEnv.getAllComponents())

        return true;
    }

    runRendering()
    {
        this.displayApp.run();
    }
}