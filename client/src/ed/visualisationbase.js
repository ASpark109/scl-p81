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
import { InformationOverlay } from './informationoverlay';

const DISPLAY_WIDTH = 2300;
const DISPLAY_HEIGHT = 1170;

export class VisualisationBase
{
    #callbacks = null;

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

    createStarTexture(app, count = 400)
    {
        const g = new PIXI.Graphics();

        const colors = [0xffffff, 0xfaf2e7, 0x2a82da, 0xf87e6d, 0x81b8ee];

        for (let i = 0; i < count; i++) {
            const x = Math.random() * 1000;
            const y = Math.random() * 1000;
            const r = Math.random() * 1.8 + 0.5;

            const color = colors[Math.floor(Math.random() * colors.length)];

            g.beginFill(color, Math.random() * 0.8 + 0.2); // альфа 0.2-1
            g.drawCircle(x, y, r);
            g.endFill();
        }

        const texture = app.renderer.generateTexture(g, PIXI.SCALE_MODES.LINEAR);

        return texture;
    }

    createSpaceBackground(app, width, height, noiseDensity = 0.04)
    {
        const g = new PIXI.Graphics();

        g.beginFill(0x020D19);
        g.drawRect(0, 0, width, height);
        g.endFill();

        const totalPixels = Math.floor(width * height * noiseDensity);
        for (let i = 0; i < totalPixels; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const alpha = Math.random() * 0.05;
            const color = 0xdfefff; 

            g.beginFill(color, alpha);
            g.drawRect(x, y, 1, 1);
            g.endFill();
        }

        const texture = app.renderer.generateTexture(g);
        const bg = new PIXI.Sprite(texture);
        bg.width = width;
        bg.height = height;

        return bg;
    }

    addGalaxies(app, count = 100) {

        const galaxySprites = [
            "../assets/images/g1.png",
            "../assets/images/g2.png",
            "../assets/images/g3.png",
            "../assets/images/g4.png",
            "../assets/images/g5.png",
            "../assets/images/g6.png",
            "../assets/images/g7.png",
            "../assets/images/g8.png",
            "../assets/images/g9.png",
        ];

        let galaxyL = new PIXI.Container();

        for (let i = 0; i < count; i++) {
            const tex = galaxySprites[Math.floor(Math.random() * galaxySprites.length)];;
            const galaxy = PIXI.Sprite.from(tex);

            galaxy.x = Math.random() * app.screen.width;
            galaxy.y = Math.random() * app.screen.height;

            const scale = 0.08
            galaxy.scale.set(scale);

            galaxy.alpha = 0.4;
            galaxy.rotation = Math.random()

            galaxyL.addChild(galaxy);
        }

        app.stage.addChildAt(galaxyL, 1);
    }

    #createBackground()
    {
        const starTexture = this.createStarTexture(this.application);
        const stars = new PIXI.TilingSprite(
            starTexture,
            DISPLAY_WIDTH,
            DISPLAY_HEIGHT
        );
        this.application.stage.addChildAt(stars, 0);
        stars.filters = [new PIXI.BlurFilter()];
        stars.filters[0].blur = 0.8;

        const bg = this.createSpaceBackground(this.application, DISPLAY_WIDTH, DISPLAY_HEIGHT);
        this.application.stage.addChildAt(bg, 0);

        this.addGalaxies(this.application, 10);
    }

    initialize(container, pixiSpaceCraftsSystemStateContainer, isMapView, mode)
    {
        this.application = new PIXI.Application({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            backgroundColor: 0x020D19,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            });

        this.test = new PIXI.Container();
        this.application.stage.addChild(this.test);

        this.informationOverlay = new InformationOverlay()
        this.application.stage.addChild(this.informationOverlay);

        //! scale = 1, 1m = 10px
        // 40km / 1px

        container.current.appendChild(this.application.view);

        this.updateFunc = isMapView ? this.updateFunctionAbstruct : this.updateFunctionPhysical;

        this.updateFunction();

        this.application.ticker.stop();

        this.viewScales.abstract = this.displayAreaScaleConf.abstractViewScale;
        this.viewScales.physical = this.displayAreaScaleConf.physicalViewScale;

        this.SystemStateMonitor = new SystemStateMonitor(pixiSpaceCraftsSystemStateContainer);

        // if (mode === "rt")
        {
            this.#createBackground();
        }
    }

