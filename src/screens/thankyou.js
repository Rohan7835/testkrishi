import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, changethankyouAuth } from "../../src/redux/actions/actions";
import { ApiRequest } from "../apiServices/ApiRequest";

class Thankyou extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    if (!this.props.thankyouAuth) {
      this.props.history.push("/");
    } else {
      localStorage.setItem("coupon_code", "");
      localStorage.setItem("freepackage", "");
      localStorage.setItem("freeproduct", "");
      localStorage.setItem("couponStatus", 2);
      localStorage.setItem("discount_amount", "");
      localStorage.setItem("couponId", "");
      localStorage.setItem("discount_details", {});
      localStorage.setItem("discount_percentage", 0);
      var cartDatabyAPI = [];
      let dtaa = {};
      if (this.props.user_details._id) {
        ApiRequest(dtaa, "/get/addtocart/" + this.props.user_details._id, "GET")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              localStorage.setItem("status", Boolean(res.data.data.subscribe));
              res.data.data.cartDetail &&
                res.data.data.cartDetail.map((item) => {
                  cartDatabyAPI.push({
                    _id: item.product_id._id,
                    product_name: item.product_id.product_name,
                    longDesc: item.product_id.longDesc,
                    product_name: item.product_id.product_name,
                    shortDesc: item.product_id.shortDesc,
                    attachment: item.product_id.attachment,
                    banner: item.product_id.banner,
                    productThreshold: item.product_id.productThreshold,
                    productSubscription: item.product_id.productSubscription,
                    salesTaxOutSide: item.product_id.salesTaxOutSide,
                    salesTaxWithIn: item.product_id.salesTaxWithIn,
                    purchaseTax: item.product_id.purchaseTax,
                    hsnCode: item.product_id.hsnCode,
                    unitMeasurement: item.unitMeasurement,
                    TypeOfProduct: item.product_id.TypeOfProduct,
                    SKUCode: item.product_id.SKUCode,
                    __v: item.product_id.__v,
                    created_at: item.product_id.created_at,
                    status: item.product_id.status,
                    hsnCode: item.product_id.hsnCode,
                    bookingQuantity: +item.product_id.bookingQuantity,
                    productQuantity: item.product_id.productQuantity,
                    availableQuantity: +item.product_id.availableQuantity,
                    ProductRegion: item.product_id.ProductRegion,
                    relatedProduct: item.product_id.relatedProduct,
                    configurableData: [],
                    images: item.product_id.images,
                    qty: item.qty,
                    price: item.price,
                    totalprice: item.totalprice,
                    groupData: item.groupData,
                    unitQuantity: item.unitQuantity,
                    configurableItem: item.configurableItem,
                    simpleData: item.simpleItem.packet_size
                      ? [
                          {
                            package: [
                              {
                                packet_size: item.simpleItem.packet_size,
                                packetLabel: item.simpleItem.packetLabel,
                                selling_price: item.simpleItem.selling_price,
                                packetmrp: item.simpleItem.packetmrp,
                                _id: item.simpleItem._id,
                                quantity: item.qty,
                                selected: true,
                                B2B_price: item.simpleItem.B2B_price,
                                Retail_price: item.simpleItem.Retail_price,
                              },
                            ],
                            availableQuantity:
                              item.product_id.simpleData[0].availableQuantity,
                          },
                        ]
                      : [
                          {
                            RegionSellingPrice: item.price,
                            mrp: item.product_id.totalprice,
                            total_amount: item.product_id.totalprice,
                            quantity: item.product_id.qty,
                            ExpirationDate: null,
                            _id: item.product_id._id,
                            package: [],
                            userQuantity: item.qty,
                            RegionB2BPrice:
                              item.product_id.simpleData[0].RegionB2BPrice,
                            RegionRetailPrice:
                              item.product_id.simpleData[0].RegionRetailPrice,
                            availableQuantity:
                              item.product_id.simpleData[0].availableQuantity,
                          },
                        ],
                  });
                });
              this.props.addToCart(cartDatabyAPI);
              localStorage.setItem("cartItem", JSON.stringify(cartDatabyAPI));
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    this.props.changethankyouAuth(false);
  }
  go_to_home = () => {
    this.props.history.push("/order");
  };

  render() {
    return (
      <>
        <main>
          <div className="thankxbg">
            <div className="thankyou_jumbotron text-center">
              <h1 className="thankyou_tt display-3">Thank You!</h1>
              <p className="lead">YOUR ORDER IS BEING PROCESSED</p>
              <hr />
              <p className="thankyou_contact">
                Having trouble? <Link to="/contact-us"> Contact us</Link>
              </p>
              <p className="thankyou_lead">
                <button
                  className="thankyou_keepshopping bubscribe-btn"
                  onClick={(ev) => this.go_to_home(ev)}
                >
                  View your order details
                </button>
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  dataInCart: state.dataInCart,
  data: state,
  ...state,
});

const dispatchStateToProps = (dispatch) => ({
  changethankyouAuth: (data) => dispatch(changethankyouAuth(data)),
  addToCart: (data) => dispatch(addToCart(data)),
});

export default connect(mapStateToProps, dispatchStateToProps)(Thankyou);
