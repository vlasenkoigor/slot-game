import {Scene} from "../../../../core/scene/Scene";
import {Gui} from "../gui/gui";
import {Slot} from "../slot/slot";
import {onResize, toCanvas, toCanvasCenter} from "../../../../core/services/resize.service";
import {WinLine} from "../slot/win-line";
import {SpriteAnimation} from "../../../../core/animations/sprite-animation";
import {repeat, scheduledLoop, sequence, TJob} from "../../../../core/util/time";
import {RockClimber} from "../rock-climber-game";
import {Bound} from "../../../../core/decorators/bound.decorator";
import {rand} from "../../../../core/util/math";

export class MainScene extends Scene<'main', RockClimber> {
    private gui: Gui;

    private slot: Slot;

    constructor() {
        super('main');
    }

    async preload() {
        await PIXI.Assets.load([
            {alias: 'back', src: 'assets/main/back.png'},
            {alias: 'pers_static_0', src: 'assets/main/pers/pers_idle_00.png'},
            {alias: 'pers_static_1', src: 'assets/main/pers/pers_idle_01.png'},
            {alias: 'pers_static_2', src: 'assets/main/pers/pers_idle_02.png'},
            {alias: 'pers_static_3', src: 'assets/main/pers/pers_idle_03.png'},
            {alias: 'pers_static_4', src: 'assets/main/pers/pers_idle_04.png'},
            {alias: 'pers_static_5', src: 'assets/main/pers/pers_idle_05.png'},
            {alias: 'pers_static_6', src: 'assets/main/pers/pers_idle_06.png'},
            {alias: 'pers_static_7', src: 'assets/main/pers/pers_idle_07.png'},
            {alias: 'pers_static_8', src: 'assets/main/pers/pers_idle_08.png'},
            {alias: 'pers_static_9', src: 'assets/main/pers/pers_idle_09.png'},
            {alias: 'pers_static_10', src: 'assets/main/pers/pers_idle_10.png'},
            {alias: 'pers_static_11', src: 'assets/main/pers/pers_idle_11.png'},
            {alias: 'pers_static_12', src: 'assets/main/pers/pers_idle_12.png'},
            {alias: 'pers_static_13', src: 'assets/main/pers/pers_idle_13.png'},
            {alias: 'pers_static_14', src: 'assets/main/pers/pers_idle_14.png'},
            {alias: 'pers_static_15', src: 'assets/main/pers/pers_idle_15.png'},
            {alias: 'pers_static_16', src: 'assets/main/pers/pers_idle_16.png'},
            {alias: 'pers_static_17', src: 'assets/main/pers/pers_idle_17.png'},
            {alias: 'pers_static_18', src: 'assets/main/pers/pers_idle_18.png'},
            {alias: 'pers_static_19', src: 'assets/main/pers/pers_idle_19.png'},
            {alias: 'pers_static_20', src: 'assets/main/pers/pers_idle_20.png'},
            {alias: 'pers_static_21', src: 'assets/main/pers/pers_idle_21.png'},
            {alias: 'pers_static_22', src: 'assets/main/pers/pers_idle_22.png'},
            {alias: 'pers_static_23', src: 'assets/main/pers/pers_idle_23.png'},
            {alias: 'pers_static_24', src: 'assets/main/pers/pers_idle_24.png'},
            {alias: 'pers_static_25', src: 'assets/main/pers/pers_idle_25.png'},
            {alias: 'pers_static_26', src: 'assets/main/pers/pers_idle_26.png'},
            {alias: 'pers_static_27', src: 'assets/main/pers/pers_idle_27.png'},
            {alias: 'pers_static_28', src: 'assets/main/pers/pers_idle_28.png'},
            {alias: 'pers_static_29', src: 'assets/main/pers/pers_idle_29.png'},
            {alias: 'pers_static_30', src: 'assets/main/pers/pers_idle_30.png'},
            {alias: 'pers_static_31', src: 'assets/main/pers/pers_idle_31.png'},
            {alias: 'pers_static_32', src: 'assets/main/pers/pers_idle_32.png'},
            {alias: 'pers_static_33', src: 'assets/main/pers/pers_idle_33.png'},


            {alias: 'icon_1', src: 'assets/main/symbols/icon_1.png'},
            {alias: 'icon_2', src: 'assets/main/symbols/icon_2.png'},
            {alias: 'icon_3', src: 'assets/main/symbols/icon_3.png'},
            {alias: 'icon_4', src: 'assets/main/symbols/icon_4.png'},
            {alias: 'icon_5', src: 'assets/main/symbols/icon_5.png'},
            {alias: 'icon_6', src: 'assets/main/symbols/icon_6.png'},
            {alias: 'icon_7', src: 'assets/main/symbols/icon_7.png'},
            {alias: 'icon_8', src: 'assets/main/symbols/icon_8.png'},

            {alias: 'blured_icon_1', src: 'assets/main/symbols/blured/icon_1_04.png'},
            {alias: 'blured_icon_2', src: 'assets/main/symbols/blured/icon_2_04.png'},
            {alias: 'blured_icon_3', src: 'assets/main/symbols/blured/icon_3_04.png'},
            {alias: 'blured_icon_4', src: 'assets/main/symbols/blured/icon_4_04.png'},
            {alias: 'blured_icon_5', src: 'assets/main/symbols/blured/icon_5_04.png'},
            {alias: 'blured_icon_6', src: 'assets/main/symbols/blured/icon_6_04.png'},
            {alias: 'blured_icon_7', src: 'assets/main/symbols/blured/icon_7_04.png'},
            {alias: 'blured_icon_8', src: 'assets/main/symbols/blured/icon_8_04.png'},
            {alias: 'win_symbols', src: 'assets/main/symbols/win_symbols.json'},


            {alias: 'logo', src: 'assets/main/logo.json'},
            {alias: 'fire', src: 'assets/main/fire.json'},
            {alias: 'winlines', src: 'assets/main/winlines.json'},
            {alias: 'pins', src: 'assets/main/pins.json'},

            ...Gui.getResources(),

        ], (progress) => {
            console.log(progress);
        });
    }

