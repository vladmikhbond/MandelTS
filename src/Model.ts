import {glo} from "./globals.js";
import Rect from "./Rect.js";
export default class Model 
{
    ZOOM = 10;
    depthLimit = 1000;
    maxDepth = this.depthLimit;
    minDepth = 0;
    avgDepth = 0;
    

    scope: Rect;  
    
    depths: number[];
    
    K0: number;    // initial scale
     
    constructor(init: Rect) {
        this.scope = init;

        this.K0 = init.w / glo.canvas.width;
        this.depths = new Array(glo.canvas.width * glo.canvas.height);  

        this.setDepths();
    }

    // obtained scale
    get scale() { return this.scope.w / glo.canvas.width; }
    
    
    getDeep(canvX: number, canvY: number) {
        return this.depths[canvY * glo.canvas.width + canvX] ?? 0;
    }

    private setDepths() {
        this.minDepth = this.maxDepth = this.depthAt(0, 0);
        this.avgDepth = 0;
        let scale = this.scale;       
        for (let y = 0; y < glo.canvas.height; y++) {
            let scopeY = y * scale + this.scope.y;
            for (let x = 0; x < glo.canvas.width; x++) {
                let scopeX = x * scale + this.scope.x; 
                let depth = this.depthAt(scopeX, scopeY);            
                this.depths[y * glo.canvas.width + x] = depth;
                if (this.minDepth > depth) this.minDepth = depth;
                if (this.maxDepth < depth) this.maxDepth = depth; 
                this.avgDepth += depth;         
            }
        }
        this.avgDepth /= this.depths.length;
    }


    depthAt(x: number, y: number) {
        let re = x, im = y;
        for (let d = 0; d < this.depthLimit; d++) {
            [re, im] = [re * re - im * im + x, 2 * re * im + y];
            if ((re * re) + (im * im) > 4)
                return d;
        }
        return this.depthLimit;
    }

    // scale a scope & set depths matrix
    // 
    scaleScope(canvX: number, canvY: number) { 
        let centerX = canvX * this.scale + this.scope.x;   
        let centerY = canvY * this.scale + this.scope.y;
        this.scope.w /= this.ZOOM;
        this.scope.h /= this.ZOOM;
        this.scope.x = centerX - this.scope.w / 2;
        this.scope.y = centerY - this.scope.h / 2;

        this.setDepths();      
    }

    // stranslate a scope & fill depth matrix
    // 
    translateScope(dCanvX: number, dCanvY: number) {
        let k = this.scale;
        this.scope.x += dCanvX * k;
        this.scope.y += dCanvY * k;

        this.setDepths();
    }


    export(): string {
        return JSON.stringify(this.scope);
    }

    import(line: string) {
        this.scope = <Rect>JSON.parse(line);
        this.setDepths();
    }



} 