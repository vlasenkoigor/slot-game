import type {Game} from "../Game";

export class Scene<N extends string = any, G extends Game<any> = Game<any>> {
    name: N;

    game: G


    constructor(name: N) {
    }

    async preload() {
    }

    async create() {

    }

    async start(){}

    async onEnter(){}

    async onLeave(){}
}