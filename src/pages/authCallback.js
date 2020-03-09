import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { parse } from 'query-string';

export const AuthCallback = () => {
    const location = useLocation();
    const { push } = useHistory(); 

    useEffect(() => {
        const { code } = parse(location.search)
        fetch(`http://localhost:8080/swap?code=${code}`)
        .then((resp) => resp.json())
        .then((response) => {
            sessionStorage.setItem('auth', JSON.stringify(response));
            push('/app');
        })
    }, []);
    return (
        <div>Loading...</div>
    );
};