import { CommunicationOperator } from "./communicationoperator.js"
// import { RadioCommunicationSystem } from "./subsystems/radiocommunicationsystem.js"
import { SpaceCraftBuilder } from "./spacecraftbuilder.js"
var Matter = require('matter-js');

let Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
// Composites = Matter.Composites,
// Common = Matter.Common,
Events = Matter.Events,
// Constraint = Matter.Constraint,
// MouseConstraint = Matter.MouseConstraint,
// Mouse = Matter.Mouse,
// Composite = Matter.Composite,
Bodies = Matter.Bodies
// Body = Matter.Body;





export class EnvironmentBase
{
    constructor()
    {
        this.spaceCrafts = [];
    }

    init()
    {    
        console.log("INIT method")
        let engine = Engine.create(),
            world = engine.world;
        
        let render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                width: 2000,
                height: 1000,
                showAngleIndicator: true,
                showInternalEdges: true
            }
        });
        
        // // Render.run(render);
        
        var runner = Runner.create();

        let communicationOperator = new CommunicationOperator();

        console.log("communication operator")
        console.log(communicationOperator)

        let builder = new SpaceCraftBuilder();
        this.spaceCrafts = builder.buildSpaceCrafts(communicationOperator);

        communicationOperator.setSpaceCrafts(this.spaceCrafts);
        

        Runner.run(runner, engine);

        Events.on(engine, 'afterUpdate', function(event) {
            // console.log(testBody.position.x)
            communicationOperator.update(0.01)
        });
    }
}