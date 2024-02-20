import { CommunicationOperator } from "./communicationoperator.js"
import { RadioCommunicationSystem } from "./subsystems/radiocommunicationsystem.js"
import { SpaceCraftBuilder } from "./spacecraftbuilder.js"
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





export class EnvironmentBase
{
    constructor()
    {
        console.log("AAAAAAAAAAAAAAAA")
        let testBody1 = Bodies.rectangle(400, 400, 40, 300, {isStatic: true});
        console.log(testBody1.position.x)

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
        Runner.run(runner, engine);

        radioModul1.createMessage("Hello world");
        radioModul1.sendMessage(1);

        let builder = new SpaceCraftBuilder();
        let spaceCrafts = builder.buildSpaceCrafts();

        let communicationOperator = new CommunicationOperator(spaceCrafts);

        let radioModul1 = new RadioCommunicationSystem(10, 10, communicationOperator);
        let radioModul2 = new RadioCommunicationSystem(1000, 1000, communicationOperator);

        // let testBody = Bodies.rectangle(400, 400, 40, 300, {isStatic: true});
        // Composite.add(world, testBody);

        Events.on(engine, 'afterUpdate', function(event) {
            // console.log(testBody.position.x)
        });
    }
}