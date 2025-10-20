import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const DisplayObjectArea = ({pixiContainer, pixiSpaceCraftsSystemStateContainer, matterContainerPhys, matterContainer}) => {

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