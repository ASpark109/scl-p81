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

export function build_sat1(physicalModel, abstructModel, visualEffects, signalHub, conf, render)
{
    // *** shared objects ***

    let spaceCraft = new System(); // не забудь розширити System

    let monitorInter = new Map();

    return {spaceCraft, monitorInter};
}