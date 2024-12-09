import Rect from "./Rect.js";

export default class Model 
{
    SCALE = 10;

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

    get kX() { return this.window.w / this.width; }
    
    get kY() { return this.window.h / this.height; }
    

    fillDeeps() { 
        let kX = this.kX, kY = this.kY;       
        for (let y = 0; y < this.height; y++) {
            let windY = y * kY + this.window.y;
            for (let x = 0; x < this.width; x++) {
                let windX = x * kX + this.window.x;             
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

    scaleWindow(canvX: number, canvY: number) { 
        let centerX = canvX * this.kX + this.window.x;   
        let centerY = canvY * this.kY + this.window.y;
        this.window.w /= this.SCALE;
        this.window.h /= this.SCALE;
        this.window.x = centerX - this.window.w / 2;
        this.window.y = centerY - this.window.h / 2;      
    }



} 