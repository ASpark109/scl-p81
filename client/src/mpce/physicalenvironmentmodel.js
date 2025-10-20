import { Configurationsfactory } from "./configurationsfactory.js";
import { constants } from "./constants.js";
import { DockingOperator } from "./dockingoperator.js";
import { DockingTree } from "../mpce/dockingtree";
import { ModuleBase } from "./modules/modulebase.js";
import { PhysicalEnvironmentsTransporter } from "./physicalenvironmentstransporter.js";
import { SpaceCraftBuilder } from "./spacecraftbuilder.js"

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

    testRotate = 0;

    constuctor(configuration)
    {
        if (configuration != null)
        {
            this.#mConfiguration = configuration;
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

            // console.log("h")
            // const now = new Date();
            // this.deltaTime = now - this.lastTime; // різниця в мс
            // this.lastTime = now; // оновлюємо час

            // console.log(this.deltaTime)

            // const timing = event.source.timing; // або this.#mEngine.timing
            // const delta = timing.lastDelta / 1000; // останній крок у секундах
            // const fps = 1 / delta;
            // console.log("FPS:", fps.toFixed(1));
            
        })


        this.render = Matter.Render.create({
            element: container.current,
            engine: this.#mEngine,
            options: {
                width: 2000, // Adjust width
                height: 800, // Adjust height
                wireframes: true, // Disable wireframe to use full rendering
            }
        });

        //Matter.Render.run(render)


        // setInterval(() => {
        //     this.testRotate += 1;
        //     if (this.testRotate === 3)
        //         this.testRotate = 0;

        //     console.log(this.testRotate)
        // }, 2000)


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

        this.renderPhys = Matter.Render.create({
            element: containerPhys.current,
            engine: this.#mEngineInter,
            options: {
                width: 2000, // Adjust width
                height: 800, // Adjust height
                wireframes: false, // Disable wireframe to use full rendering
            }
        });

        Matter.Render.run(this.renderPhys)

        // Matter.Events.on(render, "afterRender", () => {
        //     let ctx = render.context;

        //     let thetaV = -7.594;
        //     let blockPositionVector = 151.327;
        //     let body = this.#mWorld.composites[1].bodies.find(item => item.name === "stage");

        //     let angle = ((90 - body.angle * 180 / Math.PI) - thetaV);
        //     let forceAngle = -body.angle * 180 / Math.PI + 90 + 180//(90 - (body.angle * 180 / Math.PI) - 90);

        //     if (this.testRotate === 1)
        //         forceAngle += 180

        //     let forceX = body.position.x + Math.cos(angle * Math.PI / 180) * blockPositionVector;
        //     let forceY = body.position.y - Math.sin(angle * Math.PI / 180) * blockPositionVector;

        //     let forceVX = forceX + Math.cos(forceAngle * Math.PI / 180) * 50;
        //     let forceVY = forceY - Math.sin(forceAngle * Math.PI / 180) * 50;
            
        //     ctx.beginPath();
        //     ctx.arc(forceX,
        //             forceY, 3, 0, 2 * Math.PI);
        //     ctx.fillStyle = "green";
        //     ctx.fill();

        //     if (this.testRotate !== 0)
        //     {
        //         ctx.beginPath();
        //         ctx.moveTo(forceX,
        //                 forceY);
        //         ctx.lineTo(forceVX,
        //                 forceVY);
        //         ctx.strokeStyle = "blue";
        //         ctx.lineWidth = 2;
        //         ctx.stroke();
                
        //         Matter.Body.applyForce(body, {x: forceX, 
        //                                     y: forceY},
        //                                     {x:  Math.cos(forceAngle * Math.PI / 180) * 0.001,
        //                                     y: -Math.sin(forceAngle * Math.PI / 180) * 0.001});
        //     }
        // });

        let mouse = Mouse.create(this.renderPhys.canvas)
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
        const timestep = 1000 / 60; // 16.666... мс = 60 FPS

        this.stop(); // якщо вже був запущений

        setInterval(() => {
            Matter.Engine.update(this.#mEngine, timestep);
        }, timestep);

        //Runner.run(this.#mRunner, this.#mEngine); // стара версія
    }

    stop()
    {
        Runner.stop(this.#mRunner, this.#mEngine);
    }

    reset()
    {
        Matter.Render.stop(this.renderPhys);
        Matter.Render.stop(this.render);

        if (this.renderPhys.canvas && this.renderPhys.canvas.parentNode) {
            this.renderPhys.canvas.parentNode.removeChild(this.renderPhys.canvas);
        }

        this.renderPhys.canvas = null;
        this.renderPhys.context = null;


        if (this.render.canvas && this.render.canvas.parentNode) {
            this.render.canvas.parentNode.removeChild(this.render.canvas);
        }

        if (this.#mRunnerInter) Runner.stop(this.#mRunnerInter);
        if (this.#mRunner) Runner.stop(this.#mRunner);

        Events.off(this.#mEngine, "afterUpdate")
        Events.off(this.#mEngineInter, "afterUpdate")
    }

    addObject(item)
    {
        //Тимчасово, зараз створюються тільки космічні апарати, космічні обєкти ігноруються
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

            DockingTree.addNode(spacecraft.id, null, spacecraft.id === 1 ? 1 : 1); // weight поки 1, потім змінити

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

            // тут треба підтягувати всі ініші апарати, якщо вони стиковані
            
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
        // Тут теж потрібно враховувати стикування апаратів
        
        const groupIndex = this.#nearbyObjects.findIndex(subArray => 
            subArray.some(obj => obj.abs.id === object.id));

        let position = this.#nearbyObjects[groupIndex].findIndex(item => item.abs.id === object.id);

        let ch = DockingTree.getAllChildIds(object.id);
        console.log(ch);

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