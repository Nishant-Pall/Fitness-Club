import moment from "moment";
import React, { useEffect, useState } from "react";
import { ButtonGroup, Button } from "reactstrap";
import api from "../../Services/api";

export const MyRegistrations: React.FC = () => {
    const [myEvents, setMyEvents] = useState([]);
    const user = localStorage.getItem("user");

    useEffect(() => {
        getMyEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getMyEvents = async () => {
        try {
            const response = await api.get("/registration", { headers: { user } });
            setMyEvents(response.data);
        } catch (error) {}
    };

    const isApproved = (approved: boolean) => (approved === true ? "Approved" : "Rejected");

    const acceptEventHandler = async (eventId: any) => {
        try {
            await api.post(`/registration/${eventId}/approvals`, {}, { headers: { user } });
            getMyEvents();
        } catch (err) {
            console.log(err);
        }
    };

    const rejectEventHandler = async (eventId: any) => {
        try {
            await api.post(`/registration/${eventId}/rejections`, {}, { headers: { user } });
            getMyEvents();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <ul className="events">
            {myEvents.map((event: any) => (
                <li key={event._id}>
                    <div>
                        <strong>{event.eventTitle}</strong>
                    </div>
                    <div className="events-details">
                        <span>Event Date: {moment(event.eventDate).format("l")}</span>
                        <span>Event Price: £{parseFloat(event.eventPrice).toFixed(2)}</span>
                        <span>User Email: {event.userEmail}</span>
                        <span>
                            Status:
                            <span className={event.approved !== undefined ? isApproved(event.approved) : "Pending"}>
                                {event.approved !== undefined ? isApproved(event.approved) : "Pending"}
                            </span>
                        </span>
                    </div>
                    <ButtonGroup>
                        <Button
                            disabled={event.approved === true || event.approved === false ? true : false}
                            color="secondary"
                            onClick={() => acceptEventHandler(event._id)}
                        >
                            Accept
                        </Button>
                        <Button
                            disabled={event.approved === true || event.approved === false ? true : false}
                            color="danger"
                            onClick={() => rejectEventHandler(event._id)}
                        >
                            Reject
                        </Button>
                    </ButtonGroup>
                </li>
            ))}
        </ul>
    );
};
