import {isFunction} from "./functions";

export function scheduledLoop(callback: () => Promise<unknown>, delay: (()=>number) | number) : ()=>void {
    let stop = false;
    const loop = () => {
        if (stop) {
            return;
        }

        callback()
            .then(() => setTimeout(loop, isFunction(delay) ? delay() : delay))

    };

    loop();

    return () => {
        stop = true;
    };
}


export function delay(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
}