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
import { ECLSS } from "../modules/eclss.js";
import { Navigation } from "../modules/navigation.js";
import { Lighting } from "../modules/lighting.js";

class System
{
    constructor(electricalPowerSystem,
                radioCommunication,
                dockingSystem,
                rpo,
                eclss,
                nav,
                lighting)
    {
        this.PowerSupplySystem = electricalPowerSystem;
        this.RadioCommunication = radioCommunication;
        this.DockingSystem = dockingSystem;
        this.RPO = rpo;
        this.ECLSS = eclss;
        this.Navigation = nav;
        this.LightingSystem = lighting;
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

export function build_unity_module(physicalModel, abstructModel, visualEffects, signalHub, conf, render)
{
    // *** shared objects ***
    let rocketBody = physicalModel.bodies.find(item => item.name === "stage");

    // *** Radio Communication ***
        
    let radioConf = conf.parts.find(item => item.name === "stage").radioCommunication;

    let t = new Transmitter(radioConf.transmitter.maxCarrierFrequency,
                            radioConf.transmitter.minCarrierFrequency,
                            radioConf.transmitter.maxBitRate,
                            radioConf.transmitter.minBitRate,
                            radioConf.transmitter.maxPower,
                            radioConf.transmitter.maxPower,
                            abstructModel);
    let r = new Receiver(radioConf.receiver.maxCarrierFrequency,
                         radioConf.receiver.minCarrierFrequency,
                         radioConf.receiver.maxPower,
                         radioConf.receiver.minPower,
                         abstructModel);
                         
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

    // *** ECLSS ***

    let eclss = new ECLSS();
    
    // *** ECLSS ***

    // *** Navigation ***

    let nav = new Navigation(abstructModel, rocketBody);

    // *** Navigation ***
    
    // *** Lighting ***

    let lighting = new Lighting(visualEffects);

    // *** Lighting ***

    let spaceCraft = new System(electricalPowerSystem,
                                rc,
                                dockingSystem,
                                rpo,
                                eclss,
                                nav,
                                lighting); // не забудь розширити System

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
    monitorInter.set("dockInfo", () => {
        const ds = spaceCraft.DockingSystem.Ports;
        const result = ds.map(obj => obj.info());
        return result;
    });

    return {spaceCraft, monitorInter};
}