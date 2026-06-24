import * as PIXI from 'pixi.js';
import { FaLeaf } from 'react-icons/fa';

const CENTER_X = 2300 / 3;
const CENTER_Y = 1170 / 2;

class InformationField extends PIXI.Container
{
    constructor(label = "N/A", unit = "")
    {
        super();

        this.labelStyle = { fill: 0x04db29, fontSize: 17, fontFamily: 'B612 Mono, monospace'};
        this.valueStyle = { fill: 0x04db29, fontSize: 17, fontFamily: 'B612 Mono, monospace'};
        this.space = 8;

        this.labelText = new PIXI.Text(`${label}:`, this.labelStyle);
        this.valueText = new PIXI.Text("N/A", this.valueStyle);
        
        this.valueText.x = this.labelText.width + this.space;

        this.addChild(this.labelText, this.valueText);
    }
}

export class InformationOverlay extends PIXI.Container
{
    #focusObject = null;

    #padding = 15;
    #space = 10;

    #scale = 1;

    #targetObject = null;
    #spacecrafts = [];

    constructor()
    {
        super();
        this.init();
    }

    init()
    {
        this.name = new InformationField("spacecraft name");
        this.id = new InformationField("spacecraft id");
        this.posX = new InformationField("position x");
        this.posY = new InformationField("position y");
        this.velX = new InformationField("velocity x");
        this.velY = new InformationField("velocity y");
        this.vel = new InformationField("velocity");
        this.mass = new InformationField("mass");
        this.forc = new InformationField("force");
        this.angV = new InformationField("angular vel");
        this.scAngle = new InformationField("angle");

        // -------------

        this.indicatorsContainer = new PIXI.Container();
        this.indicatorsContainer.static = true;

        for (let i = 0; i < 10; i++)
        {
            let indicator = new PIXI.Container();
            
            let frame = new PIXI.Graphics();
            frame.lineStyle(1, 0x04db29); // товщина лінії, колір
            frame.drawRect(0, 0, 30, 30);
            frame.static = true;
            frame.pivot.set(15, 15);
            let scName = new PIXI.Text("N/A", {
                fill: 0x04db29,
                fontSize: 12
            });
            scName.anchor.set(0, 0.5);
            scName.x = frame.height / 2 + 10;
            scName.y = 0;

            indicator.addChild(frame, scName);
            this.indicatorsContainer.addChild(indicator);
        }

        this.addChild(this.indicatorsContainer)
        
        // -------------

        this.gravPoint = PIXI.Sprite.from("../assets/images/surfArrow.png");
        this.gravPoint.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.gravPoint.scale.set(1/5)
        this.gravPoint.pivot.set(this.gravPoint.width / 2, this.gravPoint.height / 2)
        this.gravPoint.position.set(CENTER_X, CENTER_Y);
        this.gravPoint.static = true;
        this.addChild(this.gravPoint)
        
        // -------------

        this.targetInfoContainer = new PIXI.Container();
        this.targetInfoContainer.static = true;
        this.targetPointer = PIXI.Sprite.from("../assets/images/arrow-up.svg");
        this.targetPointer.anchor.set(0.5);
        this.targetPointer.x = 0;
        this.targetPointer.y = 0;
        this.targetPointer.static = true;

        this.targetInfo = new PIXI.Text("test", {
            fill: 0x04db29,
            fontSize: 17
        });
        this.targetInfo.anchor.set(0, 0.5);
        this.targetInfo.x = this.targetPointer.width / 2 + 30;
        this.targetInfo.y = 0;
        this.targetInfo.static = true;

        this.targetInfoContainer.addChild(this.targetPointer);
        this.targetInfoContainer.addChild(this.targetInfo);
        this.addChild(this.targetInfoContainer)
        // -------------

        this.addChild(
            this.name,
            this.id,
            this.posX,
            this.posY,
            this.velX,
            this.velY,
            this.vel,
            this.mass,
            this.forc,
            this.angV,
            this.scAngle
        );

        this.#layoutVertical();
    }

    #layoutVertical() {
        let y = this.#padding;

