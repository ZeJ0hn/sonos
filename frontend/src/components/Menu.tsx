import React from 'react';
import { Link } from "react-router-dom";
import { ADMIN_ROUTE, OPERATOR_ROUTE } from 'Routes';
import classnames from 'classnames';

import 'components/Menu.scss';

type Props = {
    path: string
}

const Menu = ({ path }: Props) => {
    return <div className='menu'>
        <Link to={OPERATOR_ROUTE} className={classnames('menu__item', { 'menu__item__selected': path === OPERATOR_ROUTE})}>Operator</Link>
        <Link to={ADMIN_ROUTE} className={classnames('menu__item', { 'menu__item__selected': path === ADMIN_ROUTE})}>Admin</Link>
    </div>
}

export default Menu