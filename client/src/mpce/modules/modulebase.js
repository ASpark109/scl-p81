/* eslint-disable no-useless-constructor */
export class ModuleBase
{
    static updateList = [];

    constructor()
    {

    }

    static updateAll()
    {
        for (let update of ModuleBase.updateList) {
            update();
        }
    }
}