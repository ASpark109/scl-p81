import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
import { EnvironmentSubSystem } from "../../mpce/environmentsubsystem"

const DisplayObjectArea = () => {

    const pixiContainer = useRef();

    useEffect(() => {

        let conf = "TEST_ENVIRONMENT";
        let displayOperator = new EnvironmentSubSystem(conf)

        if (!displayOperator.initialize(pixiContainer))
        {
            console.log("displayOperator - error");
        }

    return () => {
        displayOperator.displayApp.destroy(true);
    };
  }, []);

  return <div ref={pixiContainer}></div>;
};

export default DisplayObjectArea;