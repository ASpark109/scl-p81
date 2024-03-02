import { st1_falcon9 } from './spacecrafts/st1_falcon9';

// var Matter = require('matter-js');
// let Engine = Matter.Engine,
// Render = Matter.Render,
// Runner = Matter.Runner,
// Composites = Matter.Composites,
// Common = Matter.Common,
// Events = Matter.Events,
// Constraint = Matter.Constraint,
// MouseConstraint = Matter.MouseConstraint,
// Mouse = Matter.Mouse,
// Composite = Matter.Composite,
// Bodies = Matter.Bodies,
// Body = Matter.Body;

export class SpaceCraftBuilder{

    constructor(){
        this.spaceCrafts = [];
    }

    buildSpaceCrafts(communicationOperator){

        // console.log("communicationOperator")
        // console.log(communicationOperator)

        let f1_c = {x: 0, y: 0};
        let f2_c = {x: 0, y: 1000000000};

        let falcon9_1 = new st1_falcon9(1,communicationOperator, f1_c)
        // let falcon9_2 = new st1_falcon9(2,communicationOperator, f2_c)

        this.spaceCrafts.push(falcon9_1.build());
        // this.spaceCrafts.push(falcon9_2.build());

        // console.log("FALCON9 1");



        return this.spaceCrafts;
    }
}