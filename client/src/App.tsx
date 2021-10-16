import React from "react";
import { Container } from "reactstrap";
import { ContextWrapper } from "./user-context";
import Routes from "./routes";
import { RouteComponentProps } from "react-router";
import "./App.css";

const App: React.FC<RouteComponentProps> = ({ history, match, location }) => {
    return (
        <ContextWrapper history={history} location={location} match={match}>
            <Container>
                <h1>Sport's App</h1>
                <div className="content">
                    <Routes />
                </div>
            </Container>
        </ContextWrapper>
    );
};

export default App;
