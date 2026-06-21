export class Lighting
{
    #visualEffects = null;

    #positionLightsFlashing = null;
    #positionLightsEnabled = false;

    constructor(visualEffects)
    {
        this.#visualEffects = visualEffects
    }

    enableDockingPortLight(port, enable)
    {
        this.#visualEffects.setVisible("dockingPortLight1", enable);
        setTimeout(() => {
            this.#visualEffects.setVisible("dockingPortLight2", enable);
        }, 750);
    }

    enablePositionLights(enable)
    {
        if (enable)
        {
            this.#positionLightsFlashing = setInterval(() => {
                this.#visualEffects.setVisible("positionLightsR", this.#positionLightsEnabled);
                this.#positionLightsEnabled = !this.#positionLightsEnabled;
            }, 1200);
        }
        else
        {
            clearInterval(this.#positionLightsFlashing);
        }
    }
}