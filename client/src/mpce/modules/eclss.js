export class ECLSS
{
    #temperature = 21.6;
    #pressure = 101.3;
    #humidity = 43.8;

    constructor()
    {

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