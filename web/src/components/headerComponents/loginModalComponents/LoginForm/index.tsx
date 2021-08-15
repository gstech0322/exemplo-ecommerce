import React, { useState, useEffect, useRef, FormEvent } from 'react';
import Loader from 'react-loader-spinner';

import { useUser } from '../../../../contexts/userContext';

import { FormContainer } from './styles';

export default function LoginForm() {

    const [getEmail, setEmail] = useState('');
    const [getPassword, setPassword] = useState('');

    const [getIsfetching, setIsfetching] = useState(false);
    const [getDisabledSubmitButton, setDisabledSubmitButton] = useState(true);

    const [getNonoAnimation, setNonoAnimation] = useState(false);

    const userContext = useUser();

    const formRef = useRef(null);

    useEffect(() => {
        if (
            getEmail.trim().length < 8
            || getPassword.trim().length < 6
        ) {
            setDisabledSubmitButton(true);
        } else {
            setDisabledSubmitButton(false);
        }
    }, [getEmail, getPassword]);

    async function handleSubmit(event: FormEvent) {

        event.preventDefault();

        setIsfetching(true);
        const result = await userContext.logIn(getEmail, getPassword);

        if (result == false) {
            setPassword('');
            setNonoAnimation(true);
            setIsfetching(false);
        }
    }

    return (
        <FormContainer 
            onSubmit={handleSubmit}
            className={`${getNonoAnimation && 'no-no-animation'}`}
            ref={(element) => formRef.current = element}
        >

            <div className="input-group">
                <label htmlFor="login-email">e-mail</label>
                <input
                    type='email'
                    id="login-email"
                    data-testid="login-email"
                    value={getEmail}
                    onChange={(event) => setEmail(event.target.value.trim())}
                />
            </div>

            <div className="input-group">
                <label htmlFor="login-password">
                    Senha
                </label>
                <input
                    type='password'
                    id="login-password"
                    data-testid="login-password"
                    value={getPassword}
                    onChange={(event) => setPassword(event.target.value.trim())}
                />
            </div>

            <button
                type="submit"
                className={`login-button ${(getIsfetching) && 'is-fetching'}`}
                data-testid='login-button'
                disabled={getDisabledSubmitButton || getIsfetching}
            >
                {(getIsfetching)
                    ? (
                        <Loader
                            type="TailSpin"
                            color="#0D2235"
                            height={30}
                            width={30}
                        />
                    )
                    : 'Entrar'
                }
            </button>

        </FormContainer>
    );
}