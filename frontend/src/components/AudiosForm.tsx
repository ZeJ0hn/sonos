import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import { createAudios } from 'store/actions';

import 'components/AudiosForm.scss';
import FileUploader from './FileUploader';
import { Task } from 'Types';

export type Props = {
    task: Task
}

const AudiosForm = ({ task }: Props) => {
    const [files, setFiles] = useState<FileList>();
    const dispatch = useDispatch();

    const onSubmit = (e) => {
        e.preventDefault();
        files && dispatch(createAudios(task, files));
    };

    return (
        <form onSubmit={onSubmit} className='audioform'>
            <label>
                Files
                <FileUploader onDrop={setFiles}/>
            </label>

            <div className='audioform__footer'>
                <input type="submit" value="Upload"/>
            </div>
        </form>
    );
}

export default AudiosForm