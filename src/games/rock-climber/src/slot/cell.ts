import {clamp} from "../../../../core/util/math";
import {SpriteAnimation} from "../../../../core/animations/sprite-animation";

export class Cell extends PIXI.Sprite {

    id: number;

    frame: PIXI.Sprite;

    winAnimation: SpriteAnimation<'win_effect'>

    constructor(id: number) {
        super();

        this.setId(id);

        this.anchor.set(0.5);

        // frame.png
        const atlas = PIXI.Assets.get('win_symbols');

        this.frame = new PIXI.Sprite(atlas.textures['frame.png']);
        this.frame.anchor.set(0.5);
        this.frame.visible = false;
        this.addChild(this.frame);

        this.winAnimation = new SpriteAnimation<'win_effect'>(PIXI.Assets.get('win_symbols').animations);
        this.winAnimation.anchor.set(0.5);
        this.winAnimation.visible = false;
        this.addChild(this.winAnimation);
    }

    setId(id: number, blur = false) {
        this.id = clamp(id, 1, 8);

        if (blur) {
            this.blur();
        } else {
            this.unblur();
        }
    }

    blur() {
        this.texture = this.getTextureById(true);
    }

    unblur() {
        this.texture = this.getTextureById(false);
    }

    getTextureById(blur = false) {
        if (blur) {
            return PIXI.Assets.get(`blured_icon_${this.id}`);
        }
        return PIXI.Assets.get(`icon_${this.id}`);
    }


    async playWin() {
        this.frame.visible = true;

        this.winAnimation.visible = true;

        await this.winAnimation.play('win_effect', false);

        this.stopWin();
    }

    stopWin() {
        this.frame.visible = false;

        this.winAnimation.visible = false;

        this.winAnimation.stop();
    }


}