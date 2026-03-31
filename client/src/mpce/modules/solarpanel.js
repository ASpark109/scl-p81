import { ModuleBase } from './modulebase.js';

export class SolarPanel
{
    #powerGeneration = null
    #visualEffects = null;
    #servoMotorEnabled = false;
    #id = null;
    #direction = null;
    #scaleDir = null;

    #panelDeploymentLength = 0;
    #currentPanelDeploymentLength = 0;

    constructor(conf, visualEffects)
    {
        this.#powerGeneration = conf.maxPowerGenerationPerSec;
        this.#id = conf.visualEffectId;
        this.#direction = conf.direction;
        this.#panelDeploymentLength = conf.length;
        this.#visualEffects = visualEffects;

        switch (this.#direction)
        {
        case "left":
        case "right":
            this.#scaleDir = () => {return {x: (this.#currentPanelDeploymentLength / this.#panelDeploymentLength) / 10, y: 0.1}};
            break;
        case "up":
        case "down":
            this.#scaleDir = () => {return {x: 0.1, y: this.#currentPanelDeploymentLength / (this.#panelDeploymentLength * 1000)}};
            break;
        }

        ModuleBase.updateList.push(this.#update.bind(this));
    }

    #update()
    {
        if (this.#servoMotorEnabled)
        {
            this.#currentPanelDeploymentLength += 0.01;
            this.#visualEffects.setEffectScale(this.#id, this.#scaleDir());

            if (this.#currentPanelDeploymentLength >= this.#panelDeploymentLength)
            {
                this.#servoMotorEnabled = false;
            }
        }
    }

    // ================ interface ================

    deploy()
    {
        if (!this.#servoMotorEnabled)
        {
            this.#servoMotorEnabled = true;
        }
    }

    powerGeneration()
    {
        return this.#powerGeneration;
    }
}