import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { addToCart, userdetails } from "../../../src/redux/actions/actions";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { imageUrl } from "../../components/imgUrl";
import sendCartDataToAPI from "../../components/sendCartDataToAPI";
import { checkout } from "../../redux/actions/actions";

class Cart extends React.PureComponent {
  constructor(props) {
    var coupon = localStorage.getItem("coupon_code");

    let couponStatus = localStorage.getItem("couponStatus");
    let cstatus = 2;
    if (couponStatus) {
      cstatus = localStorage.getItem("couponStatus") ? true : false;
    }
    if (
      localStorage.getItem("couponStatus") &&
      localStorage.getItem("couponStatus") === "2"
    ) {
      cstatus = 2;
    }

    super(props);
    if (
      this.props.user_details.contactNumber &&
      this.props.user_details.email &&
      this.props.user_details.name
    ) {
      this.setState({
        verifymobilestatus: "fullytrue",
        buttonstatus: false,
        compopupstatus: false,
      });
      var statat = false;
    } else {
      var statat = true;
    }
    this.state = {
      loading: false,
      emailOnSignup: false,
      incompleteLogin: false,
      productData: [],
      verifymobilestatus: "false",
      buttonstatus: true,
      compopupstatus: statat,
      contact: this.props.user_details.contactNumber
        ? this.props.user_details.contactNumber
        : "",
      genotp: "",
      allDataLoaded: false,
      coupon: coupon || "",
      discount_percentage: 0,
      discount_amount: localStorage.getItem("discount_amount")
        ? JSON.parse(localStorage.getItem("discount_amount"))
        : 0,
      cart_data:
        this.props.dataInCart.length > 0
          ? this.props.dataInCart.map((a) => {
              return {
                inhouseQuantity:
                  typeof a.inhouseQuantity === "object"
                    ? +a.inhouseQuantity
                    : +a.inhouseQuantity,
                lostQuantity:
                  typeof a.lostQuantity === "object"
                    ? +a.lostQuantity
                    : +a.lostQuantity,
                bookingQuantity:
                  typeof a.bookingQuantity === "object"
                    ? +a.bookingQuantity
                    : +a.bookingQuantity,
                productQuantity:
                  typeof a.productQuantity === "object"
                    ? +a.productQuantity
                    : +a.productQuantity,
                availableQuantity:
                  typeof a.availableQuantity === "object"
                    ? +a.availableQuantity
                    : +a.availableQuantity,
                ...a,
              };
            })
          : [],
      total_price: 0,
      total_after_discount: 0,
      couponStatus: cstatus,
      redirectToHome: false,
      subscribe_status: localStorage.getItem("status")
        ? JSON.parse(localStorage.getItem("status"))
        : false,
      referralEligible: false,
      maxSeedOriginal: 0,
      referral_discount: 0,
      referralPercent: 0,
      loyaltyPointApplied: localStorage.getItem("loyaltyApplied")
        ? JSON.parse(localStorage.getItem("loyaltyApplied"))
        : false,
      LoyaltyPoints: 0,
      seedValue: 0,
      totalSeedRedeem: 0,
      minimumOrderValue:
        this.props.deliveryInfo.MOQ === "yes"
          ? +this.props.deliveryInfo.MOQ_Charges || 0
          : 0,
      discountLocation: "cart",
      discountProducts: [],
      subTotalWithoutGST: 0,
    };

    window.scrollTo(0, 0);
  }
  async getCartData() {
    var cartDatabyAPI = [];
    let dtaa = {};
    ApiRequest(dtaa, "/get/addtocart/" + this.props.user_details._id, "GET")
      .then((res) => {
        this.setState({ allDataLoaded: true });
        if (res.status === 201 || res.status === 200) {
          if (res.data.message === "error" && !this.state.compopupstatus) {
            if (res.data.data.cartDetail.length === 0) {
              if (
                res.data.data.outOfStock.length !== 0 ||
                res.data.data.notAdded.length !== 0
              ) {
                swal({
                  title: "",
                  text: `${res.data.data.outOfStock.join(", ")} ${
                    res.data.data.notAdded.length > 0
                      ? ", " + res.data.data.notAdded.join(", ")
                      : ""
                  }  is out of stock and removed from your cart. Please review your cart once.`,
                  icon: "warning",
                  successMode: true,
                }).then(() => this.props.history.push("/"));
              } else {
                this.props.history.push("/");
                this.setState({
                  redirectToHome: true,
                });
              }
            } else {
              if (
                res.data.data.outOfStock.length !== 0 ||
                res.data.data.notAdded.length !== 0
              ) {
                swal({
                  title: "",
                  text: `${res.data.data.outOfStock.join(", ")} ${
                    res.data.data.notAdded.length > 0
                      ? ", " + res.data.data.notAdded.join(", ")
                      : ""
                  }  is out of stock and removed from your cart. Please review your cart once.`,
                  icon: "warning",
                  successMode: true,
                });
              }
            }
          } else {
            if (
              res.data.data.outOfStock.length !== 0 ||
              res.data.data.notAdded.length !== 0
            ) {
              swal({
                title: "",
                text: `${res.data.data.outOfStock.join(", ")} ${
                  res.data.data.notAdded.length > 0
                    ? ", " + res.data.data.notAdded.join(", ")
                    : ""
                }  is out of stock and removed from your cart. Please review your cart once.`,
                icon: "warning",
                successMode: true,
              });
            }
            localStorage.setItem("status", Boolean(res.data.data.subscribe));
            res.data.data.cartDetail.map((item) => {
              if (item.product_id.preOrder) {
                localStorage.setItem("status", true);
              }
              cartDatabyAPI.push({
                _id: item.product_id._id,
                product_name: item.product_id.product_name,
                preOrderEndDate: item.product_id.preOrderEndDate,
                longDesc: item.product_id.longDesc,
                preOrder: item.product_id.preOrder,
                shortDesc: item.product_id.shortDesc,
                preOrderRemainQty: item.preOrderRemainQty,
                attachment: item.product_id.attachment,
                configurableItem: item.configurableItem,
                banner: item.product_id.banner,
                productThreshold: item.product_id.productThreshold,
                productSubscription: item.product_id.productSubscription,
                salesTaxOutSide: item.product_id.salesTaxOutSide,
                salesTaxWithIn: item.product_id.salesTaxWithIn,
                // salesTax: item.product_id.salesTaxWithIn._id,
                purchaseTax: item.product_id.purchaseTax,
                hsnCode: item.product_id.hsnCode,
                priceAfterDiscount: "",
                unitMeasurement:
                  item.unitMeasurement || item.product_id.unitMeasurement,
                TypeOfProduct: item.product_id.TypeOfProduct,
                SKUCode: item.product_id.SKUCode,
                __v: item.product_id.__v,
                created_at: item.product_id.created_at,
                status: item.product_id.status,
                hsnCode: item.product_id.hsnCode,
                inhouseQuantity: +item.product_id.inhouseQuantity,
                lostQuantity: +item.product_id.lostQuantity,
                bookingQuantity: +item.product_id.bookingQuantity,
                productQuantity: +item.product_id.productQuantity,
                availableQuantity: +item.product_id.availableQuantity,
                slug: item.slug,
                ProductRegion: item.product_id.ProductRegion,
                relatedProduct: item.product_id.relatedProduct,
                configurableData: item.configurableItem,
                images: item.product_id.images,
                base_price: item.base_price,
                product_categories:
                  item.product_categories.length > 0
                    ? item.product_categories
                    : item.product_id.product_categories,
                qty: item.qty,
                unique_id: item.unique_id || null,
                price: item.price ? item.price : 0,
                totalprice: item.totalprice ? item.totalprice : 0,
                unitQuantity: item.unitQuantity,
                groupData: item.product_id.groupData,
                variant_name: item.configurableItem.variant_name,
                simpleData:
                  item.TypeOfProduct === "simple"
                    ? item.simpleItem.packet_size
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
                        ]
                    : [],
              });
            });
            this.props.addToCart(cartDatabyAPI);
            localStorage.setItem("cartItem", JSON.stringify(cartDatabyAPI));
            if (cartDatabyAPI.length === 0) {
              this.props.history.push("/");
            }
            this.calculate_summry1(this.props.dataInCart);
            this.forceUpdate();
            this.setState({
              loading: false,
              cartItems: cartDatabyAPI,
              cart_data: cartDatabyAPI,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getSubscribeStatus() {
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(
      { _id: this.props.user_details._id },
      "/subscribe/toggle/status/get",
      "POST",
      token
    )
      .then((res) => {
        let statusFromApi = res.data.data.subscribeToggle
          ? res.data.data.subscribeToggle
          : false;
        localStorage.setItem("status", statusFromApi);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.getCartData();
    setTimeout(() => {
      if (this.props.user_details.name) {
        this.getSubscribeStatus();
        this.redeemReferralPoints();
      }
      ApiRequest({}, "/getSetting", "GET")
        .then((res) => {
          if (res.status !== 401 || res.status !== 400) {
            this.setState({
              emailOnSignup: res.data.data[0].emailOnSignup,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 0);
  }

  redeemReferralPoints = () => {
    const requestData = {};
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/booking/checkRefferalStatus", "GET", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          if (res.data.data.refferalStatus == "on") {
            if (res.data.data.eligible === true) {
              this.setState({
                referralEligible: true,
                referralPercent: res.data.data.refferalDiscountPercent,
              });
            } else {
              this.setState({
                referralEligible: false,
                referralPercent: 0,
              });
            }
          }
        }
      })
      .then(() => {
        this.calculate_summry();
        this.forceUpdate();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  redeemLoyalityPoints = () => {
    const requestData = {};
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/booking/checkLoyaltyStatus", "GET", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          if (res.data.data.loyaltyStatus) {
            let loyaltyPoint =
              (+res.data.data.redeemPercent * +this.state.subTotalWithoutGST) /
              100;
            let seedValue = res.data.data.seedValue;
            let total = loyaltyPoint * seedValue;
            if (total > res.data.data.maxRedeemDiscount) {
              total = res.data.data.maxRedeemDiscount;
            }
            this.setState({
              loyaltyStatus: res.data.data.loyaltyStatus,
              loyaltyRedeemPercent: res.data.data.redeemPercent,
              maxLoyaltyRedeemAmount: res.data.data.maxRedeemDiscount,
              maxSeedOriginal: res.data.data.maxSeeds || 0,
              // LoyaltyPoints: Math.floor(loyaltyPoint * 100) / 100,
              LoyaltyPoints: Math.floor(+loyaltyPoint),
              seedValue: seedValue ? Math.floor(+seedValue) : 0,
              // seedValue: seedValue ? Math.floor(seedValue * 100) / 100 : 0,
              totalSeedRedeem: Math.floor(+total),
              // totalSeedRedeem: Math.floor(+total * 100) / 100,
            });
          }
        }
      })
      .then(() => {
        this.calculate_summry1(this.state.cart_data, "loyalty");
        this.forceUpdate();
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.cart_data && this.props.dataInCart) {
      if (this.state.cart_data.length !== this.props.dataInCart.length) {
        this.setState({
          cart_data: this.props.dataInCart.map((a) => {
            return {
              inhouseQuantity:
                typeof a.inhouseQuantity === "object"
                  ? +a.inhouseQuantity
                  : +a.inhouseQuantity,
              lostQuantity:
                typeof a.lostQuantity === "object"
                  ? +a.lostQuantity
                  : +a.lostQuantity,
              bookingQuantity:
                typeof a.bookingQuantity === "object"
                  ? +a.bookingQuantity
                  : +a.bookingQuantity,
              productQuantity:
                typeof a.productQuantity === "object"
                  ? +a.productQuantity
                  : +a.productQuantity,
              availableQuantity:
                typeof a.availableQuantity === "object"
                  ? +a.availableQuantity
                  : +a.availableQuantity,
              ...a,
            };
          }),
        });
      }
    }
  }

  increaseQuantity = async (i) => {
    if (document.querySelector(".quantity-error-cart")) {
      document.querySelector(".quantity-error-cart").innerHTML = "";
    }
    let err;
    let errorsPresent = false;
    if (i.TypeOfProduct !== "group") {
      if (i.simpleData[0].package) {
        let selLabel = i.simpleData[0].package.filter((a) => a.selected);
        err = document.querySelector(
          "#" +
            i.slug +
            selLabel[0].packetLabel
              .toLowerCase()
              .replace(/ /g, "-")
              .replace(/[^\w-]+/g, "")
        );
      } else {
        err = document.querySelector("#" + i.slug);
      }
    } else {
      err = document.querySelector("#" + i.slug);
    }
    // var newarray = this.props.dataInCart;
    var newarray = [...this.state.cart_data];
    let selectedItem = {};
    newarray.map((itm) => {
      var avai = itm.simpleData[0]
        ? itm.simpleData[0].availableQuantity
          ? typeof itm.simpleData[0].availableQuantity === "object"
            ? +itm.simpleData[0].availableQuantity
            : +itm.simpleData[0].availableQuantity
          : typeof itm.availableQuantity === "object"
          ? +itm.availableQuantity
          : +itm.availableQuantity
        : 0;
      if (itm === i) {
        itm.TypeOfProduct === "simple"
          ? itm.simpleData[0].package[0]
            ? itm.simpleData[0].package.map((pck) => {
                if (pck.selected) {
                  avai = avai / +pck.packet_size;
                  if (avai >= +pck.quantity + 1) {
                    pck.quantity = pck.quantity + 1;
                  } else {
                    err.innerHTML = `You can not add ${
                      itm.product_name
                    } more than ${+itm.simpleData[0]?.availableQuantity} ${
                      itm.unitMeasurement?.name
                    }`;
                    err.style.display = "block";
                    errorsPresent = true;
                  }
                }
              })
            : avai > itm.simpleData[0].userQuantity
            ? (itm.simpleData[0].userQuantity += 1)
            : (err.style.display = "block")
          : (itm.qty = itm.qty + 1);
        selectedItem = itm;
      }
    });
    var data = newarray;
    if (!errorsPresent) {
      this.setState({ loading: true });
      await sendCartDataToAPI(
        [selectedItem],
        this.props.user_details,
        this.props.addToCart
      )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            this.setState({
              coupon_code: "",
              couponStatus: 2,
              discount_amount: 0,
              coupon: "",
            });
            this.props.addToCart([]);
            this.props.addToCart(data);
            this.setState({
              cart_data: data,
            });
            localStorage.setItem("cartItem", JSON.stringify(data));
            localStorage.setItem("coupon_code", "");
            localStorage.setItem("freepackage", "");
            localStorage.setItem("freeproduct", "");
            localStorage.setItem("couponStatus", 2);
            localStorage.setItem("discount_amount", "");

            this.setState({
              cartItems: data,
            });
            setTimeout(() => {
              this.calculate_summry1(this.state.cart_data);
            }, 50);
          } else {
            if (document.querySelector(".quantity-error-cart")) {
              document.querySelector(".quantity-error-cart").innerHTML =
                "You can not add " + res.data.data.join("");
            }
            if (i.TypeOfProduct === "group") {
              this.state.cart_data.map((itm) => {
                if (itm === i) {
                  itm.TypeOfProduct !== "simple" && (itm.qty = itm.qty - 1);
                }
              });

              this.forceUpdate();
            } else if (i.TypeOfProduct === "simple") {
              this.state.cart_data.map((itm) => {
                if (itm === i) {
                  itm.TypeOfProduct === "simple"
                    ? itm.simpleData[0].package[0]
                      ? itm.simpleData[0].package.forEach((pck) => {
                          if (pck.selected) {
                            pck.quantity = pck.quantity - 1;
                          }
                        })
                      : (itm.simpleData[0].userQuantity = 1)
                    : (itm.qty = itm.qty);
                }
              });
            }
            setTimeout(() => {
              this.calculate_summry1(this.state.cart_data);
            }, 50);
          }
        })
        .then(() => {
          this.setState({ loading: false });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.forceUpdate();

    // setTimeout(() => {
    //   err.style.display = "none";
    // }, 3500);
  };

  decreaseQuantity = async (i) => {
    if (document.querySelector(".quantity-error-cart")) {
      document.querySelector(".quantity-error-cart").innerHTML = "";
    }
    this.setState({ loading: true });
    // var newarray = this.props.dataInCart;
    var newarray = this.state.cart_data;
    let selectedItem = {};
    newarray.map((itm) => {
      if (itm === i) {
        if (itm.TypeOfProduct === "simple") {
          itm.simpleData[0].package[0]
            ? itm.simpleData[0].package.map((pck) => {
                if (pck.selected) {
                  if (pck.quantity === 1) {
                  } else {
                    pck.quantity = pck.quantity - 1;
                  }
                }
              })
            : itm.simpleData[0].userQuantity !== 1 &&
              (itm.simpleData[0].userQuantity -= 1);
        } else {
          if (+itm.qty > 1) itm.qty = itm.qty - 1;
        }
        selectedItem = itm;
      }
    });
    var data = newarray;
    this.props.addToCart([]);
    this.props.addToCart(data);
    this.setState({
      cart_data: data,
    });
    localStorage.setItem("cartItem", JSON.stringify(data));
    localStorage.setItem("coupon_code", "");
    localStorage.setItem("freepackage", "");
    localStorage.setItem("freeproduct", "");
    localStorage.setItem("couponStatus", 2);
    localStorage.setItem("discount_amount", "");
    this.setState({
      coupon_code: "",
      couponStatus: 2,
      discount_amount: 0,
      coupon: "",
    });
    await sendCartDataToAPI(
      // this.props.dataInCart,
      [selectedItem],
      this.props.user_details,
      this.props.addToCart
    )
      .then((res) => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      this.calculate_summry1(this.state.cart_data);
    }, 50);
    this.forceUpdate();
  };

  removebutton = () => {
    this.setState({
      coupon_code: "",
      couponStatus: 2,
      discount_amount: 0,
      coupon: "",
      discountProducts: [],
      discountLocation: "cart",
    });
    localStorage.setItem("coupon_code", "");
    localStorage.setItem("couponId", "");
    localStorage.setItem("freepackage", "");
    localStorage.setItem("freeproduct", "");
    localStorage.setItem("couponStatus", 2);
    localStorage.setItem("discount_amount", "");
    this.forceUpdate();
    setTimeout(() => {
      this.calculate_summry1(this.state.cart_data);
    }, 0);
  };

  componentWillReceiveProps() {
    if (
      this.props.dataInCart !== undefined &&
      this.props.dataInCart.length !== 0
    ) {
      this.setState({ cart_data: this.props.dataInCart });
      setTimeout(() => {
        this.calculate_summry1(this.props.dataInCart);
      }, 0);
    }
  }

  calculate_summry() {
    var sub_total = 0;
    var gst = 0;
    var cart_total = 0;
    var allGsts = [];
    var total_gst = 0;
    var total_after_dis = 0;
    this.state.cart_data.map((item, index) => {
      if (
        item.TypeOfProduct === "group" ||
        item.TypeOfProduct === "configurable"
      ) {
        sub_total = sub_total + item.price * item.qty;
      }
      if (item.simpleData) {
        if (item.simpleData.length > 0) {
          if (item.TypeOfProduct === "simple") {
            if (item.simpleData[0].package[0]) {
              item.simpleData[0].package
                .filter((dta) => dta.selected == true)
                .map((data, ind) => {
                  if (this.props.user_details.length !== 0) {
                    if (this.props.user_details.user_type === "b2b") {
                      sub_total = sub_total + data.B2B_price * data.quantity;
                    } else if (this.props.user_details.user_type === "retail") {
                      sub_total = sub_total + data.Retail_price * data.quantity;
                    } else if (
                      this.props.user_details.user_type === "user" ||
                      this.props.user_details.user_type === null
                    ) {
                      sub_total =
                        sub_total + data.selling_price * data.quantity;
                    }
                  } else {
                    sub_total = sub_total + data.selling_price * data.quantity;
                  }
                });
            } else {
              if (this.props.user_details.length !== 0) {
                if (this.props.user_details.user_type === "b2b") {
                  sub_total =
                    sub_total +
                    item.simpleData[0].RegionB2BPrice *
                      item.simpleData[0].userQuantity;
                } else if (this.props.user_details.user_type === "retail") {
                  sub_total =
                    sub_total +
                    item.simpleData[0].RegionRetailPrice *
                      item.simpleData[0].userQuantity;
                } else if (
                  this.props.user_details.user_type === "user" ||
                  this.props.user_details.user_type === null
                ) {
                  sub_total =
                    sub_total +
                    item.simpleData[0].RegionSellingPrice *
                      item.simpleData[0].userQuantity;
                }
              } else {
                sub_total =
                  sub_total +
                  item.simpleData[0].RegionSellingPrice *
                    item.simpleData[0].userQuantity;
              }
            }
          }
        }
      }
    });
    const newLocalCart = this.state.cart_data.map((itm) => {
      var totalpriceBeforeTax = 0; // total price (price * quantity) - single product
      var singleProductTaxPrice = 0; // tax price total -- single product
      var totalTaxPercentage = 0; //tax percentage of single product
      var selectedTaxRegion;
      if (itm.TypeOfProduct === "simple") {
        if (itm.simpleData[0].package.length > 0) {
          // totalpriceBeforeTax = itm.itemDiscountAmount || itm.totalprice;
          totalpriceBeforeTax = itm.totalprice;
        } else {
          totalpriceBeforeTax = itm.price * itm.qty;
        }
      } else {
        totalpriceBeforeTax = itm.price * itm.qty;
      }
      // //checking if user is inside haryana or outside haryana
      // if (this.state.insideHaryana) {
      totalTaxPercentage =
        itm.salesTaxWithIn && itm.salesTaxWithIn.totalTax
          ? itm.salesTaxWithIn.totalTax
          : 0;
      selectedTaxRegion = itm.salesTaxWithIn;

      // } else {
      //   totalTaxPercentage = itm.salesTaxOutSide.totalTax || 0;
      //   selectedTaxRegion = itm.salesTaxOutSide;
      // }
      //calculating single product tax price
      singleProductTaxPrice =
        +totalpriceBeforeTax -
        +totalpriceBeforeTax * (100 / (100 + +totalTaxPercentage));
      total_gst += singleProductTaxPrice;

      selectedTaxRegion &&
        selectedTaxRegion.taxData &&
        selectedTaxRegion.taxData.length > 0 &&
        selectedTaxRegion.taxData.map((tx) => {
          //checking if sub tax is already in array and then adding it to previously added tax.
          if (
            allGsts.filter((i) => {
              return (
                i.tax_name + i.tax_percent === tx.tax_name + tx.tax_percent
              );
            }).length > 0
          ) {
            allGsts.map((gst) => {
              if (
                gst.tax_name + gst.tax_percent ===
                tx.tax_name + tx.tax_percent
              ) {
                let total =
                  (+singleProductTaxPrice * +tx.tax_percent) /
                  +totalTaxPercentage;
                total = total.toFixed(2);
                let totalprice = parseFloat(gst.totalPrice) + parseFloat(total);
                gst.totalPrice = totalprice.toFixed(2);
                gst.tax_percent = +gst.tax_percent;
              }
            });
          } else {
            //if sub tax doesn't exist in array then pushing it directly to array
            let total =
              (+singleProductTaxPrice * +tx.tax_percent) / +totalTaxPercentage;
            allGsts.push({
              tax_name: tx.tax_name,
              totalPrice: total.toFixed(2),
              tax_percent: tx.tax_percent,
            });
          }
        });

      let amountBeforeGST = 0;
      if (
        itm.simpleData &&
        itm.simpleData[0] &&
        itm.simpleData[0].package.length > 0
      ) {
        amountBeforeGST = itm.totalprice - singleProductTaxPrice;
      } else if (itm.TypeOfProduct === "configurable") {
        amountBeforeGST = itm.totalprice - 0;
      } else {
        amountBeforeGST = itm.price * itm.qty - singleProductTaxPrice;
      }

      return {
        ...itm,
        itemWiseGst: singleProductTaxPrice.toFixed(2),
        totalPriceBeforeGST: amountBeforeGST.toFixed(2),
      };
    });

    this.setState({ cart_data: newLocalCart });
    console.log(total_gst);
    gst = total_gst;
    cart_total = sub_total;
    var a =
        localStorage.getItem("discount_amount") == null ||
        localStorage.getItem("discount_amount") == "null" ||
        localStorage.getItem("discount_amount") == "" ||
        localStorage.getItem("discount_amount") == [] ||
        localStorage.getItem("discount_amount") == undefined
          ? 0
          : localStorage.getItem("discount_amount"),
      total_after_dis = cart_total;

    //calculating total seeds---
    if (this.state.loyaltyStatus) {
      let loyaltyPoint =
        (+this.state.loyaltyRedeemPercent * (+sub_total - +gst)) / 100;
      let seedValue = this.state.seedValue;
      let totalSeed = loyaltyPoint * seedValue;
      if (totalSeed > this.state.maxLoyaltyRedeemAmount) {
        totalSeed = this.state.maxLoyaltyRedeemAmount;
      }
      this.setState({
        // LoyaltyPoints: Math.floor(loyaltyPoint * 100) / 100,
        // seedValue: seedValue ? Math.floor(seedValue * 100) / 100 : 0,
        // totalSeedRedeem: Math.floor(+totalSeed * 100) / 100,
        LoyaltyPoints: Math.floor(loyaltyPoint),
        seedValue: seedValue ? Math.floor(seedValue) : 0,
        totalSeedRedeem: Math.floor(+totalSeed),
      });
      this.forceUpdate();
      this.setState({ loading: false });
    }
    if (this.state.referralEligible) {
      var discout_referral =
        ((+total_after_dis - +total_gst) * this.state.referralPercent) / 100;
      total_after_dis = total_after_dis - discout_referral;
      this.setState({
        referral_discount: discout_referral.toFixed(2),
      });
    }
    // if (!this.state.subscribe_status) {
    if (this.state.loyaltyPointApplied) {
      total_after_dis = total_after_dis - this.state.totalSeedRedeem;
    }
    // }
    this.setState({
      subTotal_price: sub_total,
      subTotalWithoutGST: (+sub_total - +gst).toFixed(2),
      gst_price: gst.toFixed(2),

      inclusiveGST: gst.toFixed(2),
      total_price: cart_total,
      total_after_discount: total_after_dis,
      discount_amount:
        localStorage.getItem("discount_amount") == null ||
        localStorage.getItem("discount_amount") == "null" ||
        localStorage.getItem("discount_amount") == "" ||
        localStorage.getItem("discount_amount") == [] ||
        localStorage.getItem("discount_amount") == undefined
          ? 0
          : localStorage.getItem("discount_amount"),
    });
    // if (
    //   this.state.coupon ||
    //   this.state.coupon !== "" ||
    //   +localStorage.getItem("discount_amount") <= 0
    // ) {
    setTimeout(() => {
      this.applyCouponApi();
    }, 0);
    // }
  }

  calculate_summry_withcoupon() {
    var sub_total = 0;
    var gst = 0;
    var cart_total = 0;
    var total_after_dis = 0;
    this.state.cart_data.map((item, index) =>
      item.simpleData &&
      item.simpleData.length > 0 &&
      item.TypeOfProduct === "simple"
        ? item.simpleData[0].package[0]
          ? item.simpleData[0].package
              .filter((dta) => dta.selected == true)
              .map((data, ind) => {
                sub_total = sub_total + data.selling_price * data.quantity;
              })
          : (sub_total =
              sub_total +
              item.simpleData[0].RegionSellingPrice *
                item.simpleData[0].userQuantity)
        : (sub_total = sub_total + item.price * item.qty)
    );
    gst = gst;
    cart_total = gst + sub_total;
    var a =
        localStorage.getItem("discount_amount") == null ||
        localStorage.getItem("discount_amount") == "null" ||
        localStorage.getItem("discount_amount") == "" ||
        localStorage.getItem("discount_amount") == [] ||
        localStorage.getItem("discount_amount") == undefined
          ? 0
          : localStorage.getItem("discount_amount"),
      total_after_dis = cart_total - a;

    //calculating total seeds---
    if (this.state.loyaltyStatus) {
      let loyaltyPoint = (+this.state.loyaltyRedeemPercent * +sub_total) / 100;
      let seedValue = this.state.seedValue;
      let totalSeed = loyaltyPoint * seedValue;
      if (totalSeed > this.state.maxLoyaltyRedeemAmount) {
        totalSeed = this.state.maxLoyaltyRedeemAmount;
      }
      this.setState({
        // LoyaltyPoints: Math.floor(loyaltyPoint * 100) / 100,
        // seedValue: seedValue ? Math.floor(seedValue * 100) / 100 : 0,
        // totalSeedRedeem: Math.floor(+totalSeed * 100) / 100,
        LoyaltyPoints: Math.floor(loyaltyPoint),
        seedValue: seedValue ? Math.floor(seedValue) : 0,
        totalSeedRedeem: Math.floor(+totalSeed),
      });
      this.forceUpdate();
      this.setState({ loading: false });
    }
    if (this.state.referralEligible) {
      var discout_referral =
        ((+total_after_dis - +gst) * this.state.referralPercent) / 100;
      total_after_dis = total_after_dis - discout_referral;
      this.setState({
        referral_discount: discout_referral.toFixed(2),
      });
    }
    // if (!this.state.subscribe_status) {
    if (this.state.loyaltyPointApplied) {
      total_after_dis = total_after_dis - this.state.totalSeedRedeem;
    }
    // }

    // if(!this.state.subscribe_status){
    //   if(this.state.referralEligible){
    this.calculateDiscountPerItem();
    //   }
    // }

    this.setState({
      subTotal_price: sub_total,
      gst_price: gst,
      total_price: cart_total,
      total_after_discount: total_after_dis,
      discount_amount:
        localStorage.getItem("discount_amount") == null ||
        localStorage.getItem("discount_amount") == "null" ||
        localStorage.getItem("discount_amount") == "" ||
        localStorage.getItem("discount_amount") == [] ||
        localStorage.getItem("discount_amount") == undefined
          ? 0
          : localStorage.getItem("discount_amount"),
    });
  }

  calculateGST(newItemsArray) {
    var sub_total = 0;
    var gst = 0;
    var cart_total = 0;
    var allGsts = [];
    var total_gst = 0;
    var total_after_dis = 0;
    newItemsArray &&
      newItemsArray.map((item, index) => {
        if (item.TypeOfProduct === "simple") {
          if (item.simpleData) {
            if (item.simpleData.length > 0) {
              if (item.TypeOfProduct === "simple") {
                if (item.simpleData[0].package[0]) {
                  item.simpleData[0].package
                    .filter((dta) => dta.selected == true)
                    .map((data, ind) => {
                      if (this.props.user_details.length !== 0) {
                        if (this.props.user_details.user_type === "b2b") {
                          sub_total =
                            sub_total + data.B2B_price * data.quantity;
                        } else if (
                          this.props.user_details.user_type === "retail"
                        ) {
                          sub_total =
                            sub_total + data.Retail_price * data.quantity;
                        } else if (
                          this.props.user_details.user_type === "user" ||
                          this.props.user_details.user_type === null
                        ) {
                          sub_total =
                            sub_total + data.selling_price * data.quantity;
                        }
                      } else {
                        sub_total =
                          sub_total + data.selling_price * data.quantity;
                      }
                    });
                } else {
                  if (this.props.user_details.length !== 0) {
                    if (this.props.user_details.user_type === "b2b") {
                      sub_total =
                        sub_total +
                        item.simpleData[0].RegionB2BPrice *
                          item.simpleData[0].userQuantity;
                    } else if (this.props.user_details.user_type === "retail") {
                      sub_total =
                        sub_total +
                        item.simpleData[0].RegionRetailPrice *
                          item.simpleData[0].userQuantity;
                    } else if (
                      this.props.user_details.user_type === "user" ||
                      this.props.user_details.user_type === null
                    ) {
                      sub_total =
                        sub_total +
                        item.simpleData[0].RegionSellingPrice *
                          item.simpleData[0].userQuantity;
                    }
                  } else {
                    sub_total =
                      sub_total +
                      item.simpleData[0].RegionSellingPrice *
                        item.simpleData[0].userQuantity;
                  }
                }
              }
            }
          }
        } else {
          sub_total = sub_total + item.price * item.qty;
        }
      });
    //looping through cart and calcuating gst per product

    newItemsArray.forEach((itm) => {
      var totalpriceBeforeTax = 0; // total price (price * quantity) - single product
      var singleProductTaxPrice = 0; // tax price total -- single product
      var totalTaxPercentage = 0; //tax percentage of single product
      var selectedTaxRegion;
      if (itm.TypeOfProduct === "simple") {
        if (itm.simpleData[0].package.length > 0) {
          totalpriceBeforeTax =
            +itm.itemDiscountAmount > 0
              ? +itm.itemDiscountAmount - itm.itemWiseGst
              : itm.totalprice;
        } else {
          totalpriceBeforeTax =
            +itm.itemDiscountAmount > 0
              ? +itm.itemDiscountAmount - itm.itemWiseGst
              : itm.price * itm.qty;
        }
      } else {
        totalpriceBeforeTax =
          +itm.itemDiscountAmount > 0
            ? +itm.itemDiscountAmount - itm.itemWiseGst
            : itm.price * itm.qty;
      }
      totalTaxPercentage =
        itm.salesTaxWithIn && itm.salesTaxWithIn.totalTax
          ? itm.salesTaxWithIn.totalTax
          : 0;
      selectedTaxRegion = itm.salesTaxWithIn;
      singleProductTaxPrice =
        +itm.itemDiscountAmount > 0
          ? (+totalpriceBeforeTax * +totalTaxPercentage) / 100
          : +totalpriceBeforeTax -
            +totalpriceBeforeTax * (100 / (100 + +totalTaxPercentage));
      total_gst += singleProductTaxPrice;

      selectedTaxRegion &&
        selectedTaxRegion.taxData &&
        selectedTaxRegion.taxData.length > 0 &&
        selectedTaxRegion.taxData.map((tx) => {
          //checking if sub tax is already in array and then adding it to previously added tax.
          if (
            allGsts.filter((i) => {
              return (
                i.tax_name + i.tax_percent === tx.tax_name + tx.tax_percent
              );
            }).length > 0
          ) {
            allGsts.map((gst) => {
              if (
                gst.tax_name + gst.tax_percent ===
                tx.tax_name + tx.tax_percent
              ) {
                let total =
                  (+singleProductTaxPrice * +tx.tax_percent) /
                  +totalTaxPercentage;
                total = total.toFixed(2);
                let totalprice = parseFloat(gst.totalPrice) + parseFloat(total);
                gst.totalPrice = totalprice.toFixed(2);
                gst.tax_percent = +gst.tax_percent;
              }
            });
          } else {
            //if sub tax doesn't exist in array then pushing it directly to array
            let total =
              (+singleProductTaxPrice * +tx.tax_percent) / +totalTaxPercentage;
            allGsts.push({
              tax_name: tx.tax_name,
              totalPrice: total.toFixed(2),
              tax_percent: tx.tax_percent,
            });
          }
        });
    });

    gst = total_gst;
    this.setState({
      total_after_discount:
        +this.state.total_after_discount - +this.state.inclusiveGST + +gst,
      gst_price: gst.toFixed(2),
    });
  }

  calculate_summry1(newItemsArray, callFrom) {
    var sub_total = 0;
    var gst = 0;
    var cart_total = 0;
    var allGsts = [];
    var total_gst = 0;
    var total_after_dis = 0;
    newItemsArray &&
      newItemsArray.map((item, index) => {
        if (item.TypeOfProduct === "simple") {
          if (item.simpleData) {
            if (item.simpleData.length > 0) {
              if (item.TypeOfProduct === "simple") {
                if (item.simpleData[0].package[0]) {
                  item.simpleData[0].package
                    .filter((dta) => dta.selected == true)
                    .map((data, ind) => {
                      if (this.props.user_details.length !== 0) {
                        if (this.props.user_details.user_type === "b2b") {
                          sub_total =
                            sub_total + data.B2B_price * data.quantity;
                        } else if (
                          this.props.user_details.user_type === "retail"
                        ) {
                          sub_total =
                            sub_total + data.Retail_price * data.quantity;
                        } else if (
                          this.props.user_details.user_type === "user" ||
                          this.props.user_details.user_type === null
                        ) {
                          sub_total =
                            sub_total + data.selling_price * data.quantity;
                        }
                      } else {
                        sub_total =
                          sub_total + data.selling_price * data.quantity;
                      }
                    });
                } else {
                  if (this.props.user_details.length !== 0) {
                    if (this.props.user_details.user_type === "b2b") {
                      sub_total =
                        sub_total +
                        item.simpleData[0].RegionB2BPrice *
                          item.simpleData[0].userQuantity;
                    } else if (this.props.user_details.user_type === "retail") {
                      sub_total =
                        sub_total +
                        item.simpleData[0].RegionRetailPrice *
                          item.simpleData[0].userQuantity;
                    } else if (
                      this.props.user_details.user_type === "user" ||
                      this.props.user_details.user_type === null
                    ) {
                      sub_total =
                        sub_total +
                        item.simpleData[0].RegionSellingPrice *
                          item.simpleData[0].userQuantity;
                    }
                  } else {
                    sub_total =
                      sub_total +
                      item.simpleData[0].RegionSellingPrice *
                        item.simpleData[0].userQuantity;
                  }
                }
              }
            }
          }
        } else {
          sub_total = sub_total + item.price * item.qty;
        }
      });
    //looping through cart and calcuating gst per product

    const newLocalCart = newItemsArray.map((itm) => {
      var totalpriceBeforeTax = 0; // total price (price * quantity) - single product
      var singleProductTaxPrice = 0; // tax price total -- single product
      var totalTaxPercentage = 0; //tax percentage of single product
      var selectedTaxRegion;
      if (itm.TypeOfProduct === "simple") {
        if (itm.simpleData[0].package.length > 0) {
          // totalpriceBeforeTax = itm.itemDiscountAmount || itm.totalprice;
          totalpriceBeforeTax = itm.price * itm.qty;
          // itm.simpleData[0].package
          //   .filter((dta) => dta.selected == true)
          //   .map((data, ind) => {
          //     if (this.props.user_details.length !== 0) {
          //       if (this.props.user_details.user_type === "b2b") {
          //         totalpriceBeforeTax = data.B2B_price * data.quantity;
          //       } else if (this.props.user_details.user_type === "retail") {
          //         totalpriceBeforeTax = data.Retail_price * data.quantity;
          //       } else if (
          //         this.props.user_details.user_type === "user" ||
          //         this.props.user_details.user_type === null
          //       ) {
          //         totalpriceBeforeTax = data.selling_price * data.quantity;
          //       }
          //     } else {
          //       totalpriceBeforeTax = data.selling_price * data.quantity;
          //     }
          //   });
        } else {
          totalpriceBeforeTax = itm.price * itm.qty;
        }
      } else {
        totalpriceBeforeTax = itm.price * itm.qty;
      }

      // //checking if user is inside haryana or outside haryana
      // if (this.state.insideHaryana) {
      totalTaxPercentage =
        itm.salesTaxWithIn && itm.salesTaxWithIn.totalTax
          ? itm.salesTaxWithIn.totalTax
          : 0;
      selectedTaxRegion = itm.salesTaxWithIn;
      // } else {
      //   totalTaxPercentage = itm.salesTaxOutSide.totalTax || 0;
      //   selectedTaxRegion = itm.salesTaxOutSide;
      // }
      //calculating single product tax price
      singleProductTaxPrice =
        +totalpriceBeforeTax -
        +totalpriceBeforeTax * (100 / (100 + +totalTaxPercentage));
      total_gst += singleProductTaxPrice;

      selectedTaxRegion &&
        selectedTaxRegion.taxData &&
        selectedTaxRegion.taxData.length > 0 &&
        selectedTaxRegion.taxData.map((tx) => {
          //checking if sub tax is already in array and then adding it to previously added tax.
          if (
            allGsts.filter((i) => {
              return (
                i.tax_name + i.tax_percent === tx.tax_name + tx.tax_percent
              );
            }).length > 0
          ) {
            allGsts.map((gst) => {
              if (
                gst.tax_name + gst.tax_percent ===
                tx.tax_name + tx.tax_percent
              ) {
                let total =
                  (+singleProductTaxPrice * +tx.tax_percent) /
                  +totalTaxPercentage;
                total = total.toFixed(2);
                let totalprice = parseFloat(gst.totalPrice) + parseFloat(total);
                gst.totalPrice = totalprice.toFixed(2);
                gst.tax_percent = +gst.tax_percent;
              }
            });
          } else {
            //if sub tax doesn't exist in array then pushing it directly to array
            let total =
              (+singleProductTaxPrice * +tx.tax_percent) / +totalTaxPercentage;
            allGsts.push({
              tax_name: tx.tax_name,
              totalPrice: total.toFixed(2),
              tax_percent: tx.tax_percent,
            });
          }
        });

      let amountBeforeGST = 0;
      if (
        itm.simpleData &&
        itm.simpleData[0] &&
        itm.simpleData[0].package.length > 0
      ) {
        amountBeforeGST = itm.totalprice - singleProductTaxPrice;
      } else {
        amountBeforeGST = itm.price * itm.qty - singleProductTaxPrice;
      }

      return {
        ...itm,
        itemWiseGst: singleProductTaxPrice.toFixed(2),
        totalPriceBeforeGST: amountBeforeGST.toFixed(2),
      };
    });

    this.setState({ cart_data: newLocalCart });

    gst = total_gst;
    cart_total = sub_total;
    var a =
        localStorage.getItem("discount_amount") === null ||
        localStorage.getItem("discount_amount") === "null" ||
        localStorage.getItem("discount_amount") === "" ||
        localStorage.getItem("discount_amount") === [] ||
        localStorage.getItem("discount_amount") === undefined
          ? 0
          : localStorage.getItem("discount_amount"),
      total_after_dis = cart_total - a;

    //calculating total seeds---
    if (this.state.loyaltyStatus) {
      let loyaltyPoint =
        (+this.state.loyaltyRedeemPercent * (+sub_total - +gst)) / 100;
      let seedValue = this.state.seedValue;
      let totalSeed = loyaltyPoint * seedValue;
      if (totalSeed > this.state.maxLoyaltyRedeemAmount) {
        totalSeed = this.state.maxLoyaltyRedeemAmount;
      }
      this.setState({
        // LoyaltyPoints: Math.floor(loyaltyPoint * 100) / 100,
        // seedValue: seedValue ? Math.floor(seedValue * 100) / 100 : 0,
        // totalSeedRedeem: Math.floor(+totalSeed * 100) / 100,
        LoyaltyPoints: Math.floor(loyaltyPoint),
        seedValue: seedValue ? Math.floor(seedValue) : 0,
        totalSeedRedeem: Math.floor(+totalSeed),
      });
      this.forceUpdate();
      this.setState({ loading: false });
    }
    if (this.state.referralEligible) {
      var discout_referral =
        ((+cart_total - +total_gst) * this.state.referralPercent) / 100;
      total_after_dis = total_after_dis - discout_referral;
      this.setState({
        referral_discount: discout_referral.toFixed(2),
      });
    }

    // if (!this.state.subscribe_status) {
    if (this.state.loyaltyPointApplied) {
      total_after_dis = total_after_dis - this.state.totalSeedRedeem;
    }
    // }

    this.calculateDiscountPerItem(newItemsArray);
    this.setState({
      subTotal_price: sub_total,
      gst_price: gst.toFixed(2),
      inclusiveGST: gst.toFixed(2),
      total_price: cart_total,
      subTotalWithoutGST: (+sub_total - +gst).toFixed(2),
      total_after_discount: total_after_dis,
      discount_amount:
        localStorage.getItem("discount_amount") == null ||
        localStorage.getItem("discount_amount") == "null" ||
        localStorage.getItem("discount_amount") == "" ||
        localStorage.getItem("discount_amount") == [] ||
        localStorage.getItem("discount_amount") == undefined
          ? 0
          : localStorage.getItem("discount_amount"),
    });
    this.forceUpdate();
    this.setState({ loading: false });
    setTimeout(() => {
      if (!this.state.totalSeedRedeem) {
        if (!callFrom || callFrom !== "loyalty") {
          this.redeemLoyalityPoints();
        }
      }
    }, 0);
  }

  _handleForm(ev) {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  }

  forward() {
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      this.state.contact &&
      this.state.name &&
      this.state.email &&
      this.state.email.match(mailformat)
    ) {
      const requestData = {
        name: this.state.name,
        email: this.state.email,
        contactNumber: this.state.contact,
      };
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      ApiRequest(requestData, "/userUpdate", "POST", token)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            if (res.data.status === "error" || res.data.message === "error") {
              if (res.data.invalidRefferal) {
                swal({
                  title: "Error",
                  text: "Invalid referral code.",
                  icon: "warning",
                  dangerMode: true,
                });
              }
            } else {
              // this.props.addToCart([]);
              this.props.userdetails(res.data.data);
              // localStorage.setItem("status", "false");
              this.setState({
                verifymobilestatus: "fullytrue",
                buttonstatus: false,
              });
              this.props.history.push("/");
              this.setState({
                redirectToHome: true,
              });
            }
          } else {
            swal({
              title: "Enter correct OTP",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .then(() => {
          if (this.state.coupon) {
            var requestData = {
              coupon_code: this.state.coupon,
            };
            ApiRequest(requestData, "/GetCouponByCode", "POST", "")
              .then(async (res) => {
                var response = res.data.data;
                var ProductCouponError = false;
                if (res.data.message === "ok") {
                  var valueErr = document.getElementsByClassName("err");
                  for (var i = 0; i < valueErr.length; i++) {
                    valueErr[i].innerText = "";
                  }
                  if (response.discountType === "couponValue") {
                    if (
                      this.state.total_after_discount > response.couponValue
                    ) {
                      if (response.discountAmount) {
                        this.setState({
                          couponStatus: true,
                          discount_amount: response.discountAmount,
                          total_after_discount:
                            this.state.total_after_discount -
                            response.discountAmount,
                          discount_percentage:
                            (response.discountAmount /
                              this.state.subTotal_price) *
                            100,
                        });

                        localStorage.setItem("coupon_code", this.state.coupon);
                        localStorage.setItem("couponStatus", true);
                      } else if (response.discountPercentage) {
                        var pdiscount =
                          (this.state.total_price *
                            parseInt(response.discountPercentage)) /
                          100;
                        if (+pdiscount > +response.discount_upto) {
                          var percentdiscount = response.discount_upto;
                          this.setState({
                            discount_percentage:
                              (response.discount_upto /
                                this.state.subTotal_price) *
                              100,
                          });
                        } else {
                          var percentdiscount = pdiscount;
                          this.setState({
                            discount_percentage: parseInt(
                              response.discountPercentage
                            ),
                          });
                        }
                        this.setState({
                          couponStatus: true,
                          // discount_percentage: parseInt(response.discountPercentage),
                          discount_amount: percentdiscount,
                          discount_percentageAPI: response.discountPercentage,
                          max_discount_amount: response.discount_upto,
                          total_after_discount:
                            this.state.total_after_discount - percentdiscount,
                        });
                      } else if (response.discountProductPackagedata) {
                        localStorage.setItem(
                          "freepackage",
                          JSON.stringify(response.discountProductPackagedata)
                        );
                        localStorage.setItem(
                          "freeproduct",
                          JSON.stringify(response.discountProduct)
                        );
                        this.setState({
                          couponStatus: true,
                        });

                        localStorage.setItem("coupon_code", this.state.coupon);
                        localStorage.setItem("couponStatus", true);
                      }
                    } else if (
                      this.state.total_after_discount <= response.couponValue
                    ) {
                      var valueErr = document.getElementsByClassName("err");
                      for (var i = 0; i < valueErr.length; i++) {
                        valueErr[i].innerText = "";
                      }
                      valueErr = document.getElementsByClassName(
                        "err_couponecodevalidation"
                      );
                      valueErr[0].innerText =
                        "Minimum Cart value of " +
                        response.couponValue +
                        " is required";
                    } else {
                      this.setState({
                        couponStatus: false,
                        discount_percentage: 0,
                        discount_amount: 0,
                        total_after_discount: this.state.total_price,
                      });
                    }
                  } else if (response.discountType === "ProductCategory") {
                    var applicablestatus = false;
                    var cartdata = this.props.dataInCart;
                    if (response.productDetail.length > 0) {
                      var couponprodids = [];
                      for (let i = 0; i < response.productDetail.length; i++) {
                        couponprodids.push(
                          response.productDetail[i].product_id
                        );
                      }
                      for (let j = 0; j < cartdata.length; j++) {
                        var n = couponprodids.includes(cartdata[j]._id);
                        if (n === false) {
                          applicablestatus = false;
                        } else {
                          applicablestatus = true;
                          break;
                        }
                      }
                    } else {
                      var couponprodids = [];
                      for (let i = 0; i < response.categoryDetail.length; i++) {
                        couponprodids.push(
                          response.categoryDetail[i].category_id
                        );
                      }
                      for (let j = 0; j < cartdata.length; j++) {
                        var n = couponprodids.includes(
                          cartdata[j].product_cat_id._id
                        );
                        if (n === false) {
                          applicablestatus = false;
                        } else {
                          applicablestatus = true;
                          break;
                        }
                      }
                    }

                    if (applicablestatus === true) {
                      if (response.discountAmount) {
                        this.setState({
                          couponStatus: true,
                          discount_amount: response.discountAmount,
                          total_after_discount:
                            this.state.total_after_discount -
                            response.discountAmount,
                        });

                        localStorage.setItem("coupon_code", this.state.coupon);
                        localStorage.setItem("couponStatus", true);
                      } else if (response.discountPercentage) {
                        var pdiscount =
                          (this.state.total_price *
                            parseInt(response.discountPercentage)) /
                          100;
                        if (pdiscount > response.discount_upto) {
                          var percentdiscount = response.discount_upto;
                        } else {
                          var percentdiscount = pdiscount;
                        }
                        this.setState({
                          couponStatus: true,
                          discount_percentage: parseInt(
                            response.discountPercentage
                          ),
                          discount_amount: percentdiscount,
                          total_after_discount:
                            this.state.total_after_discount - percentdiscount,
                        });
                      } else if (response.discountProductPackagedata) {
                        localStorage.setItem(
                          "freepackage",
                          JSON.stringify(response.discountProductPackagedata)
                        );
                        localStorage.setItem(
                          "freeproduct",
                          JSON.stringify(response.discountProduct)
                        );
                      } else {
                        this.setState({
                          couponStatus: false,
                          discount_percentage: 0,
                          discount_amount: 0,
                          total_after_discount: this.state.total_price,
                        });
                      }
                    } else {
                      ProductCouponError = true;
                      localStorage.setItem("couponId", "");
                      localStorage.setItem("coupon_code", "");
                      localStorage.setItem("discount_details", {});
                      localStorage.setItem("discount_amount", 0);
                      localStorage.setItem("discount_percentage", 0);
                      localStorage.setItem("couponStatus", 2);
                      var valueErr = document.getElementsByClassName("err");
                      for (var i = 0; i < valueErr.length; i++) {
                        valueErr[i].innerText = "";
                      }
                      valueErr = document.getElementsByClassName(
                        "err_couponecodevalidation"
                      );
                      valueErr[0].innerText =
                        "Coupon Available for selected products only";
                    }
                  }

                  localStorage.setItem(
                    "discount_amount",
                    this.state.discount_amount
                  );
                } else {
                  var valueErr = document.getElementsByClassName("err");
                  for (var i = 0; i < valueErr.length; i++) {
                    valueErr[i].innerText = "";
                  }
                  valueErr = document.getElementsByClassName(
                    "err_couponecodevalidation"
                  );
                  valueErr[0].innerText = res.data.data;
                }
                if (!ProductCouponError) {
                  localStorage.setItem("couponId", res.data.data._id);
                  localStorage.setItem(
                    "coupon_code",
                    res.data.data.coupon_code
                  );
                }
              })
              .then(() => {
                this.calculateDiscountPerItem();
              })
              .catch((error) => {
                console.log(error);
              });
          }
          this.forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        });
      this.setState({
        compopupstatus: true,
      });
    } else {
      var valueErr = document.getElementsByClassName("err");
      for (var i = 0; i < valueErr.length; i++) {
        valueErr[i].innerText = "";
      }
      if (!this.state.contact) {
        valueErr = document.getElementsByClassName("err_contact");
        valueErr[0].innerText = "This Field is Required";
      }
      if (!this.state.name) {
        valueErr = document.getElementsByClassName("err_name");
        valueErr[0].innerText = "This Field is Required";
      }
      if (!this.state.email) {
        valueErr = document.getElementsByClassName("err_email");
        valueErr[0].innerText = "This Field is Required";
      } else if (this.state.email.match(mailformat)) {
      } else {
        valueErr = document.getElementsByClassName("err_email");
        valueErr[0].innerText = "Enter Valid Email Address";
      }
    }
  }

  _handleCheckoutClick = async () => {
    this.setState({ allDataLoaded: false });
    await sendCartDataToAPI(
      this.state.cart_data,
      this.props.user_details,
      this.props.addToCart
    )
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          let dtaa = {};
          ApiRequest(
            dtaa,
            "/get/addtocart/" + this.props.user_details._id,
            "GET"
          )
            .then((res1) => {
              if (res1.status === 201 || res1.status === 200) {
                if (res1.data.data.priceChanged) {
                  swal({
                    title: "Price Changed!",
                    text: "Prices of items are changed. Your cart will be refreshed.",
                    icon: "warning",
                  }).then(() => {
                    window.location.reload();
                  });
                } else {
                  localStorage.setItem(
                    "discount_amount",
                    this.state.discount_amount
                  );
                  localStorage.setItem(
                    "discount_percentage",
                    this.state.discount_percentage
                  );
                  setTimeout(() => {
                    this.props.history.push("checkout");
                  }, 0);
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (res.status === 400) {
          this.setState({ allDataLoaded: true });
          if (res.data.message === "errror") {
            if (document.querySelector(".quantity-error-cart")) {
              document.querySelector(".quantity-error-cart").innerHTML =
                "You can not add " + res.data.data?.join("");
            }
          }
        } else {
          this.setState({ allDataLoaded: true });
          swal({
            title: "Network Error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  _handleFormmobile(val) {
    var name = val.target.name;
    var value = val.target.value;

    this.setState({
      [name]: value,
    });
  }

  verify() {
    this.setState({
      signupCompleted: false,
      showOtpForSignup: false,
      incompleteLogin: false,
    });
    if (isNaN(this.state.contact)) {
      swal({
        title: "Please enter number",
        icon: "warning",
        dangerMode: true,
      });
    } else if (
      this.state.contact.length < 10 ||
      this.state.contact.length > 10
    ) {
      swal({
        title: "Please enter 10 Digit Number",
        icon: "warning",
        dangerMode: true,
      });
    } else if (this.state.contact) {
      const requestData = {
        contactNumber: this.state.contact,
      };
      ApiRequest(requestData, "/mobileSignUp", "POST")
        .then(async (res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({ user_id: res.data.data._id });
            if (res.data.data.name && res.data.data.email) {
              swal({
                title: "OTP sent on email and SMS.",
                icon: "success",
                dangerMode: false,
              });
              if (res.data.data.name && res.data.data.email) {
                this.setState({ incompleteLogin: false });
              } else {
                this.setState({ incompleteLogin: true });
              }
            }
            if (res.data.data.userExists) {
              this.setState({
                verifymobilestatus: "semitrue",
                buttonstatus: false,
                readonlytrue: true,
                otttpp: res.data.data.otp,
              });
            } else {
              this.setState({
                verifymobilestatus: "fullytrue",
                buttonstatus: false,
                readonlytrue: true,
              });
            }
            // this.setState({
            //   verifymobilestatus: "semitrue",
            //   buttonstatus: false,
            //   readonlytrue: true,
            //   otttpp: res.data.data.otp,
            // });
            // localStorage.setItem("status", "false");
            // local cart data

            if (this.props.dataInCart.length > 0) {
              await sendCartDataToAPI(
                this.props.dataInCart,
                res.data.data,
                this.props.addToCart
              )
                .then((res) => {
                  localStorage.setItem(
                    "discount_amount",
                    this.state.discount_amount
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          } else if (res.status === 400 && res.data.message === "error") {
            if (res.data.data) {
              swal({
                title: res.data.data,
                icon: "warning",
                dangerMode: true,
              });
            } else {
              alert("Account Deactivated. Please Contact Us For More Details");
            }
          }
        })
        .then(() => {
          this.forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      swal({
        title: "Please enter your number",
        icon: "warning",
        dangerMode: true,
      });
    }
  }
  verifyWithEmail() {
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      !this.state.email &&
      (isNaN(this.state.contact) || !this.state.contact)
    ) {
      swal({
        title: "Please enter number and email",
        icon: "warning",
        dangerMode: true,
      });
    } else if (isNaN(this.state.contact)) {
      swal({
        title: "Please enter number",
        icon: "warning",
        dangerMode: true,
      });
    } else if (
      this.state.contact.length < 10 ||
      this.state.contact.length > 10
    ) {
      swal({
        title: "Please enter 10 Digit Number",
        icon: "warning",
        dangerMode: true,
      });
    } else if (!this.state.email) {
      swal({
        title: "Please enter Email",
        icon: "warning",
        dangerMode: true,
      });
    } else if (!this.state.email.match(mailformat)) {
      swal({
        title: "Please enter correct Email",
        icon: "warning",
        dangerMode: true,
      });
    } else if (
      this.state.contact &&
      this.state.email &&
      this.state.email.match(mailformat)
    ) {
      const requestData = {
        contactNumber: this.state.contact,
        email: this.state.email,
      };
      ApiRequest(requestData, "/mobileSignUp", "POST")
        .then(async (res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({ user_id: res.data.data._id });
            if (res.data.data.name && res.data.data.email) {
              swal({
                title: "OTP sent on email and SMS.",
                icon: "success",
                dangerMode: false,
              });
            }
            this.setState({
              verifymobilestatus: "semitrue",
              buttonstatus: false,
              readonlytrue: true,
              otttpp: res.data.data.otp,
            });
            // localStorage.setItem("status", "false");
            // local cart data
            if (this.props.dataInCart.length > 0) {
              await sendCartDataToAPI(
                this.props.dataInCart,
                res.data.data,
                this.props.addToCart
              )
                .then((res) => {
                  localStorage.setItem(
                    "discount_amount",
                    this.state.discount_amount
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          } else if (res.status === 400 && res.data.message === "error") {
            if (res.data.data) {
              swal({
                title: res.data.data,
                icon: "warning",
                dangerMode: true,
              });
            } else {
              alert("Account Deactivated. Please Contact Us For More Details");
            }
          }
        })
        .then(() => {
          this.forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      swal({
        title: "Please enter your number",
        icon: "warning",
        dangerMode: true,
      });
    }
  }

  verifyagain() {
    const requestData = this.state.emailOnSignup
      ? {
          contactNumber: this.state.contact,
          email: this.state.email,
        }
      : {
          contactNumber: this.state.contact,
        };
    ApiRequest(requestData, "/resendOtp", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          swal({
            title: "OTP sent on email and SMS.",
            icon: "success",
            dangerMode: false,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sendCartDataToApi = async (callFrom) => {
    await sendCartDataToAPI(
      this.props.dataInCart,
      this.props.user_details,
      this.props.addToCart
    )
      .then((res) => {
        if (res.status === 400 || res.status === 401) {
          if (res.data.message === "error") {
            let newCartModifying = this.props.dataInCart;
            const newItemsArray = newCartModifying.filter((itm) => {
              if (itm._id !== this.state.product_data._id) {
                return itm;
              }
            });
            if (newItemsArray !== undefined) {
              this.props.addToCart(newItemsArray);
              localStorage.setItem("cartItem", JSON.stringify(newItemsArray));
            } else {
              this.props.addToCart([]);
              localStorage.setItem("cartItem", []);
            }

            this.setState({
              cartItems: this.props.dataInCart ? this.props.dataInCart : [],
            });
            swal({
              // title: ,
              text: "This Item is currently out of stock",
              icon: "warning",
              dangerMode: true,
            });
          }
        }
        this.forceUpdate();
      })
      .catch((error) => {
        console.log(error);
      });
    if (callFrom !== "login") {
      localStorage.setItem("coupon_code", "");
      localStorage.setItem("freepackage", "");
      localStorage.setItem("freeproduct", "");
      localStorage.setItem("couponStatus", 2);
      localStorage.setItem("discount_amount", "");
    } else {
      this.calculate_summry();
    }
    this.forceUpdate();
  };

  onotpchange(val) {
    var cartDatabyAPI = [];
    var newpackage = [];
    localStorage.setItem("contact", this.state.contact);
    var name = val.target.name;
    var value = val.target.value;
    this.setState({
      [name]: value,
    });

    if (value.length == 6) {
      const requestData = {
        user_id: this.state.user_id,
        otp: value,
        getToken: true,
      };

      ApiRequest(requestData, "/userMobileVerification", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.props.userdetails(res.data.data);
            localStorage.setItem("_jw_token", res.data.token);
            // localStorage.setItem("status", "false");
            if (this.props.dataInCart.length > 0) {
              this.sendCartDataToApi("login");
            }
            if (
              this.props.user_details.contactNumber &&
              this.props.user_details.name &&
              this.props.user_details.email
            ) {
              if (this.props.dataInCart.length === 0) {
                let dtaa = {};
                ApiRequest(
                  dtaa,
                  "/get/addtocart/" + this.props.user_details._id,
                  "GET"
                )
                  .then((res) => {
                    if (res.status === 201 || res.status === 200) {
                      if (
                        res.data.message === "error" ||
                        res.data.data.cartDetail.length === 0
                      ) {
                        window.location.reload();
                      } else {
                        localStorage.setItem(
                          "status",
                          Boolean(res.data.data.subscribe)
                        );
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
                            preOrderRemainQty: item.preOrderRemainQty,
                            productSubscription:
                              item.product_id.productSubscription,
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
                            productQuantity: +item.product_id.productQuantity,
                            availableQuantity:
                              +item.product_id.availableQuantity,
                            ProductRegion: item.product_id.ProductRegion,
                            relatedProduct: item.product_id.relatedProduct,
                            configurableData: [],
                            images: item.product_id.images,
                            qty: item.qty,
                            price: item.price,
                            unitQuantity: item.unitQuantity,
                            simpleData: item.simpleItem.packet_size
                              ? [
                                  {
                                    package: [
                                      {
                                        packet_size:
                                          item.simpleItem.packet_size,
                                        packetLabel:
                                          item.simpleItem.packetLabel,
                                        selling_price:
                                          item.simpleItem.selling_price,
                                        packetmrp: item.simpleItem.packetmrp,
                                        _id: item.simpleItem._id,
                                        quantity: item.qty,
                                        selected: true,
                                        B2B_price: item.simpleItem.B2B_price,
                                        Retail_price:
                                          item.simpleItem.Retail_price,
                                      },
                                    ],
                                    availableQuantity:
                                      item.product_id.simpleData[0]
                                        .availableQuantity,
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
                                      item.product_id.simpleData[0]
                                        .RegionB2BPrice,
                                    RegionRetailPrice:
                                      item.product_id.simpleData[0]
                                        .RegionRetailPrice,
                                    availableQuantity:
                                      item.product_id.simpleData[0]
                                        .availableQuantity,
                                  },
                                ],
                          });
                        });
                        this.calculate_summry1(cartDatabyAPI);
                        this.props.addToCart(cartDatabyAPI);
                        this.setState({
                          loading: false,
                        });
                      }
                    }
                  })
                  .then(() => {
                    this.forceUpdate();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
              this.setState({
                verifymobilestatus: "fullytrue",
                compopupstatus: false,
              });
              this.redeemReferralPoints();
            }
            this.setState({
              verifymobilestatus: "fullytrue",
              buttonstatus: false,
            });
            localStorage.setItem("contact", this.state.contact);
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
    } else {
      if (value.length > 6) {
        swal({
          title: "Enter correct OTP",
          // text: "Are you sure that you want to leave this page?",
          icon: "warning",
          dangerMode: true,
        });
      }
    }
  }

  calculateDiscountPerItem = (newItemsArray) => {
    let localProducts = this.state.cart_data;
    let cart_data_dt = [];
    let localPrice = 0;
    localStorage.setItem(
      "discount_details",
      JSON.stringify({
        discountLocation: this.state.discountLocation,
        discountProducts: this.state.discountProducts,
      })
    );
    let discountLocation = this.state.discountLocation;
    let discountProducts = this.state.discountProducts;
    // let subTotal = this.state.discountLocation === 'product' ? +this.state.discountProductsTotalPrice : +this.state.subTotal_price;

    //getting single selected price
    localProducts.map((item, index) =>
      item.simpleData &&
      item.simpleData.length > 0 &&
      item.TypeOfProduct === "simple"
        ? item.simpleData[0].package
            .filter((dta) => dta.selected == true)
            .map((data, ind) => {
              if (this.props.user_details.length !== 0) {
                if (this.props.user_details.user_type === "b2b") {
                  localPrice = data.B2B_price;
                } else if (this.props.user_details.user_type === "retail") {
                  localPrice = data.Retail_price;
                } else if (
                  this.props.user_details.user_type === "user" ||
                  this.props.user_details.user_type === null
                ) {
                  localPrice = data.selling_price;
                }
              } else {
                if (data.selling_price) {
                  localPrice = data.selling_price;
                } else {
                  localPrice = data.packetmrp;
                }
              }
              cart_data_dt.push({
                inhouseQuantity:
                  typeof item.inhouseQuantity === "object"
                    ? +item.inhouseQuantity
                    : +item.inhouseQuantity,
                lostQuantity:
                  typeof item.lostQuantity === "object"
                    ? +item.lostQuantity
                    : +item.lostQuantity,
                bookingQuantity:
                  typeof item.bookingQuantity === "object"
                    ? +item.bookingQuantity
                    : +item.bookingQuantity,
                productQuantity:
                  typeof item.productQuantity === "object"
                    ? +item.productQuantity
                    : +item.productQuantity,
                availableQuantity:
                  typeof item.availableQuantity === "object"
                    ? +item.availableQuantity
                    : +item.availableQuantity,
                product_categories:
                  item.product_categories?.length > 0
                    ? item.product_categories
                    : item.product_id?.product_categories,
                ...item,
                product_cat_id: item.product_cat_id
                  ? item.product_cat_id._id
                  : null,
                product_subCat1_id: item.product_subCat1_id
                  ? item.product_subCat1_id._id
                  : null,
                product_id: item._id,
                product_name: item.product_name,
                productItemId: data._id,
                TypeOfProduct: item.TypeOfProduct,
                packet_size: data.packet_size,
                packetLabel: data.packetLabel,
                qty: data.quantity,
                price: localPrice,
                totalprice: data.quantity * localPrice,
                without_package: false,
              });
            })
        : (localPrice = item.totalprice)
    );

    localProducts.map((item, index) => {
      if (item.TypeOfProduct === "simple") {
        if (this.props.user_details.length !== 0) {
          if (this.props.user_details.user_type === "b2b") {
            localPrice = item.simpleData[0].RegionB2BPrice;
          } else if (this.props.user_details.user_type === "retail") {
            localPrice = item.simpleData[0].RegionRetailPrice;
          } else if (
            this.props.user_details.user_type === "user" ||
            this.props.user_details.user_type === null
          ) {
            localPrice = item.simpleData[0].RegionSellingPrice;
          }
        } else {
          if (item.selling_price) {
            localPrice = item.simpleData[0].RegionSellingPrice;
          } else {
            localPrice = item.simpleData[0].packetmrp;
          }
        }
      } else {
        localPrice = item.totalPrice;
      }
      if (item.simpleData) {
        if (item.simpleData.length > 0) {
          if (item.TypeOfProduct === "simple") {
            if (item.simpleData[0].package.length === 0) {
              cart_data_dt.push({
                inhouseQuantity:
                  typeof item.inhouseQuantity === "object"
                    ? +item.inhouseQuantity
                    : +item.inhouseQuantity,
                lostQuantity:
                  typeof item.lostQuantity === "object"
                    ? +item.lostQuantity
                    : +item.lostQuantity,
                bookingQuantity:
                  typeof item.bookingQuantity === "object"
                    ? +item.bookingQuantity
                    : +item.bookingQuantity,
                productQuantity:
                  typeof item.productQuantity === "object"
                    ? +item.productQuantity
                    : +item.productQuantity,
                availableQuantity:
                  typeof item.availableQuantity === "object"
                    ? +item.availableQuantity
                    : +item.availableQuantity,
                product_categories: item.product_categories || [],
                ...item,
                product_cat_id: item.product_cat_id
                  ? item.product_cat_id._id
                  : null,
                product_subCat1_id: item.product_subCat1_id
                  ? item.product_subCat1_id._id
                  : null,
                product_id: item._id,
                product_name: item.product_name,
                productItemId: item.simpleData[0]._id,
                TypeOfProduct: item.TypeOfProduct,
                packet_size: null,
                packetLabel: null,
                unitQuantity: item.unitQuantity,
                unitMeasurement: item.unitMeasurement,
                qty: item.simpleData[0].userQuantity,
                price: localPrice,
                totalprice: item.simpleData[0].userQuantity * localPrice,
                without_package: true,
              });
            }
          }
        }
      }
      if (item.TypeOfProduct === "group") {
        cart_data_dt.push({
          product_categories: item.product_categories || [],
          ...item,
          product_id: item._id,
          qty: item.qty,
          totalprice: item.qty * item.price,
          without_package: true,
        });
      }
      if (item.TypeOfProduct === "configurable") {
        cart_data_dt.push({
          ...item,
          product_cat_id: null,
          product_subCat1_id: null,
          product_id: item._id,
          preOrder: false,
          preOrderRemainQty: item.preOrderRemainQty,
          product_name: item.product_name,
          productItemId: null,
          TypeOfProduct: "configurable",
          unitQuantity: item.unitQuantity,
          unitMeasurement: item.unitMeasurement,
          qty: item.qty,
          price: item.price,
          totalprice: item.price * item.qty,
          without_package: null,
          variant_name: item.variant_name,
        });
      }
    });
    let totalredeemPercentage =
      (+this.state.totalSeedRedeem / +this.state.subTotalWithoutGST) * 100;
    if (+this.state.couponStatus === 2 || !this.state.couponStatus) {
      cart_data_dt.forEach((prd) => {
        let priceAfterDiscount = 0;
        if (this.state.referralEligible) {
          priceAfterDiscount =
            prd.totalprice -
            (prd.totalPriceBeforeGST * +this.state.referralPercent) / 100;
        }
        if (this.state.loyaltyPointApplied) {
          if (priceAfterDiscount === 0) {
            priceAfterDiscount =
              +prd.totalprice -
              (+prd.totalPriceBeforeGST * totalredeemPercentage) / 100;
          } else {
            priceAfterDiscount =
              +priceAfterDiscount -
              (+prd.totalPriceBeforeGST * totalredeemPercentage) / 100;
          }
        }
        return (prd.priceAfterDiscount = priceAfterDiscount.toFixed(2));
      });
    } else {
      if (this.state.discount_percentage) {
        if (discountLocation === "product") {
          cart_data_dt.forEach((prd) => {
            let priceAfterDiscount = 0;
            discountProducts.forEach((discountItem) => {
              if (prd._id === discountItem._id) {
                priceAfterDiscount =
                  +prd.totalprice -
                  +prd.totalPriceBeforeGST *
                    (this.state.discount_percentage / 100);
                return (prd.priceAfterDiscount = localStorage.getItem(
                  "discount_amount"
                )
                  ? priceAfterDiscount.toFixed(2)
                  : 0);
              } else {
                return discountProducts.filter((a) => a._id === prd._id).length
                  ? (prd.priceAfterDiscount = prd.priceAfterDiscount)
                  : (prd.priceAfterDiscount = 0);
              }
            });
            if (this.state.loyaltyPointApplied) {
              if (priceAfterDiscount === 0) {
                priceAfterDiscount =
                  +prd.totalprice -
                  (+prd.totalPriceBeforeGST * totalredeemPercentage) / 100;
              } else {
                priceAfterDiscount =
                  +priceAfterDiscount -
                  (+prd.totalPriceBeforeGST * totalredeemPercentage) / 100;
              }
              return (prd.priceAfterDiscount = priceAfterDiscount.toFixed(2));
            }
          });
        } else {
          cart_data_dt.forEach((prd) => {
            let priceAfterDiscount = 0;
            priceAfterDiscount =
              prd.totalprice -
              prd.totalPriceBeforeGST * (this.state.discount_percentage / 100);
            prd.priceAfterDiscount = localStorage.getItem("discount_amount")
              ? priceAfterDiscount.toFixed(2)
              : 0;
            if (this.state.loyaltyPointApplied) {
              if (priceAfterDiscount === 0) {
                priceAfterDiscount =
                  +prd.totalprice -
                  (+prd.totalPriceBeforeGST * totalredeemPercentage) / 100;
              } else {
                priceAfterDiscount =
                  +priceAfterDiscount -
                  (+prd.totalPriceBeforeGST * totalredeemPercentage) / 100;
              }
              return (prd.priceAfterDiscount = priceAfterDiscount.toFixed(2));
            }
          });
        }
      }
    }
    var localCart = [];
    cart_data_dt.forEach((itm) => {
      localCart.push({ ...itm, itemDiscountAmount: itm.priceAfterDiscount });
    });
    setTimeout(() => {
      this.setState({
        cart_data: localCart,
      });
      this.calculateGST(localCart);
      console.log(localCart);
      // this.props.addToCart([]);
      // this.props.addToCart(cart_data_dt);
      localStorage.setItem("cartItem", JSON.stringify(localCart));
    }, 0);
  };

  applyCouponApi = async (data) => {
    if (this.state.coupon == "") {
      // if (callFrom && callFrom === "calculation") {
      // } else {
      this.setState({
        couponnotfound: true,
      });
      // }
    } else {
      this.setState({
        couponnotfound: false,
      });
      // this.setState({ total_after_discount: await this.state.total_price });

      var requestData = {
        coupon_code: this.state.coupon,
      };
      ApiRequest(requestData, "/GetCouponByCode", "POST", "", "")
        .then(async (res) => {
          var response = res.data.data;
          var ProductCouponError = false;
          var errorsPresent = false;
          if (res.data.message === "ok") {
            var valueErr = document.getElementsByClassName("err");
            for (var i = 0; i < valueErr.length; i++) {
              valueErr[i].innerText = "";
            }
            if (response.discountType === "couponValue") {
              if (
                +this.state.subTotal_price >= +response.couponValue
                // this.state.total_after_discount > response.couponValue
              ) {
                if (response.discountAmount) {
                  this.setState({
                    couponStatus: true,
                    discount_amount: response.discountAmount,
                    total_after_discount:
                      this.state.total_after_discount - response.discountAmount,
                    discount_percentage:
                      (response.discountAmount /
                        this.state.subTotalWithoutGST) *
                      100,
                  });

                  localStorage.setItem("coupon_code", this.state.coupon);
                  localStorage.setItem("couponStatus", true);
                } else if (response.discountPercentage) {
                  var pdiscount =
                    (this.state.subTotalWithoutGST *
                      parseInt(response.discountPercentage)) /
                    100;
                  if (
                    response.discount_upto &&
                    +pdiscount > +response.discount_upto
                  ) {
                    var percentdiscount = response.discount_upto;
                    this.setState({
                      discount_percentage:
                        (response.discount_upto /
                          this.state.subTotalWithoutGST) *
                        100,
                    });
                  } else {
                    var percentdiscount = pdiscount.toFixed(2);
                    this.setState({
                      discount_percentage: parseInt(
                        response.discountPercentage
                      ),
                    });
                  }
                  this.setState({
                    couponStatus: true,
                    // discount_percentage: parseInt(response.discountPercentage),
                    discount_amount: percentdiscount,
                    discount_percentageAPI: response.discountPercentage,
                    max_discount_amount: response.discount_upto,
                    total_after_discount:
                      this.state.total_after_discount - percentdiscount,
                  });
                } else if (response.discountProductPackagedata) {
                  localStorage.setItem(
                    "freepackage",
                    JSON.stringify(response.discountProductPackagedata)
                  );
                  localStorage.setItem(
                    "freeproduct",
                    JSON.stringify(response.discountProduct)
                  );
                  this.setState({
                    couponStatus: true,
                  });

                  localStorage.setItem("coupon_code", this.state.coupon);
                  localStorage.setItem("couponStatus", true);
                }
              } else if (
                +this.state.subTotal_price < +response.couponValue
                // this.state.total_after_discount <= response.couponValue
              ) {
                errorsPresent = true;
                var valueErr = document.getElementsByClassName("err");
                for (var i = 0; i < valueErr.length; i++) {
                  valueErr[i].innerText = "";
                }
                valueErr = document.getElementsByClassName(
                  "err_couponecodevalidation"
                );
                valueErr[0].innerText =
                  "Minimum Cart value of " +
                  response.couponValue +
                  " is required";
              } else {
                this.setState({
                  couponStatus: false,
                  discount_percentage: 0,
                  discount_amount: 0,
                  total_after_discount: this.state.total_price,
                });
              }
            } else if (response.discountType === "ProductCategory") {
              var applicablestatus = false;
              var cartdata = this.state.cart_data;
              var totalPriceDiscountItems = 0;
              var discountedItems = [];
              if (response.productDetail.length > 0) {
                var couponprodids = [];
                for (let i = 0; i < response.productDetail.length; i++) {
                  couponprodids.push(response.productDetail[i].product_id);
                }
                for (let j = 0; j < cartdata.length; j++) {
                  var n = couponprodids.includes(cartdata[j]._id);
                  if (n === false) {
                    applicablestatus = false;
                  } else {
                    applicablestatus = true;
                    break;
                  }
                }
              } else {
                var couponprodids = [];
                var couponcatids = [];
                for (let i = 0; i < response.categoryDetail.length; i++) {
                  couponcatids.push(response.categoryDetail[i].category_id);
                }
                for (let j = 0; j < cartdata.length; j++) {
                  var m = false;
                  // var n = couponcatids.includes(
                  //   cartdata[j].product_cat_id._id
                  // );
                  for (
                    let k = 0;
                    k < cartdata[j].product_categories.length;
                    k++
                  ) {
                    m = couponcatids.includes(
                      cartdata[j].product_categories[k]._id
                    );
                    if (m === false) {
                      // applicablestatus = false;
                    } else {
                      applicablestatus = true;
                      break;
                    }
                  }
                  if (m === false) {
                    // applicablestatus = false;
                  } else {
                    applicablestatus = true;
                    couponprodids.push(cartdata[j]._id);
                  }
                }
              }
              cartdata.forEach((item) => {
                couponprodids.forEach((couponItem) => {
                  if (item._id === couponItem) {
                    discountedItems.push(item);
                    totalPriceDiscountItems += +item.totalPriceBeforeGST;
                  }
                });
              });
              this.setState({
                discountLocation: response.discountLocation
                  ? response.discountLocation
                  : response.ProductCategoryType
                  ? "product"
                  : "cart",
                discountProducts: discountedItems,
                discountProductsTotalPrice: totalPriceDiscountItems,
              });
              if (applicablestatus === true) {
                if (response.discountAmount) {
                  this.setState({
                    couponStatus: true,
                    discount_amount: response.discountAmount,
                    total_after_discount:
                      this.state.total_after_discount - response.discountAmount,
                    discount_percentage:
                      response.discountLocation === "cart"
                        ? (response.discountAmount /
                            this.state.subTotalWithoutGST) *
                          100
                        : (response.discountAmount / totalPriceDiscountItems) *
                          100,
                  });

                  localStorage.setItem("coupon_code", this.state.coupon);
                  localStorage.setItem("couponStatus", true);
                } else if (response.discountPercentage) {
                  var pdiscount =
                    response.discountLocation === "cart"
                      ? (this.state.total_price *
                          parseInt(response.discountPercentage)) /
                        100
                      : (totalPriceDiscountItems *
                          parseInt(response.discountPercentage)) /
                        100;
                  console.log(pdiscount);
                  if (
                    response.discount_upto &&
                    pdiscount > response.discount_upto
                  ) {
                    var percentdiscount = response.discount_upto;
                  } else {
                    var percentdiscount = pdiscount;
                  }
                  this.setState({
                    couponStatus: true,
                    discount_percentage: parseInt(response.discountPercentage),
                    discount_amount: percentdiscount.toFixed(2),
                    total_after_discount:
                      this.state.total_after_discount - percentdiscount,
                  });
                } else if (response.discountProductPackagedata) {
                  localStorage.setItem(
                    "freepackage",
                    JSON.stringify(response.discountProductPackagedata)
                  );
                  localStorage.setItem(
                    "freeproduct",
                    JSON.stringify(response.discountProduct)
                  );
                } else {
                  this.setState({
                    couponStatus: false,
                    discount_percentage: 0,
                    discount_amount: 0,
                    total_after_discount: this.state.total_price,
                  });
                }
              } else {
                ProductCouponError = true;

                errorsPresent = true;
                localStorage.setItem("couponId", "");
                localStorage.setItem("coupon_code", "");
                localStorage.setItem("discount_details", {});
                localStorage.setItem("discount_amount", 0);
                localStorage.setItem("discount_percentage", 0);
                localStorage.setItem("couponStatus", 2);
                var valueErr = document.getElementsByClassName("err");
                for (var i = 0; i < valueErr.length; i++) {
                  valueErr[i].innerText = "";
                }
                valueErr = document.getElementsByClassName(
                  "err_couponecodevalidation"
                );
                valueErr[0].innerText =
                  "Coupon Available for selected products only";
              }
            }
            if (!ProductCouponError) {
              localStorage.setItem(
                "discount_amount",
                this.state.discount_amount
              );
            }
          } else {
            errorsPresent = true;
            var valueErr = document.getElementsByClassName("err");
            for (var i = 0; i < valueErr.length; i++) {
              valueErr[i].innerText = "";
            }
            valueErr = document.getElementsByClassName(
              "err_couponecodevalidation"
            );
            valueErr[0].innerText = res.data.data;
          }
          if (res.status === 200 || res.status === 201) {
            if (!ProductCouponError && !errorsPresent) {
              localStorage.setItem("couponId", res.data.data._id);
              localStorage.setItem("coupon_code", res.data.data.coupon_code);
            }
          }
          setTimeout(() => {
            if (errorsPresent) {
              localStorage.setItem("coupon_code", "");
              localStorage.setItem("freepackage", "");
              localStorage.setItem("freeproduct", "");
              localStorage.setItem("couponStatus", 2);
              localStorage.setItem("discount_amount", "");
              localStorage.setItem("couponId", "");
              localStorage.setItem("discount_details", {});
              localStorage.setItem("discount_percentage", 0);
              this.setState({ couponStatus: 2 });
            }
          }, 0);
        })
        .then(() => {
          this.calculate_summry1(this.state.cart_data);
          // this.calculateDiscountPerItem();
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.forceUpdate();
  };

  //removing deleted item from items state
  async removeItemFromCart(removedItem) {
    if (document.querySelector(".quantity-error-cart")) {
      document.querySelector(".quantity-error-cart").innerHTML = "";
    }
    this.setState({ loading: true });
    let selectedItem = {};
    this.state.cart_data.map((itm) => {
      if (itm === removedItem) {
        if (itm.TypeOfProduct === "simple") {
          itm.simpleData[0].package[0]
            ? itm.simpleData[0].package.map((pck) => {
                if (pck.selected) {
                  pck.quantity = 0;
                }
              })
            : (itm.simpleData[0].userQuantity = 0);
        } else {
          if (+itm.qty) {
            itm.qty = 0;
          }
        }
        selectedItem = itm;
      }
    });

    const newItemsArray = this.state.cart_data.filter((itm) => {
      if (itm !== removedItem) {
        return itm;
      }
    });
    this.props.addToCart(newItemsArray);
    let subscribe = false;
    newItemsArray.forEach((itm) => {
      if (itm.preOrder) {
        subscribe = true;
      }
    });
    localStorage.setItem("coupon_code", "");
    localStorage.setItem("freepackage", "");
    localStorage.setItem("freeproduct", "");
    localStorage.setItem("couponStatus", 2);
    localStorage.setItem("discount_amount", "");
    this.setState({
      coupon_code: "",
      couponStatus: 2,
      discount_amount: 0,
      coupon: "",
    });
    await sendCartDataToAPI(
      [selectedItem],
      this.props.user_details,
      this.props.addToCart
    )
      .then((res) => {
        localStorage.setItem(
          "cartItem",
          Array.isArray(newItemsArray)
            ? JSON.stringify(newItemsArray)
            : JSON.stringify([newItemsArray])
        );
        this.calculate_summry1(newItemsArray);

        if (newItemsArray.length === 0) {
          this.setState({
            redirectToHome: true,
          });
        }
        this.forceUpdate();
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  truncateToDecimals = (num, dec = 2) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };

  onsignupotpchange(val) {
    localStorage.setItem("contact", this.state.contact);
    var name = val.target.name;
    var value = val.target.value;
    this.setState({
      [name]: value,
    });

    if (value.length == 6) {
      const requestData = {
        user_id: this.state.user_id,
        otp: value,
        getToken: true,
      };
      ApiRequest(requestData, "/userMobileVerification", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            // this.props.userdetails(res.data.data);
            this.setState({ signupCompleted: true });
            localStorage.setItem("_jw_token", res.data.token);
            localStorage.setItem("contact", res.data.data.contactNumber);
            let tokenExpireTime = new Date();
            tokenExpireTime.setDate(tokenExpireTime.getDate() + 1);
            localStorage.setItem("session", JSON.stringify(tokenExpireTime));
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
    } else {
      if (value.length > 6) {
        swal({
          title: "Enter correct OTP",
          // text: "Are you sure that you want to leave this page?",
          icon: "warning",
          dangerMode: true,
        });
      }
    }
  }

  verifySignup() {
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      this.state.contact &&
      this.state.name &&
      this.state.email &&
      this.state.email.match(mailformat)
    ) {
      // this.setState({ showOtpForSignup: true });
      const requestData = {
        name: this.state.name,
        email: this.state.email,
        contactNumber: this.state.contact,
        refferalCodeFrom: this.state.referal_code,
      };
      ApiRequest(requestData, "/createUserWhileSignup", "POST")
        .then(async (res) => {
          if (res.status === 201 || res.status === 200) {
            if (res.data.invalidRefferal) {
              swal({
                title: "Error",
                text: "Invalid referral code.",
                icon: "warning",
                dangerMode: true,
              });
            } else if (res.data.result) {
              if (res.data.result[0].contactNumber) {
                swal({
                  title: "Error",
                  text: res.data.result[0].contactNumber,
                  icon: "warning",
                  dangerMode: true,
                });
              }
            } else {
              // this.props.userdetails(res.data.data);
              this.setState({
                showOtpForSignup: true,
                user_id: res.data.data._id,
                otttpp: res.data.data.otp,
              });
              swal({
                title: "OTP sent on email and SMS.",
                icon: "success",
                dangerMode: false,
              });

              if (this.props.dataInCart.length > 0) {
                await sendCartDataToAPI(
                  this.props.dataInCart,
                  res.data.data,
                  this.props.addToCart
                )
                  .then((res) => {
                    localStorage.setItem(
                      "discount_amount",
                      this.state.discount_amount
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            }
          } else {
            swal({
              title: "Error",
              text: "Network Error",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // this.setState({
      //   compopupstatus: true,
      // });
    } else {
      var valueErr = document.getElementsByClassName("err");
      for (var i = 0; i < valueErr.length; i++) {
        valueErr[i].innerText = "";
      }
      if (!this.state.contact) {
        valueErr = document.getElementsByClassName("err_contact");
        valueErr[0].innerText = "This Field is Required";
      }
      if (!this.state.name) {
        valueErr = document.getElementsByClassName("err_name");
        valueErr[0].innerText = "This Field is Required";
      }
      if (!this.state.email) {
        valueErr = document.getElementsByClassName("err_email");
        valueErr[0].innerText = "This Field is Required";
      } else if (this.state.email.match(mailformat)) {
      } else {
        valueErr = document.getElementsByClassName("err_email");
        valueErr[0].innerText = "Enter Valid Email Address";
      }
    }
  }

  render() {
    if (this.state.redirectToHome) {
      this.props.history.push("/");
    }
    const totalAfterDiscount = this.state.total_after_discount;
    return (
      <>
        {this.state.compopupstatus == false ? (
          <main>
            {this.state.loading ? (
              <div className="cart-loading">
                {/* <ReactLoading
                  type={"bubbles"}
                  color={"#febc15"}
                  height={"50px"}
                  width={"100px"}
                /> */}
              </div>
            ) : (
              ""
            )}
            <div className="mj-cart-wrap">
              <div className="container-fluid">
                <div className="cart-row">
                  <div className="cart-left-col">
                    <h2>
                      Shopping Cart
                      {this.state.loading ? (
                        <i
                          className="fa fa-spinner searchLoading ml-2"
                          aria-hidden="true"
                        ></i>
                      ) : (
                        ""
                      )}
                    </h2>
                    <div className="checkout-right-col">
                      <div className="checkout-table-class">
                        <table className="pro-cart-table">
                          <tbody>
                            {this.state.cart_data && this.state.cart_data[0]
                              ? this.state.cart_data.map((item, index) => {
                                  let groupItem = [];
                                  if (item.TypeOfProduct === "group") {
                                    item.groupData &&
                                      item.groupData.map((group) => {
                                        group.sets.map((set) => {
                                          if (set.qty && set.qty > 0) {
                                            groupItem.push({
                                              name: set.product.product_name,
                                              package: set.package?._id
                                                ? set.package.packetLabel
                                                : set.unitQuantity +
                                                  " " +
                                                  set.unitMeasurement,
                                              qty: set.qty,
                                              price: set.price,
                                            });
                                          }
                                        });
                                      });
                                  }
                                  //selectedPck
                                  let selLabel =
                                    item.simpleData[0] &&
                                    item.simpleData[0].package.filter(
                                      (a) => a.selected
                                    );
                                  return item.simpleData &&
                                    item.simpleData.length > 0 &&
                                    item.TypeOfProduct === "simple" ? (
                                    item.simpleData[0].package[0] ? (
                                      item.simpleData[0].package
                                        .filter((dta) => dta.selected == true)
                                        .map((data, ind) => {
                                          var price;
                                          if (
                                            this.props.user_details.length !== 0
                                          ) {
                                            if (
                                              this.props.user_details
                                                .user_type === "b2b"
                                            ) {
                                              price = data.B2B_price;
                                            } else if (
                                              this.props.user_details
                                                .user_type === "retail"
                                            ) {
                                              price = data.Retail_price;
                                            } else if (
                                              this.props.user_details
                                                .user_type === "user" ||
                                              this.props.user_details
                                                .user_type === null
                                            ) {
                                              price = data.selling_price;
                                            }
                                          } else {
                                            if (data.selling_price) {
                                              price = data.selling_price;
                                            } else {
                                              price = data.packetmrp;
                                            }
                                          }
                                          return (
                                            <tr>
                                              <td className="pointer">
                                                <Link
                                                  to={"/product/" + item.slug}
                                                >
                                                  <div className="cart_itm_image">
                                                    {item.images &&
                                                    item.images.length > 0 ? (
                                                      <img
                                                        src={
                                                          item.images
                                                            ? imageUrl +
                                                              item.images[0]
                                                                .image
                                                            : ""
                                                        }
                                                        alt=""
                                                      />
                                                    ) : (
                                                      <img
                                                        src={
                                                          imageUrl +
                                                          localStorage.getItem(
                                                            "prdImg"
                                                          )
                                                        }
                                                        alt="image"
                                                      />
                                                    )}
                                                  </div>
                                                </Link>
                                              </td>
                                              <td>
                                                <div className="pro-cart-name">
                                                  <Link
                                                    to={"/product/" + item.slug}
                                                  >
                                                    <h4 className="capitalise">
                                                      {item.product_name}
                                                      <span>
                                                        {data.packetLabel}
                                                      </span>
                                                    </h4>
                                                    <p className="price-bold">
                                                      <span
                                                      // style={
                                                      //   item.priceAfterDiscount
                                                      //     ? {
                                                      //         textDecoration:
                                                      //           "line-through",
                                                      //         color: "gray",
                                                      //       }
                                                      //     : {}
                                                      // }
                                                      >
                                                        ₹
                                                        {this.props.user_details
                                                          .length !== 0
                                                          ? price *
                                                            data.quantity
                                                          : data.selling_price *
                                                            data.quantity}
                                                      </span>
                                                      {"  "}
                                                      {/* {this.state
                                                        .couponStatus ? (
                                                        item.priceAfterDiscount ? (
                                                          <span>
                                                            {" "}
                                                            ₹
                                                            {
                                                              item.priceAfterDiscount
                                                            }
                                                          </span>
                                                        ) : (
                                                          ""
                                                        )
                                                      ) : (
                                                        ""
                                                      )} */}
                                                    </p>
                                                  </Link>
                                                  {/* <p style={{ margin: 2 }}>
                                                  ₹{data.selling_price}
                                                </p> */}
                                                </div>

                                                <div className="cart-qty">
                                                  <div className="qty-click">
                                                    <div className="quantity-row">
                                                      <div
                                                        onClick={() =>
                                                          this.decreaseQuantity(
                                                            item
                                                          )
                                                        }
                                                        className="qt-btn quantity-minus"
                                                      >
                                                        <i
                                                          className="fa fa-minus"
                                                          aria-hidden="true"
                                                        ></i>
                                                      </div>
                                                      <input
                                                        type="number"
                                                        readOnly
                                                        value={data.quantity}
                                                      />
                                                      <div
                                                        onClick={() =>
                                                          this.increaseQuantity(
                                                            item
                                                          )
                                                        }
                                                        className="qt-btn quantity-plust"
                                                      >
                                                        <i
                                                          className="fa fa-plus"
                                                          aria-hidden="true"
                                                        ></i>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="cart-remove"
                                                      onClick={() =>
                                                        this.removeItemFromCart(
                                                          item
                                                        )
                                                      }
                                                    >
                                                      <i
                                                        className="fa fa-trash"
                                                        aria-hidden="true"
                                                      ></i>
                                                    </div>
                                                  </div>
                                                </div>
                                                <span
                                                  id={
                                                    item.simpleData[0]
                                                      ? item.slug +
                                                        selLabel[0].packetLabel
                                                          .toLowerCase()
                                                          .replace(/ /g, "-")
                                                          .replace(
                                                            /[^\w-]+/g,
                                                            ""
                                                          )
                                                      : item.slug
                                                  }
                                                  style={{
                                                    display: "none",
                                                    color: "red",
                                                  }}
                                                >
                                                  {typeof item.availableQuantity ===
                                                  "object"
                                                    ? item.availableQuantity
                                                    : item.availableQuantity}{" "}
                                                  Units currently in stock
                                                </span>
                                              </td>
                                            </tr>
                                          );
                                        })
                                    ) : (
                                      <tr>
                                        {/*simpleData with no packages*/}
                                        <td className="pointer">
                                          <Link to={"/product/" + item.slug}>
                                            <div className="cart_itm_image">
                                              {item.images &&
                                              item.images.length > 0 ? (
                                                <img
                                                  src={
                                                    item.images
                                                      ? imageUrl +
                                                        item.images[0].image
                                                      : ""
                                                  }
                                                  alt=""
                                                />
                                              ) : (
                                                <img
                                                  src={
                                                    imageUrl +
                                                    localStorage.getItem(
                                                      "prdImg"
                                                    )
                                                  }
                                                  alt="image"
                                                />
                                              )}
                                            </div>
                                          </Link>
                                        </td>
                                        <td>
                                          <div className="pro-cart-name">
                                            <Link to={"/product/" + item.slug}>
                                              <h4 className="capitalise">
                                                {item.product_name}
                                                <span>
                                                  {item.unitQuantity +
                                                    " " +
                                                    item.unitMeasurement}
                                                </span>
                                              </h4>
                                              <p className="price-bold">
                                                <span
                                                // style={
                                                //   item.priceAfterDiscount
                                                //     ? {
                                                //         textDecoration:
                                                //           "line-through",
                                                //         color: "gray",
                                                //       }
                                                //     : {}
                                                // }
                                                >
                                                  ₹
                                                  {item.simpleData[0]
                                                    .RegionSellingPrice *
                                                    item.simpleData[0]
                                                      .userQuantity}
                                                </span>
                                                {"  "}
                                                {/* {this.state.couponStatus ? (
                                                  item.priceAfterDiscount ? (
                                                    <span>
                                                      {" "}
                                                      ₹{item.priceAfterDiscount}
                                                    </span>
                                                  ) : (
                                                    ""
                                                  )
                                                ) : (
                                                  ""
                                                )} */}
                                              </p>
                                            </Link>
                                            {/* <p>
                                              ₹
                                              {
                                                item.simpleData[0]
                                                  .RegionSellingPrice
                                              }
                                            </p> */}
                                          </div>

                                          <div className="cart-qty">
                                            <div className="qty-click">
                                              <div className="quantity-row">
                                                <div
                                                  onClick={() =>
                                                    this.decreaseQuantity(item)
                                                  }
                                                  className="qt-btn quantity-minus"
                                                >
                                                  <i
                                                    className="fa fa-minus"
                                                    aria-hidden="true"
                                                  ></i>
                                                </div>
                                                <input
                                                  type="number"
                                                  value={
                                                    item.simpleData[0]
                                                      .userQuantity
                                                  }
                                                />
                                                <div
                                                  onClick={() =>
                                                    this.increaseQuantity(item)
                                                  }
                                                  className="qt-btn quantity-plust"
                                                >
                                                  <i
                                                    className="fa fa-plus"
                                                    aria-hidden="true"
                                                  ></i>
                                                </div>
                                              </div>
                                              <div
                                                className="cart-remove"
                                                onClick={() =>
                                                  this.removeItemFromCart(item)
                                                }
                                              >
                                                <i
                                                  className="fa fa-trash"
                                                  aria-hidden="true"
                                                ></i>
                                              </div>
                                            </div>
                                          </div>

                                          <span
                                            id={item.slug}
                                            style={{
                                              display: "none",
                                              color: "red",
                                            }}
                                          >
                                            {typeof item.availableQuantity ===
                                            "object"
                                              ? item.availableQuantity
                                              : item.availableQuantity}{" "}
                                            Units currently in stock
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  ) : (
                                    <tr>
                                      {/*Group Data*/}
                                      <td className="pointer">
                                        <Link to={"/product/" + item.slug}>
                                          <div className="cart_itm_image">
                                            {item.images &&
                                            item.images.length > 0 ? (
                                              <img
                                                src={
                                                  item.images
                                                    ? imageUrl +
                                                      item.images[0].image
                                                    : ""
                                                }
                                                alt=""
                                              />
                                            ) : (
                                              <img
                                                src={
                                                  imageUrl +
                                                  localStorage.getItem("prdImg")
                                                }
                                                alt="image"
                                              />
                                            )}
                                          </div>
                                        </Link>
                                      </td>
                                      <td>
                                        <div className="pro-cart-name">
                                          <Link to={"/product/" + item.slug}>
                                            <h4 className="capitalise">
                                              {item.product_name}
                                            </h4>
                                            <p className="price-bold">
                                              <span
                                              // style={
                                              //   item.priceAfterDiscount
                                              //     ? {
                                              //         textDecoration:
                                              //           "line-through",
                                              //         color: "gray",
                                              //       }
                                              //     : {}
                                              // }
                                              >
                                                ₹{+item.price * +item.qty}
                                              </span>{" "}
                                              {/* {this.state.couponStatus ? (
                                                item.priceAfterDiscount ? (
                                                  <span>
                                                    {" "}
                                                    ₹{item.priceAfterDiscount}
                                                  </span>
                                                ) : (
                                                  ""
                                                )
                                              ) : (
                                                ""
                                              )} */}
                                            </p>
                                          </Link>
                                          {/* <p>
                                              ₹
                                              {
                                                item.simpleData[0]
                                                  .RegionSellingPrice
                                              }
                                            </p> */}
                                        </div>

                                        <div className="cart-qty">
                                          <div className="qty-click">
                                            <div className="quantity-row">
                                              <div
                                                onClick={() =>
                                                  this.decreaseQuantity(item)
                                                }
                                                className="qt-btn quantity-minus"
                                              >
                                                <i
                                                  className="fa fa-minus"
                                                  aria-hidden="true"
                                                ></i>
                                              </div>
                                              <input
                                                type="number"
                                                value={item.qty}
                                              />
                                              <div
                                                onClick={() =>
                                                  this.increaseQuantity(item)
                                                }
                                                className="qt-btn quantity-plust"
                                              >
                                                <i
                                                  className="fa fa-plus"
                                                  aria-hidden="true"
                                                ></i>
                                              </div>
                                            </div>
                                            <div
                                              className="cart-remove"
                                              onClick={() =>
                                                this.removeItemFromCart(item)
                                              }
                                            >
                                              <i
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                              ></i>
                                            </div>
                                          </div>
                                        </div>
                                        {item.TypeOfProduct === "group" ? (
                                          <ul>
                                            {groupItem.map((group) => {
                                              return (
                                                <li
                                                  style={{
                                                    textTransform: "capitalize",
                                                    listStyle: "none",
                                                    color: "gray",
                                                    padding: "2px 0px",
                                                    fontSize: "13px",
                                                  }}
                                                >
                                                  {group.name}-{group.package}-{" "}
                                                  {item.base_price
                                                    ? " "
                                                    : "( ₹" +
                                                      group.price +
                                                      " )"}{" "}
                                                  [{group.qty}]
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        ) : (
                                          ""
                                        )}

                                        <span
                                          id={item.slug}
                                          style={{
                                            display: "none",
                                            color: "red",
                                          }}
                                        >
                                          {typeof item.availableQuantity ===
                                          "object"
                                            ? item.availableQuantity
                                            : item.availableQuantity}{" "}
                                          Units currently in stock
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })
                              : "No Items in Cart"}
                            {localStorage.getItem("freepackage") &&
                            localStorage.getItem("freeproduct") ? (
                              <tr>
                                <td className="pointer">
                                  <div className="cart_itm_image">
                                    {/* {JSON.parse(localStorage.getItem("freeproduct")).bookingQuantity} */}
                                    <img
                                      src={
                                        imageUrl +
                                        JSON.parse(
                                          localStorage.getItem("freeproduct")
                                        ).images[0].image
                                      }
                                      alt=""
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="pro-cart-name">
                                    <h4 className="capitalise">
                                      {
                                        JSON.parse(
                                          localStorage.getItem("freeproduct")
                                        ).product_name
                                      }
                                    </h4>
                                    <p>Free</p>
                                    <p>
                                      {
                                        JSON.parse(
                                          localStorage.getItem("freepackage")
                                        ).packetLabel
                                      }{" "}
                                      - {"1"}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                        {this.state.subTotal_price <
                        +this.state.minimumOrderValue ? (
                          <p style={{ color: "red" }}>
                            Min Order Value should be ₹
                            {+this.state.minimumOrderValue}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  {this.props.dataInCart && this.props.dataInCart[0] ? (
                    <div className="cart-right-col">
                      {!this.state.referralEligible && (
                        <div className="coupon-bx">
                          <h2>Have a Coupon Code?</h2>
                          <div className="form-group">
                            {this.state.couponnotfound == true ? (
                              <div>
                                <input
                                  type="text"
                                  name="coupon"
                                  value={this.state.coupon}
                                  readOnly={
                                    this.state.couponStatus == true
                                      ? true
                                      : false
                                  }
                                  style={{ borderColor: "red" }}
                                  onChange={(val) => this._handleForm(val)}
                                  placeholder="Add a Coupon Code"
                                />
                                <span>Please Add a Coupon</span>
                              </div>
                            ) : (
                              <div>
                                <input
                                  type="text"
                                  name="coupon"
                                  value={this.state.coupon}
                                  readOnly={
                                    this.state.couponStatus == true
                                      ? true
                                      : false
                                  }
                                  style={{
                                    borderColor:
                                      this.state.couponStatus == 2
                                        ? "lightGrey"
                                        : this.state.couponStatus == true ||
                                          this.state.couponStatus == "true"
                                        ? "green"
                                        : "red",
                                  }}
                                  onChange={(val) => this._handleForm(val)}
                                  placeholder="Add a Coupon Code"
                                />
                                <span
                                  className="err err_couponecodevalidation"
                                  style={{ textTransform: "none" }}
                                ></span>
                                <div>
                                  {this.state.couponStatus == 2 ? (
                                    <span></span>
                                  ) : this.state.couponStatus == true ||
                                    this.state.couponStatus == "true" ? (
                                    <span style={{ color: "#0abe0a" }}>
                                      Coupon Applied
                                    </span>
                                  ) : (
                                    <span>Coupon Doesn’t Exist</span>
                                  )}
                                </div>
                              </div>
                            )}
                            {this.state.couponStatus == true ||
                            this.state.couponStatus == "true" ? (
                              <button
                                className="apply-btn blank-btn"
                                onClick={(val) => this.removebutton(val)}
                              >
                                <span className="button-text">Remove</span>
                                <span className="button-overlay"></span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="submit blank-btn"
                                onClick={(val) => this.applyCouponApi(val)}
                              >
                                <span className="button-text">Apply</span>
                                <span className="button-overlay"></span>
                              </button>
                              //   <button
                              //     className="apply-btn"
                              //     onClick={(val) => this.applyCouponApi(val)}
                              //   >
                              //     Apply
                              //   </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="redeem_loyalty_container">
                        <input
                          type="checkbox"
                          name="loyaltyPoint"
                          className="redeem_loyalty_input"
                          checked={!!this.state.loyaltyPointApplied}
                          onChange={() => {
                            this.setState({
                              loyaltyPointApplied:
                                !this.state.loyaltyPointApplied,
                            });

                            setTimeout(() => {
                              localStorage.setItem(
                                "loyaltyApplied",
                                JSON.stringify(this.state.loyaltyPointApplied)
                              );
                              // this.calculate_summry1(this.state.cart_data);
                              this.calculate_summry1(this.state.cart_data);
                            }, 50);
                          }}
                        />
                        <label htmlFor="loyaltyPoint">
                          Redeemable Krishi Seeds available -{" "}
                          {this.state.totalSeedRedeem &&
                            this.state.seedValue &&
                            this.truncateToDecimals(
                              +this.state.totalSeedRedeem /
                                +this.state.seedValue
                            )}{" "}
                          (₹
                          {this.state.totalSeedRedeem})
                        </label>
                      </div>

                      <div className="cart-summary">
                        <h2>Summary</h2>
                        <table className="summarytable">
                          <tbody>
                            <tr>
                              <td>Sub-total</td>
                              <td>₹ {this.state.subTotalWithoutGST}</td>
                            </tr>
                            {this.state.couponStatus ? (
                              <tr>
                                <td>Discount</td>
                                <td>
                                  {this.state.discount_amount ||
                                  this.state.discount_amount != null ||
                                  this.state.discount_amount != undefined ||
                                  this.state.discount_amount != ""
                                    ? "₹" + this.state.discount_amount
                                    : "--"}
                                </td>
                              </tr>
                            ) : (
                              ""
                            )}

                            {/* <tr>
                              <td>Sub-total (Including GST)</td>
                              <td>₹ {this.state.subTotal_price}</td>
                            </tr> */}
                            {/* <tr>
                              <td>GST</td>
                              <td>₹ {this.state.gst_price}</td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                Cart Total <small>(including GST)</small>
                              </td>
                              <td>₹ {this.state.total_price}</td>
                            </tr> */}
                            {this.state.referralEligible &&
                            this.state.referral_discount ? (
                              <tr>
                                <td>Referral Discount</td>
                                <td>₹{this.state.referral_discount}</td>
                              </tr>
                            ) : (
                              ""
                            )}
                            {this.state.loyaltyPointApplied &&
                            this.state.totalSeedRedeem > 0 ? (
                              <tr>
                                <td>Redeem Points Discount</td>
                                <td>₹{this.state.totalSeedRedeem}</td>
                              </tr>
                            ) : (
                              ""
                            )}
                            <tr>
                              <td>GST</td>
                              <td>₹ {this.state.gst_price}</td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <td>Total</td>
                              <td>₹{totalAfterDiscount.toFixed()}</td>
                            </tr>
                          </tfoot>
                        </table>
                        {this.props.dataInCart && this.props.dataInCart[0] ? (
                          <div className="checout-btn">
                            {/* <Link to={{ pathname: 'checkout', data: this.state.cart_data }} > */}
                            {!this.state.loading ? (
                              this.state.allDataLoaded ? (
                                +this.state.subTotal_price <
                                +this.state.minimumOrderValue ? (
                                  <button
                                    type="button"
                                    className="submit fill-btn"
                                    style={{ cursor: "no-drop" }}
                                  >
                                    <span className="button-text">
                                      Checkout
                                    </span>

                                    <span className="button-overlay"></span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="submit fill-btn"
                                    onClick={() => this._handleCheckoutClick()}
                                  >
                                    <span className="button-text">
                                      Checkout
                                    </span>
                                    <span className="button-overlay"></span>
                                  </button>
                                )
                              ) : (
                                <button
                                  type="button"
                                  className="submit fill-btn"
                                  style={{ background: "white" }}
                                >
                                  <span
                                    className="button-text"
                                    style={{ color: "#fff" }}
                                  >
                                    <i
                                      className="fa fa-spinner searchLoading"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                  <span className="button-overlay"></span>
                                </button>
                              )
                            ) : (
                              <button
                                type="button"
                                className="submit fill-btn"
                                style={{ background: "white" }}
                              >
                                <span
                                  className="button-text"
                                  style={{ color: "#fff" }}
                                >
                                  <i
                                    className="fa fa-spinner searchLoading"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                                <span className="button-overlay"></span>
                              </button>
                            )}

                            {/* <button
                            onClick={() => this._handleCheckoutClick()}
                            type="text"
                          >
                            Checkout
                          </button> */}
                            {/* </Link> */}
                          </div>
                        ) : (
                          ""
                        )}
                        <p
                          className="quantity-error-cart mt-3"
                          style={{ color: "red" }}
                        ></p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </main>
        ) : (
          <main className="page-content latest_page_degs">
            <div className="banner_bk_imag login-bk-image">
              <section className="center-form-single-col">
                <div className="responsive_lgin">
                  <h3>Login/Sign up</h3>
                  <form>
                    <>
                      <div className="form-group">
                        <label>Mobile Number</label>

                        <input
                          type="text"
                          name="contact"
                          onChange={(val) => this._handleFormmobile(val)}
                          className="count"
                          placeholder="Contact Number"
                          readOnly={
                            this.state.readonlytrue == true ? true : false
                          }
                        />
                      </div>
                      {/* {this.state.emailOnSignup ? (
                        <div className="form-group">
                          <label>Email</label>

                          <input
                            type="text"
                            name="email"
                            onChange={(val) => this._handleForm(val)}
                            className="count"
                            placeholder="Email"
                          />
                        </div>
                      ) : (
                        ""
                      )} */}

                      {this.state.buttonstatus == true ? (
                        <>
                          <div className="form-bottom">
                            <button
                              type="button"
                              className="button-design"
                              onClick={(ev) => this.verify(ev)}
                            >
                              <span className="button-text">Proceed</span>
                              <span className="button-overlay"></span>
                            </button>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {/* {this.state.verifymobilestatus == "fullytrue" ? (
                        <span className="check-edit">
                          <i
                            className="fa fa-check-square-o"
                            aria-hidden="true"
                          ></i>
                        </span>
                      ) : (
                        ""
                      )} */}
                    </>

                    {this.state.verifymobilestatus == "semitrue" ? (
                      <>
                        <span className="check-name">
                          Enter OTP - {this.state.otttpp}
                        </span>
                        <span className="check-mail modal-right-bx otp_design">
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            maxLength="6"
                            className="count"
                            onChange={(event) => this.onotpchange(event)}
                          ></input>
                        </span>
                        <span
                          className="resend_otp"
                          onClick={(ev) => this.verifyagain(ev)}
                        >
                          Resend OTP
                          <i className="fa fa-undo" aria-hidden="true"></i>
                        </span>
                      </>
                    ) : (
                      ""
                    )}

                    {this.state.verifymobilestatus == "fullytrue" ? (
                      <>
                        <span className="check-name">Name</span>
                        <span className="check-mail modal-right-bx">
                          <input
                            type="text"
                            name="name"
                            onChange={(val) => this._handleForm(val)}
                            className="count"
                            placeholder="Name"
                            readOnly={
                              this.state.showOtpForSignup == true ? true : false
                            }
                          />
                        </span>
                        <span
                          style={{ color: "red" }}
                          className="err_name"
                        ></span>
                      </>
                    ) : (
                      ""
                    )}

                    {this.state.verifymobilestatus == "fullytrue" ? (
                      <>
                        <span className="check-name">Email</span>
                        <span className="check-mail modal-right-bx">
                          <input
                            type="text"
                            name="email"
                            onChange={(val) => this._handleForm(val)}
                            className="count"
                            placeholder="Email"
                            readOnly={
                              this.state.showOtpForSignup == true ? true : false
                            }
                          />
                        </span>
                        <span
                          style={{ color: "red" }}
                          className="err_email"
                        ></span>
                      </>
                    ) : (
                      ""
                    )}

                    {!this.state.incompleteLogin &&
                    this.state.verifymobilestatus == "fullytrue" ? (
                      this.state.showOtpForSignup ? (
                        !this.state.signupCompleted && (
                          <>
                            <span className="check-name">
                              Enter OTP- {this.state.otttpp}
                            </span>
                            <span className="check-mail modal-right-bx otp_design">
                              <input
                                type="text"
                                placeholder="Enter OTP"
                                maxLength="6"
                                className="count"
                                onChange={(event) =>
                                  this.onsignupotpchange(event)
                                }
                              ></input>
                            </span>
                            <span
                              className="resend_otp"
                              onClick={(ev) => this.verifyagain(ev)}
                            >
                              Resend OTP
                              <i className="fa fa-undo" aria-hidden="true"></i>
                            </span>
                          </>
                        )
                      ) : (
                        <button
                          type="button"
                          className="button-design"
                          onClick={(ev) => this.verifySignup(ev)}
                        >
                          Send OTP
                        </button>
                      )
                    ) : (
                      ""
                    )}

                    {this.state.verifymobilestatus == "fullytrue" ? (
                      this.state.signupCompleted ? (
                        <button
                          type="button"
                          className="button-design"
                          onClick={(ev) => this.forward(ev)}
                        >
                          Save and Continue
                        </button>
                      ) : this.state.incompleteLogin ? (
                        <button
                          type="button"
                          className="button-design"
                          onClick={(ev) => this.forward(ev)}
                        >
                          Save and Continue
                        </button>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </form>
                  <div className="form-group">
                    {/* <p>A OTP will be sent to your number.</p> */}
                    <p>
                      {" "}
                      Your personal data will be used to support your experience
                      throughout this website to manage access to your account,
                      and for other purposes described in our{" "}
                      <Link to="/Privacy-Policy">Privacy Policy.</Link>
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </main>
        )}
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
  checkout: (data) => dispatch(checkout(data)),
  userdetails: (data) => dispatch(userdetails(data)),
  addToCart: (data) => dispatch(addToCart(data)),
});

export default connect(mapStateToProps, dispatchStateToProps)(Cart);
