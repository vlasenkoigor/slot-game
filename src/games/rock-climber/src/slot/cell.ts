import {clamp} from "../../../../core/util/math";

export class Cell extends PIXI.Sprite {

    id: number;

    constructor(id: number) {
        super();

        this.setId(id);

        this.anchor.set(0.5);
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

}