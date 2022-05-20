import React from "react";
import { Link } from "react-router-dom";

export default class MainSideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  _handleForm(val) {
    var name = val.target.name;
    var value = val.target.value;
    this.setState({ [name]: value });
  }

  forward = (ev) => {
    let name = this.state.name;
    let email = this.state.email;
    let address = this.state.address;
    let password = this.state.password;
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!email) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "This Field is Required";
    } else if (email) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "";
    } else if (email.match(mailformat)) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "Enter Valid E-Mail Address";
    }

    if (!password) {
      valueErr = document.getElementsByClassName("err_password");
      valueErr[0].innerText = "This Field is Required";
    } else if (password) {
      valueErr = document.getElementsByClassName("err_password");
      valueErr[0].innerText = "";
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    } else if (name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "";
    }
    if (!address) {
      valueErr = document.getElementsByClassName("err_address");
      valueErr[0].innerText = "This Field is Required";
    } else if (address) {
      valueErr = document.getElementsByClassName("err_address");
      valueErr[0].innerText = "";
    }
  };

  componentWillReceiveProps() {
    console.log("checkout props -==>>", this.props);
  }

  componentWillUnmount() {}

  render() {
    return (
      <>
        <div className="container">
          <div className="my-order-wrap">
            <div className="main_content">
              <div className="left_m_content">
                <h3>My Account</h3>
                <ul>
                  <li>
                    <Link to="/my-order">Order Histoy</Link>
                  </li>
                  <li>
                    <Link to="/manage-address">View Addresses</Link>
                  </li>
                </ul>
              </div>
              <div className="right_m_content"></div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
