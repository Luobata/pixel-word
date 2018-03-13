const html2canvas = require('html2canvas');

interface Config {
    // 多少个像素宽度集合
    pixelWidth: number;
}

export default class Pixel {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    offCtx: CanvasRenderingContext2D;
    transCtx: CanvasRenderingContext2D;
    body: HTMLElement;
    width: number;
    height: number;
    config: Config;

    constructor() {
        const canvas = document.createElement('canvas');
        const offCanvas = document.createElement('canvas');
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.offCtx = offCanvas.getContext('2d');
        this.body = document.body;
        this.config = {
            pixelWidth: 5,
        };
        this.init(() => {
            const width = this.body.clientWidth;
            const height = this.body.clientHeight;
            this.width = width;
            this.height = height;
            canvas.width = width;
            canvas.height = height;
            offCanvas.width = width;
            offCanvas.height = height;

            this.pixel();
        });
    }

    init(fn: Function) {
        html2canvas(document.body).then((canvas: HTMLCanvasElement) => {
            console.log('finished');
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            // canvas.width = this.width;
            // canvas.height = this.height;
            canvas.style.display = 'none';
            this.transCtx = canvas.getContext('2d');
            this.body.querySelector('img').style.display = 'none';
            this.body.appendChild(canvas);
            fn();
        });
    }

    pixel() {
        // 图片像素画
        const dataWrap = this.transCtx.getImageData(
            0,
            0,
            this.width,
            this.height,
        );
        const data = dataWrap.data;

        const format = (data: Uint8ClampedArray, x: number, y: number) => {
            let r = 0;
            let g = 0;
            let b = 0;
            const total = Math.pow(this.config.pixelWidth, 2);
            for (let i = x; i < x + this.config.pixelWidth; i++) {
                for (let j = y; j < y + this.config.pixelWidth; j++) {
                    const index = j * this.width + i;
                    r += data[4 * index + 0];
                    g += data[4 * index + 1];
                    b += data[4 * index + 2];
                }
            }
            r = r / total;
            g = g / total;
            b = b / total;
            for (let i = x; i < x + this.config.pixelWidth; i++) {
                for (let j = y; j < y + this.config.pixelWidth; j++) {
                    const index = j * this.width + i;
                    data[4 * index + 0] = r;
                    data[4 * index + 1] = g;
                    data[4 * index + 2] = b;
                }
            }
        };

        for (let x = 0; x < this.width; x += this.config.pixelWidth) {
            for (let y = 0; y < this.height; y += this.config.pixelWidth) {
                format(data, x, y);
            }
        }
        console.log(data);

        this.ctx.putImageData(dataWrap, 0, 0);
        this.body.appendChild(this.canvas);
    }
}
