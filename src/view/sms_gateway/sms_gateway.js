import React from "react";
import Modal from "react-modal";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
class sms_gateway extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      seedValueinRupee: 0,
      whatChatLink: "",
      productImage: "",
      exemptDelivery: false,
      preOrder: false,
      modalIsOpen: false,
      allKeys: [],
      status: false,
    };
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeloyality = this.handleChangeloyality.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.changePaymentMethod = this.changePaymentMethod.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  async formHandler(val, type) {
    this.setState({ [val.target.name]: val.target.value });
  }
  changePaymentMethod(val, type) {
    this.setState({ [val.target.name]: val.target.value });

    var valueErr = document.getElementsByClassName("err");
    const Err = Array.from(valueErr);
    Err.forEach((v) => (v.innerText = ""));
  }
  handleChangeloyality(checked) {
    if (checked) {
      this.setState({ loyalitystatus: true });
    } else {
      this.setState({ loyalitystatus: false });
    }
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  closeModal() {
    this.setState({
      modalIsOpen: false,
      name: "",
      description: "",
      url: "",
      stage: "",
      apiKey: "",
      screatKey: "",
      status: "",
    });
  }
  update = (dt) => {
    var name = dt.name;
    var status = dt.status;
    var valueErr = document.getElementsByClassName("err");
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      swal({
        title: "Error",
        text: "Name is required",
        icon: "warning",
      });
    } else {
      valueErr[0].innerText = "";
      var data = {};
      var errorStatus = false;
      if (name === "sms_alert") {
        var senderID = dt.keys.senderID || "";
        var username = dt.keys.username || "";
        var password = dt.keys.password || "";

        if (!senderID) {
          valueErr = document.getElementsByClassName("err_editsenderID");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!username) {
          valueErr = document.getElementsByClassName("err_editusername");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!password) {
          valueErr = document.getElementsByClassName("err_editpassword");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        data = {
          _id: dt._id,
          name,
          keys: {
            senderID,
            username,
            password,
          },
          status: status ? true : false,
        };
      } else if (name === "aws_sms") {
        var User = dt.keys.User || "";
        var AWS_ACCESS_KEY_ID = dt.keys.AWS_ACCESS_KEY_ID || "";
        var AWS_SECRET_ACCESS_KEY = dt.keys.AWS_SECRET_ACCESS_KEY || "";
        var AWS_REGION = dt.keys.AWS_REGION || "";

        if (!User) {
          valueErr = document.getElementsByClassName("err_editUser");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!AWS_ACCESS_KEY_ID) {
          valueErr = document.getElementsByClassName(
            "err_editAWS_ACCESS_KEY_ID"
          );
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!AWS_SECRET_ACCESS_KEY) {
          valueErr = document.getElementsByClassName(
            "err_editAWS_SECRET_ACCESS_KEY"
          );
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!AWS_REGION) {
          valueErr = document.getElementsByClassName("err_editAWS_REGION");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        data = {
          _id: dt._id,
          name,
          keys: {
            User,
            AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY,
            AWS_REGION,
          },

          status: status ? true : false,
        };
      }
      if (!errorStatus) {
        AdminApiRequest(data, "/admin/sms/gateway/update", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              swal({
                title: "Details Updated",
                // text: "Are you sure that you want to leave this page?",
                icon: "success",
                dangerMode: false,
              });
              this.GetPaymentKeys();
            } else {
              swal({
                title: "Network error ",
                text: "Please try again after some time !!!",
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
  delete = (dt) => {
    var data = {
      _id: dt._id,
    };
    swal({
      title: "Are you sure?",
      text: "This payment method will be deleted permanently.",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          closeModal: true,
        },
      },
    }).then((status) => {
      if (status) {
        AdminApiRequest(data, "/admin/sms/gateway/delete", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              swal({
                title: "Deleted successfully!",
                // text: "Are you sure that you want to leave this page?",
                icon: "success",
                dangerMode: false,
              });
              this.GetPaymentKeys();
            } else {
              swal({
                title: "Network error ",
                text: "Please try again after some time !!!",
                icon: "warning",
                dangerMode: true,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  addkey = () => {
    var name = this.state.name;
    var status = this.state.status;
    var valueErr = document.getElementsByClassName("err");

    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    } else {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "";
      var data = {};
      var errorStatus = false;
      if (name === "sms_alert") {
        var senderID = this.state.senderID || "";
        var username = this.state.username || "";
        var password = this.state.password || "";

        if (!senderID) {
          valueErr = document.getElementsByClassName("err_senderID");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!username) {
          valueErr = document.getElementsByClassName("err_username");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!password) {
          valueErr = document.getElementsByClassName("err_password");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        data = {
          name,
          senderID,
          username,
          password,
          status: status ? true : false,
        };
      } else if (name === "aws_sms") {
        var User = this.state.User || "";
        var AWS_ACCESS_KEY_ID = this.state.AWS_ACCESS_KEY_ID || "";
        var AWS_SECRET_ACCESS_KEY = this.state.AWS_SECRET_ACCESS_KEY || "";
        var AWS_REGION = this.state.AWS_REGION || "";

        if (!User) {
          valueErr = document.getElementsByClassName("err_User");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!AWS_ACCESS_KEY_ID) {
          valueErr = document.getElementsByClassName("err_AWS_ACCESS_KEY_ID");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!AWS_SECRET_ACCESS_KEY) {
          valueErr = document.getElementsByClassName(
            "err_AWS_SECRET_ACCESS_KEY"
          );
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!AWS_REGION) {
          valueErr = document.getElementsByClassName("err_AWS_REGION");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }

        data = {
          name,
          User,
          AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY,
          AWS_REGION,
          status: status ? true : false,
        };
      }

      setTimeout(() => {
        if (!errorStatus) {
          AdminApiRequest(data, "/admin/sms/gateway/add", "POST")
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                swal({
                  title: "Details Updated",
                  // text: "Are you sure that you want to leave this page?",
                  icon: "success",
                  dangerMode: false,
                });
                this.GetPaymentKeys();
                this.closeModal();
              } else {
                swal({
                  title: "Network error ",
                  text: "Please try again after some time !!!",
                  icon: "warning",
                  dangerMode: true,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }, 0);
    }
  };
  GetAdminSetting() {
    let data = {};
    AdminApiRequest(data, "/admin/getSetting", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          console.log("qwertyuiop", res.data.data[0]);
          this.setState({
            mailBanner: res.data.data[0].mailBanner,
          });
        } else {
          swal({
            title: "Network error ",
            text: "Please try again after some time !!!",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  GetPaymentKeys() {
    let data = {};
    AdminApiRequest(data, "/admin/sms/gateway/getAll", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            allKeys: res.data.data,
          });
        } else {
          swal({
            title: "Network error ",
            text: "Please try again after some time !!!",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.GetAdminSetting();
    this.GetPaymentKeys();
    if (!JSON.parse(localStorage.getItem("storeheyLoggedIn"))) {
      this.props.history.push("/storehey");
    }
  }

  handleChangeStatus(checked, _id) {
    const data = [...this.state.allKeys];
    const newdata = data.map((d) => {
      return d._id === _id ? { ...d, status: checked } : { ...d };
    });
    setTimeout(() => {
      this.setState({ allKeys: newdata });
    }, 0);
  }

  handleChange(e, _id) {
    let tempStatus = false;
    if (e.target.name === "name" || e.target.name === "status") {
      tempStatus = true;
    }
    const data = [...this.state.allKeys];
    const newdata = data.map((d) => {
      return tempStatus
        ? d._id === _id
          ? { ...d, [e.target.name]: e.target.value }
          : { ...d }
        : d._id === _id
        ? { ...d, keys: { ...d.keys, [e.target.name]: e.target.value } }
        : { ...d };
    });
    setTimeout(() => {
      this.setState({ allKeys: newdata });
    }, 0);
  }

  changeStatus(e) {
    const data = this.state.allKeys;
    const newData = { ...data, status: e };
    this.setState({ allKeys: newData });
  }

  render() {
    return (
      <>
        <div className="wrapper ">
          <Adminsiderbar />
          <div className="main-panel">
            <Adminheader />
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 ml-auto mr-auto order_new_det">
                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">shopping_cart</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn">
                          <h4 className="card-title"> SMS Alert Gateway </h4>
                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={() => this.openModal()}
                          >
                            <i className="fa fa-plus"></i> Add
                          </button>
                        </div>
                        <div className="payment-setting mt-5 d-flex justify-content-start align-items-center">
                          {this.state.allKeys.length > 0
                            ? this.state.allKeys.map((key) => {
                                return (
                                  <div className="payment-card">
                                    <h3 className="mt-4 payment-key-heading">
                                      {key.name}
                                    </h3>
                                    <div className="form-group mt-5">
                                      <div className="modal-left-bx">
                                        <label>Name</label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="text"
                                          name="name"
                                          readOnly
                                          className="form-control border-bottom-gray"
                                          placeholder="Enter name"
                                          onChange={(ev) =>
                                            this.handleChange(ev, key._id)
                                          }
                                          value={key.name}
                                        />
                                      </div>{" "}
                                    </div>
                                    {key.name === "aws_sms" ? (
                                      <>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              User
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="User"
                                              value={key.keys.User}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter User"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editUser"></span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              AWS ACCESS KEY ID
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="AWS_ACCESS_KEY_ID"
                                              value={key.keys.AWS_ACCESS_KEY_ID}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter AWS ACCESS KEY ID"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editAWS_ACCESS_KEY_ID"></span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              AWS SECRET ACCESS KEY
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="AWS_SECRET_ACCESS_KEY"
                                              value={
                                                key.keys.AWS_SECRET_ACCESS_KEY
                                              }
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter AWS SECRET ACCESS KEY"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editAWS_SECRET_ACCESS_KEY"></span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              AWS REGION
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="AWS_REGION"
                                              value={key.keys.AWS_REGION}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter AWS REGION"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editAWS_REGION"></span>
                                          </div>
                                        </div>
                                      </>
                                    ) : key.name === "sms_alert" ? (
                                      <>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              Sender ID{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="senderID"
                                              value={key.keys.senderID}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter Sender ID"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editsenderID"></span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              Username{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="username"
                                              value={key.keys.username}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter Username"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editusername"></span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              Password{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="password"
                                              value={key.keys.password}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter Password"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editpassword"></span>
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    <div className="d-flex justify-content-between">
                                      <div className="form-group">
                                        <div className="modal-left-bx">
                                          <label>Status</label>
                                        </div>
                                        <div className="modal-right-bx">
                                          <Switch
                                            onChange={(e) =>
                                              this.handleChangeStatus(
                                                e,
                                                key._id
                                              )
                                            }
                                            checked={key.status}
                                          />
                                        </div>{" "}
                                      </div>
                                    </div>
                                    <div className="form-group mt-3">
                                      <div className="modal-right-bx d-flex justify-content-between">
                                        <button
                                          type="button"
                                          className="submit fill-btn m-1"
                                          onClick={() => this.update(key)}
                                        >
                                          <span className="button-text">
                                            Update
                                          </span>
                                          <span className="button-overlay"></span>
                                        </button>
                                        <button
                                          type="button"
                                          className="submit fill-btn m-1"
                                          style={{
                                            backgroundColor: "white",
                                          }}
                                          onClick={() => this.delete(key)}
                                        >
                                          <span
                                            className="button-text"
                                            style={{
                                              color: "#febc15",
                                            }}
                                          >
                                            Delete
                                          </span>
                                          <span className="button-overlay"></span>
                                        </button>
                                      </div>{" "}
                                    </div>
                                  </div>
                                );
                              })
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Add model here */}
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                style={customStyles}
              >
                <div role="dialog" className="user-pop-block">
                  <div className="modal-dialog">
                    <div className="modal-content default_form_design">
                      <button
                        type="button"
                        className="close"
                        onClick={this.closeModal}
                      >
                        &times;
                      </button>
                      <h4 className="modal-title">Add SMS Gateway</h4>
                      <div className="modal-form-bx">
                        <form>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Name <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <select
                                name="name"
                                className="form-control"
                                onChange={this.changePaymentMethod}
                              >
                                <option value="">Select sms gateway</option>
                                <option value="aws_sms">AWS SMS</option>
                                <option value="sms_alert">SMS Alert</option>
                              </select>
                              <span className="err err_name"></span>
                            </div>
                          </div>
                          {this.state.name === "aws_sms" ? (
                            <>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    User<span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="User"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter User"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_User"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    AWS ACCESS KEY ID{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="AWS_ACCESS_KEY_ID"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter AWS ACCESS KEY ID"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_AWS_ACCESS_KEY_ID"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    AWS SECRET ACCESS KEY{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="AWS_SECRET_ACCESS_KEY"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter AWS SECRET ACCESS KEY"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_AWS_SECRET_ACCESS_KEY"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    AWS REGION{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="AWS_REGION"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter AWS REGION"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_AWS_REGION"></span>
                                </div>
                              </div>
                            </>
                          ) : this.state.name === "sms_alert" ? (
                            <>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Sender ID{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="senderID"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter Sender ID"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_senderID"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Username <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="username"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter username"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_username"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Password <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="password"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter password"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_password"></span>
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Status</label>
                            </div>
                            <div className="modal-right-bx">
                              <Switch
                                name="status"
                                onChange={(ev) => this.setState({ status: ev })}
                                checked={this.state.status}
                                id="normal-switch"
                              />
                            </div>
                          </div>

                          <div className="modal-bottom">
                            <button
                              type="button"
                              className="btn btn-primary feel-btn"
                              onClick={this.addkey}
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }
}

export default sms_gateway;
