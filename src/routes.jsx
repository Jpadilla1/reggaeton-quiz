import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { App } from './pages/app';
import { AuthCallback } from './pages/authCallback';

export const Routes = () => (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/app" component={App} />
        <Route exact path="/auth_callback" component={AuthCallback} />
    </Switch>
);