    objectsApproaching([object0, object, radians])
    {
        let pos = {x: 0, y: 0};
        function shorten(v, delta)
        {
            const len = Math.hypot(v.x, v.y);
            const k = (len - delta) / len;

            return {
                x: v.x * k,
                y: v.y * k
            };
        }
        let n = shorten({x: object.position.x - object0.position.x,
            y:object.position.y - object0.position.y
        }, 6371000); // radius

        pos.x = n.x;
        pos.y = n.y;

        const rect = new PIXI.Graphics();

        rect.beginFill(0x003B0B);
        rect.drawRect(-400, -0.25, 900, 300); // центр у (0,0)
        rect.endFill();

        rect.scale.set(100, 100);

        rect.position.set(
            (object.position.x - pos.x) * 10,
            (object.position.y - pos.y) * 10
        );

        rect.rotation = radians;
        this.environmentComponents[0].physical = rect;
        this.test.addChild(rect);
    }

    objectsDistancing(data)
    {
        //this.test.removeChild(this.environmentComponents[0].physical);
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
                    "id": composite.id,
                    "name": item.displayName
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
            this.informationOverlay.update();
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

            item.visualEffects.x = item.visual[0].x;
            item.visualEffects.y = item.visual[0].y;
            item.visualEffects.rotation = item.physical[0].angle
        }

        // for (let i = 0; i < this.environmentComponents.length; ++i)
        // {
        //     this.environmentComponents[i].visual.x = (this.environmentComponents[i].abstract.position.x - this.shiftx.x) * 10;
        //     this.environmentComponents[i].visual.y = (this.environmentComponents[i].abstract.position.y - this.shiftx.y) * 10;
        // }

        //console.log(this.components[0].visualEffects.x + " " + this.components[0].visualEffects.y)

        this.test.x = (DISPLAY_WIDTH/3 - this.components[0].visual[0].x * this.test.scale.x);
        this.test.y = (DISPLAY_HEIGHT/2 - this.components[0].visual[0].y * this.test.scale.y);
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

    setFocusObject(name)
    {
        let index = this.components.findIndex(item => item.name === name)

        if (index === -1)
            return;

        let temp = this.components[index]
        this.components[index] = this.components[0];
        this.components[0] = temp;

        this.prevPos.x = this.components[0].abstract.position.x;
        this.prevPos.y = this.components[0].abstract.position.y;

        this.informationOverlay.setSpacecraft(this.components[0]);

        this.informationOverlay.setTargetObject(this.#findClosest());
    }

    #findClosest()
    {
        let closest = null;
        let minDistSq = Infinity;

        for (let i = 1; i < this.components.length; i++)
        {
            const dx = this.components[i].abstract.position.x - this.components[0].abstract.position.x;
            const dy = this.components[i].abstract.position.y - this.components[0].abstract.position.y;

            // квадрат відстані (швидше, ніж sqrt)
            const distSq = dx * dx + dy * dy;

            if (distSq < minDistSq)
            {
                minDistSq = distSq;
                closest = this.components[i];
            }
        }

        return closest;
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
            this.environmentComponents[0].visual.scale.set(1);

            for (let item of this.components)
            {
                this.test.addChild(item.visualAbstruct);
                this.test.addChild(this.environmentComponents[0].visual);
            }
    
            this.updateFunc = this.updateFunctionAbstruct;
            this.informationOverlay.setVisibleFrame(false);
        }
        else
        {
            this.abstructCameraView = false;

            for (let item of this.components)
            {
                this.test.removeChild(item.visualAbstruct);
            }
            this.test.removeChild(this.environmentComponents[0].visual);

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

                const s = this.displayAreaScaleConf.physicalViewScale[this.scaleLevel]

                this.test.scale.x = s;
                this.test.scale.y = s;

                console.log(this.test.scale)

                if (s < 0.1)
                    this.informationOverlay.setVisibleFrame(true, s);
                else
                    this.informationOverlay.setVisibleFrame(false);
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
        this.informationOverlay.setSpacecraft(this.components[0])
        this.informationOverlay.setTargetObject(this.components[1]);

        this.application.ticker.start();
        this.SystemStateMonitor.start();
    }

    reset()
    {
        this.application.destroy(true);
        this.SystemStateMonitor.reset();
    }
}