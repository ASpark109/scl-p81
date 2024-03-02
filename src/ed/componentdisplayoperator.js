import { Composite } from "matter-js";
import {a} from "../mpce/environmentbase"
import { EnvironmentBase } from "../mpce/environmentbase"
import image_url from '../assets/images/rectangle.png';
import wall_url from '../assets/images/wall.png';
import * as PIXI from 'pixi.js';

export class ComponentDisplayOperator
{
    constructor()
    {
        this.app = null;
        this.displayedComponents = []
        this.environmentModels = []
    }

    init(container)
    {
        this.testEnv = new EnvironmentBase();
        this.testEnv.init();

        this.app = new PIXI.Application({
            width: 2000,
            height: 1100,
            backgroundColor: 0x020D19,
            });
        
        container.current.appendChild(this.app.view);
        this.environmentModels = Composite.allBodies(this.testEnv.world);

        console.log("Wow")

        this.createRenderingModel(this.environmentModels)
    }

    run()
    {
        this.app.ticker.add(() => {
            
            for(let i = 0; i < this.displayedComponents.length; i++)
            {
                this.displayedComponents[i].x = this.environmentModels[i].position.x;
                this.displayedComponents[i].y = this.environmentModels[i].position.y;
                this.displayedComponents[i].rotation = this.environmentModels[i].angle;
            }
        });
    }

    createRenderingModel(objects)
    {
        for(let item of objects)
        {
            switch (item.label)
            {
            case "falcon":
                let rectangle = PIXI.Sprite.from(image_url);
                rectangle.anchor.set(0.5, 0.5);

                this.displayedComponents.push(rectangle);
                this.app.stage.addChild(rectangle)
                
                break;

            case "wall":
                let wall = PIXI.Sprite.from(wall_url);
                wall.anchor.set(0.5, 0.5);

                this.displayedComponents.push(wall);
                this.app.stage.addChild(wall)
                
                break;
            }
        }

    }
}