import { constants } from "./constants.js";

import Matter from 'matter-js';

export class PhysicalEnvironmentsTransporter
{
    #mWorld = null;
    #mWorldInter = null;
    #mRunnerInter = null;
    #mEngineInter = null;
    #mSpaceCraftsLocationGrid = [];
    #mDistanceBetweenObjects = constants.DISTANCE_BETWEEN_OBJECTS;

    constructor (w1, w2, runner, e)
    {
        this.#mWorld = w1;
        this.#mWorldInter = w2;
        this.#mRunnerInter = runner;
        this.#mEngineInter = e;

        for (let i = 0; i < constants.LOCATION_GRID_WIDTH; i++)
        {
            this.#mSpaceCraftsLocationGrid.push([]);
            for (let n = 0; n < constants.LOCATION_GRID_HEIGHT; n++)
            {
                this.#mSpaceCraftsLocationGrid[i].push(-1);
            }
        }
    }

    #nearbyObjectsGroups = [];
    #groupCoordinateOrigin = [];
    #groupCount = 0;

    betweengroups = 2000

    transportMasterObjectToPhysicalInteractionEnvironment(physicalObject)
    {
        let master = physicalObject.bodies.find(item => item.master === true);

        console.log("Master: " + master.displayName)

        if (master.type === "spacecraft")
        {
            let mountPoint = Matter.Composite.allConstraints(this.#mWorld)
                                            .find(item => item.myId === physicalObject.id);

            const mountPointCoord = this.#mSpaceCraftsLocationGrid.findIndex(subArray => 
                    subArray.some(item => item === physicalObject.id));

            let index = this.#mSpaceCraftsLocationGrid[mountPointCoord].indexOf(physicalObject.id)
            if (index !== -1)
            {
                this.#mSpaceCraftsLocationGrid[mountPointCoord][index] = -1;
            }

            Matter.Composite.remove(this.#mWorld, mountPoint);
            Matter.Composite.remove(this.#mWorld, physicalObject);
        }

        let groupOrigin = this.getNewCoordinatesOrigin();
        let relativePosition = {x: 0, y: 0};

        relativePosition.x = -master.position.x + groupOrigin.x + 700
        relativePosition.y = -master.position.y + groupOrigin.y + 600;

        Matter.Composite.translate(physicalObject, relativePosition);

        for (let i = 0; i < physicalObject.bodies.length; i++)
        {
            Matter.Body.setVelocity(physicalObject.bodies[i], {x: 0, y: 0});
        }

        Matter.Composite.add(this.#mWorldInter, physicalObject)
    }

    transportObjectToPhysicalInteractionEnvironment(object0, object)
    {
        let physicalObject = Matter.Composite.allComposites(this.#mWorld)
                                        .find(item => item.id === object.id);

        let mountPoint = Matter.Composite.allConstraints(this.#mWorld)
                .find(item => item.myId === object.id);

        const mountPointCoord = this.#mSpaceCraftsLocationGrid.findIndex(subArray => 
            subArray.some(item => item === object.id));
    
        let index = this.#mSpaceCraftsLocationGrid[mountPointCoord].indexOf(object.id)
        if (index !== -1)
        {
            this.#mSpaceCraftsLocationGrid[mountPointCoord][index] = -1;
        }

        Matter.Composite.remove(this.#mWorld, mountPoint);
        Matter.Composite.remove(this.#mWorld, physicalObject);

        let master = physicalObject.bodies.find(item => item.master === true);

        let relativePosition = {x: 0, y: 0};

        let shift = {x: 0, y: 0};

        if (object0.type === "sb")
        {
            function shorten(v, delta)
            {
                const len = Math.hypot(v.x, v.y);
                const k = (len - delta) / len;

                return {
                    x: v.x * k,
                    y: v.y * k
                };
            }
            let n = shorten({x: object.position.x - object0.position.x,
                y:object.position.y - object0.position.y
            }, 6371000); // radius

            shift.x = n.x;
            shift.y = n.y;
        }
        else
        {
            shift.x = object.position.x - object0.position.x;
            shift.y = object.position.y - object0.position.y;
        }
        
        let refObj = Matter.Composite.allComposites(this.#mWorldInter)
                                        .find(item => item.id === object0.id);
        
        let relMaster = refObj.bodies.find(item => item.master === true);

        let shift1 = {x: 0, y: 0};
        
        shift1.x = relMaster.position.x - master.position.x;
        shift1.y = relMaster.position.y - master.position.y;

        relativePosition.x = (shift1.x + shift.x * 10);
        relativePosition.y = (shift1.y + shift.y * 10);

        let relVel = {x: 0, y: 0};

        relVel.x = (object.velocity.x - object0.velocity.x) * 10 / 60;
        relVel.y = (object.velocity.y - object0.velocity.y) * 10 / 60;

        Matter.Composite.translate(physicalObject, relativePosition);
        for (let i = 0; i < physicalObject.bodies.length; i++)
        {
            Matter.Body.setVelocity(physicalObject.bodies[i], relVel);
        }

        Matter.Composite.add(this.#mWorldInter, physicalObject)

        return {x: relVel.x, y: relVel.y};
    }

    transportObjectToAbstractPhysicalEnvironment(object)
    {
        if (object.type === "sb")
        {
            let physicalObject = Matter.Composite.allComposites(this.#mWorldInter)
                .find(item => item.id === object.id);

            Matter.Composite.remove(this.#mWorldInter, physicalObject);
        }
        else
        {
            let physicalObject = Matter.Composite.allComposites(this.#mWorldInter)
                    .find(item => item.id === object.id);

            let master = physicalObject.bodies.find(item => item.master === true);

            Matter.Composite.remove(this.#mWorldInter, physicalObject);
            Matter.Body.setVelocity(master, {x: 0, y: 0});

            let relativePosition = {x: 0, y: 0}

            let anchor = this.findFreePosition(object.id);

            relativePosition.x = -master.position.x + anchor.x 
            relativePosition.y = -master.position.y + anchor.y

            Matter.Composite.translate(physicalObject, relativePosition);

            //! створити окрему функцію для створення точки кріплення
            const centreOfMassConstraint = Matter.Constraint.create({
                bodyA: master,
                pointA: {x: 0, y: 0},
                pointB: {x: master.position.x, y: master.position.y},
                stiffness: 1,
                myId: object.id
            });

            Matter.Composite.add(this.#mWorld, [physicalObject, centreOfMassConstraint])
        }
    }

    findFreePosition(spaceCraftId)
    {
        for (let h = 0; h < this.#mSpaceCraftsLocationGrid.length; h++)
        {
            for (let w = 0; w < this.#mSpaceCraftsLocationGrid[h].length; w++)
            {
                if (this.#mSpaceCraftsLocationGrid[h][w] === -1)
                {
                    this.#mSpaceCraftsLocationGrid[h][w] = spaceCraftId;

                    return {x: (w * this.#mDistanceBetweenObjects) + 100,
                            y: (h * this.#mDistanceBetweenObjects) + 500};
                }
            }
        }

        //! можливо зупинити двигун
    }

    getNewCoordinatesOrigin()
    {
        const groupOrigin = {x: this.#groupCount * this.betweengroups, y: 0};
        this.#groupCoordinateOrigin.push(groupOrigin);

        //++this.#groupCount;

        return groupOrigin;
    }

}