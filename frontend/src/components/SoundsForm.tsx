import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import { createSounds } from 'store/actions';

import 'components/SoundsForm.scss';
import FileUploader from './FileUploader';
import { Task } from 'Types';
import { clearModal } from 'store/reducer';

export type Props = {
    task: Task
}

const SoundsForm = ({ task }: Props) => {
    const [files, setFiles] = useState<FileList>();
    const dispatch = useDispatch();

    const onSubmit = (e) => {
        e.preventDefault();
        files && dispatch(createSounds(task, files)).then(() => dispatch(clearModal()));
    };

    return (
        <form onSubmit={onSubmit} className='soundform'>
            <label>
                Files
                <FileUploader onDrop={setFiles}/>
            </label>

            <div className='soundform__footer'>
                <input type="submit" value="Upload"/>
            </div>
        </form>
    );
}

export default SoundsForm