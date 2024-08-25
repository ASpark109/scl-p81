import * as PIXI from 'pixi.js';

import falcon9fs from '../assets/images/rectangle.png';
import falcon9leg from '../assets/images/falcon9leg.png';
import wall_url from '../assets/images/wall.png';

export class VisualisationBase
{
    constructor()
    {
        this.application = null;
        this.displayedComponents = [];
        this.environmentComponents = [];
        this.test = null;
    }

    images = 
    {
        falcon9fs: falcon9fs,
        falcon9leg: falcon9leg
    }

    init(container)
    {
        this.application = new PIXI.Application({
            width: 2000,
            height: 1100,
            backgroundColor: 0x020D19,
            });

        this.test = new PIXI.Container();
        this.application.stage.addChild(this.test);

        // this.test.scale.x = 0.5;
        // this.test.scale.y = 0.5;

        container.current.appendChild(this.application.view);

        this.test.x = 100
        this.test.y = -200
        
        console.log(this.test.width)

        this.application.ticker.stop();
    }

    createRenderingObjects(components)
    {
        for (const item of components)
        {   
            for (const obj of item.bodies)
            {
                if(obj.imageDev)
                {
                    let rectangle = PIXI.Sprite.from(this.images[obj.imageDev]);
                    rectangle.anchor.set(0.5, 0.5);

                    this.displayedComponents.push(rectangle);
                    this.environmentComponents.push(obj);
                    this.test.addChild(rectangle)
                }
            }
        }

        this.updateFunction();
    }

    updateFunction()
    {
        if(this.environmentComponents.length === 0)
        {
            return false;
        }

        this.application.ticker.add(() => {
            
            for(let i = 0; i < this.displayedComponents.length; i++)
            {
                this.displayedComponents[i].x = this.environmentComponents[i].position.x;
                this.displayedComponents[i].y = this.environmentComponents[i].position.y;
                this.displayedComponents[i].rotation = this.environmentComponents[i].angle;
            }
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