import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import SplitPane from 'react18-split-pane';
import "./DevelopmentArea.css";
import CodeEditorWindow from '../CodeEditor/CodeEditor';
import OutputWindow from '../OutputWindow/OutputWindow'
import DisplayObjectArea from '../DisplayObjectArea/DisplayObjectArea'
import FunctionalDisplayObjectAreaPanel from "../FunctionalDisplayObjectAreaPanel/FunctionalDisplayObjectAreaPanel"
import FunctionalEditorPanel from '../FunctionalEditorPanel/FunctionalEditorPanel';
// import MatterJSComponent from '../../pixiTest/pixiT';
import { Configurationsfactory } from "../../mpce/configurationsfactory";

const DevelopmentArea = () => {
	const [scale, setScale] = useState({scale: 1});
	const [isMapViewEnabled, setViewMode] = useState(false);

	const displayAreaScaleConf = Configurationsfactory.getConfiguration("SCALE_DISPLAY_AREA");
	let currentScale = isMapViewEnabled ? displayAreaScaleConf.abstractViewScale : displayAreaScaleConf.physicalViewScale;

	const handleOutput = (msg) => {
		OutputWindow.receiveLog(msg);
	};

	const handleClick = (buttonType) => {
		switch (buttonType)
		{
		case "scalePlus":
			// if ((scale.scale + 1) !== currentScale.length)
			{
				setScale({scale: 1});
			}
			break;
		case "scaleMinus":
			// if ((scale.scale - 1) !== -1)
			{
				setScale({scale: -1});
			}
			break;
		case "viewMode":
			setViewMode(!isMapViewEnabled);
			break;
		}
	}

return (
	<div className='splitPaneContainer'>
		<SplitPane
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
									   isMapViewEnabled = {isMapViewEnabled}>
					</DisplayObjectArea>
				</div>
			</div>
			<div className="right-panel">
				<SplitPane split="horizontal" defaultSize="50%" allowResize={true}>
					<div className='upper-panel'>
						<div className="editPanel">
							<FunctionalEditorPanel 
								// onRunClick={handleRunCode}
								// onSpacecraftSelected={(spacecraft)=>{UserInteractionInterface.setControlModel(spacecraft.value);}}
							/>
						</div>
						<div className="editor">
							<CodeEditorWindow
								initCode={
	`// start your project here

	let openValve = Interface.System.LandingLegs.Leg1.PneumaticBlock.setValveState(true);
	let result = Interface.System.LandingLegs.Leg1.PneumaticBlock.readPressure()

	result.onFinished((value) => {
		console.log("Sensor value received:", value);
	});

	function loop()
	{

	}
	`}
								language={"javascript"}
								theme={"vs-dark"}
								onOutput={handleOutput}>
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