import {wait} from "../../../../core/util/time";

export class WinLine extends PIXI.Container {
  constructor(readonly index: number) {
    super();
    const textures = PIXI.Assets.get('winlines').textures;
    const pin_textures = PIXI.Assets.get('pins').textures;

    const left_pin =  new PIXI.Sprite(pin_textures[`${index + 1}.png`]);
    left_pin.anchor.set(0.75, 0.25)
    left_pin.x = 0;
    left_pin.y = 0;

    const line = new PIXI.Sprite(textures[`${index + 1}.png`]);
    line.anchor.set(0, this.getLineTextureAnchorY(index+1));
    line.x = 10;

    const right_pin =  new PIXI.Sprite(pin_textures[`${index + 1}.png`]);
    right_pin.anchor.set(0.75, 0.25)
    right_pin.x = line.x + line.width+20;
    right_pin.y = 0;

    this.addChild(left_pin);
    this.addChild(right_pin);
    this.addChild(line);
  }


  async play(){
    this.visible = true;

    await wait(2000);

    this.visible = false;
  }

  stop(){
    this.visible = false;
  }



  static createWinLines() {
    const winLines = new PIXI.Container();
    for (let i = 0; i < 9; i++) {
      const winLine = new WinLine(i);
      winLine.y = i * 50;
      winLines.addChild(winLine);

      winLine.visible = false;

      WinLine.lines.push(winLine);
    }

    return winLines;
  }

  static lines: WinLine[] = [];

  private getLineTextureAnchorY(index: number): number {
    if ([4, 7,8].includes(index)) {
        return 1;
    }

    return 0;
  }

  public static patterns = [
      [0, 0, 0, 0, 0], // 1
      [0, 0, 1, 0, 0], // 2
      [0, 1, 2, 1, 0], // 3
      [1, 0, 0, 0, 1], // 4
      [1, 1, 1, 1, 1], // 5
      [1, 2, 2, 2, 1], // 6
      [2, 1, 0, 1, 2], // 7
      [2, 2, 1, 2, 2], // 8
      [2, 2, 2, 2, 2], // 8
  ]

}

