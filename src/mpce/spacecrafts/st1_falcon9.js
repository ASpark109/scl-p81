import { RadioCommunicationSystem } from "../subsystems/radiocommunicationsystem"
import { MainControlUnit } from "../subsystems/maincontrolunit";

var Matter = require('matter-js');

// var Engine = Matter.Engine,
//     Render = Matter.Render,
//     Runner = Matter.Runner,
//     Composites = Matter.Composites,
//     Common = Matter.Common,
//     Events = Matter.Events,
//     Constraint = Matter.Constraint,
//     MouseConstraint = Matter.MouseConstraint,
//     Mouse = Matter.Mouse,
//     Composite = Matter.Composite,
//     Bodies = Matter.Bodies,
//     Body = Matter.Body;

export class st1_falcon9{
    constructor(id, communicationOperator, cord){
        this.id = id;
        this.communicationOperator = communicationOperator;
        this.cord = cord
        this.subsystemsinitialisation();
        // this.build()
    }

    subsystemsinitialisation()
    {
        
        this.MainControlUnit = new MainControlUnit(this.id, this.cord);
        this.RadioCommunicationModule = new RadioCommunicationSystem(this.MainControlUnit, 
                                                        this.communicationOperator);
    }

    // build()
    // {
        
    //     this.serviceModul = Bodies.rectangle(1000, 700, 40, 300);
    //     this.leftLeg = Bodies.rectangle(975, 805, 8, 75);
    //     this.rigthtLeg = Bodies.rectangle(1025, 805, 8, 75);

    //     this.leftLegConstraint = Constraint.create({
    //         bodyA: serviceModul,
    //         pointA: {x: -24, y: 140 },
    //         bodyB: leftLeg,
    //         pointB: {x:0, y:35},
    //         length:0
    //     });

    //     this.rightLegConstraint = Constraint.create({
    //         bodyA: serviceModul,
    //         pointA: {x: 24, y: 140 },
    //         bodyB: rigthtLeg,
    //         pointB: {x:0, y:35},
    //         length:0
    //     });

    //     this.leftLegConstraintS = Constraint.create({
    //         bodyA: serviceModul,
    //         pointA: {x: -20, y: 97 },
    //         bodyB: leftLeg,
    //         pointB: {x:0, y:-10},
    //         length:5
            
    //     });

    //     this.rightLegConstraintS = Constraint.create({
    //         bodyA: serviceModul,
    //         pointA: {x: 20, y: 97 },
    //         bodyB: rigthtLeg,
    //         pointB: {x:0, y:-10},
    //         length:5
    //     });
    // }
}