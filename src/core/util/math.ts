export function rand(min : number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function getRandElement<T>(arr: T[]) : T {
    return arr[rand(0, arr.length - 1)];
}


export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}