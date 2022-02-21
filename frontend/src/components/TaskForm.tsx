import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from 'store/actions';

import 'components/TaskForm.scss';
import { clearModal } from 'store/reducer';


const TaskForm = () => {
    const [name, setName] = useState<string>('');
    const dispatch = useDispatch();

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createTask(name)).then(() => dispatch(clearModal()));;
    };

    return (
        <form onSubmit={onSubmit} className='taskform'>
            <label>
                Name
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </label>

            <div className='taskform__footer'>
                <input type="submit" value="Create"/>
            </div>
        </form>
    );
}

export default TaskForm