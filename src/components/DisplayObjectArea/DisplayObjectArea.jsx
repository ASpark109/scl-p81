import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
// import Rocket from '../../mpce/testRect';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
// import { EnvironmentBase } from "../../mpce/environmentbase.js"
import { userData } from '../../userData/userCode';
import { ComponentDisplayOperator } from '../../ed/componentdisplayoperator';

const DisplayObjectArea = () => {

    const pixiContainer = useRef();

    useEffect(() => {

        userData();
        let displayOperator = new ComponentDisplayOperator()

        //Запускаємо середовище matter pixi
        if (!displayOperator.init(pixiContainer))
        {
            console.log("displayOperator - error");
        }

        displayOperator.runRendering()

    return () => {
        displayOperator.displayApp.destroy(true);
    };
  }, []);

  return <div ref={pixiContainer}></div>;
};

export default DisplayObjectArea;