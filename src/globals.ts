export const glo = {
    canvas: <HTMLCanvasElement>document.getElementById('canvas'),
    deepText: <HTMLInputElement>document.getElementById('deepText'),
    deepSpan: <HTMLSpanElement>document.getElementById('deepSpan'),
    darkColor:  <HTMLInputElement>document.getElementById('darkColor'),
    lightColor:  <HTMLInputElement>document.getElementById('lightColor'),
    thirdColor:  <HTMLInputElement>document.getElementById('thirdColor'),
    themes: <NodeListOf<HTMLInputElement>>document.getElementsByName("themes"),
};


export const colors = {
    dark: [0, 0, 0],
    light: [255, 0, 0],
    third: [0, 0, 255],
};

// '#rrggbb' => [r, g, b]
export function parseColor(color: string): number[] {
    let r = parseInt((color.slice(1, 3)), 16);
    let g = parseInt((color.slice(3, 5)), 16);
    let b = parseInt((color.slice(5, 7)), 16);
    return [r, g, b];
}

// [r, g, b] => '#rrggbb'
export function doColor(arr: number[]): string {
    return '#' + arr.map(x => ('0' + x.toString(16)).slice(-2)).join('');
}