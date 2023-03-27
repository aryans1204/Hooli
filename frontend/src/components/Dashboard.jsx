import React, { Component } from 'react';
import classes from './Dashboard.module.css';
import NavBar from './NavBar';

class Dashboard extends Component {

    /**
     * Retrieves user profile and checks for authentiation when component is mounted
     * @async
     * @returns {*}
     */
    async componentDidMount() {
        await fetch("/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            console.log(response.status);
            if (response.status == 401)
                this.setState({ authenticated: false });
            else
                this.setState({ authenticated: true });
          });
    }

    render() {
        return (
            <><NavBar />
            {this.state.authenticated == false && (<Navigate to="/" replace={true} />)}

            <div className={classes.div}>
                <h1 className={classes.text}>Dashboard Page</h1>
                <div className={classes.container}>
                    <div className={classes.weekly}>
                        <p>sdfsdfs</p>
                    </div>
                    <div className={classes.breakdown}>
                        <p>sdfsdfs</p>
                    </div>
                    <div className={classes.income}>
                        <h2>Monthly Income Trend</h2>

                    </div>
                    <div className={classes.investments}>
                        <p>sdfsdfs</p>
                    </div>
                </div>
            </div>
            </>
        );
    }
}

export default Dashboard;