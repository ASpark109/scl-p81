// SPACECRAFTS -----
import FALCON9_ST1 from "../configurations/spacescrafts/st1_falcon9_conf.json";
import SAT1 from "../configurations/spacescrafts/sat1_conf.json";

// SPACECRAFTS MONITOR DISPLAY
import FALCON9_ST1_MONITOR from "../configurations/spacescrafts/st1_falcon9_monitor_view_conf.json";
import SAT1_MONITOR from "../configurations/spacescrafts/sat1_monitor_view_conf.json";

// SPACECRAFTS VISUAL EFFECTS
import FALCON9_ST1_VISUAL from "../configurations/spacescrafts/st1_falcon9_visual_effects_conf.json";
import SAT1_VISUAL from "../configurations/spacescrafts/sat1_visual_effects_conf.json";

// INITIAL ENVIRONMENTS -----
import TEST_ENVIRONMENT from "../configurations/initial_environments/test_conf.json";
import TEST_ENVIRONMENT1 from "../configurations/initial_environments/test_conf1.json";

// OTHER -----
import SCALE_DISPLAY_AREA from "../configurations/scale_display_area_conf.json";

export class Configurationsfactory
{   
    static getConfiguration(conf, type = null)
    {


        if (configurations.hasOwnProperty(conf))
        {
            if (type !== null)
            {
                return configurations[conf][type];
            }
            else
                return configurations[conf];
        }   
        else
        {
            console.log("Конфігурації не існує " + conf);
        }

        return null;
    }

    static addGeneratedAbsConfiguration(name, conf)
    {
        if (configurations[name].abstractSystemInterfaceData === null)
            configurations[name].abstractSystemInterfaceData = conf; 
    }
}

let configurations =
{
    // *** SPACECRAFRS ***
        FALCON9_ST1:
        {
            spaceCraftData: FALCON9_ST1,
            monitorDisplayData: FALCON9_ST1_MONITOR,
            visualEffects: FALCON9_ST1_VISUAL,
            abstractSystemInterfaceData: null
        },

        SAT1:
        {
            spaceCraftData: SAT1,
            monitorDisplayData: SAT1_MONITOR,
            visualEffects: SAT1_VISUAL,
            abstractSystemInterfaceData: null
        },

    // *** GROUND COMMUNICATION SYSTEM
        GCS:
        {
            // spaceCraftData: FALCON9_ST1,
            // monitorDisplayData: FALCON9_ST1_MONITOR,
            // visualEffects: FALCON9_ST1_VISUAL,
            abstractSystemInterfaceData: null
        },

    // *** INITIAL ENVIRONMENTS ***
        TEST_ENVIRONMENT: TEST_ENVIRONMENT,
        TEST_ENVIRONMENT1: TEST_ENVIRONMENT1,
    
    // *** OTHER ***
        SCALE_DISPLAY_AREA: SCALE_DISPLAY_AREA
};