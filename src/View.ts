import Model from "./Model.js";

export default class View 
{
    model: Model;
    canvas: HTMLCanvasElement;
    pixels: Uint8ClampedArray;
    ctx: CanvasRenderingContext2D;

    constructor(model: Model) {
        this.model = model;
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d")!;
        this.ctx.translate(0, this.canvas.height);
        this.ctx.scale(1, -1);
        this.pixels = new Uint8ClampedArray(this.canvas.width * this.canvas.height * 4); // RGBA
    }

    doImage() { 
        for (let y = 0; y < this.canvas.height; y++) {
            let shift = 4 * y * this.canvas.width;
            for (let x = 0; x < this.canvas.width; x++) {
                let i = shift + 4 * x;
                let red = this.model.deeps[i / 4] > 400 ? 255 : 0;
                this.pixels[i] = red;     // R
                this.pixels[i + 1] = 0;   // G
                this.pixels[i + 2] = 0;   // B
                this.pixels[i + 3] = 255; // A
            }
        }
        return new ImageData(this.pixels, this.canvas.width, this.canvas.height);
    }

    draw() {     
        this.doImage();
        
        this.ctx.putImageData(this.doImage(), 0, 0);
    }

}