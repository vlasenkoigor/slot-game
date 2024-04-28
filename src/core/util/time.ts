import {isFunction} from "./functions";

export function scheduledLoop(callback: () => Promise<unknown>, delay: (() => number) | number): () => void {
    let stop = false;
    const loop = () => {
        if (stop) {
            return;
        }

        callback()
            .then(() => setTimeout(loop, isFunction(delay) ? delay() : delay))

    };

    setTimeout(loop, isFunction(delay) ? delay() : delay)

    return () => {
        stop = true;
    };
}

export function wait(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Promise

export type JobResult = {
    done: Promise<unknown>,
    cancel: () => void
};

export type TJob = () => JobResult;


export function all(jobs: [job: () => Promise<void>, cancel: () => void][]): [Promise<void>, () => void] {
    let cancel = false;

    const promise = new Promise<void>(async resolve => {
        await Promise.all(jobs.map(job => job[0]()));
        resolve();
    });

    return [promise, () => {
        cancel = true;
        jobs.forEach(job => job[1]());
    }];

}

export function sequence(jobs: TJob[]): TJob {
    let wasCanceled = false;

    let currentCancel = () => {};

    const job = async () => {
        for (let i = 0; i < jobs.length; i++) {
            if (wasCanceled) {
                break;
            }

            const {done, cancel} = jobs[i]();

            currentCancel = cancel;

            await done;
        }
    };

    return () => {
        return {
            done: job(),
            cancel: () => {
                wasCanceled = true;
                currentCancel();
            }
        }
    }
}

export function repeat(job: TJob, times: number | 'infinite'): TJob {
    let wasCanceled = false;

    let currentCancel = () => {};

    const repeatJob = async () => {
        let i = 0;

        while (!wasCanceled && (times === 'infinite' || i < times)) {
            const {done, cancel} = job();

            currentCancel = cancel;

            await done;

            i++;
        }
    };

    return () => {
        return {
            done: repeatJob(),
            cancel: () => {
                wasCanceled = true;
                currentCancel();
            }
        }
    }
}