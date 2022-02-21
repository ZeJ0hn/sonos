import React, { useEffect, useRef, useState } from 'react';
import { Range, Sound, Task } from 'Types';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrack } from 'store/selector';
import { fetchTrack, skip, validate } from 'store/actions';
import { filterData, normalizeData } from 'tools/AudioTools';

import 'components/SoundCard.scss';
import Play from 'assets/icons/play';
import Pause from 'assets/icons/pause';
import Replay from 'assets/icons/replay';
import paintViewer from 'tools/Painter';


type Props = {
    task: Task,
    sound: Sound
};


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
    const [cursor, setCursor] = useState(-1);

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
          paintViewer(canvasRef.current, data, time, duration, wakeWordCoord, utteranceCoord, cursor)
        }
      }, [canvasRef, data, time, duration, wakeWordCoord, utteranceCoord, cursor])

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

            const x = event.clientX - canvasRef.current.offsetLeft;

            if (wakeWordCoord.start < 0) setWakeWordCoord({...wakeWordCoord, start: x});
            else if (wakeWordCoord.end < 0) setWakeWordCoord({...wakeWordCoord, end: x});
            else if (utteranceCoord.start < 0) setUtteranceCoord({...utteranceCoord, start: x});
            else if (utteranceCoord.end < 0) setUtteranceCoord({...utteranceCoord, end: x});
        }

        const onMouseMove = (event) => {
            if (!canvasRef.current) return;
            const x = event.clientX - canvasRef.current.offsetLeft;
            setCursor(x);
        }

        const onValidate = () => {
            // TODO Add coordinate check
            dispatch(validate(task, sound, {
                 wakeword_start: wakeWordCoord.start,
                 wakeword_end: wakeWordCoord.end,
                 utterance_start: utteranceCoord.start,
                 utterance_end: utteranceCoord.end
            }))
        }

        const onSkip = () => {
            dispatch(skip(task, sound))
        }

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
                        <div>
                            <button className='audiocard__player__buttons__button' onClick={onValidate}>Validate</button>
                            <button className='audiocard__player__buttons__button' onClick={onSkip}>Skip</button>
                        </div>
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