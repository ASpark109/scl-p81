export class Channel
{
    #receivers = [];
    #freq = null;

    constructor(freq)
    {
        this.#freq = freq;
    }

    addReceiver(receiver)
    {
        this.#receivers.push(receiver);
    }

    removeReceiver(receiver)
    {
        this.#receivers.filter(item => item !== receiver);
    }

    isEmpty()
    {
        return this.#receivers.length === 0;
    }

    sendSignal(signal, position, bitRate)
    {
        console.log(signal)
        for (let receiver of this.#receivers)
        {
            let recPos = receiver.position();
            let x = recPos.x - position.x;
            let y = recPos.y - position.y;
            let dis = Math.sqrt(x*x + y*y);
            let t = dis / 299792458;

            setTimeout(()=>{
                // повідомлення наразі відправляється цілим пакетом а не по частинах

                const eventName = "onSignalReceived";
                let iframe = receiver.iframe();

                if (iframe)
                {
                    iframe.current?.contentWindow.postMessage(
                        { type: "eventMessage", eventName, data: signal},
                    "*");
                }

                // receiver.signalReceived(signal[0]);

                // let counter = 1;
                // const send = setInterval(() => {
                //     if (counter <= signal.length - 1)
                //     {
                //         receiver.signalReceived(signal[counter]);
                //         counter++;
                //     }
                //     else
                //     {
                //         clearInterval(send);
                //     }
                // }, 1000 / bitRate);

                window.parent.postMessage(
                { type: "ground-communication-system", signal, freq: this.#freq, bitRate},
                "*");

            }, t * 1000);
        }
    }
}