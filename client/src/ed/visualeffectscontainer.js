import * as PIXI from 'pixi.js';

import { Configurationsfactory } from '../mpce/configurationsfactory';

export class VisualEffectsContainer extends PIXI.Container
{
    #configuration = null;

    constructor(spaceCraftName)
    {
        super()

        this.#configuration = Configurationsfactory.getConfiguration(spaceCraftName, "visualEffects").effects;

        this.#init();
    }

    #init()
    {
        for (const item of this.#configuration)
        {
            const effect = PIXI.Sprite.from(item.path);
            effect.anchor.set(item.center.x, item.center.y);
            effect.name = item.id
            effect.x = item.position.x;
            effect.y = item.position.y;
            effect.rotation = item.angle * Math.PI / 180;
            effect.scale.set(item.scale.x, item.scale.y);
            effect.visible = item.visible;

            this.addChild(effect);
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