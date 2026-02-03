import React, { useState, useEffect, useRef } from "react";
import "./CodeEditor.css";

import Editor from "@monaco-editor/react";
import { Configurationsfactory } from "../../mpce/configurationsfactory";
import SpacecraftCodeRunner from "../SpacecraftCodeRunner/SpacecraftCodeRunner"
import { getFileByName } from "../../api/userSrcCode";

const CodeEditorWindow = ({ initCode = "",
							language = "javascript",
							theme = "vs-dark",
							onOutput,
							trigger,
							currentSpacecraft,
							initConf,
							isEnvInit,
							saveTrigger,
							submitTrigger,
							mode}) => 
{
  	const [userCodeList, setCodeList] = useState(() => {
		const obj = {};

		// for (let i = 0; i < initConf.length; i++)
		// {
		// 	let init = initCode;
		// 	obj[`${initConf[i].displayName}`] = `//${initConf[i].displayName}\n` + init;
		// }

		// console.log(obj)

		return obj;
	});

	useEffect(() => {
		const fetchSrcCode = async () => {
			const codes = {};

			for (let i = 0; i < initConf.length; i++)
			{
				const spacecraft = initConf[i];
				const filename = `${spacecraft.displayName}.txt`;

				const code = await getFileByName(filename, mode);
				codes[spacecraft.displayName] = code || `// ${spacecraft.displayName}\n // not found`;
			}

			setCodeList(codes);
		};

		fetchSrcCode();
	}, [initConf]);

	const handleCodeChange = (newCode) => {
    	setCodeList((prev) => ({
      		...prev,
      		[currentSpacecraft]: newCode
    	}));
  	};

  	useEffect(() =>
	{
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

	// потрібно переробити, це поки не працює як потрібно
	// useEffect(() => {
  	// 	if (!trigger && onOutput) {
    // 		onOutput(""); 
  	// 	}
	// }, [trigger, onOutput]);

	return (
		<div className="EditorContainer">
			<div className="Editor">
				<Editor
					width="100%"
					height="100%"
					language={language}
					value={userCodeList[currentSpacecraft]}
					theme={theme}
					defaultValue={initCode}
					onChange={handleCodeChange}
					options={{
						minimap: { enabled: false },
						fontSize: 16,
						scrollBeyondLastLine: false,
						automaticLayout: true,
					}}>
				</Editor>
			</div>
			{
				initConf.map((spaceCraft) => (
					<SpacecraftCodeRunner key={spaceCraft.displayName}
										  code={userCodeList[spaceCraft.displayName]}
										  spaceCraftName={spaceCraft.displayName}
										  config={Configurationsfactory.getConfiguration(spaceCraft.Name, "abstractSystemInterfaceData")}
										  codeRunTrigger={trigger}
										  isEnvInit={isEnvInit}
										  saveTrigger={saveTrigger}
										  submitTrigger={submitTrigger}
										  currentSpacecraft={currentSpacecraft}
										  mode={mode}>
					</SpacecraftCodeRunner>
				))
			}
		</div>
  	);
};

export default CodeEditorWindow;