// SPACECRAFTS -----
import FALCON9_ST1 from "../configurations/spacescrafts/st1_falcon9_conf.json";

// SPACECRAFTS MONITOR DISPLAY
import FALCON9_ST1_MONITOR from "../configurations/spacescrafts/st1_falcon9_monitor_view_conf.json"

// ABSTRACT SYSTEM INTERFACE
// import FALCON9_ST1_ABS_SYS_INTF from "../configurations/spacescrafts/st1_falcon9_abs_sys_intf_conf.json"

// INITIAL ENVIRONMENTS -----
import TEST_ENVIRONMENT from "../configurations/initial_environments/test_conf.json";

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
    // SPACECRAFRS -----
        FALCON9_ST1:
        {
            spaceCraftData: FALCON9_ST1,
            monitorDisplayData: FALCON9_ST1_MONITOR,
            abstractSystemInterfaceData: null
        },

    // INITIAL ENVIRONMENTS -----
        TEST_ENVIRONMENT: TEST_ENVIRONMENT,
    
    // OTHER -----
        SCALE_DISPLAY_AREA: SCALE_DISPLAY_AREA
};