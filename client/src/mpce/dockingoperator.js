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
    #mStif = 0.001

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
        const collisionEventHandler = (event) => {
            var pairs = event.pairs;

            for (var i = 0, j = pairs.length; i != j; ++i)
            {
                let pair = pairs[i];

                if (pair.bodyA.dockId == null || pair.bodyB.dockId == null)
                {
                    continue;
                }

                this.doDock(pair.bodyA, pair.bodyB)

                console.log("welcome!")
            }
        }

        Matter.Events.on(this.#mEngine, 'collisionStart', collisionEventHandler);
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

        let localPoint1_1;
        let localPoint2_1;

        console.log(first.id + " " + second.id)
        console.log(first.docDir + " " + second.docDir)

        switch (first.docDir)
        {
        case "up":
            localPoint1_1 = {x:-10, y:-6}
            localPoint2_1 = {x:10, y:-6}
            break;
        case "right":
            localPoint1_1 = {x:6, y:-10}
            localPoint2_1 = {x:6, y:10}
            break;
        case "down":
            localPoint1_1 = {x:-10, y:6}
            localPoint2_1 = {x:10, y:6}
            break;
        case "left":
            localPoint1_1 = {x:-6, y:-10}
            localPoint2_1 = {x:-6, y:10}
            break;
        }

        let localPoint1_2;
        let localPoint2_2;

        switch (second.docDir)
        {
        case "up":
            localPoint1_2 = {x:-10, y:-6}
            localPoint2_2 = {x:10, y:-6}
            break;
        case "right":
            localPoint1_2 = {x:6, y:-10}
            localPoint2_2 = {x:6, y:10}
            break;
        case "down":
            localPoint1_2 = {x:-10, y:6}
            localPoint2_2 = {x:10, y:6}
            break;
        case "left":
            localPoint1_2 = {x:-6, y:-10}
            localPoint2_2 = {x:-6, y:10}
            break;
        }

        const cos1 = Math.cos(first.angle);
        const sin1 = Math.sin(first.angle);

        const cos2 = Math.cos(second.angle);
        const sin2 = Math.sin(second.angle);

        const worldPoint1 = {
            x1:  (localPoint1_1.x * cos1 - localPoint1_1.y * sin1),
            y1:  (localPoint1_1.x * sin1 + localPoint1_1.y * cos1),
            x2: (localPoint2_1.x * cos1 - localPoint2_1.y * sin1),
            y2:  (localPoint2_1.x * sin1 + localPoint2_1.y * cos1)
        };

        const worldPoint2 = {
            x1: (localPoint1_2.x * cos2 - localPoint1_2.y * sin2),
            y1:  (localPoint1_2.x * sin2 + localPoint1_2.y * cos2),
            x2:  (localPoint2_2.x * cos2 - localPoint2_2.y * sin2),
            y2:  (localPoint2_2.x * sin2 + localPoint2_2.y * cos2)
        };

        let pair1 = {
            A: {x: worldPoint1.x1, y: worldPoint1.y1},
            B: {x: worldPoint2.x1, y: worldPoint2.y1}
        }

        let pair2 = {
            A: {x: worldPoint1.x2, y: worldPoint1.y2},
            B: {x: worldPoint2.x2, y: worldPoint2.y2}
        }

        if (Math.hypot(worldPoint1.x1 - worldPoint2.x1, worldPoint1.y1 - worldPoint2.y1) < Math.hypot(worldPoint1.x1 - worldPoint2.x2, worldPoint1.y1 - worldPoint2.y2))
        {
            //console.log("OK")
        }
        else
        {
            let temp
            temp = pair1.B
            pair1.B = pair2.B
            pair2.B = temp
        }

        let dockConstraint1 = Matter.Constraint.create({
            bodyA: first,
            bodyB: second,

            pointA: pair1.A,
            pointB: pair1.B,

            length: 0,

            stiffness: this.#mStif,
            damping: this.#mDemp
        });

        let dockConstraint2 = Matter.Constraint.create({
            bodyA: first,
            bodyB: second,


            pointA: pair2.A,
            pointB: pair2.B,

            length: 0,

            stiffness: this.#mStif,
            damping: this.#mDemp
        });

        const newConnection = {
            scA: first.dockId.parent,
            scB: second.dockId.parent,

            portA: first.dockId.dock,
            portB: second.dockId.dock,

            connectionId1: dockConstraint1.id,
            connectionId2: dockConstraint2.id,
        };
        
        this.#mDockingSpacecrafts.push(newConnection);
        Matter.Composite.add(this.#mInteractionWorld, [dockConstraint1, dockConstraint2]); // це треба додават до конкретного композиту космічного апарату

        SignalSlotDispatcher.emit("updateNearbyObjects", null);

        console.log("dock!");

        setTimeout(() => {
            this.dockingFinalizing(dockConstraint1, dockConstraint2)

            const iframe1 = UserInteractionInterface.getIframeWithId(first.dockId.parent, this.#mode);
            const iframe2 = UserInteractionInterface.getIframeWithId(second.dockId.parent, this.#mode);

            const displayName1 = UserInteractionInterface.getSpacecraftDisplayName(first.dockId.parent, this.#mode);
            const displayName2 = UserInteractionInterface.getSpacecraftDisplayName(second.dockId.parent, this.#mode);
            
            const eventName = "docking";

            iframe1.current?.contentWindow.postMessage(
            { type: "eventMessage", eventName, data: {portId: first.dockId.dock, spacecraftName: displayName2}},
            "*");
            iframe2.current?.contentWindow.postMessage(
            { type: "eventMessage", eventName, data: {portId: second.dockId.dock, spacecraftName: displayName1}},
            "*");

        }, 4000)
    }

    dockingFinalizing(dockConstraint1, dockConstraint2)
    {
        dockConstraint1.damping = 1;
        dockConstraint2.damping = 1;

        dockConstraint1.stiffness = 0.05;
        dockConstraint2.stiffness = 0.05;

        // let counter = 0;
        // let stif = 0;

        // const i = setInterval(() => {
            
        //     stif += 0.05

        //     dockConstraint1.stiffness = stif;
        //     dockConstraint2.stiffness = stif;

        //     counter += 1;
        //     if (stif >= 0.6)
        //     {
        //         dockConstraint1.damping = 1;
        //         dockConstraint2.damping = 1;
        //         clearInterval(i);
        //     }
        // }, 200)
    } 

    doUndock(spaceCraftId, portId)
    {
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

        Matter.Composite.remove(this.#mInteractionWorld, [connection1, connection2]);
    
        // Here we are trying to determine which spacecraft needs to be notified
        // that the spacecraft it was docked to has initiated undocking
        const sc = connection.scA === spaceCraftId ? {p: connection.scB, d: connection.portB} : {p: connection.scA, d: connection.portA};

        const iframe = UserInteractionInterface.getIframeWithId(sc.p, this.#mode);
        const eventName = "requestSeparation"
        iframe.current?.contentWindow.postMessage(
        { type: "eventMessage", eventName, data: {portId: sc.d}},
        "*");

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