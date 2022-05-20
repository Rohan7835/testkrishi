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
class paymentkeys extends React.Component {
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
      adminStatus: false,
      frontendStatus: false,
      production_txn_url: "",
      staging: false,
      staging_txn_url: "",
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
    var errorStatus = false;
    var name = dt.name;
    var frontendStatus = dt.frontendStatus;
    var adminStatus = dt.adminStatus;
    var staging = dt.staging;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!name) {
      errorStatus = true;
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This field is required";
    }

    {
      var data = {
        _id: dt._id,
        name,
        keys: {},
        frontendStatus,
        adminStatus,
        staging,
      };
      if (name === "Razorpay") {
        var keyid = dt.keys.keyid || "";
        var secretid = dt.keys.secretid || "";
        if (!keyid) {
          valueErr = document.getElementsByClassName("err_editkeyid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!secretid) {
          valueErr = document.getElementsByClassName("err_editsecretid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        data.keys = { keyid, secretid };
      } else if (name === "Paypal") {
        var clientid = dt.keys.clientid || "";
        var secretcode = dt.keys.secretcode || "";
        if (!clientid) {
          valueErr = document.getElementsByClassName("err_editclientid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!secretcode) {
          valueErr = document.getElementsByClassName("err_editsecretcode");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        data.keys = { clientid, secretcode };
      } else if (name === "Paytm") {
        var merchantid = dt.keys.merchantid || "";
        var key = dt.keys.key || "";
        // var url = dt.keys.url || "";
        var website = dt.keys.website || "";
        var production_txn_url = dt.production_txn_url;
        var staging_txn_url = dt.staging_txn_url;
        if (!production_txn_url) {
          valueErr = document.getElementsByClassName(
            "err_edit_production_txn_url"
          );
          errorStatus = true;
          valueErr[0].innerText = "This field is required";
        }
        if (!staging_txn_url) {
          valueErr = document.getElementsByClassName(
            "err_edit_staging_txn_url"
          );
          errorStatus = true;
          valueErr[0].innerText = "This field is required";
        }
        if (!merchantid) {
          valueErr = document.getElementsByClassName("err_editmerchantid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!key) {
          valueErr = document.getElementsByClassName("err_editkey");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        // if (!url) {
        //   valueErr = document.getElementsByClassName("err_editurl");
        //   valueErr[0].innerText = "This Field is Required";
        //   errorStatus = true;
        // }
        if (!website) {
          valueErr = document.getElementsByClassName("err_editwebsite");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        data.keys = {
          merchantid,
          key,
          // url,
          website,
          production_txn_url,
          staging_txn_url,
        };
      } else if (name === "Stripe") {
        var keyid = dt.keys.keyid || "";
        var secretid = dt.keys.secretid || "";
        if (!keyid) {
          valueErr = document.getElementsByClassName("err_editkeyid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!secretid) {
          valueErr = document.getElementsByClassName("err_editsecretid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        data.keys = {
          keyid,
          secretid,
        };
      }
      if (!errorStatus) {
        AdminApiRequest(data, "/admin/payment/gateway/update", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              swal({
                title: "Details Updated",
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
        AdminApiRequest(data, "/admin/payment/gateway/delete", "POST")
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
    var errorStatus = false;
    var name = this.state.name;
    // var status = this.state.status;
    var frontendStatus = this.state.frontendStatus;
    var adminStatus = this.state.adminStatus;
    var staging = this.state.staging;
    var production_txn_url = this.state.production_txn_url;
    var staging_txn_url = this.state.staging_txn_url;

    var valueErr = document.getElementsByClassName("err");

    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
      errorStatus = true;
    }

    {
      var data = {
        name,
        frontendStatus,
        adminStatus,
        staging,
      };
      if (name === "Razorpay") {
        var keyid = this.state.keyid || "";
        var secretid = this.state.secretid || "";
        if (!keyid) {
          valueErr = document.getElementsByClassName("err_keyid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!secretid) {
          valueErr = document.getElementsByClassName("err_secretid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        data.keyid = keyid;
        data.secretid = secretid;
      } else if (name === "Paypal") {
        var clientid = this.state.clientid || "";
        var secretcode = this.state.secretcode || "";
        if (!clientid) {
          valueErr = document.getElementsByClassName("err_clientid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!secretcode) {
          valueErr = document.getElementsByClassName("err_secretcode");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }

        data.clientid = clientid;

        data.secretcode = secretcode;
      } else if (name === "Paytm") {
        var merchantid = this.state.merchantid || "";
        var key = this.state.key || "";
        // var url = this.state.url || "";
        var website = this.state.website || "";
        if (!merchantid) {
          valueErr = document.getElementsByClassName("err_merchantid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!production_txn_url) {
          valueErr = document.getElementsByClassName("err_production_txn_url");
          errorStatus = true;
          valueErr[0].innerText = "This field is required";
        }
        if (!staging_txn_url) {
          valueErr = document.getElementsByClassName("err_staging_txn_url");
          errorStatus = true;
          valueErr[0].innerText = "This field is required";
        }
        if (!key) {
          valueErr = document.getElementsByClassName("err_key");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        // if (!url) {
        //   valueErr = document.getElementsByClassName("err_url");
        //   valueErr[0].innerText = "This Field is Required";
        //   errorStatus = true;
        // }
        if (!website) {
          valueErr = document.getElementsByClassName("err_website");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        data.merchantid = merchantid;
        data.key = key;
        // data.url = url;
        data.website = website;
        data.production_txn_url = production_txn_url;
        data.staging_txn_url = staging_txn_url;
      } else if (name === "Stripe") {
        var keyid = this.state.keyid || "";
        var secretid = this.state.secretid || "";
        if (!keyid) {
          valueErr = document.getElementsByClassName("err_keyid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        if (!secretid) {
          valueErr = document.getElementsByClassName("err_secretid");
          valueErr[0].innerText = "This Field is Required";
          errorStatus = true;
        }
        data.keyid = keyid;
        data.secretid = secretid;
      }

      setTimeout(() => {
        if (!errorStatus) {
          AdminApiRequest(data, "/admin/payment/gateway/add", "POST")
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
    AdminApiRequest(data, "/admin/payment/gateway/getAll", "GET")
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

  handleChangeStatus(checked, _id, name) {
    const data = [...this.state.allKeys];
    const newdata = data.map((d) => {
      return d._id === _id ? { ...d, [name]: checked } : { ...d };
    });
    setTimeout(() => {
      this.setState({ allKeys: newdata });
    }, 0);
  }

  handleChange(e, _id) {
    let tempStatus = false;
    if (
      e.target.name === "name" ||
      e.target.name === "status" ||
      e.target.name === "production_txn_url" ||
      e.target.name === "staging_txn_url"
    ) {
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
                          <h4 className="card-title"> Payment Gateway </h4>
                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={() => this.openModal()}
                          >
                            <i className="fa fa-plus"></i> Add
                          </button>
                        </div>
                        <div className="payment-setting mt-5 d-flex justify-content-start align-items-start">
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
                                          className="form-control"
                                          placeholder="Enter name"
                                          onChange={(ev) =>
                                            this.handleChange(ev, key._id)
                                          }
                                          value={key.name}
                                        />
                                      </div>{" "}
                                    </div>

                                    {key.name === "Paytm" ? (
                                      <>
                                        <div className="form-group mt-5">
                                          <div className="modal-left-bx">
                                            <label>
                                              Production URL
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="production_txn_url"
                                              className="form-control"
                                              placeholder="Enter Production URL"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                              value={
                                                key.keys.production_txn_url
                                              }
                                            />
                                            <span className="err err_edit_production_txn_url"></span>
                                          </div>{" "}
                                        </div>
                                        <div className="form-group mt-5">
                                          <div className="modal-left-bx">
                                            <label>
                                              Staging URL
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="staging_txn_url"
                                              className="form-control"
                                              placeholder="Enter Staging URL"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                              value={key.keys.staging_txn_url}
                                            />
                                            <span className="err err_edit_staging_txn_url"></span>
                                          </div>{" "}
                                        </div>

                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              Merchant ID{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="merchantid"
                                              value={key.keys.merchantid}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter  Merchant ID"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editmerchantid"></span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              Key{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="key"
                                              value={key.keys.key}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter Key"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editkey"></span>
                                          </div>
                                        </div>
                                        {/* <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              URL{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="url"
                                              value={key.keys.url}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter URL"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editurl"></span>
                                          </div>
                                        </div>
                                         */}
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              Website{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="website"
                                              value={key.keys.website}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter Website"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editwebsite"></span>
                                          </div>
                                        </div>
                                      </>
                                    ) : key.name === "Razorpay" ? (
                                      <>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              Key ID{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="keyid"
                                              value={key.keys.keyid}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter Key ID"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editkeyid"></span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              Secret ID{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="secretid"
                                              value={key.keys.secretid}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter secret ID"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editsecretid"></span>
                                          </div>
                                        </div>
                                      </>
                                    ) : key.name === "Paypal" ? (
                                      <>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              Client ID{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="clientid"
                                              value={key.keys.clientid}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter Client ID"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editclientid"></span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              Secret Code{" "}
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="secretcode"
                                              value={key.keys.secretcode}
                                              autoComplete="off"
                                              className="form-control"
                                              placeholder="Enter Secret Code"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                            />
                                            <span className="err err_editsecretcode"></span>
                                          </div>
                                        </div>
                                      </>
                                    ) : key.name === "Stripe" ? (
                                      <div className="form-group">
                                        <div className="modal-left-bx">
                                          <label>
                                            Description{" "}
                                            <span className="asterisk">*</span>
                                          </label>
                                        </div>
                                        <div className="modal-right-bx">
                                          <input
                                            type="text"
                                            name="description"
                                            value={key.keys.description}
                                            autoComplete="off"
                                            className="form-control"
                                            placeholder="Enter  description"
                                            onChange={(ev) =>
                                              this.handleChange(ev, key._id)
                                            }
                                          />
                                          <span className="err err_editdescription"></span>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    <div className="d-flex justify-content-between">
                                      <div className="d-flex justify-content-between">
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>Admin Status</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <Switch
                                              onChange={(e) =>
                                                this.handleChangeStatus(
                                                  e,
                                                  key._id,
                                                  "adminStatus"
                                                )
                                              }
                                              checked={key.adminStatus}
                                            />
                                          </div>{" "}
                                        </div>
                                      </div>
                                      <div className="d-flex justify-content-between">
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>Frontend Status</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <Switch
                                              onChange={(e) =>
                                                this.handleChangeStatus(
                                                  e,
                                                  key._id,
                                                  "frontendStatus"
                                                )
                                              }
                                              checked={key.frontendStatus}
                                            />
                                          </div>{" "}
                                        </div>
                                      </div>

                                      <div className="d-flex justify-content-between">
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>Staging Status</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <Switch
                                              onChange={(e) =>
                                                this.handleChangeStatus(
                                                  e,
                                                  key._id,
                                                  "staging"
                                                )
                                              }
                                              checked={key.staging}
                                            />
                                          </div>{" "}
                                        </div>
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
                      <h4 className="modal-title">Add Key</h4>
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
                                <option value="">Select Payment Method</option>
                                <option value="Paytm">Paytm</option>
                                <option value="Razorpay">Razorpay</option>
                                <option value="Paypal">Paypal</option>
                                {/* <option value="Stripe">Stripe</option> */}
                              </select>
                              {/* <input
                                type="text"
                                name="name"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter  Name"
                                onChange={this.formHandler}
                              /> */}
                              <span className="err err_name"></span>
                            </div>
                          </div>

                          {this.state.name === "Paytm" ? (
                            <>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Production URL
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="production_txn_url"
                                    className="form-control"
                                    placeholder="Enter Production URL"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_production_txn_url"></span>
                                </div>{" "}
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Staging URL
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="staging_txn_url"
                                    className="form-control"
                                    placeholder="Enter Staging URL"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_staging_txn_url"></span>
                                </div>{" "}
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Merchant ID{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="merchantid"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter  Merchant ID"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_merchantid"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Key <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="key"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter Key"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_key"></span>
                                </div>
                              </div>
                              {/* <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    URL <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="url"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter URL"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_url"></span>
                                </div>
                              </div>
                              */}
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Website <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="website"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter Website"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_website"></span>
                                </div>
                              </div>
                            </>
                          ) : this.state.name === "Razorpay" ? (
                            <>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Key ID <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="keyid"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter Key ID"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_keyid"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Secret ID{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="secretid"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter secret ID"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_secretid"></span>
                                </div>
                              </div>
                            </>
                          ) : this.state.name === "Paypal" ? (
                            <>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Client ID{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="clientid"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter Client ID"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_clientid"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Secret Code{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="secretcode"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder="Enter Secret Code"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_secretcode"></span>
                                </div>
                              </div>
                            </>
                          ) : this.state.name === "Stripe" ? (
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Description{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="description"
                                  autoComplete="off"
                                  className="form-control"
                                  placeholder="Enter  description"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_description"></span>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {/*
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Description <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="description"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter  description"
                                onChange={this.formHandler}
                              />
                              <span className="err err_description"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                URL<span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="url"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter URL"
                                onChange={this.formHandler}
                              />
                              <span className="err err_url"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Stage <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="stage"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter stage"
                                onChange={this.formHandler}
                              />
                              <span className="err err_stage"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                API Key <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="apiKey"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter API Key"
                                onChange={this.formHandler}
                              />
                              <span className="err err_apiKey"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Secret Key <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="screatKey"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter secret Key"
                                onChange={this.formHandler}
                              />
                              <span className="err err_screatKey"></span>
                            </div>
                          </div>
                              */}

                          <div className="d-flex  justify-content-between m-2">
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Admin Status</label>
                              </div>
                              <div className="modal-right-bx">
                                <Switch
                                  name="status"
                                  onChange={(ev) =>
                                    this.setState({ adminStatus: ev })
                                  }
                                  checked={this.state.adminStatus}
                                  id="normal-switch"
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Frontend Status</label>
                              </div>
                              <div className="modal-right-bx">
                                <Switch
                                  name="status"
                                  onChange={(ev) =>
                                    this.setState({ frontendStatus: ev })
                                  }
                                  checked={this.state.frontendStatus}
                                  id="normal-switch"
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Staging Status</label>
                              </div>
                              <div className="modal-right-bx">
                                <Switch
                                  name="status"
                                  onChange={(ev) =>
                                    this.setState({ staging: ev })
                                  }
                                  checked={this.state.staging}
                                  id="normal-switch"
                                />
                              </div>
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

export default paymentkeys;
