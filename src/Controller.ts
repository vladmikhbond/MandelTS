import {glo, distance} from "./globals.js";
import Model from "./Model.js";
import {View, colors, str2rgb, ThemeMode} from "./View.js";

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
            glo.deepSpan.innerHTML = model.canvasDepthAt(e.offsetX, e.offsetY);            
        });
    
        // canvas_mouseup
        glo.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            if (distance(e.offsetX, e.offsetY, mousPos.x, mousPos.y) < 10) {
                model.scaleScope(e.offsetX, e.offsetY);
                view.drawAnime();
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

        // dark color_change
        glo.darkInputColor.addEventListener('change', () => {
            colors.dark = str2rgb(glo.darkInputColor.value);
            view.draw();
        });

        // light color_change
        glo.lightInputColor.addEventListener('change', () => {
            colors.light = str2rgb(glo.lightInputColor.value);
            view.draw();
        });

        // third color_change
        glo.thirdInputColor.addEventListener('change', () => {
            colors.third = str2rgb(glo.thirdInputColor.value);
            view.draw();
        });
        
        // radioButtons_click 
        for (const rButton of glo.themeRButtons) {
            rButton.addEventListener('click', (e) => {
                view.themeMode = +(e.target as HTMLInputElement).value;
                if (rButton == glo.themeRButtons[ThemeMode.zebra]) {                    
                    view.nextPalette();
                }
                view.draw();
            });
        }

        // exportButton_click
        glo.exportButton.addEventListener('click', () => {
            glo.exportText.value = model.export();
        }) 

        // importButton_click
        glo.importButton.addEventListener('click', () => {
            model.import(glo.exportText.value);
            view.draw();
        }) 

        // canvas_keydown
        glo.canvas.addEventListener('keydown', (e) => {
            console.log(e.key)
            // Check if Ctrl+Z pressed
            if (e.ctrlKey && 'zZяЯ'.includes(e.key) ) {
                console.log('Ctrl + Z')
                model.undo();
                view.draw();
            }
        });

        // helpButton_click
        glo.helpButton.addEventListener('click', () => {
            glo.helpDiv.style.display = glo.helpDiv.style.display != 'block' ? 'block' : 'none';
        }) 


    }


}
