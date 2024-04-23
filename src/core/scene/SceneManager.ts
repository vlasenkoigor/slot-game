import type {Scene} from "./Scene";

export class SceneManager<S extends readonly Scene<any>[]> {
    scenes: S;

    constructor(scenes: S) {
        this.scenes = scenes;

    }

    getScene<N extends SceneName<S>>(name:N ): ScenesMap<S>[N] {
        return null;
    }
}


type SceneName<S extends readonly Scene<any>[]> = S[number]['name'];

type ScenesMap<S extends readonly Scene<any>[]> = {
    [E in S[number] as E["name"]]: E
}
