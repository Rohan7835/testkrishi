import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../../css/margins-min.css";
import "../../../css/material-dashboard.css?v=2.1.1";
import "../../../css/style.css";

class Adminheader extends Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
      var ad_data = JSON.parse(dt);
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_data: ad_data,
    };
    this.logout = this.logout.bind(this);
    this.gotohome = this.gotohome.bind(this);
  }

  logout = () => {
    window.location = "/admin-login";
    localStorage.clear("adminInfo");

    // window.location = "/admin-login";
    // this.props.history.push(`/admin-login`);
    // this.props.history.push('/admin-login');
  };
  gotohome = () => {
    // localStorage.clear("adminInfo");
    window.location = "/";
    // window.location.reload();
    // this.props.history.push("/");
  };
  render() {
    return (
      // <nav className="header">

      //         <ul className="headerdesigns">
      //         <li className="u-name"><i className="fa fa-user"></i> {this.state.username }</li>
      //         <li className="dropdown-item" onClick={this.logout}> Logout</li>
      //         </ul>

      //     </nav>
      <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
        <div className="container-fluid">
          {/* <div className="navbar-wrapper">
                        <Link to={'/'} className="navbar-brand">logo</Link>
                    </div> */}
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            aria-controls="navigation-index"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="navbar-toggler-icon icon-bar"></span>
            <span className="navbar-toggler-icon icon-bar"></span>
            <span className="navbar-toggler-icon icon-bar"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end">
            {/* <form className="navbar-form">
                            <div className="input-group no-border">
                                <input type="text" value="" className="form-control" placeholder="Search..." />
                                <button type="submit" className="btn btn-white btn-round btn-just-icon" >
                                    <i className="material-icons">search</i>
                                    <div className="ripple-container"></div>
                                </button>
                            </div>
                        </form> */}
            <ul className="navbar-nav">
              <a href="/" target="_blank">
                <button type="button">
                  <li className="nav-item">Go to Website</li>
                </button>
              </a>
              {/* <li className="nav-item dropdown">
                                <a className="nav-link" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="material-icons">notifications</i>
                                    <span className="notification">5</span>
                                    <p className="d-lg-none d-md-block">
                                        Some Actions
                                    </p>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item" href="#">Mike John responded to your email</a>
                                    <a className="dropdown-item" href="#">You have 5 new tasks</a>
                                    <a className="dropdown-item" href="#">You're now friend with Andrew</a>
                                    <a className="dropdown-item" href="#">Another Notification</a>
                                    <a className="dropdown-item" href="#">Another One</a>
                                </div>
                            </li> */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link"
                  href="/"
                  id="navbarDropdownProfile"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.state.admin_data.username}{" "}
                  <i className="material-icons">person</i>
                  <p className="d-lg-none d-md-block">Account</p>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="navbarDropdownProfile"
                >
                  <Link to="/admin-general-setting">
                    <a className="dropdown-item">Setting</a>
                  </Link>
                  {/* <a className="dropdown-item" href="#">My Inbox</a>
                                    <a className="dropdown-item" href="#">Task</a>
                                    <a className="dropdown-item" href="#">Chats</a> */}
                  <div className="dropdown-divider"></div>
                  <li className="dropdown-item" onClick={this.logout}>
                    Log out
                  </li>
                </div>
              </li>
              {/* <Link to={'/login'}><button className="btn btn-primary m-r-10"> <i className="fa fa-sign-in"></i> Login </button></Link> */}
              {/* <button className="btn btn-primary" onClick={this.openLogin}> <i className="fa fa-sign-in"></i> Login </button> */}
              {/* <Link to={'/registration'}><button className="btn btn-success"> <i className="fa fa-user-plus"></i> Signup </button></Link> */}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Adminheader;
