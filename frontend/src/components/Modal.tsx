import React, {ReactNode, ReactElement} from 'react';

import styles from 'components/Modal.module.scss';
import Cancel from "assets/icons/cancel";

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
    <div className={styles.modal} onClick={onClose}>
        <div className={styles.modal__body} onClick={e => e.stopPropagation()}>
            <div className={styles.modal__header}>
                <h4 className={styles.modal__title}>{title}</h4>
                <button onClick={onClose} className={styles.modal__button}>
                    <Cancel/>
                </button>
            </div>
            <div className={styles.modal__content}>
                {children}
            </div>
        </div>
    </div>
);

export default Modal;
