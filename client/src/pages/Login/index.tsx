import React, { useState } from "react";
import api from "../../Services/api";
import { Alert, Button, Container, Form, FormGroup, Input } from "reactstrap";
import { RouteComponentProps } from "react-router";

const Login: React.FC<RouteComponentProps> = ({ history }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await api.post("/login", { email, password });
        const user_id = response.data.user_id || false;
        const user = response.data.user || false;

        try {
            if (user && user_id) {
                localStorage.setItem("user", user);
                localStorage.setItem("user_id", user_id);
                history.push("/");
            } else {
                const message = response.data.message;
                setError(true);
                setErrorMessage(message);
                setTimeout(() => {
                    setError(false);
                    setErrorMessage("");
                }, 2000);
                console.log(errorMessage);
            }
        } catch (error: any) {
            setError(true);
            setErrorMessage(`The server returned an error: ${error.message}`);
        }
    };

    return (
        <Container>
            <h2>Login</h2>
            <p>
                Please <strong>Login</strong> into your account
            </p>
            <Form onSubmit={handleSubmit}>
                <div className="input-group">
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            name="email"
                            id="exampleEmail"
                            placeholder="Your email"
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            name="password"
                            id="examplePassword"
                            placeholder="Your password"
                        />
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button className="submit-btn">Submit</Button>
                </FormGroup>
                <FormGroup>
                    <Button className="secondary-btn" onClick={() => history.push("/register")}>
                        New Account
                    </Button>
                </FormGroup>
            </Form>
            {error ? (
                <Alert color="danger" className="event-validation">
                    {errorMessage}
                </Alert>
            ) : (
                ""
            )}
        </Container>
    );
};

export default Login;
