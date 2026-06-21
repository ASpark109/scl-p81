import * as PIXI from 'pixi.js'

import { styles } from './monitorstyle'

export class RPO extends PIXI.Container
{
    #conf = null;
    #scale = 0;

    #proximityRadarDetected = new PIXI.Container();
    #laserRangeFinderDetectedObj = new PIXI.Container();

    #scaleText = null;
    #detectedText = null;

    #prActive = false;
    #lrfActive = false;

    #mode = null;

    #proxSchem = null;
    #lrfSchem = null;

    #scaleLRF = 15;
    #scalePR = 1;

    constructor(conf)
    {
        super()

        this.#conf = conf

        this.pivot.set(this.#conf.dimensions.x / 2, this.#conf.dimensions.y / 2)

        this.addChild(this.#proximityRadarDetected);
        this.addChild(this.#laserRangeFinderDetectedObj);

        this.#create();
        this.#createSchem();
        this.#createInfoPanel();

        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(0, -60, this.#conf.dimensions.x, this.#conf.dimensions.y + 60); // межі видимості
        mask.endFill();

        this.mask = mask;
        this.addChild(mask);
        
        this.#setMode("PR");
    }

    #create()
    {
        const RPOMonitor = new PIXI.Graphics();

        RPOMonitor.lineStyle(1, styles.blue, 1);
        RPOMonitor.drawRect(0, 0,  this.#conf.dimensions.x, this.#conf.dimensions.y);

        const titel = new PIXI.Text("Rendezvous and Proximity Operations system", {
            fontFamily: "B612 Mono, monospace",
            fontSize: styles.fontSizeDefault,
            fill: styles.blue,
            align: "center"
        });

        titel.anchor.set(0.5)
        titel.x = RPOMonitor.width / 2
        titel.y = 15

        // ----------------

        const spaceCraft = new PIXI.Graphics();
        spaceCraft.pivot.set(3, 3);
        spaceCraft.lineStyle(1, styles.green, 1);
        spaceCraft.drawRect(0, 0,  6, 6);
        spaceCraft.position.set(RPOMonitor.width / 2, RPOMonitor.height / 2);        

        this.addChild(RPOMonitor);
        this.addChild(titel);

        this.addChild(spaceCraft);
    }

    #createSchem()
    {
        this.#proxSchem = new PIXI.Graphics();
        this.#proxSchem.lineStyle(1, 0x003005); // товщина, колір
        this.#proxSchem.drawCircle(this.#conf.dimensions.x / 2, this.#conf.dimensions.y / 2, 40);
        this.#proxSchem.drawCircle(this.#conf.dimensions.x / 2, this.#conf.dimensions.y / 2, 80);
        this.#proxSchem.drawCircle(this.#conf.dimensions.x / 2, this.#conf.dimensions.y / 2, 120);
        this.#proxSchem.drawCircle(this.#conf.dimensions.x / 2, this.#conf.dimensions.y / 2, 160);
        this.#proxSchem.drawCircle(this.#conf.dimensions.x / 2, this.#conf.dimensions.y / 2, 200);

        this.addChild(this.#proxSchem);

        this.#lrfSchem = new PIXI.Graphics();
        this.#lrfSchem.lineStyle(0.5, 0x002203); // товщина, колір

        for (let i = 0; i < this.#conf.dimensions.x / 25 - 1; i++)
        {
            this.#lrfSchem.moveTo(25 * (i+1), 25);
            this.#lrfSchem.lineTo(25 * (i+1), this.#conf.dimensions.y - 25);
        }

        for (let i = 0; i < this.#conf.dimensions.y / 25 - 1; i++)
        {
            this.#lrfSchem.moveTo(25, 25 * (i+1));
            this.#lrfSchem.lineTo(this.#conf.dimensions.x - 25, 25 * (i+1));
        }

        this.addChild(this.#lrfSchem);
    }

    #createInfoPanel()
    {
        let infoPanel = new PIXI.Container();
        infoPanel.x = 0;
        infoPanel.y = -20;

        this.#scaleText = new PIXI.Text("scale: 10km", {
            fill: 0x00ff66,
            fontSize: 16,
            fontFamily: 'B612 Mono, monospace',
        });
        this.#scaleText.x = 0;
        this.#scaleText.y = 0;
        
        infoPanel.addChild(this.#scaleText);


        this.#detectedText= new PIXI.Text("detected: N/A", {
            fill: 0x00ff66,
            fontSize: 16,
            fontFamily: 'B612 Mono, monospace',
        });
        this.#detectedText.anchor.set(1, 0);
        this.#detectedText.x = this.#conf.dimensions.x;
        this.#detectedText.y = 0;

        infoPanel.addChild(this.#detectedText);


        let PR = new PIXI.Text("PR  <", {
            fill: 0x00ff66,
            fontSize: 16,
            fontFamily: 'B612 Mono, monospace',
        });
        PR.x = 0;
        PR.y = -20;

        PR.eventMode = 'static';
        PR.on('pointerdown', () => {
            LRF.text = "LRF";
            PR.text = "PR  <";

            this.#setMode("PR");
        });

        infoPanel.addChild(PR);


        let LRF = new PIXI.Text("LRF", {
            fill: 0x00ff66,
            fontSize: 16,
            fontFamily: 'B612 Mono, monospace',
        });
        LRF.x = 0;
        LRF.y = -40;

        LRF.eventMode = 'static';
        LRF.on('pointerdown', () => {
            LRF.text = "LRF <";
            PR.text = "PR";

            this.#setMode("LRF");
        });

        infoPanel.addChild(LRF);


        let scalePlus = new PIXI.Text("+", {
            fill: 0x00ff66,
            fontSize: 25,
            fontFamily: 'B612 Mono, monospace',
        });
        scalePlus.anchor.set(0.5);
        scalePlus.x = this.#conf.dimensions.x / 2 - 15;
        scalePlus.y = 0;

        scalePlus.eventMode = 'static';
        scalePlus.on('pointerdown', () => {

            console.log(this.#prActive + " " + this.#lrfActive)
            if (this.#mode === "PR")
            {
                this.#scalePR += 0.5;
            }
            else if (this.#mode === "LRF")
            {
                this.#scaleLRF += 2;
            }
        });

        infoPanel.addChild(scalePlus);


        let scaleMinus = new PIXI.Text("-", {
            fill: 0x00ff66,
            fontSize: 25,
            fontFamily: 'B612 Mono, monospace',
        });
        scaleMinus.anchor.set(0.5);
        scaleMinus.x = this.#conf.dimensions.x / 2 + 15;
        scaleMinus.y = 0;

        scaleMinus.eventMode = 'static';
        scaleMinus.on('pointerdown', () => {
            console.log(this.#prActive + " " + this.#lrfActive)
            if (this.#mode === "PR")
            {
                this.#scalePR -= 0.5;
            }
            else if (this.#mode === "LRF")
            {
                this.#scaleLRF -= 2;
            }
        });

        infoPanel.addChild(scaleMinus);


        // --------
        this.addChild(infoPanel);
    }

    #setMode(mode)
    {
        switch (mode) {
            case "PR":
                this.#proxSchem.visible = true;
                this.#lrfSchem.visible = false;

                this.#proximityRadarDetected.visible = true;
                this.#laserRangeFinderDetectedObj.visible = false;

                this.#mode = mode;

                break;
            case "LRF":
                this.#proxSchem.visible = false;
                this.#lrfSchem.visible = true;

                this.#proximityRadarDetected.visible = false;
                this.#laserRangeFinderDetectedObj.visible = true;

                this.#mode = mode;

                break;
            default:
                break;
        }
    }

    #processProximityRadarData(data)
    {
        const diff = data.length - (this.#proximityRadarDetected.children.length);

        if (diff > 0)
        {
            for (let i = 0; i < diff; i++)
            {
                let obj = new PIXI.Graphics();

                obj.beginFill(styles.blue);
                obj.drawRect(0, 0, 6, 6);
                obj.endFill();
                obj.pivot.set(3, 3);

                this.#proximityRadarDetected.addChild(obj);
            }
        }

        for (let i = 0; i < this.#proximityRadarDetected.children.length; i++)
        {
            if (i < data.length)
            {
                this.#proximityRadarDetected.children[i].visible = true;
                this.#proximityRadarDetected.children[i].x = (this.#conf.dimensions.x / 2) * 1 + data[i].x * this.#scalePR;
                this.#proximityRadarDetected.children[i].y = (this.#conf.dimensions.y / 2) * 1 + data[i].y * this.#scalePR;
            }
            else
            {
                this.#proximityRadarDetected.children[i].visible = false;
            }
        }
    }

    #processLaserRangeFinderDetectedData(data)
    {
        this.#laserRangeFinderDetectedObj.removeChildren();

        let obj = new PIXI.Graphics();

        for (const item of data)
        {
            const v = item.main;

            obj.lineStyle(1, styles.blue, 1);

            obj.moveTo(this.#conf.dimensions.x / 2 + v[0].x * this.#scaleLRF, this.#conf.dimensions.y / 2 + v[0].y * this.#scaleLRF);

            for (let i = 1; i < v.length; i++)
            {
                obj.lineTo((this.#conf.dimensions.x / 2 + v[i].x * this.#scaleLRF),
                           (this.#conf.dimensions.y / 2 + v[i].y * this.#scaleLRF));
            }

            obj.lineTo((this.#conf.dimensions.x / 2 + v[0].x * this.#scaleLRF),
                           (this.#conf.dimensions.y / 2 + v[0].y * this.#scaleLRF));

            for (let i = 0; i < item.dockPorts.length; i++)
            {
                let dock = new PIXI.Graphics();

                dock.beginFill(styles.yellow); // червоний
                dock.drawRect(0, 0, 8, 8);
                dock.endFill();

                dock.pivot.set(4, 4);

                dock.position.set(
                    this.#conf.dimensions.x / 2 + item.dockPorts[i].x * this.#scaleLRF,
                    this.#conf.dimensions.y / 2 + item.dockPorts[i].y * this.#scaleLRF
                );
                
                dock.rotation = item.dockPorts[i].angle;

                this.#laserRangeFinderDetectedObj.addChild(dock);
            }
        }

        this.#laserRangeFinderDetectedObj.addChild(obj);
    }

    update(info)
    {
        if (info.proximityRadar)
        {
            if (!this.#prActive)
                this.#prActive = true

            this.#detectedText.text = info.proximityRadar.length;
            this.#processProximityRadarData(info.proximityRadar);
        }
        else
        {
            if (this.#prActive)
            {
                this.#prActive = false;

                this.#proximityRadarDetected.visible = false
            }
        }

        if (info.laserRangeFinder)
        {
            if (!this.#lrfActive)
                this.#lrfActive = true

            this.#detectedText.text = info.laserRangeFinder.length;
            this.#processLaserRangeFinderDetectedData(info.laserRangeFinder);
        }
        else
        {
            if (this.#lrfActive)
            {
                this.#lrfActive = false;

                this.#proximityRadarDetected.visible = false
            }
        }
    }
}