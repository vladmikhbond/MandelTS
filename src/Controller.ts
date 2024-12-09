import {glo} from "./globals.js";
import Model from "./Model.js";
import View from "./View.js";

export default class Controller 
{
    

    constructor(model: Model, view: View) 
    {
        let offsetX = glo.canvas.width / 2;
        let offsetY = glo.canvas.height / 2;
        

        // canvas_click
        glo.canvas.addEventListener('click', (e: MouseEvent) => {
            let zoom = e.altKey ? 1 / model.ZOOM_STEP : model.ZOOM_STEP
            model.scaleWindow(e.offsetX, e.offsetY, zoom);
            view.draw();
        });
    
        // canvas_mousemove
        glo.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            const D = 5;
            view.draw(false);
            if (D < e.offsetX && e.offsetX < glo.canvas.width - D &&
                D < e.offsetY && e.offsetY < glo.canvas.height - D) {
                view.drawGrayRect(e.offsetX, e.offsetY);
            }        
        });
    
        // deepText_change
        glo.deepText.addEventListener('change', () => {
            model.DEEP_LIMIT = +glo.deepText.value;
            model.scaleWindow(offsetX, offsetY, 1);
            view.draw();
        });


    }


}