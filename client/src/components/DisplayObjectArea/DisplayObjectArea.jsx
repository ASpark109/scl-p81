import "./DisplayObjectArea.css";

const DisplayObjectArea = ({pixiContainer, pixiSpaceCraftsSystemStateContainer, matterContainerPhys, matterContainer}) => {

    return<div className="dispalyArea">
                <div id = "renderWin">
                    <div id="renWin1" ref={pixiContainer}></div>
                    <div ref={matterContainerPhys}></div>
                    {/* <div ref={matterContainer}></div> */}
                    <div id="systemStateWin" ref={pixiSpaceCraftsSystemStateContainer}></div>
                    
                    
                </div>
            </div>
};

export default DisplayObjectArea;