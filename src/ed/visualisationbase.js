import * as PIXI from 'pixi.js';
//import { constants } from "../mpce/constants";

import falcon9fs from '../assets/images/rectangle.png';
import falcon9leg from '../assets/images/falcon9leg.png';

import satellite from '../assets/images/satelliteicon.png';
import planet from '../assets/images/planet.png';
import dockingPort from '../assets/images/dockingPort.png';
import { SignalSlotDispatcher } from "../mpce/signalslotdispatcher";

const DISPLAY_WIDTH = 2000;
const DISPLAY_HEIGHT = 1100;

export class VisualisationBase
{
    constructor()
    {
        this.application = null;
        this.components = [];
        this.environmentComponents = [];
        this.sector = [];
        this.test = null;
        this.focusObject = null
        this.prevPos = {x: 0, y: 0}
        this.shiftx = {x: 0, y: 0}
        this.updateFunc = null;
        this.abstructCameraView = false;
        this.metersPerPixelAbstruct = 1/40000;
        this.approachingComponents = [];
    }

    images = 
    {
        falcon9fs: falcon9fs,
        falcon9leg: falcon9leg,
        rocketIcon: satellite,
        planet: planet,
        dockingPort: dockingPort
    }

    #scale = 1;

    trajectory = new PIXI.Container();

    initialize(container)
    {
        this.application = new PIXI.Application({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            backgroundColor: 0x020D19,
            antialias: true
            });

        this.test = new PIXI.Container();
        this.application.stage.addChild(this.test);


        this.application.stage.addChild(this.trajectory);
        //! scale = 1, 1m = 10px

        // 40km / 1px

        //this.test.x += 100;
        //this.test.y += 100;

        container.current.appendChild(this.application.view);

        this.updateFunc = this.updateFunctionPhysical;

        this.updateFunction();

        this.application.ticker.stop();

        let graphics = new PIXI.Graphics();

    }

    addObject(item, composite, abstract)
    {
        if (item.type == "spacecraft")
        {
            let object = []

            for (const body of composite.bodies)
            {
                let rectangle = PIXI.Sprite.from(this.images[body.imageDev]);
                rectangle.anchor.set(0.5, 0.5);

                //! Напевно треба зробити мап
                object.push(rectangle);
            }

            let icon = PIXI.Sprite.from(this.images["rocketIcon"])
            icon.anchor.set(0.5, 0.5);

            let obj = {
                "visual": object,
                "visualAbstruct": icon,
                "physical": composite.bodies,
                "abstract": abstract,
                "mountingPoint": composite.mountingPoint, //На скільки я зараз розумію це поле буде оновлюватися при стиковці/розстиковці апаратів
                "id": composite.id
                //mainObj?
            }

            this.test.addChild(...object);
            this.components.push(obj);

            return obj;
        }
        else if (item.type == "spaceobject")
        {

            // let icon1 = PIXI.Sprite.from(this.images["planet"]);
            // icon1.anchor.set(0.5,0.5);

            // icon1.scale.set(300000)
            const circle = new PIXI.Graphics();
            circle.beginFill(0x011591);
            circle.drawCircle(0, 0, item.Radius * this.metersPerPixelAbstruct);
            circle.endFill();

            circle.pivot.set(0.5, 0.5)

            //circle.scale.set(1/this.#scale)


            let obj = {
                "visual": circle,
                "physical": null,
                "abstract": abstract
            }

            this.test.addChild(circle);
            this.environmentComponents.push(obj);
        }
    }

    updateFunction()
    {
        this.application.ticker.add(() => {
            this.updateFunc();
        });
    }

    updateFunctionPhysical()
    {
        

        //console.log((this.components[0].abstract.position.x - this.components[1].abstract.position.x) + " - " + (this.components[0].abstract.position.y - this.components[1].abstract.position.y));

        //this.shiftx.x += this.components[0].abstract.position.x - this.prevPos.x
        //this.shiftx.y += this.components[0].abstract.position.y - this.prevPos.y

        //this.prevPos.x = this.components[0].abstract.position.x
        //this.prevPos.y = this.components[0].abstract.position.y

        for (let q = 0; q < this.components.length; ++q)
        {
            let item = this.components[q];

            for (let i = 0; i < item.physical.length; ++i)
            {
                item.visual[i].x = item.physical[i].position.x - item.mountingPoint.x + (item.abstract.position.x - this.shiftx.x) * 10// * this.#scale * 10;
                item.visual[i].y = item.physical[i].position.y - item.mountingPoint.y + (item.abstract.position.y - this.shiftx.y) * 10// * this.#scale * 10;
                item.visual[i].rotation = item.physical[i].angle;
            }
        }
        //console.log(this.components[1].visual[0].x + " - V")
        // for (let i = 0; i < this.environmentComponents.length; ++i)
        // {
        //     this.environmentComponents[i].visual.x = (this.environmentComponents[i].abstract.position.x - this.shiftx.x) * 10;
        //     this.environmentComponents[i].visual.y = (this.environmentComponents[i].abstract.position.y - this.shiftx.y) * 10;
        // }

        this.test.x += (DISPLAY_WIDTH/3 - this.components[0].visual[0].x * this.test.scale.x - this.test.x) * 1;
        this.test.y += (DISPLAY_HEIGHT/2 - this.components[0].visual[0].y * this.test.scale.y - this.test.y) * 1;
    }