        for (const child of this.children)
        {
            if (!child.static)
            {
                child.y = y;
                child.x = this.#padding
                y += child.height + this.#space;
            }
        }
    }

    #updateData()
    {
        this.name.valueText.text = this.#focusObject.name;
        this.id.valueText.text = this.#focusObject.id;
    }

    update()
    {
        this.posX.valueText.text = this.#focusObject.abstract.position.x.toFixed(2) + " m"
        this.posY.valueText.text = this.#focusObject.abstract.position.y.toFixed(2) + " m"
        this.velX.valueText.text = this.#focusObject.abstract.velocity.x.toFixed(5) + " m/s"
        this.velY.valueText.text = this.#focusObject.abstract.velocity.y.toFixed(5) + " m/s"
        this.vel.valueText.text = Math.hypot(this.#focusObject.abstract.velocity.x,
                                                this.#focusObject.abstract.velocity.y).toFixed(2) + " m/s";
        this.mass.valueText.text = Math.round(this.#focusObject.physical[0].mass * 6000) + " kg"
        this.forc.valueText.text = Math.hypot(this.#focusObject.abstract.force.x,
                                                this.#focusObject.abstract.force.y).toFixed(2) + " H";
        this.angV.valueText.text = (this.#focusObject.physical[0].angularVelocity * 60 * 180 / Math.PI).toFixed(4) + " deg/s";
        this.scAngle.valueText.text = ((((-this.#focusObject.physical[0].angle * 180 / Math.PI) % 360) + 360) % 360).toFixed(2) + " deg";
        //---------------

        if (this.#targetObject)
        {
            let x = this.#targetObject.abstract.position.x - this.#focusObject.abstract.position.x
            let y = this.#targetObject.abstract.position.y - this.#focusObject.abstract.position.y

            let dis = Math.hypot(x, y);

            let vx = this.#focusObject.abstract.velocity.x - this.#targetObject.abstract.velocity.x;
            let vy = this.#focusObject.abstract.velocity.y - this.#targetObject.abstract.velocity.y;

            let target = this.normalizeAndAngle(x, y, 250)
            this.targetInfo.text = (dis/1000).toFixed(3) + " km\n" + Math.abs(vx).toFixed(2) + " m/s\n" + Math.abs(vy).toFixed(2) + " m/s";
            this.targetPointer.rotation = target.angle

            this.targetInfoContainer.position.set(CENTER_X + target.unit.x, CENTER_Y + target.unit.y)
        }
        //---------------

        let gravPoint = this.normalizeAndAngle(-this.#focusObject.abstract.position.x, -this.#focusObject.abstract.position.y, 100)
        this.gravPoint.position.set(CENTER_X + gravPoint.unit.x, CENTER_Y + gravPoint.unit.y)
        this.gravPoint.rotation = gravPoint.angle
        
        //---------------

        for (let i = 0; i < this.#spacecrafts.length && i < 10; i++)
        {
            let indicator = this.indicatorsContainer.children[i];
            const spacecraft = this.#spacecrafts[i];

            let x = spacecraft.abstract.position.x - this.#focusObject.abstract.position.x
            let y = spacecraft.abstract.position.y - this.#focusObject.abstract.position.y

            indicator.x = CENTER_X + x * this.#scale;
            indicator.y = CENTER_Y + y * this.#scale;
        }
        //this.targetInfo.x = CENTER_X + x * this.#scale;
        //this.targetInfo.y = CENTER_Y + y * this.#scale;
    }

    normalizeAndAngle(x, y, r = 250)
    {
        const length = Math.hypot(x, y);

        if (length === 0) {
            return null;
        }

        const unitX = x / length * r;
        const unitY = y / length * r;

        const angleRad = Math.atan2(y, x);
        const angle = angleRad + Math.PI / 2;

        return {
            unit: { x: unitX, y: unitY },
            angle: angle
        };
    }

    setSpacecraft(newObj)
    {
        this.#focusObject = newObj
        this.#updateData();
    }

    setTargetObject(newObject)
    {
        this.#targetObject = newObject;

        if (!this.#targetObject)
        {
            this.targetInfoContainer.visible = false;
        }
        else
        {
            this.targetInfoContainer.visible = true;
        }
    }

    setVisibleFrame(enable, scale)
    {
        this.indicatorsContainer.visible = enable;
        this.#scale = scale * 10;
    }

    updateSpacecrafts(spacecrafts)
    {
        this.#spacecrafts = spacecrafts;

        for (let i = 0; i < this.indicatorsContainer.children.length; i++)
        {
            const sc = this.#spacecrafts[i];
            const indicator = this.indicatorsContainer.children[i];

            if (sc !== undefined)
            {       
                indicator.children[1].text = sc.name;
                indicator.visible = true;
            }
            else
            {
                indicator.visible = false;
            }
        }
    }
}