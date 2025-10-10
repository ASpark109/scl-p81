import { PneumaticActuator } from "../modules/pneumaticactuator.js";
import { RCSBlock } from "../modules/rcsblock.js";
import { Tank } from "../modules/tank.js";
import { Engine } from "../modules/engine.js";
import { Pump } from "../modules/pump.js";

class Leg
{
    constructor(pneumaticActuator)
    {
        this.PneumaticBlock = pneumaticActuator;
    }
}

class LandingLegs
{
    constructor(leg1, leg2)
    {
        this.Leg1 = leg1;
        this.Leg2 = leg2;
    }
}

class System
{
    constructor(landingLegs, rcs, engineBlock, fuelSystem)
    {
        this.LandingLegs = landingLegs;
        this.RCS = rcs;
        this.EngineBlock = engineBlock;
        this.FuelSystem = fuelSystem;
    }
}

class RCS
{
    constructor(block1, block2, fuelTank)
    {
        this.Block1 = block1;
        this.Block2 = block2;
        this.FuelTank = fuelTank;
    }
}

class EngineBlock
{
    constructor(engines)
    {
        this.Engine = engines;
    }
}

class TankWrapper
{
    constructor(tank)
    {
        this.FillLevelSensor = tank.FillLevelSensor;
    }
}

class FuelSystem
{
    constructor(tank1, tank2, pump)
    {
        this.Tank1 = new TankWrapper(tank1);
        this.Tank2 = new TankWrapper(tank2);
        this.Pump = pump;

        console.log("READ SENSOR >>> " + this.Tank1.FillLevelSensor.readValue())
    }
}

export function buildSt1_falcon9(physicalModel, abstructModel, conf)
{
    // *** shared objects ***

    // *** Landing Legs ***
    
    let actuator1 = physicalModel.constraints.find(item => item.name === "constraint_Stage_LeftLeg_support");
    let actuator2 = physicalModel.constraints.find(item => item.name === "constraint_Stage_RightLeg_support");

    let pneumaticActuatorConf = conf.parts.find(item => item.name === "stage").landingLegPneumaticSystem;

    let pneumaticActuator1 = new PneumaticActuator(actuator1, pneumaticActuatorConf);
    let pneumaticActuator2 = new PneumaticActuator(actuator2, pneumaticActuatorConf);

    let leg1 = new Leg(pneumaticActuator1);
    let leg2 = new Leg(pneumaticActuator2);

    let landingLegs = new LandingLegs(leg1, leg2);
    
    // *** Landing Legs ***

    // *** RCS System ***

    let rocketBody = physicalModel.bodies.find(item => item.name === "stage");
    let rcsConf = conf.parts.find(item => item.name === "stage").rcs;

    let rcsBlock1 = new RCSBlock(rocketBody, abstructModel, rcsConf.units[0]);
    let rcsBlock2 = new RCSBlock(rocketBody, abstructModel, rcsConf.units[1]);

    let rcsFuelTank = new Tank(rcsConf.tank);

    let rcs = new RCS(rcsBlock1, rcsBlock2, rcsFuelTank);

    // *** RCS System ***

    // *** Engines ***

    let engineConf = conf.parts.find(item => item.name === "stage").engines;

    let engines = Array.from({ length: engineConf.count }, (e, i) => (new Engine(rocketBody, abstructModel, engineConf.parameters, i)));

    let engineBlock = new EngineBlock(engines);

    // *** Engines ***

    // *** Fuel System ***

    let tank1 = new Tank({"maxCapacity": 100, "fuelWeight": 30});
    let tank2 = new Tank({"maxCapacity": 50, "fuelWeight": 10});

    let pump = new Pump(tank1, tank2);

    let fuelSystem = new FuelSystem(tank1, tank2, pump);

    // *** Fuel System ***

    // *** final assembly ***
    let spaceCraft = new System(landingLegs,
                                rcs,
                                engineBlock,
                                fuelSystem); // не забудь розширити System

    return spaceCraft;
}