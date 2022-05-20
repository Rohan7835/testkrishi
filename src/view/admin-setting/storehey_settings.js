import CKEditor from "ckeditor4-react";
import QRCode from "qrcode";
import React from "react";
import Switch from "react-switch";
import io from "socket.io-client";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import url from "../../main_url";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";

class setting extends React.Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      _id: "",
      reviewRating: false,
      giftingOnOff: false,
      creditPaymentOnOff: false,
      creditPaymentOnline: false,
      creditPaymentOffline: false,
      simple_product: false,
      config_product: false,
      group_product: false,
      invoiceDeclaration: "",
      invoicePaymentDetail: "",
      whatsappOnOff: false,
      whatsappStatus: "offline",
      qr: null,
      loading: false,
    };
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
  }
  async formHandler(val, type) {
    this.setState({ [val.target.name]: val.target.value });
  }
  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true });
    } else {
      this.setState({ status: false });
    }
  }

  handleChangeloyality(checked) {
    if (checked) {
      this.setState({ loyalitystatus: true });
    } else {
      this.setState({ loyalitystatus: false });
    }
  }
  update = () => {
    var data = new FormData();

    // var images = [];
    // images = document.querySelector('input[name="banner"]').files[0]
    //   ? document.querySelector('input[name="banner"]').files[0]
    //   : this.state.banner;
    // data.append("banner", images);
    data.append(
      "reviewRating",
      this.state.reviewRating ? this.state.reviewRating : false
    );
    data.append(
      "simple_product",
      this.state.simple_product ? this.state.simple_product : false
    );
    data.append(
      "config_product",
      this.state.config_product ? this.state.config_product : false
    );
    data.append(
      "group_product",
      this.state.group_product ? this.state.group_product : false
    );
    data.append(
      "giftingOnOff",
      this.state.giftingOnOff ? this.state.giftingOnOff : false
    );
    data.append(
      "creditPaymentOnOff",
      this.state.creditPaymentOnOff ? this.state.creditPaymentOnOff : false
    );
    data.append(
      "creditPaymentOnline",
      this.state.creditPaymentOnOff ? this.state.creditPaymentOnline : false
    );
    data.append(
      "creditPaymentOffline",
      this.state.creditPaymentOnOff ? this.state.creditPaymentOffline : false
    );
    data.append(
      "invoiceDeclaration",
      this.state.invoiceDeclaration ? this.state.invoiceDeclaration : ""
    );
    data.append(
      "invoicePaymentDetail",
      this.state.invoicePaymentDetail ? this.state.invoicePaymentDetail : ""
    );
    data.append(
      "whatsappOnOff",
      this.state.whatsappOnOff ? this.state.whatsappOnOff : false
    );
    data.append("_id", this.state._id ? this.state._id : "");

    AdminApiRequest(data, "/admin/storehey/UpdateOne", "POST", "apiWithImage")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          swal({
            title: "Details Updated",
            // text: "Are you sure that you want to leave this page?",
            icon: "success",
            dangerMode: false,
          });
          this.GetAdminSetting();
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
  };
  GetAdminSetting() {
    let data = {};
    AdminApiRequest(data, "/storehey/getSetting", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          AdminApiRequest(data, "/whatsapp/checkStatus", "GET")
            .then((res1) => {
              if (res1.status === 201 || res1.status === 200) {
                if (res1.data.data == "CONNECTED") {
                  this.setState({ whatsappStatus: "online" });
                }
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

          this.setState({
            reviewRating: res.data.data[0].reviewRating,
            giftingOnOff: res.data.data[0].giftingOnOff,
            creditPaymentOnOff: res.data.data[0].creditPaymentOnOff,
            creditPaymentOnline: res.data.data[0].creditPaymentOnline,
            creditPaymentOffline: res.data.data[0].creditPaymentOffline,
            simple_product: res.data.data[0].simple_product,
            config_product: res.data.data[0].config_product,
            group_product: res.data.data[0].group_product,
            invoiceDeclaration: res.data.data[0].invoiceDeclaration,
            invoicePaymentDetail: res.data.data[0].invoicePaymentDetail,
            whatsappOnOff: res.data.data[0].whatsappOnOff,
            _id: res.data.data[0]._id,
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
    if (!JSON.parse(localStorage.getItem("storeheyLoggedIn"))) {
      this.props.history.push("/storehey");
    }
  }
  onEditorChange(evt) {
    this.setState({
      invoicePaymentDetail: evt.editor.getData(),
    });
  }
  startWhatsapp() {
    if (!this.state.loading) {
      this.setState({ loading: true });
      const requestData = {};
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";

      AdminApiRequest(requestData, "/whatsapp/startConnection", "GET", token)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({ whatsappStatus: "connecting" });
            console.log("got response :::: ", res);
            this.socket = io(`${url}`);
            this.initializeSocketEvents();
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
  initializeSocketEvents() {
    this.socket.on("connection_success", () => {
      this.requestQR();
    });
    this.socket.on("qr", (msg) => {
      console.log("QR Received :::: ", msg);
      QRCode.toDataURL(msg, (err, url) => {
        if (err) console.error(err);
        this.setState({ qr: url, loading: false });
        console.log(url);
      });
    });

    this.socket.on("whatsapp_connection_success", (msg) => {
      this.setState({ whatsappStatus: "online" });
      this.socket.emit("closeSocketServer");
      this.socket.close();
    });
  }
  requestQR() {
    this.socket.emit("qr_request", {});
  }
  stopWhatsapp() {
    const requestData = {};
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";

    AdminApiRequest(requestData, "/whatsapp/stopConnection", "GET", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({ whatsappStatus: "offline", qr: null });
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
  render() {
    return (
      <>
        <div className="wrapper ">
          <Adminsiderbar />
          <div className="main-panel">
            <Adminheader />
            <div className="container">
              <div className="setting-page">
                <h3>Status</h3>
                <div className="Default_icon">
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Review & Rating Status</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={(e) => this.setState({ reviewRating: e })}
                        checked={this.state.reviewRating}
                        id="normal-switch"
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Gifting Status</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={(e) => this.setState({ giftingOnOff: e })}
                        checked={this.state.giftingOnOff}
                        id="normal-switch"
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group mt-3">
                    <div className="modal-left-bx">
                      <label>Credit Limit Status</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={(e) =>
                          this.setState({ creditPaymentOnOff: e })
                        }
                        checked={this.state.creditPaymentOnOff}
                        id="normal-switch"
                      />
                    </div>{" "}
                  </div>
                  {this.state.creditPaymentOnOff ? (
                    <>
                      <div className="form-group mt-3">
                        <div className="modal-left-bx">
                          <label>Credit Payment - Online</label>
                        </div>
                        <div className="modal-right-bx">
                          <Switch
                            onChange={(e) =>
                              this.setState({ creditPaymentOnline: e })
                            }
                            checked={this.state.creditPaymentOnline}
                            id="normal-switch"
                          />
                        </div>{" "}
                      </div>
                      <div className="form-group mt-3">
                        <div className="modal-left-bx">
                          <label>Credit Payment - Offline</label>
                        </div>
                        <div className="modal-right-bx">
                          <Switch
                            onChange={(e) =>
                              this.setState({ creditPaymentOffline: e })
                            }
                            checked={this.state.creditPaymentOffline}
                            id="normal-switch"
                          />
                        </div>{" "}
                      </div>
                      <h3 className="mt-3 pt-3 d-block w-100">Product Types</h3>

                      <div className="form-group ">
                        <div className="modal-left-bx">
                          <label>Simple</label>
                        </div>
                        <div className="modal-right-bx">
                          <Switch
                            onChange={(e) =>
                              this.setState({ simple_product: e })
                            }
                            checked={this.state.simple_product}
                            id="normal-switch"
                          />
                        </div>{" "}
                      </div>

                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>Configure</label>
                        </div>
                        <div className="modal-right-bx">
                          <Switch
                            onChange={(e) =>
                              this.setState({ config_product: e })
                            }
                            checked={this.state.config_product}
                            id="normal-switch"
                          />
                        </div>{" "}
                      </div>

                      <div className="form-group mt-3">
                        <div className="modal-left-bx">
                          <label>Group</label>
                        </div>
                        <div className="modal-right-bx">
                          <Switch
                            onChange={(e) =>
                              this.setState({ group_product: e })
                            }
                            checked={this.state.group_product}
                            id="normal-switch"
                          />
                        </div>{" "}
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <h3>Whatsapp</h3>
                <div className="Default_icon">
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Whatsapp Module</label>
                    </div>
                    <div className="modal-right-bx">
                      <div className="d-flex align-items-center">
                        <Switch
                          onChange={(e) => this.setState({ whatsappOnOff: e })}
                          checked={this.state.whatsappOnOff}
                          id="normal-switch"
                        />
                        {this.state.loading ? (
                          <span
                            className="button-text ml-3"
                            style={{ color: "#fff" }}
                          >
                            <i
                              className="fa fa-spinner searchLoading"
                              aria-hidden="true"
                            ></i>
                          </span>
                        ) : (
                          ""
                        )}
                      </div>

                      {this.state.whatsappOnOff ? (
                        <>
                          {this.state.whatsappStatus == "offline" ? (
                            <button
                              className="d-block btn btn-primary  mt-2"
                              style={{ background: "#febc12", border: "none" }}
                              onClick={() => {
                                this.startWhatsapp();
                              }}
                            >
                              Establish connection
                            </button>
                          ) : (
                            ""
                          )}

                          {this.state.qr &&
                          this.state.whatsappStatus == "connecting" ? (
                            <div className="qr">
                              <img src={this.state.qr} alt="" />
                            </div>
                          ) : (
                            ""
                          )}

                          {this.state.whatsappStatus == "online" ? (
                            <button
                              className="d-block btn btn-primary  mt-2"
                              style={{ background: "#febc12", border: "none" }}
                              onClick={() => {
                                this.stopWhatsapp();
                              }}
                            >
                              Stop connection
                            </button>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <h3>Invoice</h3>
                <div className="Default_icon">
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Invoice Declaration</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="invoiceDeclaration"
                        className="form-control"
                        placeholder="Enter Invoice Declaration"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.invoiceDeclaration}
                      />
                    </div>{" "}
                  </div>

                  <div className="form-group w-100 mt-4 ml-0">
                    <div className="modal-left-bx">
                      <label>Invoice Payment Detail</label>
                    </div>
                    <div className="modal-right-bx">
                      <CKEditor
                        onChange={this.onEditorChange}
                        data={this.state.invoicePaymentDetail}
                        type="classic"
                      />
                    </div>{" "}
                  </div>
                </div>

                <div className="form-group">
                  <button
                    type="button"
                    className="submit fill-btn"
                    onClick={() => this.update()}
                  >
                    <span className="button-text">Update</span>
                    <span className="button-overlay"></span>
                  </button>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }
}

export default setting;
