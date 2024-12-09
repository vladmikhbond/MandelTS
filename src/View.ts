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
        this.pixels = new Uint8ClampedArray(this.canvas.width * this.canvas.height * 4); // RGBA
        
        this.ctx = this.canvas.getContext("2d")!;
        // transform
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(1, -1);
        
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

    drawGrayRect(canvX: number, canvY: number) {
        // retransform
        canvX -= this.canvas.width / 2;
        canvY = this.canvas.height / 2 - canvY;

        let w = this.canvas.width / this.model.SCALE;
        let h = this.canvas.height / this.model.SCALE; 
        let x = canvX - w / 2;
        let y = canvY - h / 2;
        this.ctx.strokeStyle = 'gray';
        this.ctx.strokeRect(x, y, w, h);
    }

    draw(doImage = true) {     
        if (doImage) this.doImage(); 
        this.ctx.putImageData(this.doImage(), 0, 0);
    }

}