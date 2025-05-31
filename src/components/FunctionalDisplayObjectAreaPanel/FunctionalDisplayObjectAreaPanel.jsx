// import React, {useState} from 'react';
// import {Link} from 'react-router-dom';
import "./FunctionalDisplayObjectAreaPanel.css";
import "../EditorPanelButtonGroup/EditorPanelButtonGroup"
import {AiFillCaretRight} from "react-icons/ai";
import {FaSquare} from "react-icons/fa";
import EditorPanelButtonGroup from '../EditorPanelButtonGroup/EditorPanelButtonGroup';

const FunctionalDisplayObjectAreaPanel = ({onRunClick, onSpacecraftSelected}) => {

    return (
        <div className='functionalDisplayObjectAreaPanel'>
            <button className="panel-button">
                <span>button1</span>
            </button>
            <button className="panel-button">
                <span>button2</span>
            </button>
            <button className="panel-button">
                <span>button3</span>
            </button>
            <button className="panel-button">
                <span>button4</span>
            </button>
            <button className="panel-button">
                <span>button5</span>
            </button>
            <EditorPanelButtonGroup onSelectChange={onSpacecraftSelected} className="testBtn"></EditorPanelButtonGroup>
        </div>        
    );

};

export default FunctionalDisplayObjectAreaPanel;