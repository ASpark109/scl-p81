import { Configurationsfactory } from "./configurationsfactory.js";

import Matter from 'matter-js';
// SPACECRAFTS
// import { st1_falcon9 } from './spacecrafts/st1_falcon9';

export class SpaceCraftBuilder{

    #currentId = 0;
    #numberOfObjects = 0;

    //#configurableBuilder = null

    constructor(numberOfObjects)
    {
        this.#numberOfObjects = numberOfObjects

    }

    buildSpaceCraft(confName)
    {

        if (!confName)
        {
            console.log("Конфігурація не встановлена");
            return;
        }

        let conf = Configurationsfactory.getConfiguration(confName, "spaceCraftData");

        // нащо для кожного апарату створювати новий ConfigurableBuilder? Який смисл?
        let builder = new ConfigurableBuilder(this.#getNewId(), conf, this.#numberOfObjects);

        return builder.build();
    }

    #getNewId()
    {
        return this.#currentId++;
    }
}

// --------------------------------------------------------------------

class ConfigurableBuilder
{
    constructor(id, conf, numberOfObjects)
    {
        this.#id = id;
        this.#conf = conf;
        this.#numberOfObjects = numberOfObjects;
    }

    #id = null;
    #conf = null;
    #numberOfObjects = 0;
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
                                                friction: conf.friction,
                                                frictionAir: 0,
                                                mass: conf.componentMass / 1000 + conf.fuelMass / 1000, // Kg -> T
                                                isSensor: conf.isSensor,
                                                dockId: conf.name === "dockingPort" ? {dock: conf.id, parent: this.#id} : null, // переписати потім, щоб воно не залежало від сенсора
                                                // застаріло dockId береться від композиту, потрібно переписати так, щоб один композит міг мати багато докерів
                                                location: conf.isSensor ? conf.location : null,

                                                name: conf.name,
                                                type: "spacecraft", // Шо це і нашо?
                                                master: conf.master,
                                                imageDev: conf.image_dev,
                                                imageMain: conf.image_main
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
}