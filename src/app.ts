import Rect from "./Rect.js";
import Model from "./Model.js";
import View from "./View.js";
import Controller from "./Controller.js";


const model = new Model(new Rect(-2, -2, 4, 4));
model.fillDeeps();
const view = new View(model);
new Controller(model, view);
view.draw();