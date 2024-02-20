const lightSpeed = 299792458;

export class CommunicationOperator{
    
    constructor(spaceCrafts){
    
        this.spaceCrafts = spaceCrafts;
        this.messages = [];
        this.received = new Array(spaceCrafts.length).fill(false);
        
    }

    addMessage(message){
        this.messages.push(message)
    }

    update(time){
        for (let i = 0; i < this.messages.length; i++)
        {
            messages[i].propagationDistance += lightSpeed * time;

            for (let n = 0; n < this.spaceCrafts.length; n++)
            {
                if(messages[i].propagationDistance >= this.spaceCrafts[n].MainControlUnit.getCoordinates() &&
                        this.received[n] == false)
                {
                    this.spaceCrafts[n].RadioCommunicationModule.receivedMessages(messages[i].message)
                    this.received[n] = true;
                }
            }
        }

    }

    getDist()
    {

    }
}