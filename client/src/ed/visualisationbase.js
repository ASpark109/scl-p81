import * as PIXI from 'pixi.js';
//import { constants } from "../mpce/constants";

import falcon9fs from '../assets/images/rectangle.png';
import falcon9leg from '../assets/images/falcon9leg.png';

import satellite from '../assets/images/satelliteicon.png';
import planet from '../assets/images/planet.png';
import dockingPort from '../assets/images/dockingPort.png';
import rcsThruster from '../assets/images/rcs.png';

import { Configurationsfactory } from "../mpce/configurationsfactory";
import { SystemStateMonitor } from './systemstatemonitor';
import { VisualEffectsContainer } from './visualeffectscontainer';

const DISPLAY_WIDTH = 2300;
const DISPLAY_HEIGHT = 1170;

export class VisualisationBase
{
    constructor()
    {
        this.application = null;
        this.components = [];
        this.environmentComponents = [];
        this.test = null;
        this.focusObject = null
        this.prevPos = {x: 0, y: 0}
        this.shiftx = {x: 0, y: 0}
        this.updateFunc = null
        this.abstructCameraView = false;
        this.metersPerPixelAbstruct = 1/40000;
        this.viewScales = {"abstract": null, "physical": null};
        this.scaleLevel = 1;
        this.displayAreaScaleConf = Configurationsfactory.getConfiguration("SCALE_DISPLAY_AREA");
        this.currentScale = 0;

        this.SystemStateMonitor = null;
            
    }

    images = 
    {
        falcon9fs: falcon9fs,
        falcon9leg: falcon9leg,
        rocketIcon: satellite,
        planet: planet,
        dockingPort: dockingPort,
        rcs: rcsThruster
    }

    initialize(container, pixiSpaceCraftsSystemStateContainer, isMapView)
    {
        this.application = new PIXI.Application({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            backgroundColor: 0x020D19,
            antialias: true
            });

        this.test = new PIXI.Container();
        this.application.stage.addChild(this.test);

        //! scale = 1, 1m = 10px
        // 40km / 1px

        container.current.appendChild(this.application.view);

        this.updateFunc = isMapView ? this.updateFunctionAbstruct : this.updateFunctionPhysical;

        this.updateFunction();

        this.application.ticker.stop();

        this.viewScales.abstract = this.displayAreaScaleConf.abstractViewScale;
        this.viewScales.physical = this.displayAreaScaleConf.physicalViewScale;

        this.SystemStateMonitor = new SystemStateMonitor(pixiSpaceCraftsSystemStateContainer);
    }

    addObject(item, composite, abstract)
    {
        return new Promise((resolve) => {
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

                // const visualEffectsContainer = new PIXI.Container();
                // const testEffect = PIXI.Sprite.from(this.images["rcs"])

                // visualEffectsContainer.addChild(testEffect);
                // this.test.addChild(visualEffectsContainer);

                let icon = PIXI.Sprite.from(this.images["rocketIcon"])
                icon.anchor.set(0.5, 0.5);

                const visualEffectsContainer = new VisualEffectsContainer(item.Name);
                this.test.addChild(visualEffectsContainer);

                let obj = {
                    "visual": object,
                    "visualEffects": visualEffectsContainer,
                    "visualAbstruct": icon,
                    "physical": composite.bodies,
                    "abstract": abstract,
                    "mountingPoint": composite.mountingPoint, //На скільки я зараз розумію це поле буде оновлюватися при стиковці/розстиковці апаратів
                    "id": composite.id
                }

                this.test.addChild(...object);
                this.components.push(obj);

                this.SystemStateMonitor.addObject(item.Name, composite.id)

                resolve(obj);
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
        });
    }

    setMonitoringInterfaceForId(id, monitorinterface)
    {
        this.SystemStateMonitor.setInterfaceForId(id, monitorinterface);
    }

    updateFunction()
    {
        this.application.ticker.add(() => {
            this.updateFunc();
        });
    }

