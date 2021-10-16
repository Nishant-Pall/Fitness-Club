import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./pages/Login/index";
import Dashboard from "./pages/Dashboard/index";
import Register from "./pages/Register/index";
import EventsPage from "./pages/EventsPage/index";

const Routes: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/login" exact component={Login} />
                <Route path="/register" exact component={Register} />
                <Route path="/events" component={EventsPage} />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;
