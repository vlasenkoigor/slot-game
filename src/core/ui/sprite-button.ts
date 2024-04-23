import {Button} from "@pixi/ui";

type ButtonTextures = [normal: PIXI.Texture, pressed: PIXI.Texture];
type ButtonTexturesConfig = [normal: string, pressed: string];
export class SpriteButton extends Button
{
    private buttonView = new PIXI.Container();
    private textView: PIXI.Text;
    private buttonBg = new PIXI.Sprite();
    private action: (event: string) => void;

    textures: ButtonTextures;

    constructor(props: {
        textures: ButtonTextures | ButtonTexturesConfig,
        text?: string,
        textColor?: string,
        disabled?: boolean,
        action?: (event: string) => void})
    {
        super(/* we can set a view for button later */);

        this.textures = props.textures.map((texture) => typeof texture === 'string' ? PIXI.Texture.from(texture) : texture)  as ButtonTextures;

        this.view = this.buttonView;

        this.buttonBg.texture = this.textures[0];

        this.buttonBg.anchor.set(0.5);

        this.textView = new PIXI.Text({
            text: props.text, style: {
                fontSize: 40,
                fill: props.textColor
            }
        });
        this.textView.y = -10;
        this.textView.anchor.set(0.5);

        this.buttonView.addChild(this.buttonBg, this.textView);

        this.enabled = !props.disabled;

        this.action = props.action || (()=>{});
    }

    override down()
    {
        this.buttonBg.texture = this.textures[1];
    }

    override up()
    {
        this.buttonBg.texture = this.textures[0];
    }

    override upOut()
    {
        this.buttonBg.texture = this.textures[0];
    }

    override out()
    {
        if (!this.isDown)
        {
            this.buttonBg.texture =  this.textures[0];
        }
    }

    override press()
    {
        this.action('onPress');
    }

    override hover()
    {
        if (!this.isDown)
        {
            this.buttonBg.texture =  this.textures[1];
        }
    }

    set enabled(enabled: boolean) {
        super.enabled = enabled;
        this.buttonBg.texture =  enabled ? this.textures[0] : this.textures[1];
    }
}