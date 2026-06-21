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
import { Canadarm } from "../modules/canadarm.js";
import { ECLSS } from "../modules/eclss.js";
import { Navigation } from "../modules/navigation.js";

class System
{
    constructor(
                rcs,
                electricalPowerSystem,
                radioCommunication,
                dockingSystem,
                rpo,
                canadarm,
                eclss,
                nav)
    {
        this.RCS = rcs;
        this.PowerSupplySystem = electricalPowerSystem;
        this.RadioCommunication = radioCommunication;
        this.DockingSystem = dockingSystem;
        this.RPO = rpo;
        this.Canadarm = canadarm;
        this.ECLSS = eclss;
        this.Navigation = nav;
    }
}

class RCS
{
    constructor(block1, block2, block3, block4, fuelTank)
    {
        this.Block1 = block1;
        this.Block2 = block2;
        this.Block3 = block3;
        this.Block4 = block4;
        this.FuelTank = fuelTank;
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

export function build_harmony_module(physicalModel, abstructModel, visualEffects, signalHub, conf, render)
{
    // *** shared objects ***

    // *** RCS System ***

    let rocketBody = physicalModel.bodies.find(item => item.name === "stage");
    let rcsConf = conf.parts.find(item => item.name === "stage").rcs;

    let rcsBlock1 = new RCSBlock(rocketBody, abstructModel, rcsConf.units[0], visualEffects);
    let rcsBlock2 = new RCSBlock(rocketBody, abstructModel, rcsConf.units[1], visualEffects);
    let rcsBlock3 = new RCSBlock(rocketBody, abstructModel, rcsConf.units[2], visualEffects);
    let rcsBlock4 = new RCSBlock(rocketBody, abstructModel, rcsConf.units[3], visualEffects);

    let rcsFuelTank = new Tank(rcsConf.tank, abstructModel, rocketBody);

    let rcs = new RCS(rcsBlock1, rcsBlock2, rcsBlock3, rcsBlock4, rcsFuelTank);

    // *** RCS System ***

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
    let solarPanels = solarPanelsConf.map(sp => new SolarPanel(sp, visualEffects));

    let electricalPowerSystem = new ElectricalPowerSystem([t._electricalDevice,
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

    // *** Canadarm ***

    let canadarm = new Canadarm(physicalModel)

    // *** Canadarm ***

    // *** ECLSS ***

    let eclss = new ECLSS(visualEffects);
    
    // *** ECLSS ***

    // *** Navigation ***

    let nav = new Navigation(abstructModel, rocketBody);

    // *** Navigation ***

    // *** final assembly ***
    let spaceCraft = new System(rcs,
                                electricalPowerSystem,
                                rc,
                                dockingSystem,
                                rpo,
                                canadarm,
                                eclss,
                                nav); // не забудь розширити System

    let monitorInter = new Map();

    monitorInter.set("PSSInfo", () => spaceCraft.PowerSupplySystem.info());
    monitorInter.set("radioCommunicationStatus", () => {
        return {
            transmitter: spaceCraft.RadioCommunication.Transmitter.status(),
            receiver: spaceCraft.RadioCommunication.Receiver.status()
        }
    });
    monitorInter.set("proximityRadar", () => {
        return {
           proximityRadar: spaceCraft.RPO.ProximityRadar.scan(),
           laserRangeFinder: spaceCraft.RPO.LaserRangeFinder.scan(),
           angle: physicalModel.angle
        }
    });
    monitorInter.set("ECLSSInfo", () => spaceCraft.ECLSS.info());
    monitorInter.set("navInfo", () => spaceCraft.Navigation.info());
    monitorInter.set("canadarmInfo", () => spaceCraft.Canadarm.info());
    monitorInter.set("dockInfo", () => {
        const ds = spaceCraft.DockingSystem.Ports;
        const result = ds.map(obj => obj.info());
        return result;
    });

    return {spaceCraft, monitorInter};
}