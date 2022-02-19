import React, { useMemo } from 'react';
import { ModalContent } from 'components/Modal';

import 'components/Admin.scss';
import TaskForm from './TaskForm';
import { useSelector } from 'react-redux';
import { selectTasks } from 'store/selector';

type Props = {
    openModal: (content: ModalContent) => void
};

const Admin = ({ openModal }: Props) => {

    const tasks = useSelector(selectTasks);

    const tasksList = useMemo(() => tasks.map(t => <p>{t.name}</p>)
    , [tasks]);

    return <div>
        <button
            className='admin__add_button'
            onClick={() => openModal({ title: "Ajouter une image", component: <TaskForm /> })}
        >
            Create a task
        </button>

        <div className='admin__content'>
            <div className='admin__content__list'>
                {tasksList}
            </div>
            <div></div>
        </div>

    </div>
}

export default Admin;