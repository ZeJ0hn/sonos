import React from 'react';
import { Link } from "react-router-dom";
import { ADMIN_ROUTE, TASKS_ROUTE } from 'Routes';

import 'components/Menu.scss';


const Menu = () => {
    return <div className='menu'>
        <Link to={TASKS_ROUTE} className='menu__item'>Tasks</Link>
        <Link to={ADMIN_ROUTE} className='menu__item'>Admin</Link>
    </div>
}

export default Menu