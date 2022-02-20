import React, {ReactNode, ReactElement} from 'react';

import Cancel from "assets/icons/cancel";

import 'components/Modal.scss';


export interface ModalContent {
    component: ReactNode,
    title: string,
}

export type StateProps = {
    title: string;
    children: ReactNode | null;
};

export type DispatchProps = {
    onClose: () => void;
};

type Props = StateProps & DispatchProps;

const Modal = ({
                   title,
                   children,
                   onClose,
               }: Props): ReactElement<'div'> => (
    <div className='modal' onClick={onClose}>
        <div className='modal__body' onClick={e => e.stopPropagation()}>
            <div className='modal__header'>
                <h4 className='modal__title'>{title}</h4>
                <button onClick={onClose} className='modal__button'>
                    <Cancel/>
                </button>
            </div>
            <div className='modal__content'>
                {children}
            </div>
        </div>
    </div>
);

export default Modal;
