import { Component, useState } from "react";

import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import { Link, useNavigate } from "react-router-dom";
import classes from "./NavBar.module.css";
import logo from "../assets/icons/hooli-logo.png";
import home from "../assets/icons/home.png";
import expense from "../assets/icons/expense.png";
import forex from "../assets/icons/forex.png";
import income from "../assets/icons/income.png";
import investment from "../assets/icons/investment.png";
import profile from "../assets/icons/user.png";
import logout from "../assets/icons/logout.png";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

/**
 * Returns a SideNav component that has a NavItem component for each of the pages in the app.
 * @returns {*}
 */
function NavBar() {
  const navigate = useNavigate();
  const [logoutSuccess, setLogoutSuccess] = useState(null);
  async function handleLogout() {
    alert("Logging out");
    await fetch("/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status != 500) {
          setLogoutSuccess(true);
          sessionStorage.clear();
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  }
  return (
    <SideNav
      className={classes.nav}
      /*onSelect={ (selected) => {console.log(selected); navigate('/' + selected)}}*/
      onSelect={(selected) => {
        console.log(selected);
        if (selected === "logout") {
          handleLogout();
          navigate("/");
        } else {
          navigate("/" + selected);
        }
      }}
    >
      <SideNav.Toggle />
      <SideNav.Nav defaultSelected="dashboard">
        <NavItem eventKey="dashboard">
          <NavIcon>
            <img src={home} className={classes.icons} />
          </NavIcon>
          <NavText className={classes.navText}>Main</NavText>
        </NavItem>
        <NavItem eventKey="expenditures">
          <NavIcon>
            <img src={expense} className={classes.icons} />
          </NavIcon>
          <NavText className={classes.navText}>Expenditures</NavText>
        </NavItem>
        <NavItem eventKey="income">
          <NavIcon>
            <img src={income} className={classes.icons} />
          </NavIcon>
          <NavText className={classes.navText}>Income</NavText>
        </NavItem>
        <NavItem eventKey="investments">
          <NavIcon>
            <img src={investment} className={classes.icons} />
          </NavIcon>
          <NavText className={classes.navText}>Investments</NavText>
        </NavItem>
        <NavItem eventKey="forex">
          <NavIcon>
            <img src={forex} className={classes.icons} />
          </NavIcon>
          <NavText className={classes.navText}>Forex</NavText>
        </NavItem>
        <NavItem eventKey="personalprofile">
          <NavIcon>
            <img src={profile} className={classes.icons} />
          </NavIcon>
          <NavText className={classes.navText}>Profile</NavText>
        </NavItem>
        <NavItem eventKey="logout">
          <NavIcon>
            <img src={logout} className={classes.icons} />
          </NavIcon>
          <NavText className={classes.navText}>Log out</NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
}
export default NavBar;
