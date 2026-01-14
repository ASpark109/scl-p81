import Matter from 'matter-js';

import { ModuleBase } from "./modules/modulebase.js";

class EngineUpdater {
    constructor() {
        this.engines = new Set();
        this.interval = null;
    }

    add(engine) {
        this.engines.add(engine);
        //this.start();
    }

    remove(engine) {
        this.engines.delete(engine);
        if (this.engines.size === 0) this.stop();
    }

    start() {
        if (this.interval) return;

        const timestep = 1000 / 60;
        this.interval = setInterval(() => {
            for (const engine of this.engines) {
                Matter.Engine.update(engine, timestep);
            }
            ModuleBase.updateAll();
        }, timestep);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// експорт як Singleton
export const engineUpdater = new EngineUpdater();