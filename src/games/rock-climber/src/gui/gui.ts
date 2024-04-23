import {UnresolvedAsset} from "pixi.js/lib/assets/types";
import {SpriteButton} from "../../../../core/ui/sprite-button";
import {onResize, ResizeData} from "../../../../core/services/resize.service";
import {Signal} from "../../../../core/util/Signal";

export class Gui extends PIXI.Container {

    startButton: SpriteButton;

    autoSpinButton: SpriteButton;

    public readonly startClicked = new Signal();

    constructor() {
        super();

        this.startButton = new SpriteButton({
            textures: ['start_active_btn','start_btn'],
            action: () => {
                this.startClicked.dispatch();
            }
        });
        this.addChild(this.startButton.view);

        this.autoSpinButton = new SpriteButton({
            textures: ['auto_spin_active','auto_spin'],
            action: () => {
                console.log('auto spin button clicked')
            },
        });
        this.addChild(this.autoSpinButton.view);

        onResize(this.resize.bind(this));
    }

    disable(){
        this.startButton.enabled = false;
        this.autoSpinButton.enabled = false;
    }

    enable(){
        this.startButton.enabled = true;
        this.autoSpinButton.enabled = true;
    }

    resize(data: ResizeData) {

        const {canvas} = data;

        const bottom = canvas.height - 50;


        this.startButton.view.position.set(canvas.width - 70, bottom);
        this.autoSpinButton.view.position.set(70, bottom);
    }

    static getResources(): UnresolvedAsset[] {

        return [
            {alias: 'start_active_btn', src: 'assets/gui/start_active_btn.png'},
            {alias: 'start_btn', src: 'assets/gui/start_btn.png'},
            {alias: 'auto_spin_active', src: 'assets/gui/auto_spin_active.png'},
            {alias: 'auto_spin', src: 'assets/gui/auto_spin.png'},
        ]
    }
}