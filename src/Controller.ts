import Rect from "./Rect.js";
import Model from "./Model.js";
import View from "./View.js";

export default class Controller 
{
    

    constructor(model: Model, view: View) 
    {
        // canvas_click
        view.canvas.addEventListener('click', (e: MouseEvent) => {
            model.scaleWindow(e.offsetX, e.offsetY);
            model.fillDeeps();
            view.draw();
        });
    
        // canvas_mousemove
        view.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            const D = 5;
            view.draw(false);
            if (D < e.offsetX && e.offsetX < view.canvas.width - D &&
                D < e.offsetY && e.offsetY < view.canvas.height - D) {
                view.drawGrayRect(e.offsetX, e.offsetY);
            }        
        });
    
    
    }


}