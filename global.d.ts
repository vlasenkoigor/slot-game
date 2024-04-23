import * as PIXI from 'pixi.js';

export as namespace PIXI;
export = PIXI;

declare global {
    const PIXI: typeof PIXI;
}