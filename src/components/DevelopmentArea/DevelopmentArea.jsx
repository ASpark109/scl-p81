import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import SplitPane from 'react-split-pane';
import "./DevelopmentArea.css";
import CodeEditorWindow from '../CodeEditor/CodeEditor';
import FunctionalEditorPanel from '../FunctionalEditorPanel/FunctionalEditorPanel';
import OutputWindow from '../OutputWindow/OutputWindow'
import DisplayObjectArea from '../DisplayObjectArea/DisplayObjectArea'
// import MatterJSComponent from '../../pixiTest/pixiT';

class DevelopmentArea extends React.Component {

render()
{
  return (
  <div className='splitPaneContainer w-100'>
    <SplitPane
      split="vertical"
      defaultSize="50%" // Початковий розмір панелі (50% ширини)
      allowResize={true}
      >
      <div className="left-panel">
        <div className="DisplayObjectArea">
          <DisplayObjectArea></DisplayObjectArea>
        </div>
      </div>
      <div className="right-panel">
        <SplitPane
          split="horizontal"
          defaultSize="50%" // Початковий розмір панелі (50% ширини)
          allowResize={true}
        >
          <div className='upper-panel'>
            <FunctionalEditorPanel>
              
            </FunctionalEditorPanel>
            <CodeEditorWindow>

            </CodeEditorWindow>
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
}

export default DevelopmentArea