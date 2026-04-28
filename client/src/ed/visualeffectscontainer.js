import * as PIXI from 'pixi.js';

import { Configurationsfactory } from '../mpce/configurationsfactory';

export class VisualEffectsContainer extends PIXI.Container
{
    #configuration = null;

    constructor(spaceCraftName, mode)
    {
        super()

        this.#configuration = Configurationsfactory.getConfiguration(spaceCraftName, "visualEffects").effects;
        this.spaceCraftName = spaceCraftName;
        this.zIndex = 100;
        this.mode = mode

        this.#init();
    }

    #init()
    {
        for (const item of this.#configuration)
        {
            if (!item.isAnimation)
            {
                let effectPath = null;
                if (item.pathDev && item.pathRt)
                {
                    effectPath = this.mode === "dev" ? item.pathDev : item.pathRt;
                }
                else
                {
                    effectPath = item.pathDev ? item.pathDev : item.pathRt;
                }
                const effect = PIXI.Sprite.from(effectPath);
                effect.anchor.set(item.center.x, item.center.y);
                effect.name = item.id
                effect.x = item.position.x;
                effect.y = item.position.y;
                effect.rotation = item.angle * Math.PI / 180;
                effect.scale.set(item.scale.x, item.scale.y);
                effect.visible = item.visible;
                effect.zIndex = item.zIndex ? item.zIndex : 0;

                this.addChild(effect);
            }
            else if (item.isAnimation)
            {
                const textures = item.sprites.map((item) => {return PIXI.Texture.from(item)})

                console.log(textures)

                const animation = new PIXI.AnimatedSprite(textures);

                animation.animationSpeed = 0.4;
                animation.loop = true;
                
                animation.name = item.id
                animation.x = item.position.x;
                animation.y = item.position.y;
                animation.anchor.set(item.center.x, item.center.y);
                animation.rotation = item.angle * Math.PI / 180;
                animation.scale.set(item.scale.x, item.scale.y);
                animation.visible = item.visible;
                animation.zIndex = item.zIndex ? item.zIndex : 0;
                item.play ? animation.play() : animation.stop();

                this.addChild(animation);
            }
        }
    }

    setVisible(id, visible)
    {
        const effect = this.getChildByName(id);

        if (effect)
        {
            effect.visible = visible;
        }
    }

    setVisualAndPlay(id, visible, play)
    {
        const effect = this.getChildByName(id);

        if (effect)
        {
            effect.visible = visible;
            play ? effect.play() : effect.stop();
        }
    }

    setEffectAngle(id, rotation)
    {
        const effect = this.getChildByName(id);
        effect.rotation = rotation * Math.PI / 180;
    }

    setVisibleForMs(id, visible, timeout)
    {
        const effect = this.getChildByName(id);

        if (effect)
        {
            effect.visible = visible;

            setTimeout(() => {
                effect.visible = !visible;
            }, timeout);
        }
    }

    setEffectScale(id, data)
    {
        const effect = this.getChildByName(id);
        effect.scale.set(data.x, data.y)
    }
}