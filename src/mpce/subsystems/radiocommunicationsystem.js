import { Message } from "../message"
import { CommunicationOperator } from "../communicationoperator";

export class RadioCommunicationSystem{

    #communicationOperator;

    constructor(MainControlUnit)
    {
        this.#communicationOperator = new CommunicationOperator();
        this.mainControlUnit = MainControlUnit;

        this.messagesSend = [];
        this.messagesReceived = [];

        this.messageData = null;
    }
    
    createMessage(msg){
        this.messageData = msg;//new Message(msg);
    }

    sendMessage(){

        if(this.messageData == null){
            return false;
        }

        let messageToSend = new Message(
                        this.messageData,
                        this.mainControlUnit.getCoordinates(),
                        this.mainControlUnit.unitId);

        this.#communicationOperator.addMessage(messageToSend);

        return true;
    }

    receivedMessages(message)
    {
        this.messagesReceived.push(message);
    }
    // setStatus() {
        
    // }

    // setStatus() {

    // }

    // setFrequency(){

    // }

    // getFrequency(){

    // }

    // setOperationMode(){

    // }

    // getOperationMode(){

    // }

    // sendMessage(){

    // }

    
}