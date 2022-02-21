import React, { useEffect } from 'react';
import Menu from './components/Menu';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import WebFont from 'webfontloader';
import SignIn from './components/SignIn';
import { ADMIN_ROUTE, TASKS_ROUTE } from 'Routes';
import Admin from 'components/Editor';
import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from 'store/actions';

import 'App.scss';
import { selectModal } from 'store/selector';
import { clearModal } from 'store/reducer';


const App = () => {

    const dispatch = useDispatch();
    const modal = useSelector(selectModal);

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
                            <Admin />
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
                        <Modal title={modal.title} onClose={() => dispatch(clearModal())}>
                            {modal.component}
                        </Modal>
                    )
                }
            </div>
        </Router>
    );
}

export default App;
