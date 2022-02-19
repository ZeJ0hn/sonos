import React, { useEffect, useState } from 'react';
import Menu from './components/Menu';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import WebFont from 'webfontloader';
import SignIn from './components/SignIn';
import { ADMIN_ROUTE, TASKS_ROUTE } from 'Routes';
import Admin from 'components/Admin';
import Modal, { ModalContent } from 'components/Modal';
import { useDispatch } from 'react-redux';
import { fetchTasks } from 'store/actions';

import 'App.scss';


const App = () => {

    const [modal, setModal] = useState<ModalContent | undefined>(undefined)
    const dispatch = useDispatch();

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
        <Router>
            <div className='page'>
                <Menu />

                <div className='content'>
                    <Switch>
                        <Route strict path={ADMIN_ROUTE}>
                            <Admin openModal={setModal} />
                        </Route>
                        {/* <Route strict path={TASKS_ROUTE}>
                            <Gallery openModal={setModal} />
                        </Route> */}
                        {/* <Route path="/">
                            <Home />
                        </Route> */}
                    </Switch>
                </div>

                {
                    modal
                    && (
                        <Modal title={modal.title} onClose={() => setModal(undefined)}>
                            {modal.component}
                        </Modal>
                    )
                }
            </div>
        </Router>
    );
}

export default App;
