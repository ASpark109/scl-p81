import React, { useEffect, useRef, useState } from "react";
import { UserInteractionInterface } from "../../mpce/userinteractioninterface";

import { saveCode, submitCode} from "../../api/userSrcCode";

function SpacecraftCodeRunner({code,
                               spaceCraftName,
                               config,
                               codeRunTrigger,
                               isEnvInit,
                               saveTrigger,
                               submitTrigger,
                               project,
                               currentSpacecraft,
                               mode}) {
    const iframeRef = useRef();
    const [outputDoc, setOutputDoc] = useState("");

    useEffect(() => {
        if (spaceCraftName === currentSpacecraft)
        {
            const handleSave = async () => {
                const data = await saveCode(project, code, `${spaceCraftName}.txt`);
                console.log(`Saved: ${spaceCraftName}`, data);
            };

            handleSave();
        }
    }, [saveTrigger]);

    useEffect(() => {
        if (spaceCraftName === currentSpacecraft)
        {
            const handleSubmit = async () => {
                const data = await submitCode(code, `${spaceCraftName}.txt`);
            };

            handleSubmit();
        }
    }, [submitTrigger]);

    useEffect(() => 
    {
        if(codeRunTrigger)
        {
            handleRunCode();
        }
        else
        {
            setOutputDoc("");
        }
    }, [codeRunTrigger]);

    const handleRunCode = () => {
        if (!code)
        {
            return;
        }

        const wrappedCode =
        `
            <html>
                <body>
                    <pre id="output"></pre>
                    <script type="module">
                        console.log = function (...args) {
                            if ("${spaceCraftName}" === "${currentSpacecraft}")
                            {
                                let isError = false
                                const formatted = args.map(arg => {
                                    if (arg instanceof Error) {
                                        isError = true
                                        return arg.stack;
                                    }
                                    else if (arg instanceof Uint8Array) {
                                        return Array.from(arg).join(", ");
                                    }
                                    else if (typeof arg === "object") {
                                        return JSON.stringify(arg, null, 2);
                                    }
                                    return String(arg);
                                }).join(" ");

                                window.parent.postMessage({ type: "log", isError: isError, payload: formatted }, "*");
                            }
                        };
                        class Vector2 {
                            constructor(x = 0, y = 0) {
                                this.x = x;
                                this.y = y;
                            }
                            log()
                            {
                                console.log("vec -> " + this.x + " " + this.y)
                            }

                            // Копія
                            clone() {
                                return new Vector2(this.x, this.y);
                            }

                            // Додавання
                            add(v) {
                                return new Vector2(this.x + v.x, this.y + v.y);
                            }

                            // Віднімання
                            sub(v) {
                                return new Vector2(this.x - v.x, this.y - v.y);
                            }

                            // Множення на скаляр
                            mul(s) {
                                return new Vector2(this.x * s, this.y * s);
                            }

                            // Ділення на скаляр
                            div(s) {
                                return new Vector2(this.x / s, this.y / s);
                            }

                            // Скалярний добуток
                            dot(v) {
                                return this.x * v.x + this.y * v.y;
                            }

                            // Векторний добуток (z-компонента)
                            cross(v) {
                                return this.x * v.y - this.y * v.x;
                            }

                            // Довжина
                            length() {
                                return Math.hypot(this.x, this.y);
                            }

                            // Квадрат довжини
                            lengthSq() {
                                return this.x * this.x + this.y * this.y;
                            }

                            // Нормалізація
                            normalize() {
                                const len = this.length();

                                if (len === 0) {
                                    return new Vector2(0, 0);
                                }

                                return this.div(len);
                            }

                            // Відстань до іншого вектора
                            distance(v) {
                                return this.sub(v).length();
                            }

                            // Кут в радіанах
                            angle() {
                                return Math.atan2(this.y, this.x);
                            }

                            // Поворот
                            rotate(deg) {
                                const c = Math.cos(deg * Math.PI / 180);
                                const s = Math.sin(deg * Math.PI / 180);

                                return new Vector2(
                                    this.x * c - this.y * s,
                                    this.x * s + this.y * c
                                );
                            }

                            // Лінійна інтерполяція
                            lerp(v, t) {
                                return new Vector2(
                                    this.x + (v.x - this.x) * t,
                                    this.y + (v.y - this.y) * t
                                );
                            }

                            // Порівняння
                            equals(v, eps = 1e-9) {
                                return (
                                    Math.abs(this.x - v.x) < eps &&
                                    Math.abs(this.y - v.y) < eps
                                );
                            }

                            // Перетворення в масив
                            toArray() {
                                return [this.x, this.y];
                            }
                            
                            // ===== Статичні методи =====

                            static zero() {
                                return new Vector2(0, 0);
                            }

                            static one() {
                                return new Vector2(1, 1);
                            }

                            static up() {
                                return new Vector2(0, 1);
                            }

                            static down() {
                                return new Vector2(0, -1);
                            }

                            static left() {
                                return new Vector2(-1, 0);
                            }

                            static right() {
                                return new Vector2(1, 0);
                            }

                            static fromAngle(rad, length = 1) {
                                return new Vector2(
                                    Math.cos(rad) * length,
                                    Math.sin(rad) * length
                                );
                            }
                        }

                        class CommandInterface
                        {
                            #commands = [];

                            #responseTypes = new Map();

                            constructor()
                            {
                                this.#commands = [];
                                this.#responseTypes.set("commands-interface-request", "commands-interface-response");
                                this.#responseTypes.set("gcs-interface-request", "gcs-interface-response");

                                window.addEventListener("message", (event) =>
                                {
                                    if (event.data?.type === "commands-interface-request" ||
                                        event.data?.type === "gcs-interface-request")
                                    {
                                        const resType = this.#responseTypes.get(event.data?.type);

                                        const { functionName, params, requestId } = event.data;
                                        
                                        const cmd = this.#commands.find(c => c.name === functionName)?.fn;
                                        if (cmd)
                                        {
                                            try {
                                                const result = cmd(...params);
                                                
                                                this.#sendResponce(resType, requestId, result, null);
                                            
                                            }
                                            catch (err) {
                                                this.#sendResponce(resType, requestId, null, err.message);
                                            }
                                        }
                                        else
                                        {
                                            this.#sendResponce(resType, requestId, "command not found", null);                                     
                                        }
                                    }
                                });
                            }

                            #sendResponce(resType, requestId, result = null, error = null)
                            {
                                window.parent.postMessage({
                                    type: resType,
                                    requestId,
                                    result
                                }, "*");  
                            }

                            addCommand(name, fn)
                            {
                                this.#commands.push({ name, fn });
                            }

                            allCommands()
                            {
                                return this.#commands.map(f => f.name);
                            }
                        }

                        const CMDInterface = new CommandInterface();

                        class EventListener
                        {
                            #eventProcessors = new Map();
                            constructor()
                            {
                                window.addEventListener("message", (event) => {
                                    if (event.data?.type === "eventMessage")
                                    {
                                        const { eventName, data } = event.data;
                                        let func = this.#eventProcessors.get(eventName);
                                        
                                        if(func)
                                        {
                                            func(data);
                                        }
                                    }
                                });
                            }

                            setEventProcessorForName(eventName, func)
                            {
                                this.#eventProcessors.set(eventName, func)
                            }
                        }

                        const eventListener = new EventListener();

                        // Універсальний асинхронний відповідач
                        class AsyncResponder {
                            constructor() {
                                this._callbacks = new Map();
                                window.addEventListener("message", (event) => {
                                    if (event.data?.type === "interface-response") {
                                        const { id, result } = event.data;
                                        const callback = this._callbacks.get(id);
                                        if (callback) {
                                            callback(result);
                                            this._callbacks.delete(id);
                                        }
                                    }
                                });
                            }


                            waitForResponse(id, timeout = 1000) {
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

                        function waitForSystem() {
                            return new Promise((resolve) => {
                                if (System) {
                                    resolve(System);
                                } else {
                                    const handler = (event) => {
                                        if (event.data?.type === "set-interface") {
                                            System = transformMethods(event.data.payload);
                                            window.removeEventListener("message", handler);
                                            resolve(System);
                                        }
                                    };
                                    window.addEventListener("message", handler);
                                }
                            });
                        }

                        function transformMethods(obj) {
                            if (obj === null || typeof obj !== "object") return obj;
                            if (Array.isArray(obj)) return obj.map(transformMethods);

                            const result = {};
                            for (const key of Object.keys(obj)) {
                                const val = obj[key];

                                if (val && typeof val === "object" && val.method) {
                                    const {
                                        name,
                                        params,
                                        messageId
                                    } = val.method;
                                    if (typeof name !== "string") continue;

                                    result[name] = function(...args) {
                                        const id = Math.random().toString(36).slice(2);

                                        window.parent.postMessage({
                                            type: "call-interface-method",
                                            method: name,
                                            args,
                                            params,
                                            messageId,
                                            id
                                        },
                                        "*");

                                        // Return only a promise instead of onFinished wrapper
                                        return asyncResponder.waitForResponse(id);
                                    };
                                } else {
                                    result[key] = transformMethods(val);
                                }
                            }
                            return result;
                        }

                        try
                        {
                            System = await waitForSystem();
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
                            console.log(err);
                        }
                    </script>
                </body>
            </html>
        `;

        setOutputDoc(wrappedCode);
    };

    useEffect(() => {
        let model = UserInteractionInterface.getControlModel(spaceCraftName, mode);

        UserInteractionInterface.addIframe(spaceCraftName, iframeRef, mode);

        const listener = async (event) => {
            const { type, args, params, messageId, id} = event.data || {};

            if (type === "call-interface-method" && event.source === iframeRef.current?.contentWindow)
            {
                // console.log("call-inter-method " + spaceCraftName)
                try
                {
                    let result = model.get(messageId)(...args);
                    // if (result instanceof Promise)
                    // {
                    //     result = await result;
                    // }

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
                    //console.log("Інтерфейс відправлено в iframe " + spaceCraftName + " " + mode);
                }
            }}
        />
    );
}

export default SpacecraftCodeRunner;
