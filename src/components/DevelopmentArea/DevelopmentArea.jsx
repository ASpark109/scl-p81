import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import SplitPane from 'react18-split-pane';
import "./DevelopmentArea.css";
import CodeEditorWindow from '../CodeEditor/CodeEditor';
import OutputWindow from '../OutputWindow/OutputWindow'
import DisplayObjectArea from '../DisplayObjectArea/DisplayObjectArea'
import FunctionalDisplayObjectAreaPanel from "../FunctionalDisplayObjectAreaPanel/FunctionalDisplayObjectAreaPanel"
import FunctionalEditorPanel from '../FunctionalEditorPanel/FunctionalEditorPanel';
// import MatterJSComponent from '../../pixiTest/pixiT';

const DevelopmentArea = () => {

const handleOutput = (msg) => {
	OutputWindow.receiveLog(msg);
};

return (
	<div className='splitPaneContainer'>
		<SplitPane
			split="vertical"
			defaultSize="60%"
			allowResize={true}
		>
			<div className="left-panel">
				<div className="displayobjectfuncpanel">
					<FunctionalDisplayObjectAreaPanel></FunctionalDisplayObjectAreaPanel>
 				</div>
				<div className="DisplayObjectArea">
					<DisplayObjectArea></DisplayObjectArea>
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
	
	console.log('hello')

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