    async create(): Promise<void> {
        this.slot = new Slot(3, 5, {size: {width: 144, height: 144}, gap: {x: 17, y: 17}});
        onResize(({game}) => {
            this.slot.x = game.width / 2;
            this.slot.y = 95;
        });


        const background = new PIXI.Sprite(PIXI.Assets.get('back'));
        background.anchor.set(.5);
        onResize(toCanvasCenter(background));

        this.game.stage.addChild(this.slot);
        this.game.stage.addChild(background);

        const winLines = WinLine.createWinLines();
        toCanvas(winLines, () => {
            return {
                x: 150,
                y: 120
            }
        });

        this.game.stage.addChild(winLines);

        // create hero
        const hero = new SpriteAnimation({
            'idle': Array.from({length: 34}, (v, i) => PIXI.Assets.get(`pers_static_${i}`))
        });
        hero.anchor.set(0);
        toCanvas(hero, ({game}) => {
            return {x: game.width - 250, y: 200}
        });
        this.game.stage.addChild(hero);
        hero.play('idle', true);

        // fire
        const fire = new SpriteAnimation<'fire'>(PIXI.Assets.get('fire').animations);
        fire.anchor.set(0.5, 1);
        this.game.stage.addChild(fire);
        toCanvas(fire, {x: 220, y: 650});
        fire.play('fire', true);


        const logo = new SpriteAnimation<'logo'>(PIXI.Assets.get('logo').animations);
        logo.anchor.set(0.5, 0);
        logo.scale.set(0.8);
        toCanvas(logo, {x: 1280 / 2, y: 0});

        scheduledLoop(() => logo.play('logo'), () => rand(6000, 9000));
        this.game.stage.addChild(logo);


        this.gui = new Gui();
        this.game.stage.addChild(this.gui);
        this.gui.startClicked.add(this.startRound);
    }


    @Bound
    async startRound() {
        this.gui.disable();

        await this.reset();

        await this.slot.spin();

        const res = [
            [1, WinLine.patterns[0].slice(0, rand(3, 5))],
            [2, WinLine.patterns[1].slice(0, rand(3, 5))],
            [3, WinLine.patterns[2].slice(0, rand(3, 5))],
        ] as [number, number[]][];


        function getRandomLineResult() {
            const line = rand(1, 9);

            return [line, WinLine.patterns[line - 1].slice(0, rand(3, 5))] as [number, number[]];
        }

        const allLinesJob: TJob = () => {
            const done = Promise.all(res.map((r, i) => {
                const [line, pattern] = r;

                return WinLine.lines[line - 1].play()
            }));

            const cancel = () => {
                res.forEach((r, i) => {
                    const [line, pattern] = r;

                    return WinLine.lines[line - 1].stop();
                })
            }

            return {done, cancel}
        }


        const lineByLineJobs: TJob[] = res.map((r, i) => {
            const [line, pattern] = r;

            return () => {
                const done = Promise.all([
                    WinLine.lines[line - 1].play(),
                    this.slot.playCellsWin([pattern])
                ])

                return {
                    done,
                    cancel: () => {
                        WinLine.lines[line - 1].stop()
                    }
                }
            }
        });

        const {cancel} = sequence([allLinesJob, repeat(sequence(lineByLineJobs), 'infinite')])();

        this.winLinesReset = cancel;

        this.gui.enable();
    }

    private winLinesReset = () => {
    }

    async reset() {
        this.winLinesReset();
    }

}
