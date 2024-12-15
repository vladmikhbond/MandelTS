export const glo = {
    canvas: <HTMLCanvasElement>document.getElementById('canvas'),
    deepText: <HTMLInputElement>document.getElementById('deepText'),
    deepSpan: <HTMLSpanElement>document.getElementById('deepSpan'),
    scaleSpan: <HTMLSpanElement>document.getElementById('scaleSpan'),
    darkInputColor:  <HTMLInputElement>document.getElementById('darkColor'),
    lightInputColor:  <HTMLInputElement>document.getElementById('lightColor'),
    thirdInputColor:  <HTMLInputElement>document.getElementById('thirdColor'),
    themeRButtons: <NodeListOf<HTMLInputElement>>document.getElementsByName("themes"),
    exportButton: <HTMLButtonElement>document.getElementById("exportButton"),
    importButton: <HTMLButtonElement>document.getElementById("importButton"),
    exportText: <HTMLInputElement>document.getElementById('exportText'),
    importText: <HTMLInputElement>document.getElementById('importText'),
    helpButton: <HTMLButtonElement>document.getElementById("helpButton"),
    helpDiv: <HTMLDivElement>document.getElementById('helpDiv'),
};



export function distance(x1:number, y1:number, x2:number, y2:number) {
    let dx = x2 - x1, dy = y2 - y1;
    return Math.sqrt(dx * dx - dy * dy);
}