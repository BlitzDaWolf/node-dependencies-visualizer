import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import App from './App';
import Project from './Project';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/project" component={Project} />
            <Route exect path="/" component={App} />
        </Switch>
    </BrowserRouter>
)

export default Router;