export class SignalSlotDispatcher
{
    static connections = new Map();

    static connect(id, context, slot)
    {
        if (context)
        {
            slot = slot.bind(context);
            this.connections.set(id, slot);
        }
    }

    static emit(slotId, param)
    {
        const slot = this.connections.get(slotId);
        if (slot)
        {
            slot(param);
        } 
        else
        {
            console.warn(`Slot with id "${slotId}" not found`);
        }
    }
}