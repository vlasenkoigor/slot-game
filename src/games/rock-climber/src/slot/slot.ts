import {Reel} from "./reel";
import {WidthHeight} from "../../../../core/services/resize.service";
import {delay} from "../../../../core/util/time";

export type SlotConfig = {
    size: WidthHeight
    gap: {x: number, y: number}

}
export class Slot extends PIXI.Container {

    private reels: Reel[] = []

    private spinResolve: () => void;

    constructor(readonly rows: number = 1, readonly columns: number = 1, readonly config: SlotConfig) {
        super();

        this.createReels();

        this.pivot.set(this.width / 2, 0);
    }


    private createReels() {
        for (let i = 0; i < this.columns; i++) {
            const reel = new Reel(this.rows, this.config);

            this.reels.push(reel);
            this.addChild(reel);

            reel.x = i * (this.config.size.width + this.config.gap.x) + this.config.size.width / 2;
        }
    }

    async spin() {
        delay(2000).then(() => {
            this.stop();
        });

        await Promise.all(this.reels.map(reel => reel.spin()))
    }

    stop() {
        this.reels.forEach(reel => reel.stop());
    }
}