import {Signal} from "../util/Signal";
import {Bound} from "../decorators/bound.decorator";
import {isFunction} from "../util/functions";


interface ResizeConfig {
    width: number;
    height: number;
}

export type Orientation = 'landscape' | 'portrait';

export type ResizeData = {
    game: WidthHeight;
    canvas: WidthHeight;
    actionArea: Rect;
    orientation: Orientation;
    orientationChanged: boolean;
};

let instance: ResizeService;

export class ResizeService extends Signal<ResizeData> {

    strategy: ScaleStrategy = FitScaleStrategy;

    config: ResizeConfig;

    element: HTMLElement;

    constructor() {
        super();

        instance = this;
    }

    public init(element: HTMLElement, config: ResizeConfig) {
        window.addEventListener('resize', this.resize);

        this.element = element;

        this.config = config;

        this.add((data) => {
            onResizeCallbacks.forEach(callback => callback(data));
        }, true);

        this.resize();
    }

    @Bound
    public resize() {
        const clientSize: WidthHeight = {width: window.innerWidth, height: window.innerHeight};

        const gameSize: WidthHeight = {width: this.config.width, height: this.config.height};

        const canvasSize = this.strategy.calculateCanvasSize(clientSize, gameSize);

        const scale = this.calculateScale(canvasSize, clientSize);

        const margin = this.calculateMargins(canvasSize, clientSize, scale);

        this.element.style.width = css.px(canvasSize.width);
        this.element.style.height = css.px(canvasSize.height);

        this.element.style.marginLeft = css.px(margin.left);
        this.element.style.marginTop = css.px(margin.top);

        this.element.style.width = css.px(canvasSize.width * scale);
        this.element.style.height = css.px(canvasSize.height * scale);

        this.dispatch({
            actionArea: {x: 0, y: 0, width: gameSize.width, height: gameSize.height},
            orientationChanged: false,
            game: gameSize,
            canvas: canvasSize,
            orientation: 'landscape'
        });
    }



    /**
     * Get margins for centralizing the game.
     * if game wider then the screen. set margin left to 0.
     */
    private calculateMargins(gameSize: WidthHeight, clientSize: WidthHeight, scale: number): TopLeft {
        const clientWidth = clientSize.width,
            gameWidth = gameSize.width,
            clientHeight = clientSize.height,
            gameHeight = gameSize.height;

        const left = Math.floor(Math.max(0, (clientWidth - gameWidth * scale) / 2));

        const top = Math.floor(Math.max(0, (clientHeight - gameHeight * scale) / 2));

        return {left, top};
    }

    private calculateScale(gameSize: WidthHeight, clientSize: WidthHeight): number {
        return Math.min(clientSize.width / gameSize.width, clientSize.height / gameSize.height);
    }
}

export const FitScaleStrategy: ScaleStrategy = {
    calculateCanvasSize: function (clientSize: WidthHeight, gameSize: WidthHeight): WidthHeight {
        return {
            width: gameSize.width,
            height: gameSize.height,
        };
    },

    calculateGameAreaRect: function (canvasSize: WidthHeight, gameSize: WidthHeight): Rect {
        return {
            x: 0,
            y: 0,
            width: gameSize.width,
            height: gameSize.height,
        };
    },
};

type ResizeCallback = (data: ResizeData) => void;

const onResizeCallbacks: Array<ResizeCallback> = [];

export function onResize(callback: ResizeCallback){
    onResizeCallbacks.push(callback);

    instance.add(callback, true);
}

type Position = { x: number; y: number };

type GetPosition = ((data: ResizeData) => Position) | Position;

type Positionable = { x: number; y: number };

export const toCanvas: (el: Position, pos: GetPosition) => void = (el, pos) => {

    onResize((data) => {
        const position = isFunction(pos) ? pos(data) : pos;

        el.x = position.x;
        el.y = position.y;
    });


}


export const toCanvasCenter: (el: Position) => ResizeCallback = (el) => (data) => {
    el.x = data.canvas.width / 2;
    el.y = data.canvas.height / 2;
}


export interface ScaleStrategy {
    calculateCanvasSize(clientSize: WidthHeight, gameSize: WidthHeight): WidthHeight;

    calculateGameAreaRect(canvasSize: WidthHeight, gameSize: WidthHeight): Rect;
}

export type Rect = { x: number; y: number; width: number; height: number };

export type WidthHeight = {
    width: number;
    height: number;
};

export type TopLeft = {
    top: number;
    left: number;
};


export const css = {
    px: (value: string | number) => `${value}px`,
};
