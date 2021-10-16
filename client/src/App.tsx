import React from "react";
import "./App.css";
import { Container } from "reactstrap";
import Routes from "./routes";

const App: React.FC = () => {
    return (
        <Container>
            <h1>Sport's App</h1>
            <div className="content">
                <Routes />
            </div>
        </Container>
    );
};

export default App;
