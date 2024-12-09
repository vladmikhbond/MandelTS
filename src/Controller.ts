import Rect from "./Rect.js";
import Model from "./Model.js";
import View from "./View.js";

export default class Controller 
{
    

    constructor(model: Model, view: View) 
    {
        view.canvas.addEventListener('click', (e: MouseEvent) => {
            
            let scale = 2;
            if (e.altKey) scale = 1/scale; 
            model.scaledWindow(e.offsetX, e.offsetY, scale);
            model.fillDeeps();
            view.draw();
            
        });
    }

}