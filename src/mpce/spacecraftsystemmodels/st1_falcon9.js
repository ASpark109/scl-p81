// import { Configurationsfactory } from "./configurationsfactory.js";

import { PneumaticActuator } from "../modules/pneumaticactuator.js";

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
    constructor(landingLegs)
    {
        this.LandingLegs = landingLegs;
    }
}

export function buildSt1_falcon9(physicalmodel, conf)
{
    // *** Landing Legs ***
    
    let actuator1 = physicalmodel.constraints.find(item => item.name === "constraint_Stage_LeftLeg_support");
    let actuator2 = physicalmodel.constraints.find(item => item.name === "constraint_Stage_RightLeg_support");

    let pneumaticActuatorConf = conf.parts.find(item => item.name === "stage").landingLegPneumaticSystem;

    let pneumaticActuator1 = new PneumaticActuator(actuator1, pneumaticActuatorConf);
    let pneumaticActuator2 = new PneumaticActuator(actuator2, pneumaticActuatorConf);

    let leg1 = new Leg(pneumaticActuator1);
    let leg2 = new Leg(pneumaticActuator2);

    let landingLegs = new LandingLegs(leg1, leg2);
    
    // *** Landing Legs ***

    let spaceCraft = new System(landingLegs);

    return spaceCraft
}