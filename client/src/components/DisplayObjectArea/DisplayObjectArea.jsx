import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
import { EnvironmentSubSystem } from "../../mpce/environmentsubsystem"
import FunctionalDisplayObjectAreaPanel from "../FunctionalDisplayObjectAreaPanel/FunctionalDisplayObjectAreaPanel"

const DisplayObjectArea = ({scale, isMapViewEnabled}) => {

    const pixiContainer = useRef();
    const pixiSpaceCraftsSystemStateContainer = useRef();

    const matterContainer = useRef();
    const matterContainerPhys = useRef();

    const displayOperatorRef = useRef(null);

    useEffect(() => {
        const container = pixiContainer.current;

        const conf = "TEST_ENVIRONMENT";
        let displayOperator = new EnvironmentSubSystem(conf)

        if (!displayOperator.initialize(pixiContainer,
                                        pixiSpaceCraftsSystemStateContainer,
                                        matterContainer,
                                        matterContainerPhys))
        {
            console.log("displayOperator - error");
        }

        displayOperatorRef.current = displayOperator;

        const handleClick = (e) => {
            //console.log("Click at:", e.clientX, e.clientY);
        };
        
        const handleWheel = (e) => {
            //console.log("Scroll delta:", e.deltaY);
        };

        container.addEventListener("click", handleClick);
        container.addEventListener("wheel", handleWheel);

        return () => {
            if (displayOperatorRef.current)
            {
                displayOperatorRef.current.displayApp.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        if (displayOperatorRef.current)
        {
            displayOperatorRef.current.onScaleChanged(scale);
        }
    }, [scale]);

    useEffect(() => {
        if (displayOperatorRef.current)
        {
            displayOperatorRef.current.onViewModeChanged(isMapViewEnabled);
        }
    }, [isMapViewEnabled]);

    return<div id="hello">
                <div id = "renderWin">
                    <div id="renWin1" ref={pixiContainer}></div>
                    <div id="systemStateWin" ref={pixiSpaceCraftsSystemStateContainer}></div>
                    {/* <div ref={matterContainerPhys}></div>
                    <div ref={matterContainer}></div> */}
                </div>
            </div>
};

export default DisplayObjectArea;