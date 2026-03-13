import * as PIXI from 'pixi.js';

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

    #targetObjects = null;

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

        this.targetFrame = new PIXI.Container();
        this.targetFrame.static = true;
        this.square = new PIXI.Graphics();
        this.square.lineStyle(1, 0x04db29); // товщина лінії, колір
        this.square.drawRect(0, 0, 30, 30);
        this.square.static = true;
        this.square.pivot.set(15, 15);
        this.targetName = new PIXI.Text("N/A", {
            fill: 0x04db29,
            fontSize: 12
        });
        this.targetName.anchor.set(0, 0.5);
        this.targetName.x = this.square.height / 2 + 10;
        this.targetName.y = 0;
        this.targetFrame.addChild(this.targetName, this.square);

        this.gravPoint = PIXI.Sprite.from("../assets/images/surfArrow.png");
        this.gravPoint.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.gravPoint.scale.set(1/5)
        this.gravPoint.pivot.set(this.gravPoint.width / 2, this.gravPoint.height / 2)
        this.gravPoint.position.set(CENTER_X, CENTER_Y);
        this.gravPoint.static = true

        this.targetPointer = new PIXI.Container();
        this.targetPointer.static = true;
        this.targetArrow = PIXI.Sprite.from("../assets/images/arrow-up.svg");
        this.targetArrow.anchor.set(0.5);
        this.targetArrow.x = 0;
        this.targetArrow.y = 0;
        this.targetArrow.static = true;

        this.pointerInfo = new PIXI.Text("test", {
            fill: 0x04db29,
            fontSize: 17
        });
        this.pointerInfo.anchor.set(0, 0.5);
        this.pointerInfo.x = this.targetArrow.width / 2 + 30;
        this.pointerInfo.y = 0;
        this.pointerInfo.static = true;

        this.targetPointer.addChild(this.targetArrow);
        this.targetPointer.addChild(this.pointerInfo);

        this.addChild(this.targetPointer)
        this.addChild(this.gravPoint)

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
            this.targetFrame
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
        this.velX.valueText.text = this.#focusObject.abstract.velocity.x.toFixed(2) + " m/s"
        this.velY.valueText.text = this.#focusObject.abstract.velocity.y.toFixed(2) + " m/s"
        this.vel.valueText.text = Math.hypot(this.#focusObject.abstract.velocity.x,
                                                this.#focusObject.abstract.velocity.y).toFixed(2) + " m/s";
        this.mass.valueText.text = Math.round(this.#focusObject.physical[0].mass * 1000) + " kg"
        this.forc.valueText.text = Math.hypot(this.#focusObject.abstract.force.x,
                                                this.#focusObject.abstract.force.y).toFixed(2) + " H";
        this.angV.valueText.text = (this.#focusObject.physical[0].angularVelocity * 60 * 180 / Math.PI).toFixed(4) + " deg/s";
        //---------------

        let x = this.#targetObjects.abstract.position.x - this.#focusObject.abstract.position.x
        let y = this.#targetObjects.abstract.position.y - this.#focusObject.abstract.position.y

        let dis = Math.hypot(x, y);

        let vx = this.#focusObject.abstract.velocity.x - this.#targetObjects.abstract.velocity.x;
        let vy = this.#focusObject.abstract.velocity.y - this.#targetObjects.abstract.velocity.y;

        this.pointerInfo.text = dis.toFixed(2) + " m\n" + Math.abs(vx).toFixed(2) + " m/s\n" + Math.abs(vy).toFixed(2) + " m/s";

        let target = this.normalizeAndAngle(x, y, 250)
        this.targetPointer.position.set(CENTER_X + target.unit.x, CENTER_Y + target.unit.y)
        this.targetArrow.rotation = target.angle
        //---------------

        let gravPoint = this.normalizeAndAngle(-this.#focusObject.abstract.position.x, -this.#focusObject.abstract.position.y, 100)
        this.gravPoint.position.set(CENTER_X + gravPoint.unit.x, CENTER_Y + gravPoint.unit.y)
        this.gravPoint.rotation = gravPoint.angle
        //---------------

        this.targetFrame.x = CENTER_X + x * this.#scale;
        this.targetFrame.y = CENTER_Y + y * this.#scale;

        //console.log(this.square.x + " " + this.square.y)
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

        console.log(this.#focusObject)

        this.#updateData();
    }

    setTargetObject(newObject)
    {
        this.#targetObjects = newObject;
        this.targetName.text = this.#targetObjects.name
    }

    setVisibleFrame(enable, scale)
    {
        console.log(enable + " " + scale)
        this.#scale = scale * 10;
        this.targetFrame.visible = enable;
    }
}