import React, { useEffect, useRef, useState } from 'react';
import { Annotations, Sound, Task } from 'Types';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrack } from 'store/selector';
import { fetchTrack, skip, validate } from 'store/actions';
import { filterData, normalizeData } from 'tools/AudioTools';
import Play from 'assets/icons/play';
import Pause from 'assets/icons/pause';
import Replay from 'assets/icons/replay';
import paintViewer from 'tools/Painter';

import 'components/SoundCard.scss';


type Props = {
    task: Task,
    sound: Sound,
    readonly: boolean,
};

const pixel2time = (duration: number, width: number, annotations: Annotations): Annotations => {
    return {
        wakeword_start: Math.floor(duration * annotations.wakeword_start / width * 1000),
        wakeword_end: Math.floor(duration * annotations.wakeword_end / width * 1000),
        utterance_start: Math.floor(duration * annotations.utterance_start / width * 1000),
        utterance_end: Math.floor(duration * annotations.utterance_end / width * 1000),
        text: annotations.text,
   }
}

const time2pixel = (duration: number, width: number, annotations: Annotations): Annotations => {
    return {
        wakeword_start: Math.floor(width * annotations.wakeword_start / duration / 1000),
        wakeword_end: Math.floor(width * annotations.wakeword_end / duration / 1000),
        utterance_start: Math.floor(width * annotations.utterance_start / duration / 1000),
        utterance_end: Math.floor(width * annotations.utterance_end / duration / 1000),
        text: annotations.text,
   }
}

const NO_ANNOTATION = {wakeword_start: -1, wakeword_end: -1, utterance_start: -1, utterance_end: -1, text: '' }

const SoundCard = ({ task, sound, readonly }: Props) => {

    const dispatch = useDispatch();
    const track = useSelector(selectTrack(sound))
    const [data, setData] = useState();
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audio, setAudio] = useState<HTMLAudioElement | undefined>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [annotations, setAnnotations ] = useState<Annotations>(NO_ANNOTATION);
    const [cursor, setCursor] = useState(-1);

    useEffect(() => {
        dispatch(fetchTrack(task, sound))
    }, [dispatch, task, sound])

    useEffect(() => {
        if (sound.annotations && canvasRef.current)
            setAnnotations(time2pixel(duration, canvasRef.current.width, sound.annotations))
    }, [canvasRef, duration, sound])

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
          paintViewer(canvasRef.current, data, time, duration, annotations, cursor)
        }
      }, [canvasRef, data, time, duration, annotations, cursor])

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
            if (!canvasRef.current || readonly) return;

            const x = event.clientX - canvasRef.current.offsetLeft;

            if (annotations.wakeword_start < 0) setAnnotations({...annotations, wakeword_start: x});
            else if (annotations.wakeword_end < 0) setAnnotations({...annotations, wakeword_end: x});
            else if (x < annotations.wakeword_start || x < annotations.wakeword_end) return;
            else if (annotations.utterance_start < 0) setAnnotations({...annotations, utterance_start: x});
            else if (annotations.utterance_end < 0) setAnnotations({...annotations, utterance_end: x});
            else setAnnotations(NO_ANNOTATION);
        }

        const onMouseMove = (event) => {
            if (!canvasRef.current || readonly) return;
            const x = event.clientX - canvasRef.current.offsetLeft;
            setCursor(x);
        }

        const notValid = () => annotations.wakeword_start < 0 || annotations.wakeword_end < 0 || annotations.utterance_start < 0 || annotations.utterance_end < 0;
        const onValidate = () => canvasRef.current && dispatch(validate(task, sound, pixel2time(duration, canvasRef.current.width, annotations)));
        const onSkip = () => dispatch(skip(task, sound));

        return (
            <div className='audiocard'>
                <div className='audiocard__title'>
                    {sound.name}
                </div>
                <div className='audiocard__player'>
                    <canvas 
                        onClick={onClick} 
                        onMouseMove={onMouseMove} 
                        onMouseLeave={() => setCursor(-1)} 
                        ref={canvasRef} 
                        className='audiocard__player__viewer' id="myCanvas" width='1000' height="75" />
                    <div className='audiocard__player__buttons'>
                        <div>
                            <button className='audiocard__player__buttons__button' onClick={togglePlay}>{ audio.paused ? <Play/> : <Pause/> }</button>
                            <button className='audiocard__player__buttons__button' onClick={restart}><Replay/></button>
                        </div>
                        <input 
                            className='audiocard__player__buttons__text' 
                            type="text" 
                            value={annotations.text}
                            disabled={readonly}
                            onChange={(event) => setAnnotations({...annotations, text: event.target.value})}
                        />
                        {
                            (sound.status === 'None' && !readonly) &&
                            <div>
                                <button disabled={notValid()} className='audiocard__player__buttons__button' onClick={onValidate}>Validate</button>
                                <button className='audiocard__player__buttons__button' onClick={onSkip}>Skip</button>
                            </div>
                        }
                        {
                            (sound.status !== 'None' && readonly) &&
                            <div className='audiocard__player__buttons__status'>{sound.status}</div>
                        }
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


