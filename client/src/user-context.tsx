import React, { useState, createContext } from "react";
import { RouteComponentProps } from "react-router";

interface user {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext({} as user);

export const ContextWrapper: React.FC<RouteComponentProps> = (props) => {
    const defaultValueHandler = () => {
        const user = localStorage.getItem("user");
        if (user) return true;
        return false;
    };
    const [isLoggedIn, setIsLoggedIn] = useState(defaultValueHandler());

    const user = {
        isLoggedIn,
        setIsLoggedIn,
    };
    return <UserContext.Provider value={user}>{props.children}</UserContext.Provider>;
};
