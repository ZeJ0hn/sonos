import React from 'react';
import { ModalContent } from 'components/Modal';

import 'components/Admin.scss';
import TaskForm from './TaskForm';

type Props = {
    openModal: (content: ModalContent) => void
};

const Admin = ({ openModal }: Props) => {

    return <div>

        <button
                        className='admin__add_button'
                        onClick={() => openModal({ title: "Ajouter une image", component: <TaskForm /> })}
                    >
                        Create a task
                    </button>

    </div>
}

export default Admin;