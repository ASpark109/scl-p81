import { SpaceCraftBuilder } from "./spacecraftbuilder.js"
import { Configurationsfactory } from "./configurationsfactory.js";
import { constants } from "./constants.js";

var Matter = require('matter-js');

let Engine = Matter.Engine,
//Render = Matter.Render,
Runner = Matter.Runner,
Composite = Matter.Composite,
Events = Matter.Events
//,Bodies = Matter.Bodies,
//Body = Matter.Body

export class PhysicalEnvironmentModel
{
    #mEngine = null;
    #mWorld = null;
    #mRunner = null;

    #mConfiguration = null;
    #mBuilder = new SpaceCraftBuilder();
    #mAbstractUpdate = null

    //#mSpaceCrafts = [];
    #mSpaceCraftsLocationGrid = [];

    #mDistanceBetweenObjects = constants.DISTANCE_BETWEEN_OBJECTS;

    constuctor(configuration)
    {
        if (configuration != null)
        {
            this.#mConfiguration = Configurationsfactory.getConfiguration(configuration);
        }
        else
        {
            console.log("Не вдалось отримати конфігурацію");
        }
    }

    initialize(abstractUpdate)
    {
        this.#mEngine = Engine.create();
        this.#mWorld = this.#mEngine.world;
        this.#mRunner = Runner.create();

        this.#mAbstractUpdate = abstractUpdate;


        this.#mWorld.gravity.x = 0;
        this.#mWorld.gravity.y = 0;

        for (let i = 0; i < constants.LOCATION_GRID_WIDTH; i++)
        {
            this.#mSpaceCraftsLocationGrid.push([]);
            for (let n = 0; n < constants.LOCATION_GRID_HEIGHT; n++)
            {
                this.#mSpaceCraftsLocationGrid[i].push(false);
            }
        }

        //const self = this;
        Events.on(this.#mEngine, "afterUpdate", (event) => {
            this.#mAbstractUpdate()
        })

        //this.start()
    }

    start()
    {
        Runner.run(this.#mRunner, this.#mEngine);
    }

    stop()
    {
        Runner.stop(this.#mRunner, this.#mEngine);
    }

    addObject(item)
    {
        //Тимчасово
        if (item.type == "spaceobject")
        {
            return null;
        }
        
        let spacecraft = this.#mBuilder.buildSpaceCraft(item.Name);

        if (spacecraft.bodies.length > 0)
        {
            let master = spacecraft.bodies.find(body => body.master === true) || null;

            if (!spacecraft || !master)
            {
                console.log("The creation of a spacecraft failed: " + item.Name);
                return null;
            }
            
            let pos = this.#findFreePosition();

            spacecraft.mountingPoint = pos;

            Matter.Composite.translate(spacecraft, pos);

            console.log(master.position);

            //! Вісь обертання тимчасово встановлюється тут.
            //! На даний момент космічні апарати можуть складатися тільки з одногої частини
            const centreOfMassConstraint = Matter.Constraint.create({
                bodyA: master,
                pointA: {x: 0, y: 0},
                pointB: {x: master.position.x, y: master.position.y},
                stiffness: 1
            });

            Matter.Composite.rotate(spacecraft, item.RotationAngle * (Math.PI / 180), master.position);

            Composite.add(this.#mWorld, spacecraft);
            Composite.add(this.#mWorld, centreOfMassConstraint);

            return spacecraft
        }
        else
        {
            console.log("Creation of new object failed");
            return false;
        }
    }

    removeObject(id)
    {
        const spacecraft = this.#mWorld.Composite.find(item => item.id === id);

        Composite.remove(this.#mWorld, spacecraft)
        //this.#mSpaceCrafts.splice(index, 1);
        //! Видалити з самого середовища
    }

//private:
    #findFreePosition()
    {
        for (let h = 0; h < this.#mSpaceCraftsLocationGrid.length; h++)
        {
            for (let w = 0; w < this.#mSpaceCraftsLocationGrid[h].length; w++)
            {
                if (this.#mSpaceCraftsLocationGrid[h][w] === false)
                {
                    this.#mSpaceCraftsLocationGrid[h][w] = true;
                    
                    return {x: w * this.#mDistanceBetweenObjects,
                            y: h * this.#mDistanceBetweenObjects};
                }
            }
        }
    }
}