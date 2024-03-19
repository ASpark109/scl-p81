const pxScale = 15927.5;
const G_CONST = 6.67430E-11;
const TIME = 1

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies;
    Body = Matter.Body;
    Events = Matter.Events;
    Vector = Matter.Vector;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 2000,
        height: 1000,
        showVelocity: true
    }
});

Render.run(render);

var runner = Runner.create();
Runner.run(runner, engine);

engine.world.gravity.y = 0;
engine.world.gravity.x = 0;

let earth = Bodies.circle(0, 0, 400, {isStatic: false});
let sat1 = Bodies.circle(1000, 0, 2, { frictionAir: 0,
                                        friction: 0, 
                                        frictionStatic: 0, 
                                        vel: {x:0, y:0}, 
                                        f: {x:0, y:0}, 
                                        ass: {x:0, y:0}});
let sat2 = Bodies.circle(1000, 0, 2, { frictionAir: 0,
                                        friction: 0, 
                                        frictionStatic: 0, 
                                        vel: {x:0, y:0}, 
                                        f: {x:0, y:0}, 
                                        ass: {x:0, y:0}});

let earthM = {
    position: {x: 1000 * pxScale, y: 500 * pxScale},
    f: {x:0, y:0},
    vel: {x:0, y:0},
    ass: {x:0, y:0},
    mass: 5.972E24
};
let sat1M = {
    position: {x: 1000 * pxScale, y: (500 * pxScale) - 6779e3},
    f: {x:0, y:0},
    vel: {x:7660, y:0},
    ass: {x:0, y:0},
    mass: 1
};
let sat2M = {
    position: {x: 1000 * pxScale, y: (500 * pxScale) + 6779e3},
    f: {x:0, y:0},
    vel: {x:-7660, y:0},
    ass: {x:0, y:0},
    mass: 1
};

let spaceB = [earthM];
let satG = [sat1, sat2]
let satsM = [sat1M, sat2M];

Composite.add(world, [earth, sat1, sat2]);
Composite.translate(world, {x: 1000, y: 500});

let t1 = new Date()

let count = 1000
let count1 = 0

Events.on(engine, 'afterUpdate', function(event) {
    applayGravitation();
});

function applayGravitation()
{
    /*
    count += 1;
    if (count > 200)
    {
        let e = Vector.sub(spaceB[0].position, sats[0].position);
        
        let d = new Date();
        console.log(count1 + "," + (Vector.magnitude(e) - 6371000)/1000 + "," + sats[0].vel.x + "," + sats[0].vel.y + "," + d.toTimeString().split(" ")[0]);
        count = 0;
        count1+=1;
    }
    */

    for (let i = 0; i < satsM.length; i++)
    {
      
        state = [satsM[i].position.x, satsM[i].position.y, satsM[i].vel.x, satsM[i].vel.y];

        let newState = rk4Step(state, satsM[i], TIME);

        Body.setPosition(satG[i], {x: newState[0]/pxScale, y: newState[1]/pxScale});

        satsM[i].position = {x: newState[0], y: newState[1]};
        satsM[i].vel = {x: newState[2], y: newState[3]};
    }
}

function rk4Step(s, sat, dt) {
    const k1 = derivatives(s, sat);
    const k2 = derivatives(s.map((v, i) => v + dt / 2 * k1[i]), sat);
    const k3 = derivatives(s.map((v, i) => v + dt / 2 * k2[i]), sat);
    const k4 = derivatives(s.map((v, i) => v + dt * k3[i]), sat);

    return s.map((v, i) => v + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

function derivatives(s, sat) {
    const [x, y, vx, vy] = s;
    const acc = force(sat, spaceB[0], x, y, sat);
    const ax = acc.x;
    const ay = acc.y;

    return [vx, vy, ax, ay];
}

function force(sat, spaceB, x, y)
{
    let v = Vector.sub(spaceB.position, {x: x, y: y});
    let f = G_CONST * sat.mass * spaceB.mass / Math.pow(Vector.magnitude(v), 2);
    v = Vector.mult(Vector.normalise(v), f);

    return Vector.div(v, sat.mass);
}