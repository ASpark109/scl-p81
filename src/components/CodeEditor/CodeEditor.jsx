import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import FunctionalEditorPanel from '../FunctionalEditorPanel/FunctionalEditorPanel';
import { UserInteractionInterface } from "../../mpce/userinteractioninterface";
import "./CodeEditor.css";

const CodeEditorWindow = ({ initCode = "// hello", language = "javascript", theme = "vs-dark", onOutput }) => {
  	const [code, setCode] = useState(initCode);
  	const [outputDoc, setOutputDoc] = useState("");
  	const iframeRef = useRef();

  	const handleRunCode = () =>
	{
		UserInteractionInterface.showN();
    	const wrappedCode = `
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

						function createRecursiveInterfaceProxy(path = []) {
						return new Proxy(() => {}, {
							get(_, prop) {
							return createRecursiveInterfaceProxy([...path, prop]);
							},
							apply(_, __, args) {
							const method = path.join(".");
							const id = Math.random().toString(36).slice(2);

							window.parent.postMessage({
								type: "call-interface-method",
								method,
								args,
								id
							}, "*");

							return {
								onFinished(callback, timeout = 1000)
								{
									asyncResponder.waitForResponse(id, timeout)
										.then(result => callback(result))
										.catch(err => console.log("Async call failed:", err.message));
								},
								get promise()
								{
									return asyncResponder.waitForResponse(id);
								}
							};
							}
						});
						}

						let Interface = createRecursiveInterfaceProxy();

						try {
						${code}

						if (typeof loop === 'function') {
							function runLoop() {
							try {
								const result = loop();
								if (result instanceof Promise) {
								result.then(() => setTimeout(runLoop, 100));
								} else {
								setTimeout(runLoop, 100);
								}
							} catch (err) {
								console.log("Loop error:", err);
								setTimeout(runLoop, 100);
							}
							}
							runLoop();
						} else {
							console.log("Функція loop() не знайдена.");
						}
						} catch (err) {
						console.log("Error:", err);
						}
						</script>
        		</body>
      		</html>
    	`;
    	setOutputDoc(wrappedCode);
  	};

	useEffect(() => {

		UserInteractionInterface.setControlModel(0);

		const listener = async (event) => {
			const { type, method, args, id } = event.data || {};
		
			if (type === "call-interface-method" && id && typeof method === "string")
			{
				let result;
						
				try {
					// розбиваємо шлях типу "LandingLegs.Leg1.PneumaticBlock.readPressure"
					const pathParts = method.split(".");

					const methodName = pathParts.pop(); // останній елемент — метод
					let context = UserInteractionInterface.controlModel;
		
					// проходимось по шляху до об'єкта, який містить метод
					for (const part of pathParts)
					{
						context = context?.[part];
						if (context == null)
							break;
					}
		
					const func = context?.[methodName];
				
					if (typeof func === "function")
					{
						result = func.call(context, ...(args || []));
					}
					else
					{
						console.warn(`Метод ${method} не знайдено або не є функцією`);
					}
		
				} catch (e) {
					console.error(`Помилка у виклику ${method}:`, e);
				}
		
				event.source?.postMessage({
					type: "interface-response",
					id,
					result
				}, "*");
			}
		};
	
		window.addEventListener("message", listener);
		return () => window.removeEventListener("message", listener);
	}, []);

  	useEffect(() => {
    	const listener = (event) =>
		{
      		if (event.data?.type === "log" && onOutput)
			{
        		onOutput(event.data.payload);
      		}
    	};

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [onOutput]);

	return (
		<div className="EditorContainer">
			{/* <div className="editPanel">
				<FunctionalEditorPanel 
							onRunClick={handleRunCode}
							onSpacecraftSelected={(spacecraft)=>{UserInteractionInterface.setControlModel(spacecraft.value);}} />
			</div> */}
			<div className="Editor">
				<Editor
					width="100%"
					height="100%"
					language={language}
					value={code}
					theme={theme}
					defaultValue={code}
					onChange={(userInput) => setCode(userInput)}
					options={{
						minimap: { enabled: false },
						fontSize: 14,
						scrollBeyondLastLine: false,
						automaticLayout: true,
					}}
				/>
			</div>
			<iframe
				ref={iframeRef}
				sandbox="allow-scripts"
				srcDoc={outputDoc}
				title="Output"
				style={{ display: "none" }}
			/>
		</div>
  	);
};

export default CodeEditorWindow;
