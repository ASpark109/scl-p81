import { Configurationsfactory } from "./configurationsfactory.js";

import { PneumaticActuator } from "./modules/pneumaticactuator";
import { UserInteractionInterface } from "./userinteractioninterface.js"

const templates = 
{
    "Falcon9":
    {
        "System":
        {
            "LandingLegs":
            {
                "Leg1":
                {
                    "PneumaticBlock":
                    {
                        // setValveState()
                        // {
                        // },

                        // readPressure()
                        // {
                        // },

                        // readPistonDisplacement()
                        // {
                        // }
                    }
                },
                "Leg2":
                {
                    "PneumaticBlock":
                    {
                        // setValveState()
                        // {
                        // },

                        // readPressure()
                        // {
                        // },

                        // readPistonDisplacement()
                        // {
                        // }
                    }
                }
            }
        }
    }
}

export class SystemControllModel
{
    #spacecrafts = []
    //#interface = userInteractionInterface;

    constructor()
    {

    }

    initializa()
    {

    }

    update()
    {

    }

    addObject(physicalmodel, configuration)
    {
        if (configuration.type == "spaceobject")
        {
            return null;
        }

        let spacecraftName = configuration.Name;

        let conf = Configurationsfactory.getConfiguration(spacecraftName);

        // Цей код повинен бути автозгенерованим (в ідеалі)
        switch(spacecraftName)
        {
        case "FALCON9_ST1":
            let actuator1 = physicalmodel.constraints.find(item => item.name === "constraint_Stage_LeftLeg_support");
            let actuator2 = physicalmodel.constraints.find(item => item.name === "constraint_Stage_RightLeg_support");
            
            let pneumaticActuatorConf = conf.parts.find(item => item.name === "stage").landingLegPneumaticSystem;

            let pneumaticActuator1 = new PneumaticActuator(actuator1, pneumaticActuatorConf);
            let pneumaticActuator2 = new PneumaticActuator(actuator2, pneumaticActuatorConf);

            let controlModel = JSON.parse(JSON.stringify(templates["Falcon9"]));

            controlModel.System.LandingLegs.Leg1.PneumaticBlock.setValveState = function(isOpen) {
                pneumaticActuator1.setValveState(isOpen);
            };
            controlModel.System.LandingLegs.Leg1.PneumaticBlock.readPressure = function() {
                return pneumaticActuator1.pressureTank();
            };
            controlModel.System.LandingLegs.Leg1.PneumaticBlock.readPistonDisplacement = function() {
                pneumaticActuator1.pistonDisplacement();
            }

            controlModel.System.LandingLegs.Leg2.PneumaticBlock.setValveState = function(isOpen) {
                pneumaticActuator2.setValveState(isOpen);
            };
            controlModel.System.LandingLegs.Leg2.PneumaticBlock.readPressure = function() {
                pneumaticActuator2.pressureTank();
            };
            controlModel.System.LandingLegs.Leg2.PneumaticBlock.readPistonDisplacement = function() {
                pneumaticActuator2.pistonDisplacement();
            }

            this.#spacecrafts.push(controlModel);
            UserInteractionInterface.addSpacecraft(controlModel);


            break;
        default:
            break;
        }
    }
}