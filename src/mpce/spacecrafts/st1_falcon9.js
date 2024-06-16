import { RadioCommunicationSystem } from "../subsystems/radiocommunicationsystem"
import { MainControlUnit } from "../subsystems/maincontrolunit";
import { constants } from "../constants";

var Matter = require('matter-js');

let Bodies = Matter.Bodies
let Body = Matter.Body;

export class st1_falcon9{
    constructor(id, communicationOperator, globalCoordinates){
        this.id = id;
        this.communicationOperator = communicationOperator;
        this.globalCoordinates = globalCoordinates;
        this.sectorCoordinates = {x: null, y: null};
        this.collisionGroup = null;

        this.subsystemsinitialisation();
    }

    subsystemsinitialisation()
    {
        
        this.MainControlUnit = new MainControlUnit(this.id, this.globalCoordinates);
        this.RadioCommunicationModule = new RadioCommunicationSystem(this.MainControlUnit, 
                                                        this.communicationOperator);
    }

    build()
    {
        this.sectorCoordinates.x = this.globalCoordinates.x - (Math.floor(this.globalCoordinates.x / constants.SECTOR_WIDTH) * constants.SECTOR_WIDTH);
        this.sectorCoordinates.y = this.globalCoordinates.y - (Math.floor(this.globalCoordinates.y / constants.SECTOR_HEIGHT) * constants.SECTOR_HEIGHT);

        this.collisionGroup = (Math.floor(this.globalCoordinates.x / constants.SECTOR_WIDTH).toString(16) << 8) | 
                               Math.floor(this.globalCoordinates.y / constants.SECTOR_HEIGHT).toString(16);

        this.serviceModul = Bodies.rectangle(   this.sectorCoordinates.x,
                                                this.sectorCoordinates.y,
                                                50,
                                                100,
                                                {
                                                    width: 50,
                                                    height: 100,
                                                    label: "falcon",
                                                    collisionFilter: 
                                                    {
                                                        category: 1//this.collisionGroup
                                                    }
                                                });

        Body.setAngle(this.serviceModul, 47 * Math.PI / 180)
        

        return this.serviceModul;
    }
}