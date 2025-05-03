import { SpaceCraftBuilder } from "./spacecraftbuilder.js"
import { Configurationsfactory } from "./configurationsfactory.js";
import { PhysicalEnvironmentsTransporter } from "./physicalenvironmentstransporter.js";
import { DockingOperator } from "./dockingoperator.js";
import { constants } from "./constants.js";
import { ModuleBase } from "./modules/modulebase.js";

var Matter = require('matter-js');

let Engine = Matter.Engine,
Runner = Matter.Runner,
Composite = Matter.Composite,
Events = Matter.Events,
MouseConstraint = Matter.MouseConstraint,
Mouse = Matter.Mouse

export class PhysicalEnvironmentModel
{
    #mEngine = null;
    #mWorld = null;
    #mRunner = null;

    #mEngineInter = null;
    #mWorldInter = null;
    #mRunnerInter = null;

    #mConfiguration = null;
    #mBuilder = new SpaceCraftBuilder();
    #mObjectsTransporter = null;
    #mDockingOperator = null;
    #mAbstractUpdate = null
    
    #nearbyObjects = []; 
    #mSpaceCraftsLocationGrid = [];

    #mDistanceBetweenObjects = constants.DISTANCE_BETWEEN_OBJECTS;


    container = null

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

    initialize(abstractUpdate, container, containerPhys)
    {
        this.#mEngine = Engine.create();
        this.#mWorld = this.#mEngine.world;
        this.#mRunner = Runner.create({
            isFixed: true
        });

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

        Composite.translate(this.#mWorld, {x: 300, y: 300});

        Events.on(this.#mEngine, "afterUpdate", (event) => {
            this.#mAbstractUpdate()
            ModuleBase.updateAll();
        })


        const render = Matter.Render.create({
            element: container.current,
            engine: this.#mEngine,
            options: {
                width: 2000, // Adjust width
                height: 800, // Adjust height
                wireframes: true, // Disable wireframe to use full rendering
            }
        });

        Matter.Render.run(render)


        //==========================================

        this.#mEngineInter = Engine.create();
        this.#mWorldInter = this.#mEngineInter.world;
        this.#mRunnerInter = Runner.create({
            isFixed: true
        });

        this.#mWorldInter.gravity.x = 0;
        this.#mWorldInter.gravity.y = 0;

        Events.on(this.#mEngineInter, "afterUpdate", (event) => {
            for (let gi = 0; gi < this.#nearbyObjects.length; gi++)
            {
                let group = this.#nearbyObjects[gi];

                let ax = (group[0].phys.bodies[0].velocity.x / 10) - group[0].relVel.x
                let ay = (group[0].phys.bodies[0].velocity.y / 10) - group[0].relVel.y

                group[0].relVel.x = group[0].phys.bodies[0].velocity.x / 10
                group[0].relVel.y = group[0].phys.bodies[0].velocity.y / 10

                group[0].abs.velocity.x += ax;
                group[0].abs.velocity.y += ay;

                for (let i = 1; i < group.length; i++)
                {
                    group[i].abs.velocity.x = group[0].abs.velocity.x + (group[i].phys.bodies[0].velocity.x - group[0].phys.bodies[0].velocity.x) / 10
                    group[i].abs.velocity.y = group[0].abs.velocity.y + (group[i].phys.bodies[0].velocity.y - group[0].phys.bodies[0].velocity.y) / 10

                    Matter.Body.applyForce(group[i].phys.bodies[0],
                    {x: group[i].phys.bodies[0].position.x,
                    y: group[i].phys.bodies[0].position.y },
                    {x: 12 * (group[i].abs.force.x - group[0].abs.force.x) / 2776,
                    y: 12 * (group[i].abs.force.y - group[0].abs.force.y) / 2776});
                }
            }
        })

        const renderPhys = Matter.Render.create({
            element: containerPhys.current,
            engine: this.#mEngineInter,
            options: {
                width: 2000, // Adjust width
                height: 800, // Adjust height
                wireframes: false, // Disable wireframe to use full rendering
            }
        });

        Matter.Render.run(renderPhys)

        let mouse = Mouse.create(renderPhys.canvas)
        let mouseConstraint = MouseConstraint.create(this.#mEngineInter, {
            mouse: mouse,
            
            constraint: {
                bodyB: null,
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        Matter.Composite.add(this.#mWorldInter, mouseConstraint)

        this.#mObjectsTransporter = new PhysicalEnvironmentsTransporter(this.#mWorld,
                                                                        this.#mWorldInter,
                                                                        this.#mRunnerInter,
                                                                        this.#mEngineInter);
        
        this.#mDockingOperator = new DockingOperator(this.#mWorldInter, this.#mEngineInter);
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
        //Тимчасово, зараз створюються тільки космічні апарати, космічні обєкти ігноруються
        if (item.type == "spaceobject")
        {
            return null;
        }
        
        let spacecraft = this.#mBuilder.buildSpaceCraft(item.Name);

        console.log(spacecraft)

        if (spacecraft.bodies.length > 0)
        {
            let master = spacecraft.bodies.find(body => body.master === true) || null;

            if (!spacecraft || !master)
            {
                console.log("The creation of a spacecraft failed: " + item.Name);
                return null;
            }
            
            let pos = this.#mObjectsTransporter.findFreePosition(spacecraft.id);

            //! mountingPoint це центр маси космічного апарату
            spacecraft.mountingPoint = master.position;

            Matter.Composite.translate(spacecraft, pos);

            //! Вісь обертання тимчасово встановлюється тут.
            //! На даний момент космічні апарати можуть складатися тільки з одногої частини
            const centreOfMassConstraint = Matter.Constraint.create({
                bodyA: master,
                pointA: {x: 0, y: 0},
                pointB: {x: master.position.x, y: master.position.y},
                stiffness: 1,
                myId: spacecraft.id
            });

            Matter.Composite.rotate(spacecraft, item.RotationAngle * (Math.PI / 180), master.position);

            Composite.add(this.#mWorld, centreOfMassConstraint);
            Composite.add(this.#mWorld, spacecraft);

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
    objectsApproaching(objects)
    {
        const groupIndex = this.#nearbyObjects.findIndex(subArray => 
            subArray.some(obj => obj.id === objects[0].id));

        let composites = Matter.Composite.allComposites(this.#mWorld);
        
        if (groupIndex === -1)
        {
            let physObj1 = composites.find(item => item.id === objects[0].id);
            let physObj2 = composites.find(item => item.id === objects[1].id);

            this.#mObjectsTransporter.transportMasterObjectToPhysicalInteractionEnvironment(objects[0]);
            const relativeVelocity = this.#mObjectsTransporter.
                    transportObjectToPhysicalInteractionEnvironment(objects[0], objects[1]);

            let newItem0 = {
                "abs": objects[0],
                "phys": physObj1,
                "relVel": {x: 0, y: 0}
            }

            let newItem1 = {
                "abs": objects[1],
                "phys": physObj2,
                "relVel": relativeVelocity //! поки не використовується
            }

            this.#nearbyObjects.push([newItem0, newItem1]);
        }
        else
        {
            let physObj = composites.find(item => item.id === objects[1].id);
            
            const relativeVelocity = this.#mObjectsTransporter.
                    transportObjectToPhysicalInteractionEnvironment(objects[0],objects[1]);

            let newItem = {
                "abs": objects[1],
                "phys": physObj,
                "relVel": relativeVelocity //! поки не використовується
            }

            this.#nearbyObjects[groupIndex].push(newItem);
        }
    }

    objectsDistancing(object)
    {
        const groupIndex = this.#nearbyObjects.findIndex(subArray => 
            subArray.some(obj => obj.abs.id === object.id));

        let position = this.#nearbyObjects[groupIndex].findIndex(item => item.abs.id === object.id);

        console.log(position)

        if (position !== -1)
        {
            this.#nearbyObjects[groupIndex].splice(position, 1);

            this.#mObjectsTransporter.transportObjectToAbstractPhysicalEnvironment(object)

            if (this.#nearbyObjects[groupIndex].length === 0)
            {
                this.#nearbyObjects.splice(groupIndex, 1);
            }
        }
    }
}