    updateFunctionPhysical()
    {
        //this.shiftx.x += this.components[0].abstract.position.x - this.prevPos.x
        //this.shiftx.y += this.components[0].abstract.position.y - this.prevPos.y

        //this.prevPos.x = this.components[0].abstract.position.x
        //this.prevPos.y = this.components[0].abstract.position.y

        for (let q = 0; q < this.components.length; ++q)
        {
            let item = this.components[q];

            for (let i = 0; i < item.physical.length; ++i)
            {
                item.visual[i].x = item.physical[i].position.x - item.mountingPoint.x + (item.abstract.position.x - this.shiftx.x) * 10;
                item.visual[i].y = item.physical[i].position.y - item.mountingPoint.y + (item.abstract.position.y - this.shiftx.y) * 10;
                item.visual[i].rotation = item.physical[i].angle;
            }

            // console.log(item.mountingPoint.x)
            item.visualEffects.x = item.visual[0].x;
            item.visualEffects.y = item.visual[0].y;
            item.visualEffects.rotation = item.physical[0].angle
        }

        

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
        //this.shiftx.x += this.components[0].abstract.position.x - this.prevPos.x
        //this.shiftx.y += this.components[0].abstract.position.y - this.prevPos.y

        //this.prevPos.x = this.components[0].abstract.position.x
        //this.prevPos.y = this.components[0].abstract.position.y

        for (let q = 0; q < this.components.length; ++q)
        {
            let item = this.components[q];

                item.visualAbstruct.x = (item.abstract.position.x) * this.metersPerPixelAbstruct
                item.visualAbstruct.y = (item.abstract.position.y) * this.metersPerPixelAbstruct
                item.visualAbstruct.rotation = item.physical[0].angle;
        }

        //this.environmentComponents[0].visual.position.set((0 - this.shiftx.x) * 10,
        //                                                  (0 - this.shiftx.y) * 10);

        for (let i = 0; i < this.environmentComponents.length; ++i)
        {
            this.environmentComponents[i].visual.x = (this.environmentComponents[i].abstract.position.x) * this.metersPerPixelAbstruct;
            this.environmentComponents[i].visual.y = (this.environmentComponents[i].abstract.position.y) * this.metersPerPixelAbstruct;
        }


        this.test.x += (DISPLAY_WIDTH/3 - this.components[0].visualAbstruct.x * this.test.scale.x - this.test.x);
        this.test.y += (DISPLAY_HEIGHT/2 - this.components[0].visualAbstruct.y * this.test.scale.y - this.test.y);
        //this.test.x += (DISPLAY_WIDTH/2 - 0 * this.test.scale.x - this.test.x) * 1;
        //this.test.y += (DISPLAY_HEIGHT/2 - 0 * this.test.scale.y - this.test.y) * 1;

        this.test.scale.x += (this.currentScale - this.test.scale.x) * 0.02;
        this.test.scale.y += (this.currentScale - this.test.scale.y) * 0.02;
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

    setViewMode(isMapViewEnabled)
    {
        if (isMapViewEnabled)
        {
            this.abstructCameraView = true;

            for (let item of this.components)
            {
                this.test.removeChild(...item.visual);
            }

            this.scaleLevel = this.displayAreaScaleConf.initAbstractViewScale;
            this.setScale({scale: 0});

            for (let item of this.components)
            {
                this.test.addChild(item.visualAbstruct);
                this.test.addChild(this.environmentComponents[0].visual);
            }
    
            this.updateFunc = this.updateFunctionAbstruct;
        }
        else
        {
            this.abstructCameraView = false;

            for (let item of this.components)
            {
                this.test.removeChild(item.visualAbstruct);
                this.test.removeChild(this.environmentComponents[0].visual);
            }

            this.scaleLevel = this.displayAreaScaleConf.initPhysicalViewScale;
            this.setScale({scale: 0});

            for (let item of this.components)
            {
                this.test.addChild(...item.visual);
            }

            this.updateFunc = this.updateFunctionPhysical;
        }

        // this.test.x += (DISPLAY_WIDTH/2 - this.components[0].visualAbstruct.x * this.test.scale.x - this.test.x);
        // this.test.y += (DISPLAY_HEIGHT/2 - this.components[0].visualAbstruct.y * this.test.scale.y - this.test.y);
    }

    setScale({scale})
    {
        if (!this.abstructCameraView)
        {
            if (this.scaleLevel + scale !== this.displayAreaScaleConf.physicalViewScale.length && 
                this.scaleLevel + scale !== -1)
            {
                this.scaleLevel = this.scaleLevel + scale;

                this.test.scale.x = this.displayAreaScaleConf.physicalViewScale[this.scaleLevel];
                this.test.scale.y = this.displayAreaScaleConf.physicalViewScale[this.scaleLevel];
            }
        }
        else if (this.abstructCameraView)
        {
            if (this.scaleLevel + scale !== this.displayAreaScaleConf.abstractViewScale.length && 
                this.scaleLevel + scale !== -1)
            {
                this.scaleLevel = this.scaleLevel + scale;
                this.currentScale = this.displayAreaScaleConf.abstractViewScale[this.scaleLevel];

                for (let item of this.components)
                {
                    item.visualAbstruct.scale.set(1 / this.currentScale / 5);
                }

                // this.test.scale.x = newScale;
                // this.test.scale.y = newScale;
            }
        }
    }

    stop()
    {
        this.application.ticker.stop();
        this.SystemStateMonitor.stop();
    }

    start()
    {
        this.application.ticker.start();
        this.SystemStateMonitor.start();
    }

    reset()
    {
        this.application.destroy(true);
        this.SystemStateMonitor.reset();
    }
}