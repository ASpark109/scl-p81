import { CommunicationOperator } from "./communicationoperator.js"
// import { RadioCommunicationSystem } from "./subsystems/radiocommunicationsystem.js"
import { SpaceCraftBuilder } from "./spacecraftbuilder.js"
var Matter = require('matter-js');

let Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Composites = Matter.Composites,
Composite = Matter.Composite,
// Common = Matter.Common,
Events = Matter.Events,
// Constraint = Matter.Constraint,
// MouseConstraint = Matter.MouseConstraint,
// Mouse = Matter.Mouse,
// Composite = Matter.Composite,
Bodies = Matter.Bodies
// Body = Matter.Body;


export let a = 5;


export class EnvironmentBase
{
    constructor()
    {
        this.world = null;
        this.spaceCrafts = [];
        this.ambient = [];
    }

    init()
    {    
        // console.log("INIT method")
        let engine = Engine.create();
        this.world = engine.world;
        
        let render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                width: 2000,
                height: 1300,
                showAngleIndicator: true,
                showInternalEdges: true
            }
        });
        
        // Render.run(render);
        var runner = Runner.create();

        let communicationOperator = new CommunicationOperator();

        let builder = new SpaceCraftBuilder();
        this.spaceCrafts = builder.buildSpaceCrafts(communicationOperator);

        communicationOperator.setSpaceCrafts(this.spaceCrafts);

        //floor
        let wall = Bodies.rectangle(1000, 900, 1900, 50, { isStatic: true, width: 1900, height: 50, label:"wall"});

        this.ambient.push(wall);

        Composite.add(this.world, this.spaceCrafts);
        Composite.add(this.world, this.ambient);

        Runner.run(runner, engine);

        // engine.world.gravity.x = 0
        // engine.world.gravity.y = 0

        let self = this;
        //console.log(Composite.allBodies(world))
        //console.log(this.spaceCrafts);
        Events.on(engine, 'afterUpdate', function(event) {
            // console.log(self.spaceCrafts[0][0].position)
            communicationOperator.update(0.01);
        });
    }

    testConfiguration()
    {

    }

    getAllComponents()
    {
        return Composite.allBodies(this.world);
    }
}