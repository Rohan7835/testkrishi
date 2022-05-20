import moment from "moment";
import "moment-timezone";
import React from "react";
import Modal from "react-modal";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { imageUrl } from "../../components/imgUrl";
import DynamicUrl from "../../main_url";

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
      limit: 5,
      throwToCartPage: false,
    };
    this.onChangelist = this.onChangelist.bind();
  }

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
  componentWillReceiveProps() {}

  componentWillUnmount() {}

  downloadInvoice = (bookingCode) => {
    const requestData = {
      booking_code: bookingCode,
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
      user_id: this.props.user_details._id,
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
            res.data.outOfStock.length !== 0
          ) {
            swal({
              title: "Please note!",
              text: `${res.data.outOfStock.join(
                ", "
              )} is currently out of stock. Rest of the items of your previous order have been added to your cart.`,
              icon: "warning",
              successMode: true,
            });
          } else if (
            res.data.outOfStock.length !== 0 &&
            res.data.data.CartDetail.length !== 0
          ) {
            swal({
              title: "",
              text: `Sorry, ${res.data.outOfStock.join(
                " "
              )} are Currently Out Of Stock !`,
              icon: "warning",
              successMode: true,
            }).then(() =>
              this.setState({
                throwToCartPage: true,
              })
            );
          } else if (res.data.data.CartDetail.length !== 0) {
            this.setState({
              throwToCartPage: true,
            });
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

  orderdetails() {
    if (Array.isArray(this.props.user_details) === false) {
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
            });
          } else if (res.status !== 503) {
            swal({
              title: "Error",
              text: "Network error",
              icon: "warning",
              dangerMode: true,
            });
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  subscription() {
    const requestData = {
      user_id: this.props.user_details._id,
    };
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/subscription/getAll", "GET", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_subscription: res.data.data,
          });
        } else if (res.status !== 503) {
          swal({
            title: "Error",
            text: "Network error",
            icon: "warning",
            dangerMode: true,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
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
        {this.state.throwToCartPage ? <Redirect to="/cart" /> : ""}
        <div
          className="my-order-wrap home-page-order-wrp"
          style={{ margin: 20 }}
        >
          <div>
            <div className="right_m_content" style={{ paddingLeft: 10 }}>
              <h2>Last 5 Orders</h2>
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
                  {this.state.all_order && this.state.all_order.length > 0
                    ? this.state.all_order.map((item, index) => (
                        <tr>
                          <td style={{ textTransform: "uppercase" }}>
                            {item.booking_code}
                          </td>
                          <td>{moment(item.createDate).format("LLL")}</td>
                          <td>{item.BookingStatusByAdmin}</td>
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
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      ))
                    : "no order"}
                </tbody>
              </table>
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
          <div
            role="dialog"
            className="order-custome-wrapper subs-custome-order-popup"
          >
            <div className="modal-dialog our_order_new home-order-lastest-box">
              <div className="modal-content">
                <div>
                  <h4 className="modal-title">
                    <span>{this.state.order_detail.booking_code}</span>
                    <span>{this.state.order_detail.BookingStatusByAdmin}</span>
                  </h4>
                  <span>
                    Order placed on{"  "}
                    <Moment format="DD/MM/YYYY">
                      {this.state.order_detail.createDate}
                    </Moment>
                  </span>

                  {this.state.order_detail.dates &&
                  this.state.order_detail.dates.length > 0 ? (
                    <div>
                      <p>Subscription Dates</p>
                      {this.state.order_detail.dates.map((dt) => {
                        return (
                          <>
                            <span>
                              <Moment format="DD/MM/YYYY">{dt.date}</Moment>
                              {" - "}
                              {dt.status}
                            </span>
                            <br />
                          </>
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                  <button
                    type="button"
                    className="close"
                    onClick={this.closeModal}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-form-bx">
                  <form>
                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Order Items</label>
                      </div>
                      <div className="modal-right-bx">
                        <div className="all_items_new">
                          {this.state.order_detail.bookingdetail
                            ? this.state.order_detail.bookingdetail.map(
                                (item, index) => (
                                  <div className="flex">
                                    <div className="left_main_card_new">
                                      <img
                                        src={
                                          imageUrl +
                                          (item.product_images.length > 0 &&
                                          item.product_images[0].image
                                            ? item.product_images[0].image
                                            : item.product_images[0])
                                        }
                                        alt="image"
                                        style={{ maxWidth: "80%" }}
                                      />
                                    </div>
                                    <div className="right_main_card_new">
                                      <div className="new_pro_custommer">
                                        {" "}
                                        <span>
                                          {item.product_name}
                                          <span>
                                            {!item.without_package
                                              ? item.simpleItem.packetLabel
                                              : item.unitQuantity +
                                                " " +
                                                (item.unitMeasurement.name ||
                                                  item.unitMeasurement)}
                                          </span>
                                        </span>
                                        <span>₹{item.totalprice}</span>{" "}
                                      </div>
                                      <div>
                                        <span>Quantity {item.qty}</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )
                            : "No Order Available"}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label style={{ fontWeight: "600" }}>
                          Shipping Details
                        </label>
                      </div>
                      <div className="modal-right-bx white_bg">
                        <p
                          style={{
                            textTransform: "capitalize",
                            fontSize: "18px",
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          {this.state.order_detail.user_id &&
                            this.state.order_detail.user_id.name}
                        </p>
                        {this.state.order_detail.booking_address && (
                          <span style={{ textTransform: "capitalize" }}>
                            {
                              this.state.order_detail.booking_address.address
                              // +
                              // (this.state.order_detail
                              //   .booking_address &&
                              // this.state.order_detail
                              //   .booking_address.pincode
                              //   ? " - " +
                              //     this.state.order_detail
                              //       .booking_address.pincode
                              //   : "")
                            }
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label style={{ fontWeight: "600" }}>
                          Payment Details
                        </label>
                      </div>
                      <div className="modal-right-bx white_bg">
                        <p
                          style={{
                            textTransform: "capitalize",
                            // fontSize: "18px",
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          {this.state.order_detail.paymentmethod}
                          {this.state.order_detail.dates &&
                          this.state.order_detail.dates.length > 0 ? (
                            ""
                          ) : (
                            <span>- {this.state.order_detail.payment}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label style={{ fontWeight: "600" }}>
                          Order Details
                        </label>
                      </div>
                      <div className="modal-right-bx white_bg">
                        {/* <div className="flex_justify border_bottom">
                          <span style={{ fontWeight: "600" }}>Status</span>
                          <span>
                            {this.state.order_detail.BookingStatusByAdmin}
                          </span>
                        </div> */}
                        <div className="flex_justify border_bottom">
                          <span style={{ fontWeight: "600" }}>Sub-Total</span>
                          <span>
                            ₹
                            {this.truncateToDecimals(
                              +this.state.order_detail.totalCartPriceWithoutGST
                            )}
                          </span>
                        </div>
                        {this.state.order_detail.totalCouponDiscountAmount ? (
                          <div className="flex_justify border_bottom">
                            <span style={{ fontWeight: "600" }}>
                              Discount{" "}
                              {this.state.order_detail.coupon_code
                                ? "(" +
                                  this.state.order_detail.coupon_code +
                                  ")"
                                : ""}
                            </span>
                            <span>
                              ₹{" "}
                              {
                                this.state.order_detail
                                  .totalCouponDiscountAmount
                              }
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                        {this.state.order_detail.referralDiscount > 0 ? (
                          <div className="flex_justify border_bottom">
                            <span style={{ fontWeight: "600" }}>
                              Referral Discount
                            </span>
                            <span>
                              ₹
                              {this.truncateToDecimals(
                                this.state.order_detail.referralDiscount
                              )}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                        {this.state.order_detail.redeem_point > 0 ? (
                          <div className="flex_justify border_bottom">
                            <span style={{ fontWeight: "600" }}>
                              Redeem Point Discount
                            </span>
                            <span>
                              ₹
                              {this.truncateToDecimals(
                                this.state.order_detail.redeemDiscount
                              )}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="flex_justify border_bottom">
                          <span style={{ fontWeight: "600" }}>
                            Total GST <br />{" "}
                            {this.state.order_detail.gst > 0
                              ? this.state.order_detail.allGstLists &&
                                this.state.order_detail.allGstLists.map(
                                  (gst) => {
                                    return (
                                      <>
                                        <span style={{ fontSize: "12px" }}>
                                          {gst.tax_name} {gst.tax_percent}% - ₹
                                          {gst.totalPrice}
                                        </span>{" "}
                                        <br />
                                      </>
                                    );
                                  }
                                )
                              : ""}
                          </span>
                          <span>
                            ₹{this.state.order_detail.gst} <br />
                          </span>
                        </div>
                        {/* <div className="flex_justify border_bottom">
                          <span style={{ fontWeight: "600" }}>
                            Sub-Total (including GST)
                          </span>
                          <span>₹{this.state.order_detail.totalCartPrice}</span>
                        </div> */}

                        {/* {this.state.order_detail.couponApplied ? (
                          <div className="flex_justify border_bottom">
                            <span style={{ fontWeight: "600" }}>
                              Coupon Applied
                            </span>
                            <span>{this.state.order_detail.coupon_code}</span>
                          </div>
                        ) : (
                          ""
                        )} */}

                        <div className="flex_justify border_bottom">
                          <span style={{ fontWeight: "600" }}>
                            Delivery Charges
                          </span>
                          <span>
                            ₹{this.state.order_detail.deliveryCharges}
                          </span>
                        </div>

                        {this.state.order_detail.cod ? (
                          <div className="flex_justify border_bottom">
                            <span style={{ fontWeight: "600" }}>
                              COD Charges
                            </span>
                            <span>
                              ₹
                              {this.truncateToDecimals(
                                this.state.order_detail.codCharges
                              )}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                        {this.state.order_detail.OrderTotal ? (
                          <>
                            <div
                              className="flex_justify"
                              style={{ padding: "4px 0px" }}
                            >
                              <span style={{ fontWeight: "600" }}>
                                Total Price Per Day
                              </span>
                              <span>
                                ₹
                                {this.truncateToDecimals(
                                  this.state.order_detail.total_payment
                                )}
                              </span>
                            </div>
                            <div
                              className="flex_justify"
                              style={{ padding: "4px 0px" }}
                            >
                              <span style={{ fontWeight: "600" }}>
                                Subscription Days
                              </span>
                              <span>
                                {this.state.order_detail.dates.length}
                              </span>
                            </div>
                            {/* {this.state.order_detail.discountAmount > 0 ? (
                              <div className="flex_justify border_bottom">
                                <span style={{ fontWeight: "600" }}>
                                  Discount
                                </span>
                                <span>
                                  ₹
                                  {this.truncateToDecimals(
                                    this.state.order_detail.discountAmount
                                  )}
                                </span>
                              </div>
                            ) : (
                              ""
                            )} */}
                            <div
                              className="flex_justify"
                              style={{ padding: "4px 0px" }}
                            >
                              <span style={{ fontWeight: "600" }}>
                                Order Total
                              </span>
                              <span>
                                ₹
                                {this.truncateToDecimals(
                                  this.state.order_detail.OrderTotal
                                )}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div
                            className="flex_justify"
                            style={{ padding: "4px 0px" }}
                          >
                            <span style={{ fontWeight: "600" }}>
                              Order Total
                            </span>
                            <span>
                              ₹
                              {this.truncateToDecimals(
                                this.state.order_detail.total_payment
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
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
