import { AxiosResponse } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import api from "../../Services/api";
import moment from "moment";
import { Alert, Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { RouteComponentProps } from "react-router";
import socketio from "socket.io-client";
import "./dashboard.css";

const Dashboard: React.FC<RouteComponentProps> = ({ history }) => {
    const [events, setEvents] = useState<AxiosResponse["data"]>([]);
    const [rSelected, setRSelected] = useState<String>();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [messageHandler, setMessageHandler] = useState("");
    const [eventsRequest, setEventsRequest] = useState<any>([]);
    const [dropDownOpen, setDropDownOpen] = useState(false);

    const toggle = () => {
        setDropDownOpen(!dropDownOpen);
    };

    const user: any = localStorage.getItem("user");
    const user_id: any = localStorage.getItem("user_id");

    useEffect(() => {
        getEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const socket = useMemo(() => socketio("http://localhost:8000/", { query: { user: user_id } }), [user_id]);

    useEffect(() => {
        socket.on("registration_request", (data) => {
            setEventsRequest([...eventsRequest, data]);
        });
    }, [eventsRequest, socket]);

    const filterHandler = (query: string | undefined) => {
        setRSelected(query);
        getEvents(query);
    };

    const myEventsHandler = async () => {
        try {
            setRSelected("myevents");
            const response = await api.get("/user/events", {
                headers: { user: user },
            });
            setEvents(response.data.events);
        } catch (error) {
            history.push("/login");
        }
    };

    const deleteEventHandler = async (eventId: string) => {
        try {
            await api.delete(`/event/${eventId}`, { headers: { user: user } });
            setSuccess(true);
            setMessageHandler("The event was deleted successfully");
            setTimeout(() => {
                setSuccess(false);
                filterHandler("");
                setMessageHandler("");
            }, 2000);
        } catch (error) {
            setError(true);
            setMessageHandler("Error when deleting event");
            setTimeout(() => {
                setError(false);
                setMessageHandler("");
            }, 2000);
        }
    };

    const getEvents = async (filter?: string) => {
        try {
            const url = filter ? `/dashboard/${filter}` : `/dashboard`;
            const response = await api.get(url, {
                headers: { user: user },
            });
            setEvents(response.data.events);
        } catch (error: any) {
            history.push("/login");
        }
    };

    const registrationRequestHandler = async (event: any) => {
        try {
            await api.post(`/registration/${event.id}`, {}, { headers: { user } });
            setSuccess(true);
            setMessageHandler(`The request for the event ${event.title} was successful`);
            setTimeout(() => {
                setSuccess(false);
                filterHandler("");
                setMessageHandler("");
            }, 2000);
        } catch (error) {
            setError(true);
            setMessageHandler(`The request for the event "${event.title}" failed`);
            setTimeout(() => {
                setError(false);
                setMessageHandler("");
            }, 2000);
        }
    };

    const acceptEventHandler = async (eventId: any) => {
        try {
            await api.post(`/registration/${eventId}/approvals`, {}, { headers: { user } });
            removeNotificationFromDashboard(eventId);
        } catch (error) {
            console.log(error);
        }
    };
    const rejectEventHandler = async (eventId: any) => {
        try {
            await api.post(`/registration/${eventId}/rejections`, {}, { headers: { user } });
            removeNotificationFromDashboard(eventId);
        } catch (error) {
            console.log(error);
        }
    };

    const removeNotificationFromDashboard = (eventId: any) => {
        const newEvents = eventsRequest.filter((event: any) => event._id !== eventId);
        setEventsRequest(newEvents);
    };

    return (
        <div>
            <ul className="notifications">
                {eventsRequest.map((request: any) => {
                    return (
                        <li key={request._id}>
                            <div>
                                <strong>{request.user.email}</strong>is requesting to register to your event:
                                <strong>{request.event.title}</strong>
                            </div>
                            <ButtonGroup>
                                <Button
                                    color="secondary"
                                    onClick={() => {
                                        acceptEventHandler(request._id);
                                    }}
                                >
                                    Approve
                                </Button>
                                <Button
                                    color="danger"
                                    onClick={() => {
                                        rejectEventHandler(request._id);
                                    }}
                                >
                                    Reject
                                </Button>
                            </ButtonGroup>
                        </li>
                    );
                })}
            </ul>
            <div className="filter-panel">
                <Dropdown isOpen={dropDownOpen} toggle={toggle}>
                    <DropdownToggle color="primary" caret>
                        Filter
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => filterHandler("")} active={rSelected === ""}>
                            All Sports
                        </DropdownItem>
                        <DropdownItem onClick={myEventsHandler} active={rSelected === "myevents"}>
                            My Events
                        </DropdownItem>
                        <DropdownItem onClick={() => filterHandler("running")} active={rSelected === "running"}>
                            Running
                        </DropdownItem>
                        <DropdownItem onClick={() => filterHandler("cycling")} active={rSelected === "cycling"}>
                            Cycling
                        </DropdownItem>
                        <DropdownItem onClick={() => filterHandler("swimming")} active={rSelected === "swimming"}>
                            Swimming
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <ul className="events-list">
                {events.map((event: AxiosResponse["data"] | any) => (
                    <li key={event._id}>
                        <header
                            style={{
                                backgroundImage: `url(${event.thumbnail_url})`,
                            }}
                        >
                            {event.user === user_id ? (
                                <div>
                                    <Button
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                            deleteEventHandler(event._id);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ) : (
                                ""
                            )}
                        </header>
                        <strong>{event.title}</strong>
                        <span>Event Date: {moment(event.date).format("l")}</span>
                        <span>Event Price: {parseFloat(event.price).toFixed(2)}</span>
                        <span>Event Description: {event.description}</span>
                        <Button color="primary" onClick={() => registrationRequestHandler(event)}>
                            Registration Request
                        </Button>
                    </li>
                ))}
            </ul>
            {error ? (
                <Alert color="danger" className="event-validation">
                    {messageHandler}
                </Alert>
            ) : (
                ""
            )}
            {success ? (
                <Alert color="success" className="event-validation">
                    {messageHandler}
                </Alert>
            ) : (
                ""
            )}
        </div>
    );
};

export default Dashboard;
