import * as PIXI from 'pixi.js';
//import { constants } from "../mpce/constants";

import falcon9fs from '../assets/images/rectangle.png';
import falcon9leg from '../assets/images/falcon9leg.png';

import sat1 from '../assets/images/sat1.png';
import sat_sp from '../assets/images/sat_sp.png';

import harmonyModule from '../assets/images/harmonyModule.png';

import unityModule from '../assets/images/unityModule.png';

import dragon from '../assets/images/dragon.png';
import dragonTrunk from '../assets/images/dragonTrunk.png';

import satellite from '../assets/images/satelliteicon.png';
import planet from '../assets/images/planet.png';
import dockingPort from '../assets/images/dockingPort.png';
import rcsThruster from '../assets/images/rcs.png';

import canadarm1 from '../assets/images/canadarm1.png';
import canadarm2 from '../assets/images/canadarm2.png';
import canadarm3 from '../assets/images/canadarm3.png';
import canadarm4 from '../assets/images/canadarm4.png';

import { Configurationsfactory } from "../mpce/configurationsfactory";
import { SystemStateMonitor } from './systemstatemonitor';
import { VisualEffectsContainer } from './visualeffectscontainer';
import { InformationOverlay } from './informationoverlay';

const DISPLAY_WIDTH = 2300;
const DISPLAY_HEIGHT = 1170;

