import React from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { imageUrl } from "../../components/imgUrl";

class OrderPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      order_detail: this.props.order_detail,
      modalIsOpen: false,
      addModal: false,
      loading: true,
    };
  }

  formHandler(val) {
    var name = val.target.name;
    var value = val.target.value;
    this.setState({ [name]: value });
  }

  openSelectedOrder = (e, order) => {
    e.preventDefault();
    this.setState({ order_detail: order });

    setTimeout(() => {
      this.setState({ modalIsOpen: true });
    }, 50);
  };
  openModal = () => {
    this.setState({
      addModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      modalIsOpenedit: false,
    });
  };

  componentDidMount() {
    this.setState({
      user_id: this.props.user_details._id,
    });
  }

  truncateToDecimals = (num, dec = 2) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };

  render() {
    return (
      <div
        role="dialog"
        className="order-custome-wrapper subs-custome-order-popup"
      >
        <div className="modal-dialog our_order_new">
          <div className="modal-content">
            <div>
              <h4 className="modal-title">
                <span>
                  {this.state.order_detail && this.state.order_detail.OrderTotal
                    ? this.state.order_detail.SubscriptionID
                    : this.state.order_detail &&
                      this.state.order_detail.booking_code
                    ? this.state.order_detail.booking_code
                    : "--"}
                </span>
                <span>
                  {this.state.order_detail &&
                  this.state.order_detail.BookingStatusByAdmin
                    ? this.state.order_detail.BookingStatusByAdmin
                    : "--"}
                </span>
              </h4>
              <span>
                Order placed on{"  "}
                <Moment format="DD/MM/YYYY">
                  {this.state.order_detail && this.state.order_detail.createDate
                    ? this.state.order_detail.createDate
                    : "--"}
                </Moment>
              </span>
              <div className="form-group">
                <div className="modal-left-bx">
                  <label>Delivery Slot</label>
                </div>
                <div className="modal-right-bx">
                  {this.state.order_detail?.deliverySlot || ""}
                </div>
              </div>
              {this.state.order_detail &&
              this.state.order_detail.dates &&
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
              <button type="button" className="close" onClick={this.closeModal}>
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
                      {this.state.order_detail &&
                      this.state.order_detail.bookingdetail
                        ? this.state.order_detail.bookingdetail.map(
                            (item, index) => (
                              <div className="flex">
                                <div className="left_main_card_new">
                                  <Link
                                    to={
                                      "/product/" +
                                      (item.slug || item.product_id.slug)
                                    }
                                  >
                                    <img
                                      src={
                                        imageUrl +
                                        (item.product_images[0]
                                          ? item.product_images[0].image ||
                                            item.product_images[0]
                                          : localStorage.getItem("prdImg"))
                                      }
                                      alt="image12"
                                      style={{ maxWidth: "80%" }}
                                    />
                                  </Link>
                                </div>
                                <div className="right_main_card_new">
                                  <div className="new_pro_custommer">
                                    {" "}
                                    <span>
                                      <Link
                                        to={
                                          "/product/" +
                                          (item.slug || item.product_id.slug)
                                        }
                                        style={{ color: "#febc15" }}
                                      >
                                        {item.product_name}
                                      </Link>
                                      {/* {item.unitMeasurement &&
                                      item.unitMeasurement.name ? ( */}
                                      {item.TypeOfProduct === "simple" && (
                                        <span>
                                          {!item.without_package
                                            ? item.simpleItem.packetLabel
                                            : item.unitQuantity +
                                              " " +
                                              (item.unitMeasurement.name ||
                                                item.unitMeasurement)}
                                        </span>
                                      )}
                                      {/* ) : (
                                        ""
                                      )} */}
                                    </span>
                                    <span>
                                      ₹
                                      {item.itemWiseGst
                                        ? (
                                            +item.totalprice - +item.itemWiseGst
                                          ).toFixed(2)
                                        : item.totalprice}
                                    </span>{" "}
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
                    <label style={{ fontWeight: "600" }}>Billing Details</label>
                  </div>
                  {this.state.order_detail && (
                    <div className="modal-right-bx white_bg">
                      <p
                        style={{
                          textTransform: "capitalize",
                          fontSize: "18px",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {this.state.order_detail &&
                        this.state.order_detail.user_id
                          ? this.state.order_detail.user_id.name
                          : "--"}
                      </p>
                      {this.state.order_detail.booking_address && (
                        <span style={{ textTransform: "capitalize" }}>
                          {this.state.order_detail.booking_address.address}
                        </span>
                      )}
                    </div>
                  )}{" "}
                </div>
                {this.state.order_detail &&
                this.state.order_detail.giftingStatus ? (
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label style={{ fontWeight: "600" }}>
                        Shipping Details
                      </label>
                    </div>

                    <div className="modal-right-bx white_bg">
                      <div className="flex_justify border_bottom">
                        <span style={{ fontWeight: "600" }}>Name</span>
                        <span>
                          {this.state.order_detail &&
                          this.state.order_detail.giftingName
                            ? this.state.order_detail.giftingName
                            : "--"}
                        </span>
                      </div>
                      <div className="flex_justify border_bottom">
                        <span style={{ fontWeight: "600" }}>Contact</span>
                        <span>
                          {this.state.order_detail.giftingContact &&
                            this.state.order_detail.giftingContact}
                        </span>
                      </div>
                      <div className="flex_justify border_bottom">
                        <span style={{ fontWeight: "600" }}>Note</span>
                        <span>
                          {this.state.order_detail.giftingNote &&
                            this.state.order_detail.giftingNote}
                        </span>
                      </div>
                      <div className="flex_justify border_bottom">
                        <span style={{ fontWeight: "600" }}>Address</span>
                        <span>
                          {this.state.order_detail.giftingAddress &&
                            this.state.order_detail.giftingAddress.address}
                        </span>
                      </div>
                      <div className="flex_justify border_bottom"></div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="form-group">
                  <div className="modal-left-bx">
                    <label style={{ fontWeight: "600" }}>Payment Details</label>
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
                    <label style={{ fontWeight: "600" }}>Order Details</label>
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
                            ? "(" + this.state.order_detail.coupon_code + ")"
                            : ""}
                        </span>
                        <span>
                          ₹ {this.state.order_detail.totalCouponDiscountAmount}
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
                            this.state.order_detail.allGstLists.map((gst) => {
                              return (
                                gst.tax_name && (
                                  <>
                                    <span style={{ fontSize: "12px" }}>
                                      {gst.tax_name} {gst.tax_percent}% - ₹
                                      {+gst.totalPrice || "0"}
                                    </span>{" "}
                                    <br />
                                  </>
                                )
                              );
                            })
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
                    {this.state.order_detail.deliveryCharges ? (
                      <div className="flex_justify border_bottom">
                        <span style={{ fontWeight: "600" }}>
                          Delivery Charges
                        </span>
                        <span>₹{this.state.order_detail.deliveryCharges}</span>
                      </div>
                    ) : (
                      ""
                    )}

                    {this.state.order_detail.cod ? (
                      <div className="flex_justify border_bottom">
                        <span style={{ fontWeight: "600" }}>COD Charges</span>
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
                          <span>{this.state.order_detail.dates.length}</span>
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
                          <span style={{ fontWeight: "600" }}>Order Total</span>
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
                        <span style={{ fontWeight: "600" }}>Order Total</span>
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
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(OrderPopup);
