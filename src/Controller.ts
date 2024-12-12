import {glo, colors, str2rgb} from "./globals.js";
import Model from "./Model.js";
import View from "./View.js";

export default class Controller 
{
    

    constructor(model: Model, view: View) 
    {
        let mousPos = {x: 0, y: 0 };

        // canvas_mousedown
        glo.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            mousPos.x = e.offsetX;
            mousPos.y = e.offsetY; 
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
    
        // canvas_mouseup
        glo.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            if (e.offsetX == mousPos.x) {
                model.scaleScope(e.offsetX, e.offsetY);
                ///////////////////////////////////////////////////////////////////////////////////////////
                view.drawAnime(e.offsetX, e.offsetY);
                //view.draw();
            } else {
                model.translateScope(mousPos.x - e.offsetX, mousPos.y - e.offsetY);
                view.draw();
            }
           
        });
    
        // deepText_change
        glo.deepText.addEventListener('change', () => {
            model.depthLimit = +glo.deepText.value;
            model.translateScope(0, 0);
            view.draw();
        });

        // 
        glo.darkColor.addEventListener('change', () => {
            colors.dark = str2rgb(glo.darkColor.value);
            view.draw();
        });

        // 
        glo.lightColor.addEventListener('change', () => {
            colors.light = str2rgb(glo.lightColor.value);
            view.draw();
        });

        // 
        glo.thirdColor.addEventListener('change', () => {
            colors.third = str2rgb(glo.thirdColor.value);
            view.draw();
        });

        for (const t of glo.themes) {
            t.addEventListener('click', (e) => {
                view.themeMode = +(e.target as HTMLInputElement).value;
                view.draw();
            });
        }
        
        glo.exportButton.addEventListener('click', () => {
            glo.exportText.value = model.export();
        }) 

        glo.importButton.addEventListener('click', () => {
            model.import(glo.exportText.value);
            view.draw();
        }) 

    }


}
