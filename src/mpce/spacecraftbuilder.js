var Matter = require('matter-js');

let Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Composites = Matter.Composites,
Common = Matter.Common,
Events = Matter.Events,
Constraint = Matter.Constraint,
MouseConstraint = Matter.MouseConstraint,
Mouse = Matter.Mouse,
Composite = Matter.Composite,
Bodies = Matter.Bodies,
Body = Matter.Body;

export class SpaceCraftBuilder{

    constructor(){

    }

    buildSpaceCrafts(){
        let spaceCrafts = [];

        let testBody = Bodies.rectangle(400, 400, 40, 300, {isStatic: true});
        spaceCrafts.push(testBody);

        return spaceCrafts;
    }

    build

}