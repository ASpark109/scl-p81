import React, { useState, useEffect, useRef } from "react";
import "./LiveDisplayArea.css";

import SplitPane from 'react18-split-pane';
import SpacecraftCodeRunner from "../SpacecraftCodeRunner/SpacecraftCodeRunner"
import { Configurationsfactory } from "../../mpce/configurationsfactory";
import { getFileByName } from "../../api/userSrcCode";

const LiveDisplayArea = ({pixiContainer,
                          pixiSpaceCraftsSystemStateContainer,
                          matterContainerPhys,
                          matterContainer,
                          isEnvInit,
                          mode}) => {

    const [userCodeList, setCodeList] = useState({});

    const data = Configurationsfactory.getConfiguration("TEST_ENVIRONMENT1")
    
    const initConf = [
        ...data.spaceCrafts.map(item => ({
            Name: item.Name,
            displayName: item.displayName
        })),
        ...data.groundCommunicationSystem.map(item => ({
            Name: item.Name,
            displayName: item.displayName
        }))
    ];

    useEffect(() => {
        const fetchSrcCode = async () => {
            const codes = {};

            for (let i = 0; i < initConf.length; i++)
            {
                const spacecraft = initConf[i];
                const filename = `${spacecraft.displayName}.txt`;

                const code = await getFileByName(filename);
                codes[spacecraft.displayName] = code || `// ${spacecraft.displayName}\n // not found`;
            }

            // console.log(codes)
            setCodeList(codes);
        };

        fetchSrcCode();
    }, []);

    // for (let i of initConf)
    // {
    //     console.log(userCodeList[i.displayName]);
    // }

    return<div className="dispalyAreaContainer">
                <SplitPane
                    split="vertical"
                    defaultSize="75%"
                    allowResize={true}
                >
                    <div className="left-panel-live">
                        <div id="renWin1" ref={pixiContainer}></div>
                        <div ref={matterContainerPhys}></div>
                    </div>
                    <div className="right-panel-live">
                        <div id="systemStateWin" ref={pixiSpaceCraftsSystemStateContainer}></div>
                    </div>
                </SplitPane>
                {
                    initConf.map((spaceCraft) => (
                        <SpacecraftCodeRunner key={spaceCraft.displayName}
                                            code={userCodeList[spaceCraft.displayName]}
                                            spaceCraftName={spaceCraft.displayName}
                                            config={Configurationsfactory.getConfiguration(spaceCraft.Name, "abstractSystemInterfaceData")}
                                            codeRunTrigger={0} // run the code immediately
                                            isEnvInit={isEnvInit}
                                            saveTrigger={0}
                                            currentSpacecraft={null}
                                            mode={mode}>
                        </SpacecraftCodeRunner>
                    ))
			    }
            </div>
};

export default LiveDisplayArea;