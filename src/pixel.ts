export default class Pixel {
    ctx: CanvasRenderingContext2D;
    offCtx: CanvasRenderingContext2D;

    constructor() {
        const canvas = document.createElement('canvas');
        const offCanvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d');
        this.offCtx = offCanvas.getContext('2d');
    }
}
