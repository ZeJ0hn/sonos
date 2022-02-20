import React from 'react';
import { Audio } from 'Types';

import 'components/AudioCard.scss';


type Props = {
    audio: Audio
};

const AudioCard = ({ audio }: Props) => {
    return (
        <div className='audiocard'>
            {audio.name}
        </div>
    )
};

export default AudioCard;