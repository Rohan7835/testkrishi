import React from "react";
// import CopyToClipboard from "react-copy-to-clipboard";
import { connect } from "react-redux";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { userdetails } from "../../redux/actions/actions";
const API_KEY = "rzp_test_UWn64me6CqQI2L";
var filteredArray = [];
var total_price = [];
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      mobile: "",
      email: "",
      password: "",
      referal_code: "",
      copied: false,
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
                  newnumber: false,
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
                  newnumber: false,
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
            this.props.close();
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
      this.state.mobile != this.props.user_details.contactNumber &&
      this.state.mobile.length === 10
    ) {
      this.setState({
        newnumber: true,
      });
      this.sendotp();
    } else {
      let name = this.state.name;
      let email = this.state.email;
      let mobile = this.state.mobile;
      let password = this.state.password;
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
                  newnumber: false,
                });
                this.forceUpdate();
              } else {
                this.props.userdetails(res.data.data);
                swal({
                  title: "Profile Updated",
                  // text: "Are you sure that you want to leave this page?",
                  icon: "success",
                  dangerMode: false,
                });
                this.props.close();
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
  };

  componentDidMount() {
    const data1 = {};
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(data1, "/usersGetOne", "GET", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.props.userdetails(res.data.data[0]);
          localStorage.setItem("contact", res.data.data[0].contactNumbers);
        } else {
          swal({
            title: "Network Error",
            // text: "Are you sure that you want to leave this page?",
            icon: "warning",
            dangerMode: true,
          });
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
    });
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
        <div
          className=" bg-white cs-detail-pop"
          style={{ maxHeight: 500, padding: 20 }}
        >
          <div className="my-order-wrap">
            <div className="">
              <div className="right_m_content">
                <h2>Details</h2>
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

export default connect(mapStateToProps, dispatchStateToProps)(UserProfile);
