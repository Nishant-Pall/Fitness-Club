import React, { useEffect, useState } from "react";
import api from "../../Services/api";
import {
    Alert,
    Button,
    ButtonDropdown,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import CameraIcon from "../../assets/camera.png";
import { useMemo } from "react";
import { RouteComponentProps } from "react-router";
import "./event.css";

const EventsPage: React.FC<RouteComponentProps> = ({ history }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sport, setSport] = useState("Sport");
    const [price, setPrice] = useState("");
    const [thumbnail, setThumbnail] = useState<any>();
    const [date, setDate] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [dropdownOpen, setOpen] = useState(false);
    const user = localStorage.getItem("user");

    useEffect(() => {
        if (!user) history.push("/login");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggle = () => setOpen(!dropdownOpen);

    // everytime thumbnail changes, refresh preview
    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const eventData = new FormData();

        eventData.append("thumbnail", thumbnail);
        eventData.append("sport", sport.toLowerCase());
        eventData.append("title", title);
        eventData.append("price", price);
        eventData.append("description", description);
        eventData.append("date", date);
        try {
            if (
                title !== "" &&
                description !== "" &&
                price !== "" &&
                sport !== "Sport" &&
                date !== "" &&
                thumbnail !== null
            ) {
                await api.post("/event", eventData, {
                    headers: { user },
                });
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    history.push("/");
                }, 2000);
            } else {
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 2000);
            }
        } catch (error) {
            Promise.reject(error);
            console.log(error);
        }
    };

    const sportEventHandler = (sport: string) => {
        setSport(sport);
    };

    return (
        <Container>
            <h1>Create your event</h1>
            <Form onSubmit={handleSubmit}>
                <div className="input-group">
                    <FormGroup>
                        <Label>Upload Image: </Label>
                        <Label
                            id="thumbnail"
                            style={{ backgroundImage: `url(${preview})` }}
                            className={thumbnail ? "has-thumbnail" : ""}
                        >
                            <Input
                                type="file"
                                onChange={(
                                    event:
                                        | React.ChangeEvent<HTMLInputElement>
                                        | any
                                ) => setThumbnail(event.target.files[0])}
                            />
                            <img
                                src={CameraIcon}
                                style={{ maxWidth: "50px" }}
                                alt="Upload Icon"
                            />
                        </Label>
                    </FormGroup>
                    <FormGroup>
                        <Label>Title: </Label>
                        <Input
                            value={title}
                            id="title"
                            type="text"
                            placeholder={"Event title"}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Event description: </Label>
                        <Input
                            value={description}
                            id="description"
                            type="text"
                            placeholder={"Event description"}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Event price: </Label>
                        <Input
                            value={price}
                            id="price"
                            type="text"
                            placeholder={"Event price $0.00"}
                            onChange={(event) => setPrice(event.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Event date: </Label>
                        <Input
                            value={date}
                            id="date"
                            type="date"
                            onChange={(event) => setDate(event.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                            <Button
                                id="caret"
                                color="primary"
                                value={sport}
                                disabled
                            >
                                {sport}
                            </Button>
                            <DropdownToggle caret color="primary">
                                Choose Sport
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem
                                    onClick={() => sportEventHandler("Running")}
                                >
                                    Running
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => sportEventHandler("Cycling")}
                                >
                                    Cycling
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() =>
                                        sportEventHandler("Swimming")
                                    }
                                >
                                    Swimming
                                </DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button type="submit" className="submit-btn">
                        Create event
                    </Button>
                </FormGroup>
                <FormGroup>
                    <Button
                        className="secondary-btn"
                        onClick={() => history.push("/")}
                    >
                        Cancel
                    </Button>
                </FormGroup>
            </Form>
            {error ? (
                <Alert color="danger" className="event-validation">
                    Missing required information
                </Alert>
            ) : (
                ""
            )}
            {success ? (
                <Alert color="success" className="event-validation">
                    The event was created successfully
                </Alert>
            ) : (
                ""
            )}
        </Container>
    );
};

export default EventsPage;
