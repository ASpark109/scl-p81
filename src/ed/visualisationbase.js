import * as PIXI from 'pixi.js';
import { constants } from "../mpce/constants";

import falcon9fs from '../assets/images/rectangle.png';
import falcon9leg from '../assets/images/falcon9leg.png';
import wall_url from '../assets/images/wall.png';

const DISPLAY_WIDTH = 2000;
const DISPLAY_HEIGHT = 1100;

export class VisualisationBase
{
    constructor()
    {
        this.application = null;
        this.displayedComponents = [];
        this.environmentComponents = [];
        this.sector = [];
        this.test = null;
        this.focusObject = null
    }

    images = 
    {
        falcon9fs: falcon9fs,
        falcon9leg: falcon9leg
    }

    #scale = 1;

    init(container)
    {
        this.application = new PIXI.Application({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            backgroundColor: 0x020D19,
            });

        this.test = new PIXI.Container();
        this.application.stage.addChild(this.test);

        //! scale = 1, 1m = 10px

        this.test.scale.x = 0.3;
        this.test.scale.y = 0.3;

        container.current.appendChild(this.application.view);

        this.application.ticker.stop();
    }

    createRenderingObjects(composites)
    {
        console.log(composites)
        for (const composite of composites)
        {
            for (const body of composite.bodies)
            {
                if(body.imageDev)
                {
                    let rectangle = PIXI.Sprite.from(this.images[body.imageDev]);
                    rectangle.anchor.set(0.5, 0.5);

                    this.displayedComponents.push(rectangle);
                    this.environmentComponents.push(body);
                    this.sector.push(composite.sector);
                    this.test.addChild(rectangle)
                }
            }

        }

        this.focusObject = this.displayedComponents[0];

        this.updateFunction();
    }

    updateFunction()
    {
        if(this.environmentComponents.length === 0)
        {
            return false;
        }
        console.log(this.test.x);
        console.log(this.test.y);
        this.application.ticker.add(() => {
            
            for(let i = 0; i < this.displayedComponents.length; i++)
            {
                this.displayedComponents[i].x = this.environmentComponents[i].position.x + this.sector[i].x * constants.SECTOR_WIDTH / 1;
                this.displayedComponents[i].y = this.environmentComponents[i].position.y + this.sector[i].y * constants.SECTOR_HEIGHT / 1;
                this.displayedComponents[i].rotation = this.environmentComponents[i].angle;
            }

            this.test.x += (DISPLAY_WIDTH/2 - this.focusObject.x * this.test.scale.x - this.test.x) * 0.9;
            this.test.y += (DISPLAY_HEIGHT/2 - this.focusObject.y * this.test.scale.y - this.test.y) * 0.9;
        });
    }

    stop()
    {
        this.application.ticker.stop();
    }

    start()
    {
        this.application.ticker.start();
    }
}