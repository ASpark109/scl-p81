import { SignalSlotDispatcher } from "../mpce/signalslotdispatcher";
import { DockingTree, DockingNode } from "../mpce/dockingtree";
import { UserInteractionInterface } from "./userinteractioninterface";

import Matter from 'matter-js';

export class DockingOperator
{
    #mInteractionWorld = null;
    #mEngine = null;
    #mDockingSpacecrafts = [];

    #mDemp = 0.5; // винести в константи, або конфігурацію
    #mStif = 0.004

    #mode = null;

    constructor (interactionWorld, engine, mode)
    {
        this.#mInteractionWorld = interactionWorld;
        this.#mEngine = engine;
        this.#mode = mode;

        this.initialize();
    }

    initialize()
    {
        Matter.Events.on(this.#mEngine, 'collisionStart', (event) =>
        {
            var pairs = event.pairs;

            for (var i = 0, j = pairs.length; i != j; ++i)
            {
                let pair = pairs[i];

                if (pair.bodyA.dockId == null || pair.bodyB.dockId == null)
                {
                    //console.log("Not valid ids " + pair.bodyA.dockId + " " + pair.bodyB.dockId)
                    return;
                }

                this.doDock(pair.bodyA, pair.bodyB)

                console.log("welcome!")
            }
        });
    }

    doDock(first, second)
    {
        const connection = this.#mDockingSpacecrafts.find(c =>
            (c.scA === first.dockId.parent && c.portA === first.dockId.dock) ||
            (c.scB === second.dockId.parent && c.portB === second.dockId.dock));
        if(connection)
        {
            console.log("Connection already established")
            return;
        }

        let dockConstraint1 = Matter.Constraint.create({
            bodyA: first,
            bodyB: second,

            pointA: {x: 12, y: -10},
            pointB: {x: -12, y: -10},

            length: 0,

            stiffness: this.#mStif,
            damping: this.#mDemp
        });

        let dockConstraint2 = Matter.Constraint.create({
            bodyA: first,
            bodyB: second,

            pointA: {x: 12, y: 10},
            pointB: {x: -12, y: 10},

            length: 0,

            stiffness: this.#mStif,
            damping: this.#mDemp
        });

        console.log("dock!");

        const newConnection = {
            scA: first.dockId.parent,
            scB: second.dockId.parent,

            portA: first.dockId.dock,
            portB: second.dockId.dock,

            connectionId1: dockConstraint1.id,
            connectionId2: dockConstraint2.id,
        };
        
        this.#mDockingSpacecrafts.push(newConnection);
        Matter.Composite.add(this.#mInteractionWorld, [dockConstraint1, dockConstraint2]);

        //console.log(this.#mDockingSpacecrafts)

        SignalSlotDispatcher.emit("updateNearbyObjects", null);

        setTimeout(() => {
            dockConstraint1.stiffness = 1;
            dockConstraint2.stiffness = 1;

            const iframe1 = UserInteractionInterface.getIframeWithId(first.dockId.parent, this.#mode);
            const iframe2 = UserInteractionInterface.getIframeWithId(second.dockId.parent, this.#mode);
            
            const eventName = "docking"

            iframe1.current?.contentWindow.postMessage(
            { type: "eventMessage", eventName, data: {portId: first.dockId.dock}},
            "*");
            iframe2.current?.contentWindow.postMessage(
            { type: "eventMessage", eventName, data: {portId: first.dockId.dock}},
            "*");

        }, 3000)
    }

    doUndock(spaceCraftId, portId)
    {
        //console.log("sc -> " + spaceCraftId + "\nport -> " + portId);
        
        const connection = this.#mDockingSpacecrafts.find(c =>
            (c.scA === spaceCraftId && c.portA === portId) ||
            (c.scB === spaceCraftId && c.portB === portId)
        );

        if (connection === undefined)
        {
            console.log("Connection not found: " + spaceCraftId + ", " + portId);
            return;
        }

        const connection1 = this.#mInteractionWorld.constraints.find(constraint => constraint.id === connection.connectionId1);
        const connection2 = this.#mInteractionWorld.constraints.find(constraint => constraint.id === connection.connectionId2);

        let departure = Matter.Constraint.create({
            bodyA: connection1.bodyA,
            bodyB: connection1.bodyB,

            pointA: {x: 0, y: 0},
            pointB: {x: 0, y: 0},

            length: 80,

            stiffness: 0.0005,
            damping: 0.8
        });

        Matter.Composite.remove(this.#mInteractionWorld, [connection1, connection2]);
        Matter.Composite.add(this.#mInteractionWorld, [departure]);

        setTimeout(() => {
            Matter.Composite.remove(this.#mInteractionWorld, [departure]);
        }, 200);

        const index = this.#mDockingSpacecrafts.indexOf(connection);
        this.#mDockingSpacecrafts.splice(index, 1);
    }

    updateMassCenter(idToRemoveFromAbst)
    {
        setTimeout(() => {
            const positions = new Map(
                this.#mInteractionWorld.composites.map(composite => [
                    composite.id, 
                    composite.bodies[0].position
                ])
            );

            DockingTree.updateAllMassCenters(positions);

            SignalSlotDispatcher.emit("objectsDocked" , idToRemoveFromAbst);
        }, 10)
    }
}