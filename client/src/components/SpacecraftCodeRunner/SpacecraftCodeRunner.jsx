import React, { useEffect, useRef, useState } from "react";
import { UserInteractionInterface } from "../../mpce/userinteractioninterface";

function SpacecraftCodeRunner({ code, spaceCraftName, config, onOutput, codeRunTrigger, isEnvInit}) {
    const iframeRef = useRef();
    const [outputDoc, setOutputDoc] = useState("");

    useEffect(() => 
    {
        if(codeRunTrigger)
        {
            handleRunCode();
            //console.log("start code" + spaceCraftName)
        }
        else
        {
            setOutputDoc("");
            //console.log("stop code")
        }
    }, [codeRunTrigger]);

    const handleRunCode = () => {
        const wrappedCode =
        `
            <html>
                <body>
                    <pre id="output"></pre>
                    <script>
                        console.log = function(...args) {
                        const formatted = args.map(arg =>
                            typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
                        ).join(" ");
                        window.parent.postMessage({ type: "log", payload: formatted }, "*");
                        };

                        // Універсальний асинхронний відповідач
                        class AsyncResponder
                        {
                            constructor()
                            {
                                this._callbacks = new Map();
                                window.addEventListener("message", (event) =>
                                {
                                    if (event.data?.type === "interface-response")
                                    {
                                        const { id, result } = event.data;
                                        const callback = this._callbacks.get(id);
                                        if (callback)
                                        {
                                            callback(result);
                                            this._callbacks.delete(id);
                                        }
                                    }
                                });
                            }

                            waitForResponse(id, timeout = 1000)
                            {
                                return new Promise((resolve, reject) => {
                                const timer = setTimeout(() => {
                                    this._callbacks.delete(id);
                                    reject(new Error("Timeout waiting for response"));
                                }, timeout);

                                this._callbacks.set(id, (result) => {
                                    clearTimeout(timer);
                                    resolve(result);
                                });
                                });
                            }
                        }

                        const asyncResponder = new AsyncResponder();

                        let System = null;

                        window.addEventListener("message", (event) => {

                            if (event.data?.type === "set-interface")
                            {
                                System = transformMethods(event.data.payload)
                            }
                        });

                        function transformMethods(obj)
                        {
                            if (obj === null || typeof obj !== "object") return obj;
                            if (Array.isArray(obj)) return obj.map(transformMethods);

                            const result = {};
                            for (const key of Object.keys(obj))
                            {
                                const val = obj[key];

                                if (val.method && val && typeof val === "object")
                                {
                                    const { name, params, messageId } = val.method;
                                    if (typeof name !== "string") continue;

                                    result[name] = function (...args)
                                    {
                                        const id = Math.random().toString(36).slice(2);

                                        window.parent.postMessage(
                                        {
                                            type: "call-interface-method",
                                            method: name,
                                            args,
                                            params,
                                            messageId,
                                            id
                                        }, "*");
                                        
                                        return {
                                            onFinished(callback, timeout = 1000)
                                            {
                                                asyncResponder
                                                    .waitForResponse(id, timeout)
                                                    .then(result => callback(result))
                                                    .catch(err =>
                                                        console.log("Async call failed:", err.message)
                                                    );
                                            },
                                            get promise()
                                            {
                                                return asyncResponder.waitForResponse(id);
                                            }
                                        };
                                    };
                                } 
                                else
                                {
                                    result[key] = transformMethods(val);
                                }
                            }

                            return result;
                        }

                        setTimeout(() => {
                            try
                            {
                                ${code}

                                if (typeof loop === 'function')
                                {
                                    function runLoop() {
                                        try
                                        {
                                            const result = loop();
                                            if (result instanceof Promise)
                                            {
                                                result.then(() => setTimeout(runLoop, 100));
                                            }
                                            else
                                            {
                                                setTimeout(runLoop, 100);
                                            }
                                        }
                                        catch (err)
                                        {
                                            console.log("Loop error:", err);
                                            setTimeout(runLoop, 100);
                                        }
                                    }
                                    
                                    runLoop();
                                } 
                                else
                                {
                                    console.log("Функція loop() не знайдена.");
                                }
                            }
                            catch (err)
                            {
                                console.log("Error:", err);
                            }
                        }, 2000);
                    </script>
                </body>
            </html>
        `;

        setOutputDoc(wrappedCode);
    };

    useEffect(() => {
        let model = UserInteractionInterface.getControlModel(spaceCraftName);

        const listener = async (event) => {
            const { type, args, params, messageId, id} = event.data || {};
            
            if (type === "call-interface-method" && event.source === iframeRef.current?.contentWindow)
            {
                console.log("call-inter-method " + spaceCraftName)
                try
                {
                    const result = model.get(messageId)(...args)
                    event.source?.postMessage(
                        { type: "interface-response", id: id, result },
                        "*"
                    );
                }
                catch (err)
                {
                    event.source?.postMessage(
                        { type: "interface-response", id: id, error: err.message },
                        "*"
                    );
                }
            }
        };
    
        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    }, [isEnvInit]);

    return (
        <iframe
            ref={iframeRef}
            sandbox="allow-scripts"
            srcDoc={outputDoc}
            title="Output"
            style={{ display: "none" }}
            onLoad={() =>
            {
                if (iframeRef.current?.contentWindow)
                {
                    iframeRef.current.contentWindow.postMessage({ type: "set-interface", payload: config},
                                                                "*");
                    console.log("Інтерфейс відправлено в iframe 🚀");
                }
            }}
        />
    );
}

export default SpacecraftCodeRunner;
