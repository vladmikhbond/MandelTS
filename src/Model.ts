import Rect from "./Rect.js";

export default class Model 
{
    ZOOM_STEP = 10;
    
    scope: Rect;
    canvas: HTMLCanvasElement;
    
    deeps: number[];
    // initial scale
    K0: number;
     
    constructor(init: Rect) {
        this.scope = init;
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.K0 = init.w / this.canvas.width;
        this.deeps = new Array(this.canvas.width * this.canvas.height);  
    }
    // obtained scale
    get K() { return this.scope.w / this.canvas.width; }
    

    private fillDeeps() { 
        let k = this.K;       
        for (let y = 0; y < this.canvas.height; y++) {
            let windY = y * k + this.scope.y;
            for (let x = 0; x < this.canvas.width; x++) {
                let windX = x * k + this.scope.x;             
                this.deeps[y * this.canvas.width + x] = Model.countDeep(windX, windY);
            }
        }
    }


    private static countDeep(wx: number, wy: number, limit = 1000) {
        let x = wx, y = wy;
        for (let i = 0; i < limit; i++) {
            [x, y] = [x * x - y * y + wx, 2 * x * y + wy];
            if ((x * x) + (y * y) > 4)
                return i;
        }
        return limit;
    }

    scaleWindow(canvX: number, canvY: number) { 
        let centerX = canvX * this.K + this.scope.x;   
        let centerY = canvY * this.K + this.scope.y;
        this.scope.w /= this.ZOOM_STEP;
        this.scope.h /= this.ZOOM_STEP;
        this.scope.x = centerX - this.scope.w / 2;
        this.scope.y = centerY - this.scope.h / 2;

        this.fillDeeps();      
    }



} 