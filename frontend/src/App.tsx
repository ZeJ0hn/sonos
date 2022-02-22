import React, { useEffect } from 'react';
import Menu from './components/Menu';
import {
    Switch,
    Route,
    Redirect,
    useLocation
} from "react-router-dom";
import WebFont from 'webfontloader';
import { ADMIN_ROUTE, OPERATOR_ROUTE } from 'Routes';
import Editor from 'components/Editor';
import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from 'store/actions';
import { selectModal } from 'store/selector';
import { clearModal } from 'store/reducer';

import 'App.scss';


const App = () => {

    const dispatch = useDispatch();
    const modal = useSelector(selectModal);
    const location = useLocation();

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Roboto']
            }
        });
    }, []);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
            <div className='page'>
                <Menu path={location.pathname}/>

                <div className='content'>
                    <Switch>
                        <Route strict path={ADMIN_ROUTE}>
                            <Editor admin={true} />
                        </Route>
                        <Route strict path={OPERATOR_ROUTE}>
                            <Editor admin={false} />
                        </Route>
                        <Redirect to={OPERATOR_ROUTE} />
                    </Switch>
                </div>

                {
                    modal
                    && (
                        <Modal title={modal.title} onClose={() => dispatch(clearModal())}>
                            {modal.component}
                        </Modal>
                    )
                }
            </div>
    );
}

export default App;
