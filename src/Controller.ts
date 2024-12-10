import {glo, colors, parseColor} from "./globals.js";
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

            glo.deepSpan.innerHTML = model.getDeep(e.offsetX, e.offsetY).toString();      
        });
    
        // deepText_change
        glo.deepText.addEventListener('change', () => {
            model.depthLimit = +glo.deepText.value;
            model.scaleWindow(offsetX, offsetY, 1);
            view.draw();
        });

        // 
        glo.darkColor.addEventListener('change', () => {
            colors.dark = parseColor(glo.darkColor.value);
            view.draw();
        });

        // 
        glo.lightColor.addEventListener('change', () => {
            colors.light = parseColor(glo.lightColor.value);
            view.draw();
        });

        // 
        glo.thirdColor.addEventListener('change', () => {
            colors.third = parseColor(glo.thirdColor.value);
            view.draw();
        });

        for (const t of glo.themes) {
            t.addEventListener('click', (e) => {
                view.themeMode = +(e.target as HTMLInputElement).value;
                view.draw();
            });
        }
        
        

    }


}
