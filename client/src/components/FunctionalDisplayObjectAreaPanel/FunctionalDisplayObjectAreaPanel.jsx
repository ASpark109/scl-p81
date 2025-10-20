// import React, {useState} from 'react';
// import {Link} from 'react-router-dom';
import "./FunctionalDisplayObjectAreaPanel.css";
import "../EditorPanelButtonGroup/EditorPanelButtonGroup"
import {AiFillCaretRight} from "react-icons/ai";
import {FaSquare} from "react-icons/fa";
import EditorPanelButtonGroup from '../EditorPanelButtonGroup/EditorPanelButtonGroup';
import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { LuOrbit } from "react-icons/lu";

const FunctionalDisplayObjectAreaPanel = ({onClick, scale, isMapViewEnabled}) => {

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

            <div className="groupBorder"></div>

            <div className="zoom-button-group">
                <button className="zoom-button" onClick={() => onClick("scaleMinus")}>
                    <FiMinus className="icon" />
                </button>
                <button className="zoom-button" onClick={() => onClick("scalePlus")}>
                    <FiPlus className="icon" />
                </button>
                <button className="view-mode-button"
                        onClick={() => onClick("viewMode")}>
                    <LuOrbit className={isMapViewEnabled ? "view-mode-icon active" : "view-mode-icon"} />
                </button>
            </div>

            <div className="groupBorder"></div>

            <EditorPanelButtonGroup onSelectChange={() => {}} className="testBtn"></EditorPanelButtonGroup>
        </div>        
    );

};

export default FunctionalDisplayObjectAreaPanel;