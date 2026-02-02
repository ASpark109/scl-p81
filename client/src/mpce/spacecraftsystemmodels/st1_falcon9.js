import { PneumaticActuator } from "../modules/pneumaticactuator.js";
import { RCSBlock } from "../modules/rcsblock.js";
import { Tank } from "../modules/tank.js";
import { Engine } from "../modules/engine.js";
import { Pump } from "../modules/pump.js";
import { ElectricalPowerSystem } from "../modules/electricalpowersystem.js";
import { SolarPanel } from "../modules/solarpanel.js";
import { Battery } from "../modules/battery.js";
import { Transmitter } from "../modules/radiocommunication/transmitter.js";
import { Receiver } from "../modules/radiocommunication/receiver.js";
import { DockingPort } from "../modules/dockingport.js";
import { ProximityRadar } from "../modules/rpo/proximityradar.js";
import { LaserRangeFinder } from "../modules/rpo/laserrangefinder.js";
import { EnginesForceSink } from "../modules/enginesforcesink.js";
import { TurboPump } from "../modules/turbopump.js";

class System
{
    constructor(landingLegs,
                rcs,
                engineBlock,
                fuelSystem,
                electricalPowerSystem,
                radioCommunication,
                dockingSystem,
                rpo)
    {
        this.LandingLegs = landingLegs;
        this.RCS = rcs;
        this.EngineBlock = engineBlock;
        this.FuelSystem = fuelSystem;
        this.PowerSupplySystem = electricalPowerSystem;
        this.RadioCommunication = radioCommunication;
        this.DockingSystem = dockingSystem;
        this.RPO = rpo;
    }
}

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
    constructor(tank1, tank2, pump, turboPump)
    {
        this.Tank1 = new TankWrapper(tank1);
        this.Tank2 = new TankWrapper(tank2);
        this.Pump = pump;
        this.TurboPump = turboPump;
    }
}

class RadioCommunication
{
    constructor(transmitter, receiver)
    {
        this.Transmitter = transmitter;
        this.Receiver = receiver;
    }
}

class DockingSystem
{
    constructor(ports)
    {
        this.Ports = ports;
    }
}

class RPO
{
    constructor(proximityRadar, laserRangeFinder)
    {
        this.ProximityRadar = proximityRadar;
        this.LaserRangeFinder = laserRangeFinder;
    }
}

export function buildSt1_falcon9(physicalModel, abstructModel, visualEffects, signalHub, conf)
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

    let rcsBlock1 = new RCSBlock(rocketBody, abstructModel, rcsConf.units[0], visualEffects);
    let rcsBlock2 = new RCSBlock(rocketBody, abstructModel, rcsConf.units[1], visualEffects);

    let rcsFuelTank = new Tank(rcsConf.tank, abstructModel, rocketBody);

    let rcs = new RCS(rcsBlock1, rcsBlock2, rcsFuelTank);

    // *** RCS System ***

    // *** Engines ***

    let engineConf = conf.parts.find(item => item.name === "stage").engines;

    let engineForceSink = new EnginesForceSink(rocketBody, abstructModel, 3);

    let engines = Array.from({ length: engineConf.count }, (e, i) => (new Engine(rocketBody,
                                                                                 abstructModel,
                                                                                 engineConf.parameters,
                                                                                 i,
                                                                                 (id, vec) => {engineForceSink.updatePhysState(id, vec)},
                                                                                 (id, vec) => {engineForceSink.updateAbsState(id, vec)})));

    let engineBlock = new EngineBlock(engines);

    // *** Engines ***

    // *** Fuel System ***

    let tankConf = conf.parts.find(item => item.name === "stage").fuelSystem;
    let tank1 = new Tank(tankConf.fuelTank, abstructModel, rocketBody);
    let tank2 = new Tank(tankConf.oxidiserTank, abstructModel, rocketBody);

    let pump = new Pump(tank1, null);

    let turboPumpConf = conf.parts.find(item => item.name === "stage").turboPump;
    let turboPump = new TurboPump(engines, tank1, tank2, turboPumpConf);

    let fuelSystem = new FuelSystem(tank1, tank2, pump, turboPump);

    // *** Fuel System ***

    // *** Radio Communication ***
    
    let t = new Transmitter(1, 1, 100, 1, 400, 200, abstructModel);
    let r = new Receiver(1, 1, 1, 1, abstructModel);
    let rc = new RadioCommunication(t, r);

    signalHub.registerRadioModule(t);
    signalHub.registerRadioModule(r);

    // *** Radio Communication ***

    // *** Electrical Power System ***

    const batteriesConf = conf.parts.find(item => item.name === "stage").batteries;
    const solarPanelsConf = conf.parts.find(item => item.name === "stage").solarPanels;

    let batteries = batteriesConf.map(b => new Battery(b.capacity, b.maxInput, b.maxOutput));
    let solarPanels = solarPanelsConf.map(sp => new SolarPanel(sp.maxPowerGenerationPerSec));

    let electricalPowerSystem = new ElectricalPowerSystem([pump._electricalDevice,
                                                           tank1.FillLevelSensor._electricalDevice,
                                                           tank2.FillLevelSensor._electricalDevice,
                                                           t._electricalDevice,
                                                           r._electricalDevice],
                                                           solarPanels,
                                                           batteries); // consumers, suppliers, batteries

    // *** Electrical Power System ***

    // *** Docking Ports ***

    let dockingConf = conf.parts.find(item => item.name === "stage").dockingSystem;

    let ports = dockingConf.ports.map(port => new DockingPort(port, physicalModel.requestUndocking, physicalModel.id));

    let dockingSystem = new DockingSystem(ports);

    // *** Docking Ports ***

    // *** Rendezvous and Proximity Operations system ***

    let rpoConf = conf.parts.find(item => item.name === "stage").rpo;

    let proximityRadar = new ProximityRadar(rpoConf.proximityRadar, abstructModel);
    let laserRangeFinder = new LaserRangeFinder(rpoConf.laserRangeFinder, physicalModel);

    let rpo = new RPO(proximityRadar, laserRangeFinder); 

    // *** Rendezvous and Proximity Operations system ***

    // *** final assembly ***
    let spaceCraft = new System(landingLegs,
                                rcs,
                                engineBlock,
                                fuelSystem,
                                electricalPowerSystem,
                                rc,
                                dockingSystem,
                                rpo); // не забудь розширити System

    // *** system monitoring inteface ***

    let monitorInter = new Map();

    monitorInter.set("Leg1PneumPress", () => spaceCraft.LandingLegs.Leg1.PneumaticBlock.pressureTank());
    monitorInter.set("Leg2PneumPress", () => spaceCraft.LandingLegs.Leg2.PneumaticBlock.pressureTank());
    monitorInter.set("Leg1PneumDisp", () => spaceCraft.LandingLegs.Leg1.PneumaticBlock.pistonDisplacement());
    monitorInter.set("Leg2PneumDisp", () => spaceCraft.LandingLegs.Leg2.PneumaticBlock.pistonDisplacement());
    monitorInter.set("Tank1", () => spaceCraft.FuelSystem.Tank1.FillLevelSensor.readValue());
    monitorInter.set("Tank2", () => spaceCraft.FuelSystem.Tank2.FillLevelSensor.readValue());
    monitorInter.set("PSSInfo", () => spaceCraft.PowerSupplySystem.info());
    monitorInter.set("PumpStatus", () => spaceCraft.FuelSystem.Pump.readStatus());

    return {spaceCraft, monitorInter};
}