import { Configurationsfactory } from "./configurationsfactory.js";

import Matter from 'matter-js';
// SPACECRAFTS
// import { st1_falcon9 } from './spacecrafts/st1_falcon9';

export class SpaceCraftBuilder{

    #currentId = 0;
    //#configurableBuilder = null

    constructor(mode)
    {
        if (mode === "rt")
        {
            this.#currentId++;
        }
    }

    buildSpaceCraft(confName, displayName)
    {

        if (!confName)
        {
            console.log("Конфігурація не встановлена");
            return;
        }

        let conf = Configurationsfactory.getConfiguration(confName, "spaceCraftData");

        // нащо для кожного апарату створювати новий ConfigurableBuilder? Який смисл?
        let builder = new ConfigurableBuilder(this.#getNewId(), conf, displayName);

        return builder.build();
    }

    #getNewId()
    {
        this.#currentId += 2
        return this.#currentId;
    }
}

// --------------------------------------------------------------------

class ConfigurableBuilder
{
    constructor(id, conf, displayName)
    {
        this.#id = id;
        this.#conf = conf;
        this.#displayName = displayName;
    }

    #id = null;
    #conf = null;
    #displayName;
    #bodies = [];
    #constraints = [];

    build()
    {
        if (!this.#conf)
        {
            return null;
        }

        for (const item of this.#conf.parts)
        {
            //! First, all objects must be handled, then constraints
            switch (item.objectType)
            {
            case "rectangle":
                this.#bodies.push(this.#getRectangleObj(item));
                break;
            case "constraint":
                this.#constraints.push(this.#getConstraintObj(item));
                break;
            case "vertices":
                this.#bodies.push(this.#getObjFromVertices(item));
                break
            default:
                return null;
            }
        }

        return Matter.Composite.create({
            bodies: this.#bodies,
            constraints: this.#constraints,
            id: this.#id
        });
    }
     
    #getRectangleObj(conf)
    {
        if (!conf)
            return null;

        let part = Matter.Bodies.rectangle(conf.initPos.x,
                                           conf.initPos.y,
                                           conf.dimensions.width,
                                           conf.dimensions.height,
                                           {
                                                isStatic: conf.isStatic,
                                                friction: 1,
                                                frictionAir: 0,
                                                isSensor: conf.isSensor,
                                                mass: conf.master ? (conf.componentMass / 1000 + conf.fuelMass / 1000) : 0.1000000000000000, // Kg -> T
                                                dockId: conf.isDockingPort ? {dock: conf.id, parent: this.#id} : null, // переписати потім, щоб воно не залежало від сенсора
                                                // застаріло dockId береться від композиту, потрібно переписати так, щоб один композит міг мати багато докерів
                                                docDir: conf.isDockingPort ? conf.docDir : null,
                                                location: conf.isSensor ? conf.location : null,

                                                name: conf.name,
                                                type: "spacecraft", // Шо це і нашо?
                                                master: conf.master,
                                                displayName: conf.master ? this.#displayName : null,
                                                isVisualPart: conf.isVisualPart,
                                                imageDev: conf.isVisualPart ? conf.image_dev : null,
                                                imageMain: conf.isVisualPart ? conf.image_main : null,
                                                zIndex: conf.zIndex ? conf.zIndex : 0
                                            });

        return part;
    }

    #getConstraintObj(conf)
    {
        const findObjectByName = (name) =>
        {
            const part = this.#bodies.find(part => part.name === name);
            if (part === undefined)
            {
                console.log("Failed to configure spacecraft");
                return null
            }
            return part !== undefined ? part : null; 
        }

        if (!conf)
        {
            return null;
        }

        let part = Matter.Constraint.create(
        {
            bodyA: findObjectByName(conf.bodyA),
            pointA: {x: conf.pointA.x, y: conf.pointA.y},
            bodyB: findObjectByName(conf.bodyB),
            pointB: {x: conf.pointB.x, y: conf.pointB.y},

            //length: conf.length,

            stiffness: conf.stiffness,

            //! Поки залишиться задокументованим
            
            //damping: conf.damping,
            //angularStiffness: conf.angularStiffness,
            //angularDamping: conf.angularDamping,

            render:
            {
                visible: conf.visible
            },

            name: conf.name
        });

        return part
    }

    #getObjFromVertices(conf)
    {
        if (!conf)
            return null;
        
        const verticesToString = conf.vertices.map(v => `${v.x} ${v.y}`).join("  ");

        const vertices = Matter.Vertices.fromPath(verticesToString);
        let part = Matter.Bodies.fromVertices(0, 0, vertices,
                                            {
                                                isStatic: conf.isStatic,
                                                friction: 1,
                                                frictionAir: 0,
                                                isSensor: conf.isSensor,
                                                mass: conf.master ? (conf.componentMass / 1000 + conf.fuelMass / 1000) : 0.1, // Kg -> T
                                                dockId: conf.isDockingPort ? {dock: conf.id, parent: this.#id} : null, // переписати потім, щоб воно не залежало від сенсора
                                                // застаріло dockId береться від композиту, потрібно переписати так, щоб один композит міг мати багато докерів
                                                docDir: conf.isDockingPort ? conf.docDir : null,
                                                location: conf.isSensor ? conf.location : null,

                                                name: conf.name,
                                                type: "spacecraft", // Шо це і нашо?
                                                master: conf.master,
                                                displayName: conf.master ? this.#displayName : null,
                                                isVisualPart: conf.isVisualPart,
                                                imageDev: conf.isVisualPart ? conf.image_dev : null,
                                                imageMain: conf.isVisualPart ? conf.image_main : null,
                                                zIndex: conf.zIndex ? conf.zIndex : 0
                                            });
        
        return part;
    }
}