    updateFunctionAbstruct()
    {
        //console.log(this.components[0].abstract.position.x);
        //console.log((this.components[0].abstract.position.x - this.components[1].abstract.position.x) + " - " + (this.components[0].abstract.position.y - this.components[1].abstract.position.y));
        
        this.shiftx.x += this.components[0].abstract.position.x - this.prevPos.x
        this.shiftx.y += this.components[0].abstract.position.y - this.prevPos.y

        this.prevPos.x = this.components[0].abstract.position.x
        this.prevPos.y = this.components[0].abstract.position.y

        for (let q = 0; q < this.components.length; ++q)
        {
            let item = this.components[q];

                item.visualAbstruct.x = (item.abstract.position.x - this.shiftx.x) * this.metersPerPixelAbstruct
                item.visualAbstruct.y = (item.abstract.position.y - this.shiftx.y) * this.metersPerPixelAbstruct
                item.visualAbstruct.rotation = item.physical[0].angle;
        }

        //this.environmentComponents[0].visual.position.set((0 - this.shiftx.x) * 10,
        //                                                  (0 - this.shiftx.y) * 10);

        for (let i = 0; i < this.environmentComponents.length; ++i)
        {
            this.environmentComponents[i].visual.x = (this.environmentComponents[i].abstract.position.x - this.shiftx.x) * this.metersPerPixelAbstruct;
            this.environmentComponents[i].visual.y = (this.environmentComponents[i].abstract.position.y - this.shiftx.y) * this.metersPerPixelAbstruct;
        }



        //this.test.x += (DISPLAY_WIDTH/2 - 0 * this.test.scale.x - this.test.x) * 0.1;
        //this.test.y += (DISPLAY_HEIGHT/2 - 0 * this.test.scale.y - this.test.y) * 0.1;
    }

    setFocusObject(id)
    {
        let index = this.components.findIndex(item => item.id === id)
        let temp = this.components[index]
        this.components[index] = this.components[0];
        this.components[0] = temp;

        this.prevPos.x = this.components[0].abstract.position.x;
        this.prevPos.y = this.components[0].abstract.position.y;
    }

    setScale(scale)
    {
        //! значення переходу від абстрактного до фізичного рівня потрібно налаштовувати через конфіг
        if (scale <= 9 && !this.abstructCameraView)
        {
            this.abstructCameraView = true;

            for (let item of this.components)
            {
                this.test.removeChild(...item.visual);
                this.test.addChild(item.visualAbstruct);
                this.test.addChild(this.environmentComponents[0].visual);
            }
    
            this.updateFunc = this.updateFunctionAbstruct;
        }
        else if (scale > 9 && this.abstructCameraView)
        {
            this.abstructCameraView = false;

            for (let item of this.components)
            {
                this.test.addChild(...item.visual);
                this.test.removeChild(item.visualAbstruct);
                this.test.removeChild(this.environmentComponents[0].visual);
            }

            this.test.scale.x = 0.05//0.0007;
            this.test.scale.y = 0.05//0.0007;

            this.updateFunc = this.updateFunctionPhysical;
        }

        // if (!this.abstructCameraView)
        // {
        //     if (scale > this.#scale)
        //     {
        //         this.test.scale.x += 0.03;
        //         this.test.scale.y += 0.03;
        //     }
        //     else
        //     {
        //         this.test.scale.x -= 0.03;
        //         this.test.scale.y -= 0.03;
        //     }
        // }

        if (this.abstructCameraView)
        {
            for (let item of this.components)
            {
                item.visualAbstruct.scale.set(1 / scale / 5);
            }

            this.#scale = scale;

            this.test.scale.x = scale;
            this.test.scale.y = scale;
        }

        this.#scale = scale;

        console.log(this.test.scale.x)

        this.test.x += (DISPLAY_WIDTH/2 - this.components[0].visualAbstruct.x * this.test.scale.x - this.test.x);
        this.test.y += (DISPLAY_HEIGHT/2 - this.components[0].visualAbstruct.y * this.test.scale.y - this.test.y);

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

function onKeyDown(event) {
    console.log("HELLO");
}