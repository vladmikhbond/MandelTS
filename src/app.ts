import Rect from "./Rect.js";
import Model from "./Model.js";
import View from "./View.js";


const model = new Model(new Rect(-2, -2, 4, 4));
model.fill();
const view = new View(model)
view.draw();