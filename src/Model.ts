import Rect from "./Rect.js";

export default class Model {
    world: Rect;
    width: number;
    height: number
    deeps: number[];

    constructor(init: Rect) {
        this.world = init;
        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.width = canvas.width;
        this.height = canvas.height;
        this.deeps = new Array(canvas.width * canvas.height);
    }

    fill() {
        const Kx = this.world.w / this.width; 
        const Ky = this.world.h / this.height; 
        
        for (let y = 0; y < this.height; y++) {
            let worldY = y * Ky + this.world.y;
            for (let x = 0; x < this.width; x++) {
                let worldX = x * Kx + this.world.x;             
                this.deeps[y * this.width + x] = Model.countDeep(worldX, worldY);
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




} 