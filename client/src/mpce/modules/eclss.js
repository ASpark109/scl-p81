class CLS // Crew Lighting System
{
    #visualEffects = null;
    #isEnabled = false;
    #currentLightMode = null;

    constructor(visualEffects)
    {
        this.#visualEffects = visualEffects;
        this.#visualEffects.setVisible("interiorLightDark", true);
    }

    setLightMode(mode)
    {
        if (this.#isEnabled)
        {
            switch(mode)
            {
            case "blue":
                this.#visualEffects.setVisible(this.#currentLightMode, false);
                this.#visualEffects.setVisible("interiorLightBlue", true);
                this.#currentLightMode = "interiorLightBlue";
                break;
            case "green":
                this.#visualEffects.setVisible(this.#currentLightMode, false);
                this.#visualEffects.setVisible("interiorLightGreen", true);
                this.#currentLightMode = "interiorLightGreen";
                break;
            case "purple":
                this.#visualEffects.setVisible(this.#currentLightMode, false);
                this.#visualEffects.setVisible("interiorLightPurple", true);
                this.#currentLightMode = "interiorLightPurple";
                break;
            case "red":
                this.#visualEffects.setVisible(this.#currentLightMode, false);
                this.#visualEffects.setVisible("interiorLightRed", true);
                this.#currentLightMode = "interiorLightRed";
                break;
            }
        }
    }

    enable()
    {
        if (!this.#isEnabled)
        {
            this.#isEnabled = true;
            this.#visualEffects.setVisible("interiorLightDark", false);
        }
    }

    disable()
    {
        if (this.#isEnabled)
        {
            this.#isEnabled = false;
            this.#visualEffects.setVisible(this.#currentLightMode, false);
            this.#visualEffects.setVisible("interiorLightDark", true);
        }
    }
}

export class ECLSS
{
    #temperature = 21.6;
    #pressure = 101.3;
    #humidity = 43.8;

    constructor(visualEffects = null)
    {
        if (visualEffects)
            this.CLS = new CLS(visualEffects);
    }

    info()
    {
        if ((Math.floor(Math.random() * 10) + 1) <= 2)
        {
            this.#temperature += Math.floor(Math.random() * 2) === 0 ? -0.1 : 0.1
            this.#pressure += Math.floor(Math.random() * 2) === 0 ? -0.2 : 0.2
            this.#humidity += Math.floor(Math.random() * 2) === 0 ? -1.2 : 1.1
        }

        return {
            temperature: this.#temperature.toFixed(1),
            pressure: this.#pressure.toFixed(1),
            humidity: this.#humidity.toFixed(1)
        };
    }
}