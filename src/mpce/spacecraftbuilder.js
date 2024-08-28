import { Configurationsfactory } from "./configurationsfactory.js";
import { Logger } from "../logger.js"

var Matter = require('matter-js');
// SPACECRAFTS
// import { st1_falcon9 } from './spacecrafts/st1_falcon9';

export class SpaceCraftBuilder{

    constructor(){}

    #currentId = 0;

    buildSpaceCraft(confName){

        if (!confName)
        {
            Logger.error("Конфігурація не встановлена", SpaceCraftBuilder);
            return;
        }

        let conf = Configurationsfactory.getConfiguration(confName);

        let builder = new ConfigurableBuilder(this.#getNewId, conf);

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
    constructor(id, conf)
    {
        this.#id = id;
        this.#conf = conf
    }

    #id = null;
    #conf = null;
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
            label: this.#id,
            sector:
            {
                x: null,
                y: null
            }
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
                                                mass: conf.mass,

                                                name:conf.name,
                                                master: conf.master,
                                                imageDev: conf.image_dev,
                                                imageMain: conf.image_main,
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

            lenght: conf.lenght,

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