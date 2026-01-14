import { Channel } from "./channel";

export class SignalsHub
{   
    #channels = new Map();

    constructor()
    {
        
    }

    startListenChannel(carrierFreq, receiver)
    {
        if (!this.#channels.has(carrierFreq))
        {
            this.#channels.set(carrierFreq, new Channel(carrierFreq));
        }

        this.#channels.get(carrierFreq).addReceiver(receiver);
    }

    stopListenChannel(carrierFreq, receiver)
    {
        if (this.#channels.has(carrierFreq))
        {
            let channel = this.#channels.get(carrierFreq);
            channel.removeReceiver(receiver);

            if (channel.isEmpty)
            {
                this.#channels.delete(carrierFreq);
            }
        }
    }

    sendSignal(carrierFreq, signal, position, bitRate)
    {
        if (!(signal instanceof Uint8Array))
        {
            return false;
        }

        if (this.#channels.has(carrierFreq))
        {
            this.#channels.get(carrierFreq).sendSignal(signal, position, bitRate);
        }
    }

    registerRadioModule(module)
    {
        module.setSignalHub(this);
    }
}