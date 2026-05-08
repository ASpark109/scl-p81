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
import { BsLayersHalf } from "react-icons/bs";

const FunctionalDisplayObjectAreaPanel = ({onClick, scale, isMapViewEnabled, onFocusObjectChanged, onTargetObjectChanged, project}) => {

    return (
        <div className='functionalDisplayObjectAreaPanel'>
            <button className="panel-button">
                <span>button1</span>
            </button>
            <button className="panel-button" onClick={() => onClick("interior")}>
                <BsLayersHalf className="icon" />
            </button>
            <button className="panel-button" onClick={() => onClick("info")}>
                <span>info</span>
            </button>
            <button className="panel-button" onClick={() => onClick("orbits")}>
                <span>orbits</span>
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

            <EditorPanelButtonGroup onSelectChange={(newObject) => {onFocusObjectChanged(newObject)}} project={project}></EditorPanelButtonGroup>
            <EditorPanelButtonGroup onSelectChange={(newObject) => {onTargetObjectChanged(newObject)}} project={project}></EditorPanelButtonGroup>
        </div>        
    );

};

export default FunctionalDisplayObjectAreaPanel;