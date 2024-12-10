import {glo, colors, doColor} from "./globals.js";
import Model from "./Model.js";

enum ThemeMode {
    twoColors = 0,
    zebra,
    fair,
    threecolors     
}

export default class View 
{
    model: Model;
    pixels: Uint8ClampedArray;
    ctx: CanvasRenderingContext2D;
    themeMode: ThemeMode = ThemeMode.twoColors;

    constructor(model: Model) {
        this.model = model;
        
        glo.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.pixels = new Uint8ClampedArray(glo.canvas.width * glo.canvas.height * 4); // RGBA
        
        this.ctx = glo.canvas.getContext("2d")!;
        // transform
        this.ctx.translate(glo.canvas.width / 2, glo.canvas.height / 2);
        this.ctx.scale(1, -1);
        // setup init.html
        glo.darkColor.value = doColor(colors.dark);
        glo.lightColor.value = doColor(colors.light);
        glo.thirdColor.value = doColor(colors.third);
        glo.themes[this.themeMode].checked = true;
        glo.deepText.value = model.depthLimit.toFixed(0);
        
    }

    doImage() { 
        const getColor = [this.blackWhite, this.zebra, this.fair, this.threeColors][this.themeMode];

        for (let y = 0; y < glo.canvas.height; y++) {
            let shift = 4 * y * glo.canvas.width;
            for (let x = 0; x < glo.canvas.width; x++) {
                let i = shift + 4 * x;
                let depth = this.model.deeps[i / 4];
 
                let [r, g, b] = getColor.call(this, depth); 
                this.pixels[i] = r;       // R
                this.pixels[i + 1] = g;   // G
                this.pixels[i + 2] = b;   // B
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

//#region Themes ----------------------
 // palettes:   https://color.romanuke.com/czvetovaya-palitra-4517/

    blackWhite(depth: number) {
        return depth > (this.model.maxDepth - this.model.minDepth) / 2 ? colors.dark : colors.light ;
    }

    zebra(depth: number) {
        return [colors.light, colors.third][depth % 2];
    }

   
    fair(depth: number) {
        const cols = [ 
            [0xF9, 0x06, 0x27],
            [0xFD, 0x69, 0x4B],
            [0xEB, 0xEF, 0xB1],
            [0xE1, 0xDF, 0xE2],            
        ];
        return cols[depth % cols.length];
    }

    threeColors(depth: number)
    {
        if (depth == this.model.depthLimit) 
            return colors.dark;
        let k = (depth - this.model.minDepth) / (this.model.depthLimit - this.model.minDepth);
        let [r1, g1, b1] = colors.light;
        let [r2, g2, b2] = colors.third;
        
        let r = (r1 * k + r2 * (1 - k)) | 0;
        let g = (g1 * k + g2 * (1 - k)) | 0;
        let b = (b1 * k + b2 * (1 - k)) | 0;
        return [r, g, b];
    }



//#endregion

}



// const themeColors = [blackWhite, fair, zebra, threeColors];

