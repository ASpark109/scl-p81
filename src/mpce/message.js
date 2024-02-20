export class Message
{
    constructor(data, location, id)
    {
        this.message = data;
        this.originX = location.x;
        this.originY = location.y;
        this.unitId = id;
        this.propagationDistance = 0;
    }
}