import React, { useCallback, useEffect, useMemo } from 'react';

import TaskForm from './TaskForm';
import { useDispatch, useSelector } from 'react-redux';
import { selectSounds, selectCurrent, selectTasks } from 'store/selector';
import { Task } from 'Types';
import classnames from 'classnames';
import Done from 'assets/icons/done';
import { fetchCurrent } from 'store/actions';
import { clearCurrent, setModal } from 'store/reducer';
import SoundCard from './SoundCard';
import SoundsForm from './SoundsForm';

import 'components/Editor.scss';

type Props = {
    admin: boolean
};

const Editor = ({ admin }: Props) => {

    const tasks = useSelector(selectTasks);
    const current = useSelector(selectCurrent);
    const sounds = useSelector(selectSounds);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearCurrent())
    }, [admin, dispatch]);

    const onClick = useCallback((t: Task) => dispatch(fetchCurrent(t)), [dispatch]);
 
    const tasksList = useMemo(() => tasks.filter((t) => admin? true: !t.processed).map(t => {
        const classes = classnames('editor__content__left__list__item', { 'editor__content__left__list__item__selected': t.id === current?.id });

        return <div 
            key={t.id}
            className={classes}
            onClick={e => {
                    onClick(t); 
                    e.preventDefault();
                }
            }
        >
            {
                t.processed && <Done/>
            }
            <span className={"editor__content__left__list__item__text"}>{t.name}</span>
        </div>}
        )
    , [tasks, onClick, current, admin]);

    const audioList = useMemo(() => {
        if (current && sounds){
            const filteredSounds = sounds.filter((s) => admin ? true: s.status === 'None');
            if (filteredSounds.length > 0)
                return filteredSounds.map((a) => <SoundCard key={a.id} task={current} sound={a} readonly={admin}/>)
            else
                return <p>No more audio</p>
        }
        return null;
    }, [current, sounds, admin]);

    return <div>

        <div className='editor__content'>
            <div className='editor__content__left'>
                {
                    admin && 
                    <button
                        className='editor__button'
                        onClick={() => dispatch(setModal({ title: "Create a task", component: <TaskForm /> }))}
                    >
                        Create a task
                    </button>
                }
                <div className='editor__content__left__list'>
                    {tasksList}
                </div>
            </div>
            <div className='editor__content__details'>
                {
                    current && (
                        <div>
                        <div className='editor__content__details__header'>
                            <div className='editor__content__details__header__title'>{current.name}</div>
                            {
                                admin && 
                                <button
                                    className={classnames('editor__button', 'editor__content__details__header__button')}
                                    onClick={() => dispatch(setModal({ title: "Add audios", component: <SoundsForm task={current}/> }))}
                                >
                                    Add audios
                                </button>
                            }
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

export default Editor;