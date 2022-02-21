import React, { useEffect, useRef, useState } from 'react';
import { Sound, Task } from 'Types';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrack } from 'store/selector';
import { fetchTrack } from 'store/actions';
import { filterData, normalizeData } from 'tools/AudioTools';

import 'components/SoundCard.scss';


type Props = {
    task: Task,
    sound: Sound
};

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

const paintCanvas = (canvas: HTMLCanvasElement, data: number[], time: number, duration: number, wCoord: Range, uCoord: Range) => {
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

    drawRange(ctx, height, wCoord, 'green');
    drawRange(ctx, height, uCoord, 'purple');

  }

type Range = {
    start: number;
    end: number;
}

const SoundCard = ({ task, sound }: Props) => {

    const dispatch = useDispatch();
    const track = useSelector(selectTrack(sound))
    const [data, setData] = useState();
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audio, setAudio] = useState<HTMLAudioElement | undefined>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [wakeWordCoord, setWakeWordCoord ] = useState<Range>({start: -1, end: -1 });
    const [utteranceCoord, setUtteranceCoord ] = useState<Range>({start: -1, end: -1 });

    useEffect(() => {
        dispatch(fetchTrack(task, sound))
    }, [dispatch, task, sound])

    useEffect(() => {
        if (track) {
            const audioContext = new AudioContext();
            track.arrayBuffer().then((buffer) => audioContext.decodeAudioData(buffer))
                .then((audiodata) => filterData(audiodata))
                .then((filterdata) => normalizeData(filterdata))
                .then((d) => setData(d));

            const audioObj = new Audio(URL.createObjectURL(track));
            audioObj.onloadedmetadata = () => setDuration(audioObj.duration);
            audioObj.ontimeupdate = () => setTime(audioObj.currentTime);
            setAudio(audioObj);
        }
    }, [track, setData, setAudio]);

    useEffect(() => {
        if (canvasRef.current && data) {
          paintCanvas(canvasRef.current, data, time, duration, wakeWordCoord, utteranceCoord)
        }
      }, [canvasRef, data, time, duration, wakeWordCoord, utteranceCoord])

    if (audio){
        const togglePlay = () => {
            if(audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        }

        const restart = () => {
            audio.currentTime = 0
            if(!audio.paused){
                audio.pause();
            }
        }

        const onClick = (event) => {
            if (!canvasRef.current) return;

            const point = event.clientX - canvasRef.current.offsetLeft;

            if (wakeWordCoord.start < 0) setWakeWordCoord({...wakeWordCoord, start: point});
            else if (wakeWordCoord.end < 0) setWakeWordCoord({...wakeWordCoord, end: point});
            else if (utteranceCoord.start < 0) setUtteranceCoord({...utteranceCoord, start: point});
            else if (utteranceCoord.end < 0) setUtteranceCoord({...utteranceCoord, end: point});
        }

        const validate = () => {

        }

        return (
            <div className='audiocard'>
                <div className='audiocard__title'>
                    {sound.name}
                </div>
                <div className='audiocard__player'>
                    <canvas onClick={onClick} ref={canvasRef} className='audiocard__player__viewer' id="myCanvas" width='1000' height="75" />
                    <div className='audiocard__player_button'>
                        <button onClick={togglePlay}>Play/Pause</button>
                        <button onClick={restart}>Reset</button>
                        <button onClick={validate}>Validate</button>
                    </div>
                </div>
            </div>
        )
    }

    return <div className='audiocard'>
    {sound.name} Loading
    </div>
};

export default SoundCard;