import { Range } from "Types";

const drawVerticalLine = (ctx: CanvasRenderingContext2D, height: number, x: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
};

const drawRange = (ctx: CanvasRenderingContext2D, height: number, range: Range, color: string) => {
    if (range.start >= 0) drawVerticalLine(ctx, height, range.start, color);
    if (range.end >= 0) drawVerticalLine(ctx, height, range.end, color);
    if (range.start >= 0 && range.end >= 0) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color;
        ctx.fillRect(range.start, 0, range.end - range.start + 1, height);
        ctx.globalAlpha = 1;
    }
};

const paintViewer = (canvas: HTMLCanvasElement, data: number[], time: number, duration: number, wCoord: Range, uCoord: Range, cursor: number) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height)

    const nbBar = data.length;
    const barWidth = width / nbBar;

    data.forEach((v, i) => {
        ctx.fillStyle = 'blue';
        ctx.fillRect(i * barWidth, height, barWidth, -height * v);
    })

    drawVerticalLine(ctx, height, width * (time / duration), 'red');
    if (cursor >= 0) drawVerticalLine(ctx, height, cursor, 'grey');

    drawRange(ctx, height, wCoord, 'green');
    drawRange(ctx, height, uCoord, 'purple');

  }

export default paintViewer;
