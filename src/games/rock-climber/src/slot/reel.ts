import {Cell} from "./cell";
import {SlotConfig} from "./slot";
import {gsap} from "gsap";
import {rand} from "../../../../core/util/math";

export class Reel extends PIXI.Container {
    private spinResolve: () => void;

    isSpinning = false;

    isStopping = false;

    speedConfig = 5000;

    speed = 0;

    leadingCell: Cell;

    cells: Cell[] = [];

    symbolsToStop: number[] = [1, 2, 3];

    constructor(readonly rows: number = 1, readonly config: SlotConfig) {
        super();

        this.createCells();

        PIXI.Ticker.shared.add(this.update, this);
    }

    createCells() {
        for (let i = 0; i < this.rows + 2; i++) {
            const cell = new Cell(rand(1, 8));
            cell.y = this.getY(i);
            this.cells.push(cell);
            this.addChild(cell);
        }
    }

    getY(index: number) {
        return (index - 1) * (this.config.size.height + this.config.gap.y) + this.config.size.height / 2;
    }


    update(ticker: PIXI.Ticker) {
        if (!this.isSpinning) return;

        this.swapHeadTail((head) => {
            const headIndex = this.cells.length - 1;

            if (head === this.leadingCell) {
                this.leadingCell = this.cells[0];

                if (this.isStopping) {
                    this.isSpinning = false;

                    this.leadingCell.unblur();

                    const distance = this.getY(headIndex) - this.leadingCell.y;

                    const time = (distance / this.speed) * 3;

                    console.log('final tween', distance, this.speed, time);
                    gsap.to(this.leadingCell, {
                        y: this.getY(headIndex), duration: time, ease: "back.out(1.5)", onUpdate: () => {
                            this.swapHeadTail();
                            this.reposition()
                        },
                        onComplete: () => {
                            this.spinResolve();
                        }
                    });

                }
            }


        });

        this.moveLeadingCell(ticker.deltaMS);
        this.reposition();
    }

    swapHeadTail(cb?: (oldHead: Cell) => void) {
        const headIndex = this.cells.length - 1;

        let head = this.cells[headIndex];

        // if head is out of bounds swap head with tail
        if (head.y > this.getY(headIndex) + this.config.size.height / 2 + this.config.gap.y / 2) {
            cb?.(head);

            this.cells.unshift(this.cells.pop());

            const tail = this.cells[0];

            tail.setId(...this.getNextSymbol());
        }
    }

    getNextSymbol(): [number, boolean] {
        if (this.isSpinning){
            return [rand(1, 8), true];
        } else if (this.isStopping && !this.isSpinning) {
            return [this.symbolsToStop.pop() || rand(1, 8), false];
        }
    }

    moveLeadingCell(deltaMS: number) {
        const dy = this.speed * deltaMS / 1000;

        this.leadingCell.y += dy;
    }

    reposition() {
        const leadingCellIndex = this.cells.indexOf(this.leadingCell);
        // console.log('leadingCellIndex', leadingCellIndex);
        const totalDelta = this.leadingCell.y - this.getY(leadingCellIndex);

        for (let i = 0; i < this.cells.length; i++) {
            if (i === leadingCellIndex) continue;

            const cell = this.cells[i];

            cell.y = this.getY(i) + totalDelta;
        }
    }


    spin() {
        this.isSpinning = true;
        this.isStopping = false;

        this.leadingCell = this.cells[0];

        this.speed = 0;

        gsap.to(this, {speed: this.speedConfig, duration: 0.5, ease: "back.in(1.5)"});

        return new Promise<void>((resolve) => {
            this.spinResolve = resolve;
        })
    }

    stop() {
        this.isStopping = true;
        this.symbolsToStop = rand(0,1) ? [1, 2, 3] : [6, 7, 8] ;
    }


}

