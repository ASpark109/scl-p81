export class MainControlUnit
{
    constructor(id, cord)
    {
        this.cord = cord;
        this.unitId = id;
    }

    getCoordinates()
    {
        return {x: this.cord.x, y: this.cord.y}
    }
}