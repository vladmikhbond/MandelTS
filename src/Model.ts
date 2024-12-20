import {glo} from "./globals.js";
import Rect from "./Rect.js";
export default class Model 
{   
    // zoom for the one click
    ZOOM = 10;
    // scope window
    scope: Rect; 

    depthLimit = 1000;
    // depths matrix
    depths: number[];
    // depth bounds    
    maxDepth = 0;
    minDepth = 0;
    avgDepth = 0;
    
    // initial scale
    initScale: number;    
    // current scale
    get scale() { return this.scope.w / glo.canvas.width; }
    
    undoStack: string[] = [];

    do() {
        let json = JSON.stringify(this.scope);
        this.undoStack.push(json);  
    }

    undo() {
        if (this.undoStack.length > 0) {
            let json = this.undoStack.pop()!;
            this.scope = <Rect>JSON.parse(json);
            this.fillDepths();
        }  
    }

    constructor(initScope: Rect) {
        this.scope = initScope;
        this.initScale = initScope.w / glo.canvas.width;
        this.depths = new Array(glo.canvas.width * glo.canvas.height);  
        
        this.fillDepths();
    }
    
    getDeep(canvX: number, canvY: number) {
        return this.depths[canvY * glo.canvas.width + canvX] ?? 0;
    }

    private fillDepths() 
    {
        this.minDepth = this.maxDepth = Model.measureDepthAt(0, 0, this.depthLimit);
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
                let depth = Model.measureDepthAt(scopeX, scopeY, this.depthLimit);            
                this.depths[canvY * glo.canvas.width + canvX] = depth;
                
                // max min avg
                if (this.minDepth > depth) this.minDepth = depth;
                if (this.maxDepth < depth) this.maxDepth = depth; 
                this.avgDepth += depth;         
            }
        }
        this.avgDepth /= this.depths.length;
    }

    static measureDepthAt(scopeX: number, scopeY: number, limit:number) {
        let re = scopeX, im = scopeY;
        for (let d = 0; d < limit; d++) {
            [re, im] = [re * re - im * im + scopeX, 2 * re * im + scopeY];
            if ((re * re) + (im * im) > 4)
                return d;
        }
        return limit;
    }

    canvasDepthAt(canvX: number, canvY: number): string {
        // from canv to scope
        let scopeX = canvX * this.scale + this.scope.x;
        let scopeY = canvY * this.scale + this.scope.y;

        const INF = 1e6;
        let deep = Model.measureDepthAt(scopeX, scopeY, INF); 
        return deep == INF ? '∞' : deep.toString();
    }
    
    // scale the scope
    // 
    scaleScope(canvCenterX: number, canvCenterY: number) 
    { 
        this.do();  
        // from canv to scope
        let scopeCenterX = canvCenterX * this.scale + this.scope.x;   
        let scopeCenterY = canvCenterY * this.scale + this.scope.y;

        this.scope.w /= this.ZOOM;
        this.scope.h /= this.ZOOM;
        this.scope.x = scopeCenterX - this.scope.w / 2;
        this.scope.y = scopeCenterY - this.scope.h / 2;

        this.fillDepths();  
    }

    // stranslate the scope 
    // 
    translateScope(dCanvX: number, dCanvY: number) {
        this.scope.x += dCanvX * this.scale;
        this.scope.y += dCanvY * this.scale;

        this.fillDepths();
    }

    export(): string {
        return JSON.stringify(this.scope);
    }

    import(line: string) {
        this.scope = <Rect>JSON.parse(line);
        this.fillDepths();
    }

} 