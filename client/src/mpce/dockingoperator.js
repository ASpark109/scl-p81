import { SignalSlotDispatcher } from "../mpce/signalslotdispatcher";
import { DockingTree, DockingNode } from "../mpce/dockingtree";

import Matter from 'matter-js';

export class DockingOperator
{
    #mInteractionWorld = null;
    #mEngine = null;
    #mDockingSpacecrafts = null;

    #mDemp = 0.5; // винести в константи, або конфігурацію
    #mStif = 0.004

    constructor (interactionWorld, engine)
    {
        this.#mInteractionWorld = interactionWorld;
        this.#mEngine = engine;
        this.#mDockingSpacecrafts = [];

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
                    console.log("Not valid ids " + pair.bodyA.dockId + " " + pair.bodyB.dockId)
                    return;
                }

                let pairId = [pair.bodyA.dockId, pair.bodyB.dockId];
                pairId.sort((a, b) => a - b);

                let isExist = this.#mDockingSpacecrafts.find((item) =>
                {
                    return item[0] == pairId[0] && item[1] == pairId[1]
                });

                if (!isExist)
                {
                    this.#mDockingSpacecrafts.push(pairId);
                    this.doDock(pair.bodyA, pair.bodyB)
                }

                console.log("welcome!")
            }
        });

        Matter.Events.on(this.#mEngine, 'collisionEnd', (event) =>
        {
            var pairs = event.pairs;

            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i];
        
                let p = [pair.bodyA.dockId, pair.bodyB.dockId];
        
                p.sort((a, b) => a - b);
        
                let party = this.#mDockingSpacecrafts.find((item) =>
                {
                    return item.objects[0] == p[0] && item.objects[1] == p[1]
                });
        
                if (pair.bodyA.location === "left" && pair.bodyB.location === "right")
                {
                    party.left = false;
                    party.docked = false;
                }
                if (pair.bodyA.location === "right" && pair.bodyB.location === "left")
                {
                    party.right = false;
                    party.docked = false;
                }
        
                if (!party.left && !party.right)
                {
                    let index = this.#mDockingSpacecrafts.indexOf(party);
        
                    if (index !== -1) {
                        this.#mDockingSpacecrafts.splice(index, 1);
                    }
                }
            }
        });
    }

    doDock(left, right)
    {
        let dockConstraint1 = Matter.Constraint.create({
            bodyA: left,
            bodyB: right,

            pointA: {x: 12, y: -10},
            pointB: {x: -12, y: -10},

            length: 0,

            stiffness: this.#mStif,
            damping: this.#mDemp
        });

        let dockConstraint2 = Matter.Constraint.create({
            bodyA: left,
            bodyB: right,

            pointA: {x: 12, y: 10},
            pointB: {x: -12, y: 10},

            length: 0,

            stiffness: this.#mStif,
            damping: this.#mDemp
        });

        console.log("dock!");

        Matter.Composite.add(this.#mInteractionWorld, [dockConstraint1, dockConstraint2]);

        let physicalObject1 = Matter.Composite.allComposites(this.#mInteractionWorld)
                        .find(item => item.id === left.dockId);
        
        let physicalObject2 = Matter.Composite.allComposites(this.#mInteractionWorld)
                .find(item => item.id === right.dockId);

        Matter.Composite.add(physicalObject1, [dockConstraint1, dockConstraint2]);

        const obj1Childs = DockingTree.getAllChildIds(physicalObject1.id);
        const obj2Childs = DockingTree.getAllChildIds(physicalObject2.id);

        let idToRemoveFromAbst = undefined;

        // в метод переносу потрібно додати перевірку
        if (obj1Childs.length !== 0 && obj2Childs.length === 0)
        {
            //TODO
        }
        else if (obj1Childs.length === 0 && obj2Childs.length !== 0)
        {
            //TODO
        }
        else if (obj1Childs.length === 0 && obj2Childs.length === 0)
        {
            // left moved to right
            DockingTree.moveNode(physicalObject1.id, physicalObject2.id);
            idToRemoveFromAbst = physicalObject1.id
        }
        else
        {
            //TODO
        }

        SignalSlotDispatcher.emit("updateNearbyObjects", null);

        setTimeout(() => {
            dockConstraint1.stiffness = 0.3;
            dockConstraint2.stiffness = 0.3;

            this.updateMassCenter(idToRemoveFromAbst);
        }, 3000)
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