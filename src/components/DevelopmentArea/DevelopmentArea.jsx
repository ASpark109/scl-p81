import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import SplitPane from 'react18-split-pane';
import "./DevelopmentArea.css";
import CodeEditorWindow from '../CodeEditor/CodeEditor';
import OutputWindow from '../OutputWindow/OutputWindow'
import DisplayObjectArea from '../DisplayObjectArea/DisplayObjectArea'
import FunctionalDisplayObjectAreaPanel from "../FunctionalDisplayObjectAreaPanel/FunctionalDisplayObjectAreaPanel"
import FunctionalEditorPanel from '../FunctionalEditorPanel/FunctionalEditorPanel';
import { UserInteractionInterface } from "../../mpce/userinteractioninterface";
// import MatterJSComponent from '../../pixiTest/pixiT';
import { Configurationsfactory } from "../../mpce/configurationsfactory";

const DevelopmentArea = ({ trigger }) => {
	const [scale, setScale] = useState({scale: 1});
	const [isMapViewEnabled, setViewMode] = useState(false);
	const [currentSpacecraft, setCurrentSpacecraft] = useState("");

	const initConf = Configurationsfactory.getConfiguration("TEST_ENVIRONMENT")
		.spaceCrafts
		.map(({ Name, displayName }) => ({ Name, displayName }));;

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
							<FunctionalEditorPanel onSpacecraftSelected={(item)=>{handleNewSelectedSpacecraft(item)}}/>
						</div>
						<div className="editor">
							<CodeEditorWindow
								initCode={
`
//Falcon9St1 Optimus

// let test1 = System.LandingLegs.Leg1.PneumaticBlock.setValveState(true);

// let test2 = System.RCS.Block1.activateUnitCFor(1000);

// let test3 = System.EngineBlock.Engine[0].start();

// let test4 = System.FuelSystem.Tank1.FillLevelSensor.readValue();

// test4.onFinished((result) => {
//     console.log(result)
// })

// System.FuelSystem.Pump.setRPM(10);
// System.FuelSystem.Pump.enable();

// setTimeout(() => {
//     System.FuelSystem.Pump.disable();
// }, 300);


// let test5 = System.FuelSystem.Tank1.FillLevelSensor.readValue();

// test5.onFinished((result) => {
//     console.log(result)
// })
//console.log(System)

function loop()
{

}

`}
								language={"javascript"}
								theme={"vs-dark"}
								onOutput={handleOutput}
								trigger={trigger}
								currentSpacecraft={currentSpacecraft}
								initConf={initConf}>
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