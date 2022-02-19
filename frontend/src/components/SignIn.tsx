import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

import 'components/SignIn.scss';


const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        // firebase && firebase
        //     .doSignIn(email, password)
        //     .then(() => {
        //         history.goBack();
        //     })
        //     .catch(error => {
        //         setError(error.message);
        //     });

        event.preventDefault();
    };

    return (
        <div className='signin'>
            <form onSubmit={onSubmit} className='signin__form'>

                <label  >
                    Email
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label  >
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </label>

                <div className='signin__button'>
                    <input type="submit" value="Sign In"/>
                </div>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default SignIn;
