import {glo} from "./globals.js";
import Model from "./Model.js";

export default class View 
{
    model: Model;
    pixels: Uint8ClampedArray;
    ctx: CanvasRenderingContext2D;

    constructor(model: Model) {
        this.model = model;
        
        glo.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.pixels = new Uint8ClampedArray(glo.canvas.width * glo.canvas.height * 4); // RGBA
        
        this.ctx = glo.canvas.getContext("2d")!;
        // transform
        this.ctx.translate(glo.canvas.width / 2, glo.canvas.height / 2);
        this.ctx.scale(1, -1);
        
    }

    doImage() { 
        for (let y = 0; y < glo.canvas.height; y++) {
            let shift = 4 * y * glo.canvas.width;
            for (let x = 0; x < glo.canvas.width; x++) {
                let i = shift + 4 * x;
                let deep = this.model.deeps[i / 4];
 
                let red = deep * 255 / this.model.DEEP_LIMIT;
                this.pixels[i] = red;     // R
                this.pixels[i + 1] = 0;   // G
                this.pixels[i + 2] = 0;   // B
                this.pixels[i + 3] = 255; // A
            }
        }
        return new ImageData(this.pixels, glo.canvas.width, glo.canvas.height);
    }

    drawGrayRect(canvX: number, canvY: number) {
        // retransform
        canvX -= glo.canvas.width / 2;
        canvY = glo.canvas.height / 2 - canvY;

        let w = glo.canvas.width / this.model.ZOOM_STEP;
        let h = glo.canvas.height / this.model.ZOOM_STEP; 
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