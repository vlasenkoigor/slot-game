import {Game} from "../../../core/Game";
import {MainScene} from "./main/main-rock-climber";


export class RockClimber extends Game<[MainScene]> {
    constructor() {
        super([new MainScene()]);
    }
}

