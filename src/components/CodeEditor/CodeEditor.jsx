import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { UserInteractionInterface } from "../../mpce/userinteractioninterface";
import { Configurationsfactory } from "../../mpce/configurationsfactory";
import SpacecraftCodeRunner from "../SpacecraftCodeRunner/SpacecraftCodeRunner"
import "./CodeEditor.css";

const CodeEditorWindow = ({ initCode = "",
							language = "javascript",
							theme = "vs-dark",
							onOutput,
							trigger,
							currentSpacecraft,
							initConf}) => 
{
  	const [userCodeList, setCodeList] = useState(() => {
		const obj = {};
		
		for (let i = 0; i < initConf.length; i++)
		{
  			obj[`${initConf[i].displayName}`] = `//${initConf[i].displayName}\n` + initCode;
		}

		return obj;
	}
	);

	const handleCodeChange = (newCode) => {
		// console.log(currentSpacecraft)
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
	useEffect(() => {
  		if (!trigger && onOutput) {
    		onOutput(""); 
  		}
	}, [trigger, onOutput]);

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
					}}
				/>
			</div>
			{
				initConf.map((spaceCraft) => (
					<SpacecraftCodeRunner key={spaceCraft.displayName}
										  code={userCodeList[spaceCraft.displayName]}
										  spaceCraftName={spaceCraft.displayName}
										  config={Configurationsfactory.getConfiguration(spaceCraft.Name, "abstractSystemInterfaceData")}
										  codeRunTrigger={trigger}
					></SpacecraftCodeRunner>
				))
			}
		</div>
  	);
};

export default CodeEditorWindow;