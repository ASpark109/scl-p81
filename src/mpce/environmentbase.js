import { CommunicationOperator } from "./communicationoperator.js"
// import { RadioCommunicationSystem } from "./subsystems/radiocommunicationsystem.js"
import { SpaceCraftBuilder } from "./spacecraftbuilder.js"
import { Configurationsfactory } from "./configurationsfactory.js";
import { constants } from "./constants.js";

var Matter = require('matter-js');

let Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Composite = Matter.Composite,
Events = Matter.Events,
Bodies = Matter.Bodies,
Body = Matter.Body


export let a = 5;

export class EnvironmentBase
{
    #world = null;
    #spaceCrafts = [];
    #ambient = [];

    #globalDimensions = {
        width: 0,
        height: 0
    };

    #simulationWindowDimensions = {
        width: constants.SECTOR_WIDTH,
        height: constants.SECTOR_HEIGHT
    };

    #render = null;

    constructor()
    {}

    init()
    {    
        let engine = Engine.create();

        this.#world = engine.world;
        //this.#render = this.#creatRender(engine);

        var runner = Runner.create();

        //let communicationOperator = new CommunicationOperator();

        // Тимчасова змінна
        let conf = Configurationsfactory.getConfiguration("TEST_ENVIRONMENT");

        this.#globalDimensions.width = conf.EnvironmentWidth;
        this.#globalDimensions.height = conf.EnvironmentHeight;

        this.#addSpaceCraftToEnvironment(conf.spaceCrafts)
        this.#addObjectToEnvironment();

        engine.world.gravity.x = 0;
        engine.world.gravity.y = 0;

        let self = this;
        Events.on(engine, 'afterUpdate', function(event) {
            //Часову змінну константу потрібно потім змінити
            //communicationOperator.update(0.01);

            self.#checkingForBorderCrossings();
        });

        Runner.run(runner, engine);
    }

    #addSpaceCraftToEnvironment(conf)
    {
        let builder = new SpaceCraftBuilder();

        for (const item of conf)
        {
            let composite = builder.buildSpaceCraft(item.Name);

            let master = composite.bodies.find(body => body.master === true) || null;

            if (!composite || !master)
            {
                console.log("The creation of a spacecraft failed: " + item.Name);
                return null;
            }

            let localParam = this.#globalToLocalCoordinates(item.Position);

            Matter.Composite.translate(composite, localParam.localCoordinates);
            //Matter.Composite.translate(composite, {x: 125, y: 900});
            
            composite.sector.x = localParam.sectors.x;
            composite.sector.y = localParam.sectors.y;

            Body.setVelocity(master, item.Velocity);
            Body.setAngle(master, item.RotationAngle * (Math.PI / 180));

            Composite.add(this.#world, composite);
        }
    }

    #addObjectToEnvironment()
    {
        //floor
        let wall = Bodies.rectangle(1000, 900, 1900, 50, { isStatic: true, width: 1900, height: 50, label:"wall",
            collisionFilter: 
            {
                category: 1//this.collisionGroup
            }});

        this.#ambient.push(wall);

        //Composite.add(this.#world, this.#ambient);
    }

    getAllComponents()
    {
        return Matter.Composite.allComposites(this.#world)
    }

    #globalToLocalCoordinates(position)
    {
        let a = Math.floor(position.x / this.#simulationWindowDimensions.width);
        let b = Math.floor(position.y / this.#simulationWindowDimensions.height);
        
        return {
            localCoordinates:
            {
                x: position.x - a * this.#simulationWindowDimensions.width,
                y: position.y - b * this.#simulationWindowDimensions.height,
            },

            sectors:
            {
                x: a,
                y: b
            }
        }
    }

    #checkingForBorderCrossings()
    {
        for (const item of Matter.Composite.allComposites(this.#world))
            {
                let master = item.bodies.find(body => body.master === true) || null;

                if (master.position.x >= this.#simulationWindowDimensions.width)
                {
                    Matter.Composite.translate(item, {x: -this.#simulationWindowDimensions.width, y: 0});
                    ++item.sector.x
                    break;
                }

                if (master.position.x <= 0)
                {
                    Matter.Composite.translate(item, {x: this.#simulationWindowDimensions.width, y: 0});
                    --item.sector.x
                    break;
                }

                if (master.position.y >= this.#simulationWindowDimensions.height)
                {
                    Matter.Composite.translate(item, {x: 0, y: -this.#simulationWindowDimensions.height});
                    ++item.sector.y
                    break;
                }

                if (master.position.y <= 0)
                {
                    Matter.Composite.translate(item, {x: 0, y: this.#simulationWindowDimensions.height});
                    --item.sector.y
                    break;
                }
            }
    }

    #creatRender(engine)
    {
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

        return render;
    }
}