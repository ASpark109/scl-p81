import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import "./FunctionalEditorPanel.css";
import "../EditorPanelButtonGroup/EditorPanelButtonGroup"
import {AiFillCaretRight} from "react-icons/ai";
import {FaSquare} from "react-icons/fa";
import EditorPanelButtonGroup from '../EditorPanelButtonGroup/EditorPanelButtonGroup';

const FunctionalEditorPanel = ({}) => {

    return (
        <div className='functionalPanel'>
            <div className='leftContentBlock'>
                <button className='startButton'><AiFillCaretRight className='startBtn' /></button>
                <button className='stopButton'><FaSquare className='stopBtn'/></button>
            </div>
            <div className='rightContentBlock'>
                <EditorPanelButtonGroup></EditorPanelButtonGroup>
                <EditorPanelButtonGroup></EditorPanelButtonGroup>
            </div>
        </div>

    );

};

export default FunctionalEditorPanel;