import { Annotations } from "Types";

const drawVerticalLine = (ctx: CanvasRenderingContext2D, height: number, x: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
};

const drawRange = (ctx: CanvasRenderingContext2D, height: number, start: number, end: number, color: string) => {
    if (start >= 0) drawVerticalLine(ctx, height, start, color);
    if (end >= 0) drawVerticalLine(ctx, height, end, color);
    if (start >= 0 && end >= 0) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color;
        ctx.fillRect(start, 0, end - start + 1, height);
        ctx.globalAlpha = 1;
    }
};

const paintViewer = (canvas: HTMLCanvasElement, data: number[], time: number, duration: number, annotations: Annotations, cursor: number) => {
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

    drawRange(ctx, height, annotations.wakeword_start, annotations.wakeword_end, 'green');
    drawRange(ctx, height, annotations.utterance_start, annotations.utterance_end, 'purple');

  }

export default paintViewer;
