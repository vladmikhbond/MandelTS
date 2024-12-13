import {glo, colors, rgb2str} from "./globals.js";
import Model from "./Model.js";

enum ThemeMode {
    twoColors,
    zebra,
    fair,
    threecolors     
}

export default class View 
{
    model: Model;
    ctx = glo.canvas.getContext("2d")!;
    pixels: Uint8ClampedArray;

    offCanvas = new OffscreenCanvas(glo.canvas.width, glo.canvas.height)
    themeMode: ThemeMode = ThemeMode.twoColors;

    constructor(model: Model) {
        this.model = model;
        
        glo.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.pixels = new Uint8ClampedArray(glo.canvas.width * glo.canvas.height * 4); // RGBA

        // setup index.html
        glo.darkColor.value = rgb2str(colors.dark);
        glo.lightColor.value = rgb2str(colors.light);
        glo.thirdColor.value = rgb2str(colors.third);
        glo.themes[this.themeMode].checked = true;
        glo.deepText.value = model.depthLimit.toFixed(0);
        
    }

    createImage() { 
        const getColor = [this.blackWhite, this.zebra, this.fair, this.threeColors][this.themeMode];

        for (let y = 0; y < glo.canvas.height; y++) {
            let shift = 4 * y * glo.canvas.width;
            for (let x = 0; x < glo.canvas.width; x++) {
                let i = shift + 4 * x;
                let depth = this.model.depths[i / 4];
 
                let [r, g, b] = getColor.call(this, depth); 
                this.pixels[i] = r;       // R
                this.pixels[i + 1] = g;   // G
                this.pixels[i + 2] = b;   // B
                this.pixels[i + 3] = 255; // A
            }
        }
        let img = new ImageData(this.pixels, glo.canvas.width, glo.canvas.height);
        let co = this.offCanvas.getContext("2d");
        co!.putImageData(img, 0, 0);
        return this.offCanvas;
        
    }

    draw(renewImage=true) {     
        if (renewImage) {
            this.createImage();
        } 
        // on canvas
        this.ctx.drawImage(this.offCanvas!, 0, 0)
        
        // on html: current scale,
        let log = Math.log10(this.model.K0 / this.model.scale).toFixed(0)
        glo.scaleSpan.innerHTML = `1 : 10<sup>${log}</sup>`;
    }

    drawAnime() {

        let img = this.createImage();
        let n = 20, c = this.ctx, Z = this.model.ZOOM;
        let ss = new Array(n);  // scales 
        ss[0] = 1 / Z;

        for (let i = 1; i <= n; i++) {
            ss[i] = ss[i - 1] +  (Z - 1) / (Z * n);
            setTimeout(() => {
                c.save()                                
                c.translate(glo.canvas.width * (1 - ss[i])/2 , glo.canvas.height * (1 - ss[i])/2 )
                c.scale(ss[i], ss[i])
                c.drawImage(img, 0, 0)
                c.restore()
            }, 10 * i )
        }
         
    }

    drawGrayRect(canvX: number, canvY: number) {

        let w = glo.canvas.width / this.model.ZOOM;
        let h = glo.canvas.height / this.model.ZOOM; 
        let x = canvX - w / 2;
        let y = canvY - h / 2;
        this.ctx.fillStyle = 'rgba(255,255,255, 0.25)';
        this.ctx.fillRect(x, y, w, h);
    }

//#region Themes ----------------------
 // palettes:   https://color.romanuke.com/czvetovaya-palitra-4517/

    blackWhite(depth: number) {
        return depth > this.model.avgDepth ? colors.dark : colors.light;        
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

