import { Component } from 'react';

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { Link, useNavigate} from 'react-router-dom';
import classes from "./NavBar.module.css";
import logo from "../assets/icons/hooli-logo.png";
import home from "../assets/icons/home.png";
import expense from "../assets/icons/expense.png";
import forex from "../assets/icons/forex.png";
import income from "../assets/icons/income.png";
import investment from "../assets/icons/investment.png";
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

function NavBar() {
    const navigate = useNavigate();
    return (
        <SideNav className={classes.nav}
            onSelect={ (selected) => {console.log(selected); navigate('/' + selected)}}>
            <SideNav.Toggle />
             <SideNav.Nav defaultSelected="dashboard">
                 <NavItem eventKey="dashboard">
                     <NavIcon>
                         <img src={home} className={classes.icons}/>
                         {/* <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /> */}
                     </NavIcon>
                     <NavText className={classes.navText}>
                         Main
                     </NavText>
                 </NavItem>
                 <NavItem eventKey="expenditures">
                     <NavIcon>
                         <img src={expense} className={classes.icons}/>
                     </NavIcon>
                     <NavText className={classes.navText}>
                         Expenditures
                     </NavText>
                 </NavItem>
                 <NavItem eventKey="income">
                     <NavIcon>
                         <img src={income} className={classes.icons}/>
                     </NavIcon>
                     <NavText className={classes.navText}>
                         Income
                     </NavText>
                 </NavItem>
                 <NavItem eventKey="investments">
                     <NavIcon>
                         <img src={investment} className={classes.icons}/>
                     </NavIcon>
                     <NavText className={classes.navText}>
                         Investments
                     </NavText>
                 </NavItem>
                 <NavItem eventKey="forex">
                     <NavIcon>
                         <img src={forex} className={classes.icons}/>
                     </NavIcon>
                     <NavText className={classes.navText}>
                         Forex
                     </NavText>
                 </NavItem>
             </SideNav.Nav>
             </SideNav>  
    )
}
export default NavBar;

// class NavBar extends Component {
//     nav(selected) {
//         console.log(selected);
//         const navigate = useNavigate();
//         navigate('/' + selected);
//     }  

//     render() {
//         return (

//             <SideNav className={classes.nav} onSelect={this.nav}>
//             <SideNav.Toggle />
//             <SideNav.Nav defaultSelected="dashboard">
//                 <NavItem eventKey="dashboard">
//                     <NavIcon>
//                         <img src={home} className={classes.icons}/>
//                         {/* <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /> */}
//                     </NavIcon>
//                     <NavText className={classes.navText}>
//                         Main
//                     </NavText>
//                 </NavItem>
//                 <NavItem eventKey="expenditures">
//                     <NavIcon>
//                         <img src={expense} className={classes.icons}/>
//                     </NavIcon>
//                     <NavText className={classes.navText}>
//                         Expenditures
//                     </NavText>
//                 </NavItem>
//                 <NavItem eventKey="income">
//                     <NavIcon>
//                         <img src={income} className={classes.icons}/>
//                     </NavIcon>
//                     <NavText className={classes.navText}>
//                         Income
//                     </NavText>
//                 </NavItem>
//                 <NavItem eventKey="investments">
//                     <NavIcon>
//                         <img src={investment} className={classes.icons}/>
//                     </NavIcon>
//                     <NavText className={classes.navText}>
//                         Investments
//                     </NavText>
//                 </NavItem>
//                 <NavItem eventKey="forex">
//                     <NavIcon>
//                         <img src={forex} className={classes.icons}/>
//                     </NavIcon>
//                     <NavText className={classes.navText}>
//                         Forex
//                     </NavText>
//                 </NavItem>
//             </SideNav.Nav>
//             </SideNav>  
//         );
//     }
// }

// export default NavBar;