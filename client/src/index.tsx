import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouteComponentProps } from "react-router";

const routeComponentPropsMock: RouteComponentProps = {
    history: {} as any,
    location: {} as any,
    match: {} as any,
};

ReactDOM.render(<App {...routeComponentPropsMock} />, document.getElementById("root"));
