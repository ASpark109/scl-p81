import { useState, useEffect, useRef } from "react";
import "./LiveMonitor.css"

import DisplayObjectArea from '../DisplayObjectArea/DisplayObjectArea'
import FunctionalDisplayObjectAreaPanel from "../FunctionalDisplayObjectAreaPanel/FunctionalDisplayObjectAreaPanel"
import LiveDisplayArea from "../LiveDisplayArea/LiveDisplayArea";
import { EnvironmentSubSystem } from "../../mpce/environmentsubsystem"

export default function LiveMonitor({mode})
{
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
        const conf = "TEST_ENVIRONMENT1";
        let environment = new EnvironmentSubSystem(conf, mode)

        if (!environment.initialize(pixiContainer,
                                    pixiSpaceCraftsSystemStateContainer,
                                    matterContainer,
                                    matterContainerPhys,
                                    isMapViewEnabled))
        {
            console.log("live environment - error");
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

        // const fetchFiles = async () => {
        //     const files = await getFileNamesList();
        //     console.log("Файли:", files);
        // };
        // fetchFiles();

        return () => {
            if (environmentRef.current)
            {
                environmentRef.current.resetEnvironment(true);
            }
        };
    }, []);

    // const handleOutput = (msg) => {
	// 	OutputWindow.receiveLog(msg);
	// };

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

    return (
        <div className="liveViewContainer">
            <div className="displayobjectfuncpanel">
                <FunctionalDisplayObjectAreaPanel onClick = {handleClick}
                                                    scale = {scale.scale}
                                                    isMapViewEnabled = {isMapViewEnabled}>
                </FunctionalDisplayObjectAreaPanel>
            </div>
            <div className="DisplayObjectAreaLiveMonitor">
                <LiveDisplayArea scale = {scale}
                                    isMapViewEnabled = {isMapViewEnabled}
                                    pixiContainer = {pixiContainer}
                                    environmentRef = {environmentRef}
                                    pixiSpaceCraftsSystemStateContainer = {pixiSpaceCraftsSystemStateContainer}
                                    matterContainer = {matterContainer}
                                    matterContainerPhys = {matterContainerPhys}
                                    isEnvInit = {isEnvInitialized}
                                    mode = {mode}>
                </LiveDisplayArea>
            </div>
        </div>
    );
}