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

    private setDepths() 
    {
        this.minDepth = this.maxDepth = this.depthAt(0, 0);
        this.avgDepth = 0;
        let scale = this.scale;       
        for (let canvY = 0; canvY < glo.canvas.height; canvY++) 
        {
            // from canv to scope
            let scopeY = canvY * scale + this.scope.y;
            for (let canvX = 0; canvX < glo.canvas.width; canvX++) 
            {
                // from canv to scope
                let scopeX = canvX * scale + this.scope.x; 
                let depth = this.depthAt(scopeX, scopeY);            
                this.depths[canvY * glo.canvas.width + canvX] = depth;
                
                // max min avg
                if (this.minDepth > depth) this.minDepth = depth;
                if (this.maxDepth < depth) this.maxDepth = depth; 
                this.avgDepth += depth;         
            }
        }
        this.avgDepth /= this.depths.length;
    }


    depthAt(scopeX: number, scopeY: number) {
        let re = scopeX, im = scopeY;
        for (let d = 0; d < this.depthLimit; d++) {
            [re, im] = [re * re - im * im + scopeX, 2 * re * im + scopeY];
            if ((re * re) + (im * im) > 4)
                return d;
        }
        return this.depthLimit;
    }

    // scale a scope & set depths matrix
    // 
    scaleScope(canvCenterX: number, canvCenterY: number) { 
        // from canv to scope
        let scopeCenterX = canvCenterX * this.scale + this.scope.x;   
        let scopeCenterY = canvCenterY * this.scale + this.scope.y;

        this.scope.w /= this.ZOOM;
        this.scope.h /= this.ZOOM;
        this.scope.x = scopeCenterX - this.scope.w / 2;
        this.scope.y = scopeCenterY - this.scope.h / 2;

        this.setDepths();      
    }

    // stranslate a scope & fill depth matrix
    // 
    translateScope(dCanvX: number, dCanvY: number) {
        this.scope.x += dCanvX * this.scale;
        this.scope.y += dCanvY * this.scale;

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