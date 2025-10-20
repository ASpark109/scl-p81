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

const DevelopmentArea = ({ trigger, resetTrigger}) => {

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
        let environment = new EnvironmentSubSystem(conf)

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
								initCode={
`
let test1 = System.LandingLegs.Leg1.PneumaticBlock.setValveState(true);

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

// let test6 = System.PowerSupplySystem.energyProduction();
// let test7 = System.PowerSupplySystem.energyConsumption();
// let test8 = System.PowerSupplySystem.energyAccumulated();
// let test9 = System.PowerSupplySystem.setPowerForComponent();

// test9.onFinished((result) => {
//     console.log(result)
// })

// let counter = 0;

// setInterval(() => {
// let test6 = System.PowerSupplySystem.energyProduction();
// let test7 = System.PowerSupplySystem.energyConsumption();
// let test8 = System.PowerSupplySystem.energyAccumulated();
// let test9 = System.FuelSystem.Pump.availablePower();

// console.log("====================== " + counter);

// counter++;

// test6.onFinished((result) => {
//     console.log("Prod: " + result.max + " " + result.current)
// })

// test7.onFinished((result) => {
//     console.log("Cons: " + result)
// })

// test8.onFinished((result) => {
//     console.log("Accu: " + result)
// })

// test9.onFinished((result) => {
//     console.log("Avai: " + result)
// })

// if (counter === 30)
// {
//     System.FuelSystem.Pump.setPowerConsumption(5000);
// }

// if (counter === 45)
// {
//     System.FuelSystem.Pump.setPowerConsumption(300);
// }

// }, 1000)

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
								initConf={initConf}
								isEnvInit={isEnvInitialized}>
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