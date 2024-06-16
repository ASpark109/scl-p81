import { st1_falcon9 } from './spacecrafts/st1_falcon9';

export class SpaceCraftBuilder{

    constructor(){
        this.spaceCrafts = [];
    }

    buildSpaceCrafts(communicationOperator){

        let f1_c = {x: 500, y: 0};
        //let f2_c = {x: 0, y: 1000000000};

        let falcon9_1 = new st1_falcon9(1,communicationOperator, f1_c)
        // let falcon9_2 = new st1_falcon9(2,communicationOperator, f2_c)

        this.spaceCrafts.push(falcon9_1.build());
        // this.spaceCrafts.push(falcon9_2.build());

        return this.spaceCrafts;
    }
}