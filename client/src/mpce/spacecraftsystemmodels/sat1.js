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
import { TCS } from "../modules/tcs.js";
import { Navigation } from "../modules/navigation.js";

class System
{
    constructor(rcs,
                electricalPowerSystem,
                radioCommunication,
                solarPanels,
                tcs,
                nav)
    {
        this.RCS = rcs;
        this.PowerSupplySystem = electricalPowerSystem;
        this.RadioCommunication = radioCommunication;
        this.SolarPanels = solarPanels;
        this.TCS = tcs;
        this.Navigation = nav;
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

class RadioCommunication
{
    constructor(transmitter, receiver)
    {
        this.Transmitter = transmitter;
        this.Receiver = receiver;
    }
}

export function build_sat1(physicalModel, abstructModel, visualEffects, signalHub, conf, render)
{
    // *** shared objects ***

    // *** RCS System ***

    let rocketBody = physicalModel.bodies.find(item => item.name === "stage");
    let rcsConf = conf.parts.find(item => item.name === "stage").rcs;

    let rcsBlock1 = new RCSBlock(rocketBody, abstructModel, rcsConf.units[0], visualEffects);
    let rcsBlock2 = new RCSBlock(rocketBody, abstructModel, rcsConf.units[1], visualEffects);

    let rcsFuelTank = new Tank(rcsConf.tank, abstructModel, rocketBody);

    let rcs = new RCS(rcsBlock1, rcsBlock2, rcsFuelTank);

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
    let solarPanels = solarPanelsConf.map(conf => new SolarPanel(conf, visualEffects));

    let electricalPowerSystem = new ElectricalPowerSystem([t._electricalDevice,
                                                           r._electricalDevice],
                                                           solarPanels,
                                                           batteries); // consumers, suppliers, batteries

    // *** Electrical Power System ***

    // *** TCS ***

    let tcs = new TCS();

    // *** TCS ***

    // *** Navigation ***

    let nav = new Navigation(abstructModel, rocketBody);

    // *** Navigation ***

    let spaceCraft = new System(rcs,
                                electricalPowerSystem,
                                rc,
                                solarPanels,
                                tcs,
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

    monitorInter.set("tcsInfo", () => spaceCraft.TCS.info());
    monitorInter.set("navInfo", () => spaceCraft.Navigation.info());

    return {spaceCraft, monitorInter};
}