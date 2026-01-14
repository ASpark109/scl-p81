import { TransmitterGCM } from "../modules/radiocommunication/transmitterGCS";
import { ReceiverGCS } from "../modules/radiocommunication/receiverGCS";

class System
{
    constructor(radioCommunication)
    {
        this.RadioCommunication = radioCommunication;
    }
}

class RadioCommunication
{
    constructor(transmitter, receiver)
    {
        this.Transmitter = transmitter;
        this.Receiver = receiver;
    }
}

export function buildGCM(abstructModel, visualEffects, signalHub, conf)
{
    // temporary object. Later created in an abstract model
    let abs = {
        position: {x: 100, y: 100}
    }

    // *** Radio Communication ***
    
    let t = new TransmitterGCM(1, 1, 100, 1, abs);
    let r = new ReceiverGCS(1, 1, 1, 1, abs);
    let rc = new RadioCommunication(t, r);

    signalHub.registerRadioModule(t);
    signalHub.registerRadioModule(r);

    // *** Radio Communication ***

    // *** final assembly ***
    let GCM = new System(rc); // не забудь розширити System

    // *** system monitoring inteface ***

    let monitorInter = new Map();

    return {GCM, monitorInter};
}