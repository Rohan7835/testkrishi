import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import "../../css/margins-min.css";
import "../../css/material-dashboard.css?v=2.1.1";
import "../../css/style.css";
class Login extends Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
      window.location = "/admin-dashboard";
    } else {
    }
    this.state = {
      email: "",
      password: "",
      message: "",
      data: [],
    };
    this.login = this.login.bind(this);
    this.formHandler = this.formHandler.bind(this);
  }
  formHandler(ev) {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  }

  login() {
    var email1 = this.state.email;
    var email = email1.toLowerCase();
    var password = this.state.password;

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var mailstatus = true;
    if (!email) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "This Field is Required";
    } else if (!email.match(mailformat)) {
      mailstatus = false;
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "Enter Valid Email";
    }
    if (!password) {
      valueErr = document.getElementsByClassName("err_password");
      valueErr[0].innerText = "This Field is Required";
    }

    if (email && password && mailstatus === true) {
      const requestData = {
        email: email,
        password: password,
      };
      ApiRequest(requestData, "/adminLogin", "POST", "")
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("_Admin_jw_token", res.data.token);
            localStorage.setItem("adminInfo", JSON.stringify(res.data));
            this.props.history.push("/admin-dashboard");
            return <Redirect to="/dashboard" />;
          } else {
            swal({
              title: "Error !",
              text: res.data.message,
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          var valueErr = document.getElementsByClassName("err");
          valueErr = document.getElementsByClassName("err_password");
          valueErr[0].innerText = error;
          this.setState({
            message: error,
          });
        });
    }
  }

  render() {
    return (
      <div className="wrapper ">
        <div className="main-panel adminlogin-class">
          <div className="login-sec">
            <div className="login-panel">
              <div className="login-box">
                <div className="card">
                  <div className="card-header card-header-primary">
                    <h3 className="card-title" style={{ textAlign: "center" }}>
                      {" "}
                      Krishi Cress
                    </h3>
                  </div>

                  <div className="card-body">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="bmd-label-floating">Email</label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          placeholder="Enter Email"
                          onChange={this.formHandler}
                        />
                        <span className="err err_email"> </span>
                      </div>
                      <div className="form-group">
                        <label className="bmd-label-floating">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          placeholder="Enter Password"
                          onChange={this.formHandler}
                        />
                        <span className="err err_password"> </span>
                      </div>

                      <div
                        className="form-group"
                        style={{ textAlign: "right" }}
                      >
                        <span
                          onClick={this.login}
                          className="btn custom-btn btn-primary "
                        >
                          {" "}
                          <i className="fa fa-sign-in"></i> Log In
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
