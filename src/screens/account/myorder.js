import moment from "moment";
import "moment-timezone";
import React from "react";
import Pagination from "react-js-pagination";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import { connect } from "react-redux";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import DynamicUrl from "../../main_url";
import Sidebar from "../main_sidebar/sidebar";
import OrderPopup from "./OrderPopup";

class Myorders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      all_order: [],
      order_status_show: "orders",
      order_detail: [],
      skip: 0,
      limit: 10,
      count: 0,
      subscriptionCount: 0,
      currentPage: 1,
      loading: true,
    };
    this.onChangelist = this.onChangelist.bind();
    this.handlePageChange = this.handlePageChange.bind();
  }

  handlePageChange = (pageNumber) => {
    this.setState({
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;

    this.setState({ loading: true });
    const requestData = {
      skip: skip,
      limit: this.state.limit,
    };
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/getUserBooking", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_order: res.data.data,
          });
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
  };

  onChangelist = (data) => {
    this.setState({
      order_status_show: data,
    });
    if (data === "orders") {
      this.orderdetails();
    } else if (data === "subscription") {
      this.subscription();
    } else {
    }
  };

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
  openModal(ev, dt) {
    this.setState({
      order_detail: ev,
      userAddress:
        typeof ev.booking_address === "object"
          ? ev.booking_address
          : JSON.parse(ev.booking_address),
    });
    this.setState({ modalIsOpen: true });
  }
  closeModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  };
  // componentWillReceiveProps() {}

  componentWillUnmount() {}

  downloadInvoice = (bookingCode) => {
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    const requestData = {
      booking_code: bookingCode,
    };
    ApiRequest(requestData, "/invoice/generate", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          //
          const newWindow = window.open(
            DynamicUrl + res.data.pdf.filename,
            "_blank",
            "noopener,noreferrer"
          );
          if (newWindow) newWindow.opener = null;
        } else {
          swal({
            title: "Error",
            text: "Try Again !",
            icon: "warning",
            successMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  downloadInvoicesubscription = (bookingCode) => {
    const requestData = {
      subscription_code: bookingCode,
    };
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/invoice/generate", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          //
          const newWindow = window.open(
            DynamicUrl + res.data.pdf.filename,
            "_blank",
            "noopener,noreferrer"
          );
          if (newWindow) newWindow.opener = null;
        } else {
          swal({
            title: "Error",
            text: "Try Again !",
            icon: "warning",
            successMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  repeatOrder = (bookingCode) => {
    const requestData = {
      booking_code: bookingCode,
      regionId: JSON.parse(localStorage.getItem("selectedRegionId")),
    };
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/re-order", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          if (
            res.data.data.CartDetail.length === 0 &&
            (res.data.outOfStock.length !== 0 || res.data.notAdded.length !== 0)
          ) {
            swal({
              title: "Please note!",
              text: `${res.data.outOfStock.join(", ")} ${
                res.data.notAdded.length > 0
                  ? ", " + res.data.notAdded.join(", ")
                  : ""
              }  is currently out of stock.`,
              icon: "warning",
              successMode: true,
            });
          } else if (
            (res.data.outOfStock.length !== 0 ||
              res.data.notAdded.length !== 0) &&
            res.data.data.CartDetail.length !== 0
          ) {
            swal({
              title: "",
              text: `${res.data.outOfStock.join(", ")} ${
                res.data.notAdded.length > 0
                  ? ", " + res.data.notAdded.join(", ")
                  : ""
              } is currently out of stock. Rest of the items of your previous order have been added to your cart.`,
              icon: "warning",
              successMode: true,
            }).then(() => this.props.history.push("/cart"));
          } else if (res.data.data.CartDetail.length !== 0) {
            this.props.history.push("/cart");
          }
        } else {
          swal({
            title: "Error",
            text: "Try Again !",
            icon: "warning",
            successMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  cancelsubscription = (id) => {
    swal({
      title: "Cancel Subscription",
      text: "Are you sure?",
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
          className: "back-swal-btn",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const requestData = {
          subscriptionID: id,
        };
        ApiRequest(requestData, "/subscription/cancelOne", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              if (Array.isArray(this.props.user_details) === false) {
                this.orderdetails();
                this.subscription();
              }
              swal({
                title: "Subscription Cancelled",
                // text: "Try Again !",
                icon: "warning",
                successMode: false,
              });
              //
              // const newWindow = window.open(
              //   DynamicUrl.replace("api", "") + res.data.pdf.filename,
              //   "_blank",
              //   "noopener,noreferrer"
              // );
              // if (newWindow) newWindow.opener = null;
            } else {
              swal({
                title: "Error",
                text: "Try Again !",
                icon: "warning",
                successMode: true,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
        this.setState({ loading: false });
      }
    });
  };

  orderdetails() {
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
    };
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/getUserBooking", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_order: res.data.data,
            count: res.data.count ? res.data.count : 0,
          });
        } else if (res.status === 503) {
          // alert("Please Login Again");
          // window.location = "/";
          // localStorage.setItem("contact", "");
          // let a = [];
          // this.props.userdetails(a);
          // this.props.addToCart(a);
          // localStorage.clear();
        } else {
        }
      })
      .then(() => this.setState({ loading: false }))
      .catch((error) => {
        console.log(error);
      });
  }
  subscription() {
    const requestData = {};
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/subscription/getAll", "GET", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_subscription: res.data.data,
            subscriptionCount: res.data.count,
          });
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
  }

  componentDidMount() {
    this.setState({ loading: true });
    if (Array.isArray(this.props.user_details) === false) {
      this.orderdetails();
      this.subscription();
    }
  }

  truncateToDecimals = (num, dec = 2) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };

  render() {
    return (
      <>
        <div className="container">
          <div className="my-order-wrap">
            <div className="main_content">
              <Sidebar active="order"></Sidebar>
              <div className="right_m_content">
                <h2>Orders</h2>
                <ul
                  className="nav nav-tabs inner-tab front_css_des"
                  id="myTab"
                  role="tablist"
                >
                  <li
                    className={
                      this.state.order_status_show === "orders"
                        ? "nav-item onchang active"
                        : "nav-item onchang"
                    }
                    onClick={() => this.onChangelist("orders")}
                  >
                    Orders {this.state.count ? this.state.count : 0}
                  </li>
                  <li
                    className={
                      this.state.order_status_show === "subscription"
                        ? "nav-item onchang active"
                        : "nav-item onchang"
                    }
                    onClick={() => this.onChangelist("subscription")}
                  >
                    Subscription{" "}
                    {this.state.subscriptionCount
                      ? this.state.subscriptionCount
                      : 0}
                  </li>
                </ul>
                {/* all_subscription */}
                {this.state.order_status_show === "orders" ? (
                  <table border="0" cellspacing="0" className="order-table">
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.all_order &&
                      this.state.all_order.length > 0 ? (
                        this.state.all_order.map((item, index) => (
                          <tr>
                            <td style={{ textTransform: "uppercase" }}>
                              {item.booking_code}
                            </td>
                            <td>{moment(item.createDate).format("LLL")}</td>
                            <td style={{ textTransform: "capitalize" }}>
                              {item.BookingStatusByAdmin}
                            </td>
                            <td style={{ cursor: "pointer" }}>
                              <i
                                title="View Order Details"
                                className="fa fa-eye"
                                aria-hidden="true"
                                onClick={this.openModal.bind(this, item)}
                              ></i>
                              <i
                                title="Download Invoice"
                                className="fa fa-download"
                                aria-hidden="true"
                                style={{ marginLeft: 5 }}
                                onClick={() =>
                                  this.downloadInvoice(item.booking_code)
                                }
                              ></i>
                              {item.bookingMode === "online" ? (
                                <>
                                  <p
                                    title="Repeat Order"
                                    style={{
                                      marginLeft: 5,
                                      cursor: "pointer",
                                      color: "#febc15",
                                    }}
                                    onClick={() =>
                                      this.repeatOrder(item.booking_code)
                                    }
                                  >
                                    Repeat Order
                                  </p>
                                </>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        ))
                      ) : this.state.loading === true ? (
                        <ReactLoading type={"cylon"} color={"#febc12"} />
                      ) : (
                        "No Order"
                      )}
                    </tbody>

                    <div className="seed-wrap-box">
                      <Pagination
                        hideNavigation
                        activePage={this.state.currentPage}
                        itemsCountPerPage={this.state.limit}
                        totalItemsCount={this.state.count}
                        onChange={this.handlePageChange}
                      />
                    </div>
                  </table>
                ) : (
                  ""
                )}
                {this.state.order_status_show === "subscription" ? (
                  <table border="0" cellspacing="0" className="order-table">
                    <thead>
                      <tr>
                        <th>Subscription Number</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.all_subscription &&
                      this.state.all_subscription.length > 0 ? (
                        this.state.all_subscription.map((item, index) => (
                          <tr>
                            <td style={{ textTransform: "uppercase" }}>
                              {item.SubscriptionID}
                            </td>
                            <td>{moment(item.createDate).format("LLL")}</td>
                            <td style={{ textTransform: "capitalize" }}>
                              {item.unsubscribed === true
                                ? "Cancelled"
                                : item.BookingStatusByAdmin}
                            </td>
                            <td>
                              <i
                                className="fa fa-eye"
                                aria-hidden="true"
                                style={{ cursor: "pointer" }}
                                onClick={this.openModal.bind(this, item)}
                              ></i>
                              <i
                                title="Download Invoice"
                                className="fa fa-download"
                                aria-hidden="true"
                                style={{ marginLeft: 5 }}
                                onClick={() =>
                                  this.downloadInvoicesubscription(
                                    item.SubscriptionID
                                  )
                                }
                              ></i>
                              {item.unsubscribed === false ? (
                                <p
                                  title="Cancel Subscription"
                                  style={{
                                    marginLeft: 5,
                                    cursor: "pointer",
                                    color: "#febc15",
                                  }}
                                  onClick={() =>
                                    this.cancelsubscription(item._id)
                                  }
                                >
                                  Cancel Subscription
                                </p>
                              ) : (
                                <p
                                  title="Cancelled Subscription"
                                  style={{
                                    marginLeft: 5,
                                    cursor: "default",
                                    color: "#febc15",
                                  }}
                                >
                                  {/* Cancelled */}
                                </p>
                              )}
                              {/* <i
                                className="fa fa-times"
                                aria-hidden="true"
                                style={{ marginLeft: 5, cursor: "pointer" }}
                                onClick={() =>
                                  this.cancelsubscription(item._id)
                                }
                              >
                                Cancel Subscription
                              </i> */}
                            </td>
                          </tr>
                        ))
                      ) : this.state.loading ? (
                        <ReactLoading type={"cylon"} color={"#febc12"} />
                      ) : (
                        "No Order"
                      )}
                    </tbody>
                  </table>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        {/* // order modal start */}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="adding-address"
          contentLabel="Add Address"
          scrollable={true}
        >
          <OrderPopup order_detail={this.state.order_detail} />
        </Modal>
        {/* // order modal end */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(Myorders);
