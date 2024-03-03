import * as PIXI from 'pixi.js';

import image_url from '../assets/images/rectangle.png';
import wall_url from '../assets/images/wall.png';

export class VisualisationBase
{
    constructor()
    {
        this.application = null;
        this.displayedComponents = [];
        this.environmentComponents = [];
    }

    init(container)
    {
        this.application = new PIXI.Application({
            width: 2000,
            height: 1100,
            backgroundColor: 0x020D19,
            });

        container.current.appendChild(this.application.view);
    }

    createRenderingModel(objects)
    {

        this.environmentComponents = objects;

        for(let item of objects)
        {
            switch (item.label)
            {
            case "falcon":
                let rectangle = PIXI.Sprite.from(image_url);
                rectangle.anchor.set(0.5, 0.5);

                this.displayedComponents.push(rectangle);
                this.application.stage.addChild(rectangle)
                
                break;

            case "wall":
                let wall = PIXI.Sprite.from(wall_url);
                wall.anchor.set(0.5, 0.5);

                this.displayedComponents.push(wall);
                this.application.stage.addChild(wall)
                
                break;
            }
        }

    }

    run()
    {
        if(this.environmentComponents.length == 0)
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
}