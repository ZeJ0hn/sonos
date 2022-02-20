import React, { useCallback, useMemo } from 'react';
import { ModalContent } from 'components/Modal';

import TaskForm from './TaskForm';
import { useDispatch, useSelector } from 'react-redux';
import { selectAudios, selectCurrent, selectTasks } from 'store/selector';
import { Task } from 'Types';
import classnames from 'classnames';
import Done from 'assets/icons/done';
import AudiosForm from './AudiosForm';
import { fetchCurrent } from 'store/actions';

import 'components/Admin.scss';
import AudioCard from './AudioCard';



type Props = {
    openModal: (content: ModalContent) => void
};

const Admin = ({ openModal }: Props) => {

    const tasks = useSelector(selectTasks);
    const current = useSelector(selectCurrent);
    const audios = useSelector(selectAudios);
    const dispatch = useDispatch();

    const onClick = useCallback((t: Task) => dispatch(fetchCurrent(t)), [dispatch]);
 
    const tasksList = useMemo(() => tasks.map(t => {
        const classes = classnames('admin__content__list__item', { 'admin__content__list__item__selected': t.id === current?.id });

        return <div 
            key={t.id}
            className={classes}
            onClick={e => {
                    onClick(t); 
                    e.preventDefault();
                }
            }
        >
            {t.name}
            {
                t.processed && <Done/>
            }
        </div>}
        )
    , [tasks, onClick, current]);

    const audioList = useMemo(() => {
        if (audios){
            return audios.map((a) => <AudioCard audio={a}/>)
        }
        return null;
    }, [audios]);

    return <div>
        <button
            className='admin__button'
            onClick={() => openModal({ title: "Create a task", component: <TaskForm /> })}
        >
            Create a task
        </button>

        <div className='admin__content'>
            <div className='admin__content__list'>
                {tasksList}
            </div>
            <div className='admin__content__details'>
                {
                    current && (
                        <div>
                        <div className='admin__content__details__header'>
                            <div className='admin__content__details__header__title'>{current.name}</div>
                            <button
                                className={classnames('admin__button', 'admin__content__details__header__button')}
                                onClick={() => openModal({ title: "Add audios", component: <AudiosForm task={current}/> })}
                            >
                                Add audios
                            </button>
                        </div>
                        <div>
                            {audioList}
                        </div>
                        </div>
                    )
                }
            </div>
        </div>

    </div>
}

export default Admin;