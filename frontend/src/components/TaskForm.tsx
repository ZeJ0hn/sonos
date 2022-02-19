import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import FileUploader from './FileUploader';
import { createTask } from 'store/actions';

import 'components/TaskForm.scss';


const TaskForm = () => {
    const [name, setName] = useState<string>('');
    const [files, setFiles] = useState<FileList>();
    const dispatch = useDispatch();

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createTask(name, files));
           };

    return (
        <form onSubmit={onSubmit} className='galleryform'>
            <label>
                Name
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </label>

            <label>
                Files
                <FileUploader
                    files={files}
                    onDrop={setFiles}
                />
            </label>
            <div className='galleryform__footer'>
                <input type="submit" value="Create"/>
            </div>
        </form>
    );
}

export default TaskForm