import { Timeline } from "rsuite";

const lightSpeed = 299792458;

export class CommunicationOperator{
    
    constructor(){
        this.messages = [];
        // console.log("OPERATOOOOOOOR");
        this.t = 0
    }

    addMessage(message){
        this.messages.push(message, new Array(this.spaceCrafts.length).fill(false))

        // console.log("MESSAAAAAAAGE")
        // console.log(message)
    }

    update(time){

        for (let i = 0; i < this.messages.length; i++)
        {
            this.messages[i].propagationDistance += lightSpeed * time ;
            // console.log(this.messages[i].propagationDistance + " - " + this.t)

            for (let n = 0; n < this.spaceCrafts.length; n++)
            {
                if(this.messages[i].propagationDistance >= this.getDist(this.spaceCrafts[n], this.messages[i]) &&
                        !this.messages[i][n])
                {
                    this.spaceCrafts[n].RadioCommunicationModule.receivedMessages(this.messages[i].message)
                    this.messages[i][n] = true;
                }
            }
        }

    }

    getDist(spaceCraft, message)
    {
        let a = spaceCraft.MainControlUnit.getCoordinates();
        let b = {x: message.originX, y: message.originX};

        // console.log(Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)))

        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    setSpaceCrafts(spaceCrafts)
    {
        this.spaceCrafts = spaceCrafts
        this.received = new Array(this.spaceCrafts.length).fill(false);
    }
}