import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import SplitPane from 'react18-split-pane';
import "./DevelopmentArea.css";
import CodeEditorWindow from '../CodeEditor/CodeEditor';
import OutputWindow from '../OutputWindow/OutputWindow'
import DisplayObjectArea from '../DisplayObjectArea/DisplayObjectArea'
import FunctionalDisplayObjectAreaPanel from "../FunctionalDisplayObjectAreaPanel/FunctionalDisplayObjectAreaPanel"
import FunctionalEditorPanel from '../FunctionalEditorPanel/FunctionalEditorPanel';
import { EnvironmentSubSystem } from "../../mpce/environmentsubsystem"
import { Configurationsfactory } from "../../mpce/configurationsfactory";
import { getFileNamesList } from '../../api/userSrcCode';

const data = Configurationsfactory.getConfiguration("TEST_ENVIRONMENT")

const initConf = [
	...data.spaceCrafts.map(item => ({
		Name: item.Name,
		displayName: item.displayName
	})),
	...data.groundCommunicationSystem.map(item => ({
		Name: item.Name,
		displayName: item.displayName
	}))
];

const DevelopmentArea = ({ trigger, resetTrigger, saveTrigger, submitTrigger, mode}) => {

	const [scale, setScale] = useState({scale: 1});
	const [isMapViewEnabled, setViewMode] = useState(false);
	const [currentSpacecraft, setCurrentSpacecraft] = useState("");
	const [isEnvInitialized, setIsEnvInitialized] = useState(0);

	const pixiContainer = useRef();
    const pixiSpaceCraftsSystemStateContainer = useRef();

    const matterContainer = useRef();
    const matterContainerPhys = useRef();

    const environmentRef = useRef(null);

	function initializeEnvironment()
	{
        const conf = "TEST_ENVIRONMENT";
        let environment = new EnvironmentSubSystem(conf, mode)

        if (!environment.initialize(pixiContainer,
									pixiSpaceCraftsSystemStateContainer,
									matterContainer,
									matterContainerPhys,
									isMapViewEnabled))
        {
            console.log("environment - error");
        }
		else
		{
			environmentRef.current = environment;
			environment = null;
			setIsEnvInitialized(prev => prev + 1);
		}
	}

    useEffect(() => {
        const container = pixiContainer.current;

		initializeEnvironment();

        // const handleClick = (e) => {
        //     console.log("Click at:", e.clientX, e.clientY);
        // };
        
        // const handleWheel = (e) => {
        //     console.log("Scroll delta:", e.deltaY);
        // };

        // container.addEventListener("click", handleClick);
        // container.addEventListener("wheel", handleWheel);

		const fetchFiles = async () => {
    		const files = await getFileNamesList();
   			console.log("Файли:", files);
  		};
  		fetchFiles();

        return () => {
            if (environmentRef.current)
            {
                environmentRef.current.resetEnvironment(true);
            }
        };
    }, []);

	useEffect(() => {
		if (environmentRef.current)
		{
			environmentRef.current.onScaleChanged(scale);
		}
    }, [scale]);

    useEffect(() => {
        if (environmentRef.current)
        {
            environmentRef.current.onViewModeChanged(isMapViewEnabled);
        }
    }, [isMapViewEnabled]);

	useEffect(() => {
		if (resetTrigger !== 0)
		{
			environmentRef.current.resetEnvironment();

			initializeEnvironment();
		}
	}, [resetTrigger]);

	const handleOutput = (msg) => {
		OutputWindow.receiveLog(msg);
	};

	const handleClick = (buttonType) => {
		switch (buttonType)
		{
		case "scalePlus":
			setScale({scale: 1});
			break;
		case "scaleMinus":
			setScale({scale: -1});
			break;
		case "viewMode":
			setViewMode(!isMapViewEnabled);
			break;
		}
	}

	const handleNewSelectedSpacecraft = (item) =>
	{
		setCurrentSpacecraft(item);
	}

return (
	<div className='splitPaneContainer'>
		<SplitPane
			key="dev-pane"
			split="vertical"
			defaultSize="60%"
			allowResize={true}
		>
			<div className="left-panel">
				<div className="displayobjectfuncpanel">
					<FunctionalDisplayObjectAreaPanel onClick = {handleClick}
													  scale = {scale.scale}
													  isMapViewEnabled = {isMapViewEnabled}>
					</FunctionalDisplayObjectAreaPanel>
 				</div>
				<div className="DisplayObjectArea">
					<DisplayObjectArea scale = {scale}
									   isMapViewEnabled = {isMapViewEnabled}
									   pixiContainer = {pixiContainer}
									   environmentRef = {environmentRef}
									   pixiSpaceCraftsSystemStateContainer = {pixiSpaceCraftsSystemStateContainer}
									   matterContainer = {matterContainer}
									   matterContainerPhys = {matterContainerPhys}>
					</DisplayObjectArea>
				</div>
			</div>
			<div className="right-panel">
				<SplitPane split="horizontal" defaultSize="50%" allowResize={true}>
					<div className='upper-panel'>
						<div className="editPanel">
							<FunctionalEditorPanel onSpacecraftSelected={(item)=>{handleNewSelectedSpacecraft(item)}}/>
						</div>
						<div className="editor">
							<CodeEditorWindow
								initCode={``}
								language={"javascript"}
								theme={"vs-dark"}
								onOutput={handleOutput}
								trigger={trigger}
								currentSpacecraft={currentSpacecraft}
								initConf={initConf}
								isEnvInit={isEnvInitialized}
								saveTrigger={saveTrigger}
								submitTrigger={submitTrigger}
								mode={mode}>
							</CodeEditorWindow>
						</div>
					</div>
					<div className='down-panel'>
						<OutputWindow></OutputWindow>
					</div>
				</SplitPane>
			</div>
		</SplitPane>
	</div>
)
}

export default DevelopmentArea