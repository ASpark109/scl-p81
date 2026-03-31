export class TCS
{
    #avionics = 40;
    #batteries = 5;
    #solarPanels = -93;
    #thrusters = 30;

    constructor()
    {

    }

    info()
    {
        if ((Math.floor(Math.random() * 10) + 1) < 2)
        {
            this.#avionics += Math.floor(Math.random() * 2) === 0 ? -0.1 : 0.1
            this.#batteries += Math.floor(Math.random() * 2) === 0 ? -0.2 : 0.2
            this.#solarPanels += Math.floor(Math.random() * 2) === 0 ? -1.2 : 1.1
            this.#thrusters += Math.floor(Math.random() * 2) === 0 ? -1.2 : 1.1
        }

        return {
            avionics: this.#avionics.toFixed(1),
            batteries: this.#batteries.toFixed(1),
            solarPanels: this.#solarPanels.toFixed(1),
            thrusters: this.#thrusters.toFixed(1)
        };
    }
}