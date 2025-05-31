import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
import { EnvironmentSubSystem } from "../../mpce/environmentsubsystem"
import FunctionalDisplayObjectAreaPanel from "../FunctionalDisplayObjectAreaPanel/FunctionalDisplayObjectAreaPanel"

const DisplayObjectArea = () => {

    const pixiContainer = useRef();
    const matterContainer = useRef();
    const matterContainerPhys = useRef();

    useEffect(() => {

        let conf = "TEST_ENVIRONMENT";
        let displayOperator = new EnvironmentSubSystem(conf)

        if (!displayOperator.initialize(pixiContainer, matterContainer, matterContainerPhys))
        {
            console.log("displayOperator - error");
        }

        window.addEventListener('keydown', (event)=>{
            switch(event.key)
            {
            case "q":
                displayOperator.scaleUp();
                break;
            case "a":
                displayOperator.scaleDown();
                break;
            }
        });

    return () => {
        displayOperator.displayApp.destroy(true);
    };
  }, []);

  return<div id="hello">
            <div id = "renderWin">
                <div id="renWin1" ref={pixiContainer}></div>
                <div ref={matterContainerPhys}></div>
                <div ref={matterContainer}></div>
            </div>
        </div>
};

export default DisplayObjectArea;