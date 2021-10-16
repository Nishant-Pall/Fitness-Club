import React, { useContext, useState } from "react";
import api from "../../Services/api";
import { Alert, Button, Container, Form, FormGroup, Input } from "reactstrap";
import { RouteComponentProps } from "react-router";
import { UserContext } from "../../user-context";

const Register: React.FC<RouteComponentProps> = ({ history }) => {
    const { setIsLoggedIn } = useContext(UserContext);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (email !== "" && password !== "" && firstName !== "" && lastName !== "") {
            const response = await api.post("/user/register", {
                email,
                password,
                firstName,
                lastName,
            });
            const user = response.data.user || false;
            const user_id = response.data.user_id || false;
            if (user && user_id) {
                localStorage.setItem("user", user);
                localStorage.setItem("user_id", user_id);
                setIsLoggedIn(true);
                history.push("/");
            } else {
                const message = response.data.message;
                setError(true);
                setErrorMessage(message);
                setTimeout(() => {
                    setError(false);
                    setErrorMessage("");
                }, 2000);
            }
        } else {
            setError(true);
            setErrorMessage("You need to fill all the inputs");
            setTimeout(() => {
                setError(false);
                setErrorMessage("");
            }, 2000);
        }
    };

    return (
        <Container>
            <h2>Register</h2>
            <p>
                Please <strong>Register</strong> for a new account
            </p>
            <Form onSubmit={handleSubmit}>
                <div className="input-group">
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            onChange={(event) => setFirstName(event.target.value)}
                            type="text"
                            name="firstName"
                            id="examplefirstName"
                            placeholder="Your first name"
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            onChange={(event) => setLastName(event.target.value)}
                            type="text"
                            name="lastName"
                            id="examplelastName"
                            placeholder="Your last name"
                        />
                    </FormGroup>
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
                    <Button className="secondary-btn" onClick={() => history.push("/login")}>
                        Login instead?
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

export default Register;
