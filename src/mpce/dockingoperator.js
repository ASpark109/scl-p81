let Matter = require('matter-js');

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

            console.log("start " + pairs.length)

            for (var i = 0, j = pairs.length; i != j; ++i)
            {
                let pair = pairs[i];

                console.log(pair.bodyA.dockId + " " + pair.bodyB.dockId)

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
            console.log("Colision end");
            var pairs = event.pairs;

            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i];
        
                let p = [pair.bodyA.dockId, pair.bodyB.dockId];
                //console.log(p);
        
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
        
                console.log(this.#mDockingSpacecrafts);   
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



        setTimeout(() => {
            dockConstraint1.stiffness = 0.3;
            dockConstraint2.stiffness = 0.3;
        }, 4000)
    }
}