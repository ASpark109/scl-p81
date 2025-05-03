// SPACECRAFRS -----
import FALCON9_ST1 from "./configurations/spacescrafts/st1_falcon9_conf.json";

// INITIAL ENVIRONMENTS -----
import TEST_ENVIRONMENT from "./configurations/initial_environments/test_conf.json";

export class Configurationsfactory
{   
    static getConfiguration(conf)
    {
        if (configurations.hasOwnProperty(conf))
        {
            return configurations[conf];
        }
        else
        {
            console.log("Конфігурації не існує " + conf);
        }

        return null;
    }
}

let configurations =
{
    // SPACECRAFRS -----
        FALCON9_ST1: FALCON9_ST1,

    // INITIAL ENVIRONMENTS -----
        TEST_ENVIRONMENT: TEST_ENVIRONMENT

};