export class VisualisationBase
{
    #callbacks = null;
    #orbits = new PIXI.Container();
    #scIcons = new PIXI.Container();
    #orbitColors = [
        0x5CC0FF,
        0xFF5B1F,
        0xFFFFFF,
        0xA43BFF,
        0x3DFF51,
        0xFFFF3D,
        0xFFB21F,
        0xED3ED0,
        0x617EFF,
        0xDB7A00,
    ]

    constructor(mode)
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
        this.orbitUpdateCounter = 0;
        this.mode = mode;

        this.SystemStateMonitor = null;
            
        this.orb = new PIXI.Graphics();

        this.#orbits.addChild(this.orb)
    }

    images = 
    {
        falcon9fs: falcon9fs,
        falcon9leg: falcon9leg,
        // falcon9fsDev: falcon9fsDev,

        rocketIcon: satellite,
        planet: planet,
        dockingPort: dockingPort,
        rcs: rcsThruster,
        sat1: sat1,
        satSp: sat_sp,
        harmonyModule: harmonyModule,
        unityModule: unityModule,
        canadarm1: canadarm1,
        canadarm2: canadarm2,
        canadarm3: canadarm3,
        canadarm4: canadarm4,
        dragon: dragon,
        dragonTrunk: dragonTrunk
    }

    createStarTexture(app, count = 400)
    {
        const g = new PIXI.Graphics();

        const colors = [0xffffff, 0xfaf2e7, 0x2a82da, 0xf0f0f0, 0x81b8ee];

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

        //this.addGalaxies(this.application, 10);
    }

    initialize(container, pixiSpaceCraftsSystemStateContainer, isMapView)
    {
        this.application = new PIXI.Application({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            backgroundColor: 0x0b1522,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            });

        this.test = new PIXI.Container();
        this.test.sortableChildren = true;
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


        this.application.stage.addChild(this.#orbits)
        this.application.stage.addChild(this.#scIcons)

        if (this.mode === "rt")
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

        const rect = PIXI.Sprite.from("../assets/images/rt/background.svg");
        rect.anchor.set(0.5, 0.5);
        rect.scale.set(15, 55);

        rect.position.set(
            (object.position.x - pos.x) * 10,
            (object.position.y - pos.y) * 10
        );

        rect.rotation = radians;

        this.test.addChildAt(rect, 0);
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
                const visualEffectsContainer = new VisualEffectsContainer(item.Name, this.mode);
                visualEffectsContainer.sortableChildren = true;

                let spacecraftVisualParts = [];
                let spacecraftPhysicalParts = [];

                for (const body of composite.bodies)
                {
                    if (body.isVisualPart)
                    {
                        const imageMap = {
                            dev: body.imageDev,
                            rt: body.imageMain
                        };

                        let visualPart = PIXI.Sprite.from(imageMap[this.mode]);

                        visualPart.anchor.set(0.5, 0.5);
                        visualPart.scale.set(0.1);
                        visualPart.zIndex = body.zIndex ? body.zIndex : 0;
                        
                        if (body.name === "stage")
                        {
                            visualPart.scId  = item.Name;
                        }
                        else
                        {
                            visualPart.scId  = null;
                        }

                        //! Напевно треба зробити мап щоб могти скривати спрайти
                        spacecraftVisualParts.push(visualPart);
                        spacecraftPhysicalParts.push(body)

                        visualEffectsContainer.addChild(visualPart)
                    }
                }

                let icon = PIXI.Sprite.from(this.images["rocketIcon"])
                icon.anchor.set(0.5, 0.5);
                icon.visible = false;

                const absInfo = new PIXI.Container();

                const circle = new PIXI.Graphics();
                circle.beginFill(0x08a337);
                circle.drawCircle(0, 0, 3);
                circle.endFill();
                circle.pivot.set(-1.5, 1.5);

                const spacecraftName = new PIXI.Text(item.displayName, {
                    fontFamily: "B612 Mono, monospace",
                    fontSize: 13,
                    fill: 0x08a337,
                    align: "center"
                });
                spacecraftName.pivot.set(-10, 10);

                absInfo.addChild(circle)
                absInfo.addChild(spacecraftName)

                this.#scIcons.addChild(absInfo);

                let obj = {
                    "visual": spacecraftVisualParts,
                    "visualEffects": visualEffectsContainer,
                    "visualAbstruct": icon,
                    "info": absInfo,
                    "physical": spacecraftPhysicalParts,
                    "abstract": abstract,
                    "mountingPoint": composite.mountingPoint, //На скільки я зараз розумію це поле буде оновлюватися при стиковці/розстиковці апаратів
                    "id": composite.id,
                    "name": item.displayName
                }

                // for (const sprite of spacecraftVisualParts) {
                //     visualEffectsContainer.addChild(sprite);
                // }
                
                this.components.push(obj);
                this.SystemStateMonitor.addObject(item.Name, composite.id)

                this.test.addChild(visualEffectsContainer); 

                resolve(obj);
            }
            else if (item.type == "spaceobject")
            {
                const radiusPx = Math.max(2, Math.round(item.Radius * this.metersPerPixelAbstruct));
                const outerRadius = Math.round(radiusPx * 1.03);

                // let cnv = this.craateGradientCanvas(outerRadius, radiusPx);

                const circle = new PIXI.Graphics();
                
                circle.beginFill(0x4ec3ff, 0.4);
                circle.drawCircle(0, 0, radiusPx + 5);

                circle.lineStyle(1, 0x3a9aff);
                circle.beginFill(0x00467b);
                circle.drawCircle(0, 0, radiusPx);
                circle.endFill();

                const planetContainer = new PIXI.Container();
                planetContainer.addChild(circle);
                planetContainer.zIndex = 999;

                let obj = {
                    "visual": planetContainer,
                    "physical": null,
                    "abstract": abstract
                }

                this.test.addChild(planetContainer);
                this.environmentComponents.push(obj);
            }
        });
    }

    craateGradientCanvas(outerRadius, radiusPx)
    {
        const canvas = document.createElement('canvas');
        canvas.width = outerRadius * 2;
        canvas.height = outerRadius * 2;
        const ctx = canvas.getContext('2d');
        const cx = outerRadius;
        const cy = outerRadius;
        const grad = ctx.createRadialGradient(cx, cy, Math.max(1, Math.round(radiusPx * 0.6)), cx, cy, outerRadius);
        grad.addColorStop(0, 'rgb(255, 255, 255)');
        grad.addColorStop(0.5, 'rgba(135, 206, 250, 0.82)');
        grad.addColorStop(1, 'rgba(8, 67, 104, 0.29)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
        ctx.fill();

        return canvas
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

            this.orbitUpdateCounter++
            if (this.orbitUpdateCounter === 50)
            {
                this.updateOrbits()            
            }
        });
    }

    updateOrbits()
    {
        this.orb.clear();
        let colorCounter = 0;

        for (let spacecraft of this.components)
        {
            let pos = spacecraft.abstract.position;
            let vel = spacecraft.abstract.velocity;
            let mu = 5.972e24 * 6.67430e-11;

            const x = pos.x;
            const y = pos.y;
            const vx = vel.x, vy = vel.y;

            const r = Math.hypot(x, y);
            const v2 = vx*vx + vy*vy;

            const h = x * vy - y * vx;
            const energy = v2 / 2 - mu / r;

            if (energy >= 0) return null; // не еліпс

            const a = -mu / (2 * energy);
            const e = Math.sqrt(1 + (2 * energy * h * h) / (mu * mu));

            const ex = (vy * h) / mu - x / r;
            const ey = (-vx * h) / mu - y / r;
            const theta = Math.atan2(ey, ex);

            this.drawOrbit(a, e, theta, this.#orbitColors[colorCounter])
            colorCounter++
            if (colorCounter === this.#orbitColors.length)
                colorCounter = 0;
        }

        this.orbitUpdateCounter = 0;
    }

    setOrbitsVisible()
    {
        this.#orbits.visible = !this.#orbits.visible;
    }

    setOverlayInfoVisible()
    {
        this.informationOverlay.visible = !this.informationOverlay.visible;
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

            item.info.x = (item.abstract.position.x) * (this.metersPerPixelAbstruct * this.currentScale) + this.test.x;
            item.info.y = (item.abstract.position.y) * (this.metersPerPixelAbstruct * this.currentScale) + this.test.y;
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


        this.#orbits.position.set(this.test.x, this.test.y);
    }

    drawOrbit(a, e, theta, color)
    {
        this.orb.lineStyle(1, color, 0.7);

        const steps = 200;
        for (let i = 0; i <= steps; i++)
        {
            const phi = (i / steps) * Math.PI * 2;
            const r = a * (1 - e * e) / (1 + e * Math.cos(phi));

            const x = r * Math.cos(phi);
            const y = r * Math.sin(phi);

            const xr = ((x * Math.cos(theta) - y * Math.sin(theta)) * this.metersPerPixelAbstruct * this.currentScale)
            const yr = ((x * Math.sin(theta) + y * Math.cos(theta)) * this.metersPerPixelAbstruct * this.currentScale)
            if (i === 0) this.orb.moveTo(xr, yr);
            else this.orb.lineTo(xr, yr);
        }
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

        this.informationOverlay.setTargetObject(index === 0 ? this.components[1] : this.components[index]);
        this.informationOverlay.updateSpacecrafts(this.components);
    }

    setTargetObject(name)
    {
        let index = this.components.findIndex(item => item.name === name)

        if (index === -1 || index === 0)
            return;

        this.informationOverlay.setTargetObject(this.components[index]);
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
                //this.test.addChild(item.visualAbstruct);
                this.test.addChild(this.environmentComponents[0].visual);
            }

            for (let item of this.#scIcons.children)
            {
                item.visible = true;
            }
    
            this.#orbits.visible = true;

            this.updateFunc = this.updateFunctionAbstruct;
            this.informationOverlay.setVisibleFrame(false);
        }
        else
        {
            this.abstructCameraView = false;

            // for (let item of this.components)
            // {
            //     this.test.removeChild(item.visualAbstruct);
            // }
            this.test.removeChild(this.environmentComponents[0].visual);

            this.scaleLevel = this.displayAreaScaleConf.initPhysicalViewScale;
            this.setScale({scale: 0});

            for (let item of this.components)
            {
                for (let v of item.visual)
                {
                    this.test.addChildAt(v, 0);
                }
            }

            for (let item of this.#scIcons.children)
            {
                item.visible = false;
            }

            this.#orbits.visible = false;
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

                if (s <= 0.1)
                    this.informationOverlay.setVisibleFrame(true, s);
                else
                    this.informationOverlay.setVisibleFrame(false, s);
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

        this.updateOrbits()
    }

    setInteriorView()
    {
        let b = this.test.children.find(item => item.spaceCraftName === this.components[0].visual[0].scId)
        
        let temp = this.components[0].visual[0].zIndex;
        this.components[0].visual[0].zIndex = b.zIndex;
        b.zIndex = temp; 
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