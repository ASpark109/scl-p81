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
        this.test = null;
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

        this.test.scale.x = 0.6;
        this.test.scale.y = 0.6;

        container.current.appendChild(this.application.view);

        this.test.x = 0
        // container.scale.x = 2;
        // container.scale.y = 2;


        this.application.ticker.stop();
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
                this.test.addChild(rectangle)
                
                break;

            case "wall":
                let wall = PIXI.Sprite.from(wall_url);
                wall.anchor.set(0.5, 0.5);

                this.displayedComponents.push(wall);
                this.test.addChild(wall)
                
                break;
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