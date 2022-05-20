import React from "react";
// import CopyToClipboard from "react-copy-to-clipboard";
import { connect } from "react-redux";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { userdetails } from "../../redux/actions/actions";
import Sidebar from "../main_sidebar/sidebar";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.user_details._id) {
    } else {
      this.props.history.push("/");
      localStorage.clear();
      window.location.reload();
    }
    this.state = {
      name: "",
      mobile: "",
      email: "",
      password: "",
      referal_code: "",
      copied: false,
      creditPaymentOnOff: false,
    };
  }

  _handleForm(val) {
    var name = val.target.name;
    var value = val.target.value;
    if (name === "mobile") {
      if (value.length > 10) {
      } else {
        this.setState({
          mobile: value,
        });
      }
    } else {
      this.setState({ [name]: value });
    }
  }

  sendotp = () => {
    // this.setState({
    //   otpbutton:true
    // })
    let mobile = this.state.mobile;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!mobile) {
      valueErr = document.getElementsByClassName("err_mobile");
      valueErr[0].innerText = "This Field is Required";
    } else if (mobile.length < 10) {
      valueErr = document.getElementsByClassName("err_mobile");
      valueErr[0].innerText = "Please Enter Correct Mobile Number";
    }
    if (this.state.mobile && this.state.mobile.length === 10) {
      const requestData = {
        user_id: this.props.user_details._id,
        contactNumber: this.state.mobile,
      };

      ApiRequest(requestData, "/updateMobile", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            if (res.data.status === "error") {
              if (res.data.result[0].contactNumber === "mobile alreday exist") {
                swal({
                  // title: "Otp Send !",
                  text: "Mobile number already exist.",
                  icon: "error",
                  dangerMode: true,
                });
                this.setState({
                  name: this.props.user_details.name,
                  mobile: this.props.user_details.contactNumber,
                  email: this.props.user_details.email,
                  referal_code: this.props.user_details.myRefferalCode,
                });
                this.forceUpdate();
              } else {
                swal({
                  // title: "Otp Send !",
                  text: "Error Occured",
                  icon: "error",
                  dangerMode: true,
                });
                this.setState({
                  name: this.props.user_details.name,
                  mobile: this.props.user_details.contactNumber,
                  email: this.props.user_details.email,
                  referal_code: this.props.user_details.myRefferalCode,
                });
                this.forceUpdate();
              }
            } else {
              swal({
                title: "Otp Send !",
                // text: "Are you sure that you want to leave this page?",
                icon: "success",
                dangerMode: false,
              });
              this.setState({
                loading: false,
                newnumber: true,
              });
            }
          } else if (res.status === 404) {
            this.setState({
              newnumber: false,
            });
            swal({
              title: "Number already exist",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: false,
            });
          } else {
            swal({
              title: "Network Error ! please try again later",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  onotpchange(val) {
    var name = val.target.name;
    var value = val.target.value;

    this.setState({
      [name]: value,
    });
    if (value.length > 6) {
      swal({
        title: "Enter correct OTP",
        // text: "Are you sure that you want to leave this page?",
        icon: "warning",
        dangerMode: true,
      });
    } else if (value.length == 6) {
      const requestData = {
        user_id: this.props.user_details._id,
        contactNumber: this.state.mobile,
        otp: value,
      };
      ApiRequest(requestData, "/userMobileVerification", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.props.userdetails(res.data.data);
            this.setState({
              otpbutton: false,
              newnumber: false,
            });
            localStorage.setItem("contact", this.state.contact);
            swal({
              title: "Number updated Successfully",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: true,
            });
          } else if (res.status === 401) {
            swal({
              title: "Enter Correct Otp",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
          } else {
            swal({
              title: "Enter correct OTP",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  forward = (ev) => {
    if (
      localStorage.getItem("contact") &&
      localStorage.getItem("contact") !== "undefined"
    ) {
      if (
        this.state.mobile !== this.props.user_details.contactNumber &&
        this.state.mobile.length === 10
      ) {
        this.sendotp();
      } else {
        let name = this.state.name;
        let email = this.state.email;
        let mobile = this.state.mobile;
        var mailformat =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var valueErr = document.getElementsByClassName("err");
        for (var i = 0; i < valueErr.length; i++) {
          valueErr[i].innerText = "";
        }
        if (!email && email !== "") {
          valueErr = document.getElementsByClassName("err_email");
          valueErr[0].innerText = "This Field is Required";
        } else if (email.match(mailformat)) {
        } else {
          valueErr = document.getElementsByClassName("err_email");
          valueErr[0].innerText = "Enter Valid Email Address";
        }

        if (!mobile) {
          valueErr = document.getElementsByClassName("err_mobile");
          valueErr[0].innerText = "This Field is Required";
        } else if (mobile.toString().length !== 10) {
          valueErr = document.getElementsByClassName("err_mobile");
          valueErr[0].innerText = "Please Enter Correct Mobile Number";
        }
        if (!name) {
          valueErr = document.getElementsByClassName("err_name");
          valueErr[0].innerText = "This Field is Required";
        }
        if (
          this.state.name &&
          this.state.mobile &&
          mobile.toString().length === 10 &&
          this.state.email &&
          email.match(mailformat)
        ) {
          const requestData = {
            name: this.state.name,
            email: this.state.email,
            contactNumber: this.state.mobile,
          };
          const token = localStorage.getItem("_jw_token")
            ? "Bearer " + localStorage.getItem("_jw_token")
            : "";
          if (this.props.user_details._id) {
            ApiRequest(requestData, "/userUpdate", "POST", token)
              .then((res) => {
                if (res.status === 201 || res.status === 200) {
                  if (res.data.status || res.data.status === "error") {
                    if (res.data.result[0].email) {
                      swal({
                        // title: "Sorry!",
                        text: res.data.result[0].email,
                        icon: "error",
                        dangerMode: true,
                      });
                    } else {
                      swal({
                        // title: "Sorry!",
                        text: res.data.result[0].contactNumber,
                        icon: "error",
                        dangerMode: true,
                      });
                    }
                    this.setState({
                      name: this.props.user_details.name,
                      mobile: this.props.user_details.contactNumber,
                      email: this.props.user_details.email,
                      referal_code: this.props.user_details.myRefferalCode,
                    });
                    this.forceUpdate();
                  } else {
                    swal({
                      title: "Profile Updated",
                      // text: "Are you sure that you want to leave this page?",
                      icon: "success",
                      dangerMode: false,
                    });
                  }
                  this.setState({
                    loading: false,
                  });
                } else {
                  swal({
                    title: "Profile Not Updated",
                    // text: "Are you sure that you want to leave this page?",
                    icon: "warning",
                    dangerMode: true,
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
    } else {
      this.props.history.push("/");
      localStorage.clear();
      window.location.reload();
    }
  };

  componentDidMount() {
    const data1 = {};
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    if (this.props.user_details._id) {
      ApiRequest(data1, "/usersGetOne", "GET", token)
        .then((res) => {
          if (res.status === 200) {
            this.props.userdetails(res.data.data[0]);
            this.setState({
              creditLimit: res.data.data[0].creditLimit || 0,
              creditUsed: res.data.data[0].creditUsed || 0,
            });
            localStorage.setItem("contact", res.data.data[0].contactNumber);
          } else if (res.status !== 503) {
            swal({
              title: "Error",
              text: "Network error",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      ApiRequest({}, "/storehey/getSetting", "GET")
        .then((res) => {
          if (res.status !== 401 || res.status !== 400) {
            this.setState({
              creditPaymentOnOff: res.data.data[0].creditPaymentOnOff,
            });
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.setState({
        name: this.props.user_details.name,
        mobile: this.props.user_details.contactNumber,
        email: this.props.user_details.email,
        referal_code: this.props.user_details.myRefferalCode,
        gst_no: this.props.user_details.gst_no,
        user_type: this.props.user_details.user_type,
        creditLimit: this.props.user_details.creditLimit || 0,
        creditUsed: this.props.user_details.creditUsed || 0,
      });
    }
  }
  textCopied = () => {
    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  };
  render() {
    return (
      <>
        <div className="container">
          <div className="my-order-wrap">
            <div className="main_content">
              <Sidebar active="profile"></Sidebar>

              <div className="right_m_content">
                <h2>Profile</h2>
                <div className="my_profile">
                  <div className="modal-form-bx">
                    <form>
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>
                            Name <span className="asterisk">*</span>
                          </label>
                        </div>
                        <div className="modal-right-bx">
                          <input
                            type="text"
                            name="name"
                            value={this.state.name}
                            className="form-control"
                            placeholder="Enter Name"
                            onChange={(ev) => this._handleForm(ev)}
                          />
                          <span className="focus-border"></span>
                          <span className="err err_name"></span>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>
                            Mobile Number <span className="asterisk">*</span>
                          </label>
                        </div>
                        <div className="modal-right-bx">
                          <input
                            type="text"
                            name="mobile"
                            value={this.state.mobile}
                            className="form-control"
                            placeholder="Enter Contact Number"
                            onChange={(ev) => this._handleForm(ev)}
                          />
                          <span className="focus-border"></span>
                          <span className="err err_mobile"></span>
                        </div>
                      </div>
                      {this.state.newnumber === true ? (
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Enter Otp <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter OTP"
                              maxLength="6"
                              className="count"
                              onChange={(event) => this.onotpchange(event)}
                            ></input>
                            <span className="focus-border"></span>
                            <span className="err err_mobile"></span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>
                            Email <span className="asterisk">*</span>
                          </label>
                        </div>
                        <div className="modal-right-bx">
                          <input
                            type="email"
                            name="email"
                            value={this.state.email}
                            className="form-control"
                            placeholder="Enter Email"
                            onChange={(ev) => this._handleForm(ev)}
                          />
                          <span className="focus-border"></span>
                          <span className="err err_email"></span>
                        </div>
                      </div>

                      {this.state.gst_no ? (
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              GST <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="gst_no"
                              value={this.state.gst_no}
                              className="form-control"
                              placeholder=""
                              readOnly
                              // onChange={(ev) => this._handleForm(ev)}
                            />
                            <span className="focus-border"></span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>
                            User Type <span className="asterisk">*</span>
                          </label>
                        </div>
                        <div className="modal-right-bx">
                          <input
                            type="text"
                            name="user_type"
                            value={this.state.user_type}
                            className="form-control"
                            placeholder=""
                            readOnly
                            // onChange={(ev) => this._handleForm(ev)}
                          />
                          <span className="focus-border"></span>
                        </div>
                      </div>
                      {this.state.creditPaymentOnOff ? (
                        <div className="d-flex w-100">
                          <div className="form-group" style={{ width: "49%" }}>
                            <div className="modal-left-bx">
                              <label>Credit Limit</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="creditLimit"
                                value={this.state.creditLimit}
                                className="form-control"
                                placeholder=""
                                readOnly
                                // onChange={(ev) => this._handleForm(ev)}
                              />
                              <span className="focus-border"></span>
                            </div>
                          </div>
                          <div
                            className="form-group ml-4"
                            style={{ width: "49%" }}
                          >
                            <div className="modal-left-bx">
                              <label>Credit Due</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="creditUsed"
                                value={this.state.creditUsed}
                                className="form-control"
                                placeholder=""
                                readOnly
                                // onChange={(ev) => this._handleForm(ev)}
                              />
                              <span className="focus-border"></span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="social-iner-custome"></div>
                      <div className="modal-bottom">
                        <button
                          type="button"
                          className="submit"
                          onClick={() => this.forward()}
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* } */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});
const dispatchStateToProps = (dispatch) => ({
  userdetails: (data) => dispatch(userdetails(data)),
});

export default connect(mapStateToProps, dispatchStateToProps)(Profile);
