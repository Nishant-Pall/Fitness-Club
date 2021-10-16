import React, { useContext, useState } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../user-context";

const TopNav: React.FC = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

    const [collapsed, setCollapsed] = useState(true);
    const toggleNavbar = () => setCollapsed(!collapsed);

    const logoutHandler = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("user_id");
        setIsLoggedIn(false);
    };

    return isLoggedIn ? (
        <div>
            <Navbar color="faded" light>
                <NavbarToggler onClick={toggleNavbar} />
                <Link to="/login" onClick={logoutHandler}>
                    Logout
                </Link>
                <Collapse isOpen={!collapsed} navbar>
                    <Nav navbar>
                        <NavItem>
                            <Link to="/events">Create events</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/">Dashboard</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/myregistrations">My Registerations</Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    ) : (
        <></>
    );
};

export default TopNav;
