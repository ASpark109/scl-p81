let Matter = require('matter-js');

export class DockingOperator
{
    #mInteractionWorld = null;
    #mEngine = null;
    #mDockingSpacecrafts = null;

    #mDemp = 0.5; // винести в константи, або конфігурацію
    #mStif = 0.01

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

            console.log("Colision start " + pairs.length);

            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i];
            
                if (pair.bodyA.dockId == null || pair.bodyB.dockId == null)
                {
                    console.log("AAAAAAA");
                    console.log(pair.bodyA.dockId);
                    console.log(pair.bodyB.dockId);
                    return;
                }
        
                let p = [pair.bodyA.dockId, pair.bodyB.dockId];
                console.log(p);
        
                p.sort((a, b) => a - b);
        
                console.log(this.#mDockingSpacecrafts.length)
                console.log("hey")

                let party = this.#mDockingSpacecrafts.find((item) =>
                {
                    return item.objects[0] == p[0] && item.objects[1] == p[1]
                });

                console.log(party)
        
                if (!party)
                {
                    party = {
                        objects: p,
                    
                        leftDock: null,
                        rightDock: null,
        
                        left: false,
                        right: false,
        
                        docked: false
                    };
                    
                    this.#mDockingSpacecrafts.push(party);
                }
        
                if (pair.bodyA.location === "left" && pair.bodyB.location === "right")
                {
                    console.log("LEFT");
                    party.left = true;
                    party.leftDock = [pair.bodyA, pair.bodyB];
                }
                if (pair.bodyA.location === "right" && pair.bodyB.location === "left")
                {
                    console.log("RIGHT");
                    party.right = true;
                    party.rightDock = [pair.bodyA, pair.bodyB];
                }
        
                if (party.left && party.right)
                {
                    console.log("DOCK?")
                    party.docked = true
                    this.doDock(party.leftDock, party.rightDock)
                }
        
                console.log(this.#mDockingSpacecrafts);   
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
        let dockConstraintLeft = Matter.Constraint.create({
            bodyA: left[0],
            bodyB: left[1],
    
            pointA: {x: 0, y: 0},
            pointB: {x: 0, y: 0},
    
            length: 0,
    
            stiffness: this.#mStif,
            damping: this.#mDemp
        });
    
        let dockConstraintRight = Matter.Constraint.create({
            bodyA: right[0],
            bodyB: right[1],
    
            pointA: {x: 0, y: 0},
            pointB: {x: 0, y: 0},
    
            length: 0,
    
            stiffness: this.#mStif,
            damping: this.#mDemp
        });
    
        console.log("dock!");
    
        Matter.Composite.add(this.#mInteractionWorld, [dockConstraintLeft, dockConstraintRight]);
    
        setTimeout(() => {
            //dockConstraintLeft.length = 0;
            //dockConstraintRight.length = 0;
            
            dockConstraintLeft.stiffness = 1;
            dockConstraintRight.stiffness = 1;
        }, 4000)
    }
}