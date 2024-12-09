import Rect from "./Rect.js";

export default class Model {
    window: Rect;
    width: number;
    height: number
    deeps: number[];

    constructor(init: Rect) {
        this.window = init;
        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.width = canvas.width;
        this.height = canvas.height;
        this.deeps = new Array(canvas.width * canvas.height);
    }

    fillDeeps() {
        const Kx = this.window.w / this.width; 
        const Ky = this.window.h / this.height; 
        
        for (let y = 0; y < this.height; y++) {
            let windY = y * Ky + this.window.y;
            for (let x = 0; x < this.width; x++) {
                let windX = x * Kx + this.window.x;             
                this.deeps[y * this.width + x] = Model.countDeep(windX, windY);
            }
        }
    }


    static countDeep(wx: number, wy: number, limit = 1000) {
        let x = wx, y = wy;
        for (let i = 0; i < limit; i++) {
            [x, y] = [x * x - y * y + wx, 2 * x * y + wy];
            if ((x * x) + (y * y) > 4)
                return i;
        }
        return limit;
    }

    scaledWindow(canvX: number, canvY: number, scale = 2) {
        const Kx = this.window.w / this.width; 
        const Ky = this.window.h / this.height; 
        let centerX = canvX * Kx + this.window.x;   
        let centerY = canvY * Ky + this.window.y;
        this.window.w /= scale;
        this.window.h /= scale;
        this.window.x = centerX - this.window.w / 2;
        this.window.y = centerY - this.window.h / 2;      
    }



} 