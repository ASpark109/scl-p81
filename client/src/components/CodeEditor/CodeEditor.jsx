import React, { useState, useEffect, useRef } from "react";
import "./CodeEditor.css";

import Editor from "@monaco-editor/react";
import { Configurationsfactory } from "../../mpce/configurationsfactory";
import SpacecraftCodeRunner from "../SpacecraftCodeRunner/SpacecraftCodeRunner"
import { getFileByName } from "../../api/userSrcCode";

const CodeEditorWindow = ({ initCode = "",
							language = "javascript",
							theme = "vs-dark",
							trigger,
							currentSpacecraft,
							initConf,
							isEnvInit,
							saveTrigger,
							submitTrigger,
							project,
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

			for (let i = 0; i < initConf.list.length; i++)
			{
				const spacecraft = initConf.list[i];
				const filename = `${spacecraft.displayName}.txt`;

				const code = await getFileByName(filename, initConf.project, mode);
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
				initConf.list.map((spaceCraft) => (
					<SpacecraftCodeRunner key={spaceCraft.displayName}
										  code={userCodeList[spaceCraft.displayName]}
										  spaceCraftName={spaceCraft.displayName}
										  config={Configurationsfactory.getConfiguration(spaceCraft.Name, "abstractSystemInterfaceData")}
										  codeRunTrigger={trigger}
										  isEnvInit={isEnvInit}
										  saveTrigger={saveTrigger}
										  submitTrigger={submitTrigger}
										  project={project}
										  currentSpacecraft={currentSpacecraft}
										  mode={mode}>
					</SpacecraftCodeRunner>
				))
			}
		</div>
  	);
};

export default CodeEditorWindow;