import moment from "moment-timezone";
import React from "react";
// import ReactPixel from "react-facebook-pixel";
import Geocode from "react-geocode";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/yellow.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "react-times/css/classic/default.css";
import "react-times/css/material/default.css";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import banner from "../../assets/img/my-account-banner.jpg";
import Add_address from "../../components/Address/Add_address";
import Edit_address from "../../components/Address/Edit_address";
import { imageUrl } from "../../components/imgUrl";
import { DynamicUrl } from "../../dynamicurl";
import {
  addToCart,
  changeDelivery,
  changethankyouAuth,
  checkout,
  userdetails,
} from "../../redux/actions/actions";
import Gifting from "./Gifting";
import krishiLogo from "./krishilogo.jpeg";
import UserProfile from "./UserProfile";
const google = window.google;
const fbq = window.fbq;
const GOOGLE_API_KEY = "AIzaSyCazDplf1HtSAyvjhY40uqUaTBuSYoVyGE";
Geocode.setApiKey(GOOGLE_API_KEY);
Geocode.setRegion("in");
var RAZORPAY_KEY = "";

// const advancedMatching = {}; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
// const options = {
//   autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
//   debug: false, // enable logs
// };
// ReactPixel.init("2724112684489260", advancedMatching, options);
// ReactPixel.pageView();

class Checkout extends React.Component {
  constructor(props) {
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
    const localRegionDetails = JSON.parse(
      localStorage.getItem("regionDetails")
    );
    this.state = {
      giftingOnOff: false,
      giftingFormCompleted: true,
      samDayDeliveryProductStatus: {
        status: true,
        products: [],
      },
      farmPickupProductStatus: {
        status: true,
        products: [],
      },
      cart_data: localStorage.getItem("cartItem")
        ? JSON.parse(localStorage.getItem("cartItem"))
        : [],
      productData: [],
      deliveryCharge: this.props.deliveryInfo.Delivery_Charges
        ? this.props.deliveryInfo.Delivery_Charges
        : 0,
      codCharges:
        this.props.deliveryInfo.COD === "yes"
          ? this.props.deliveryInfo.COD_Charges
          : 0,
      codAvailable: false,
      minimumOrderValue:
        this.props.deliveryInfo.MOQ === "yes"
          ? +this.props.deliveryInfo.MOQ_Charges || 0
          : 0,
      deliverySlotInfo: this.props.deliveryInfo,
      deliveryslot: "",
      deliverySlotSlug: "",
      Free_Shipping: false,
      payStatus: true,
      cashStatus: false,
      visaStatus: false,
      name: "",
      showPincodeInput: true,
      email: "",
      contact: this.props.user_details.contactNumber
        ? this.props.user_details.contactNumber
        : "",
      discount_percentage: 0,
      discount_amount: localStorage.getItem("discount_amount")
        ? JSON.parse(localStorage.getItem("discount_amount"))
        : 0,
      subscribe_status: localStorage.getItem("status")
        ? JSON.parse(localStorage.getItem("status"))
        : false,
      total_price: 0,
      total_after_discount: 0,
      verifymobilestatus: "false",
      final_total_price: 0,
      firstTimeLoadAddress: true,
      delivery_instructions: "",
      buttonstatus: true,
      compopupstatus: statat,
      genotp: "",
      address: "",
      subscriptionLoyaltyPoints: 0,
      all_address: [],
      user_id: "",
      location_tag: "",
      street_address: "",
      selectdates: [],
      city: "",
      selectedFullAddress: "",
      state: "",
      locality: "",
      referralEligible: false,
      referralPercent: 0,
      maxLoyaltyPointToRedeem: 0,
      loyaltyPointApplied: localStorage.getItem("loyaltyApplied")
        ? JSON.parse(localStorage.getItem("loyaltyApplied"))
        : false,
      referral_discount: 0,
      loyalty_point_input: null,
      seedValue: 0,
      totalSeedRedeem: 0,
      pincode: "",
      country: "",
      selectedaddress: "",
      date: new Date(),
      noDeliverySlots: true,
      selectedtime: "10:00",
      readonlytrue: false,
      loading: false,
      insideHaryana: false, //storing boolean if user is inside haryana or not
      showTaxFields: false,
      allGstLists: [],
      showGstDropdown: false,
      giftingContent: {},
      customerProfileModal: false,
      itemWiseData: [],
      creditPaymentOnOff: false,
      paytmShow: false,
      razorpayShow: false,
    };
    this.onchangeinng = this.onchangeinng.bind(this);
  }

  getCartData = () => {
    let dtaa = {};
    ApiRequest(dtaa, "/get/addtocart/" + this.props.user_details._id, "GET")
      .then((res) => {
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
            }).then(() => this.props.history.push("/cart"));
          }
          localStorage.setItem("status", Boolean(res.data.data.subscribe));
          let newModifiedCart = [];

          this.state.cart_data.forEach((localcart) => {
            res.data.data.cartDetail.forEach((apicart) => {
              const localSlug = localcart._id + localcart.packet_size;
              const cartSlug =
                apicart.product_id._id + apicart.simpleItem.packet_size;
              if (localSlug === cartSlug) {
                if (apicart.product_id.preOrder) {
                  localStorage.setItem("status", true);
                  this.setState({ subscribe_status: true });
                }
                let newItem = {
                  itemDiscountAmount: localcart.itemDiscountAmount,
                  itemDiscountPercentage: localcart.itemDiscountPercentage,
                  preOrder: apicart.product_id.preOrder,
                  totalprice: apicart.totalprice,
                  price: apicart.price,
                  preOrderStartDate: apicart.product_id.preOrderStartDate,
                  preOrderEndDate: apicart.product_id.preOrderEndDate,
                  sameDayDelivery: apicart.product_id.sameDayDelivery,
                  farmPickup: apicart.product_id.farmPickup,
                };
                newModifiedCart.push(Object.assign(localcart, newItem));
              }
            });
          });
          let samDayDeliveryProductStatus = {
            status: true,
            products: [],
          };
          let farmPickupProductStatus = {
            status: true,
            products: [],
          };
          newModifiedCart.forEach((a) => {
            if (!a.farmPickup) {
              farmPickupProductStatus.status = false;
              farmPickupProductStatus.products.push(a.product_name);
            }
            if (!a.sameDayDelivery) {
              samDayDeliveryProductStatus.status = false;
              samDayDeliveryProductStatus.products.push(a.product_name);
            }
          });
          this.setState({
            samDayDeliveryProductStatus: samDayDeliveryProductStatus,
            farmPickupProductStatus: farmPickupProductStatus,
          });
          var fresh_data = newModifiedCart;

          setTimeout(() => {
            this.setState({
              cart_data: fresh_data,
            });
            this.props.addToCart(fresh_data);
            localStorage.setItem("cartItem", JSON.stringify(fresh_data));
            setTimeout(() => {
              this.calculate_summry("", fresh_data);
            }, 0);
          }, 0);
        }
      })
      .catch(() => {});
  };

  selectdates = (date) => {
    let a = [];
    for (let i = 0; i < date.length; i++) {
      let d = new Date(date[i].format("MM/DD/YYYY"));

      a.push({ date: moment(d).format("YYYY-MM-DD") });
    }
    this.setState({
      selectdates: a,
    });

    setTimeout(() => {
      this.calculate_summry("subscriptionDates");
    }, 100);
  };

  _handleProduct(val) {
    localStorage.setItem("data", JSON.stringify(val));
    window.location = "/product";
  }

  onange(data) {
    this.setState({
      date: data,
    });
  }

  onTimeChange(event) {
    this.setState({
      selectedtime: event.hour + ":" + event.minute,
      time: event.hour + ":" + event.minute,
    });
  }

  onSuccess = (location, selectedData) => {
    this.setState({
      street_address: selectedData.description,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      country: selectedData.terms[selectedData.terms.length - 1].value,
      state: selectedData.terms[selectedData.terms.length - 2].value,
      city: selectedData.terms[selectedData.terms.length - 3].value,
      pincode: "",
    });
  };

  changePlaces = (e) => {
    this.setState({
      loading: false,
      searchKey: "",
    });
    let block, area, city, state, country, pincode;
    if (e && e.address_components && Array.isArray(e.address_components)) {
      e.address_components.map((item) => {
        let val = item.types.join();
        if (val.includes("sublocality_level_3")) {
          block = item.long_name;
        } else if (val.includes("sublocality_level_2")) {
          area = item.long_name;
        } else if (val.includes("locality")) {
          city = item.long_name;
        } else if (val.includes("administrative_area_level_1")) {
          state = item.long_name;
        } else if (val.includes("country")) {
          country = item.long_name;
        } else if (val.includes("postal_code")) {
          pincode = item.long_name;
        }
      });
    }
    this.setState({
      street_address: e.formatted_address,
      latitude: e.geometry.location.lat(),
      longitude: e.geometry.location.lng(),
      pincode: pincode ? pincode : "",
      country: country ? country : "",
      state: state ? state : "",
      city: city ? city : "",
    });
    if (!pincode) {
      this.setState({ showPincodeInput: true });
    } else {
      this.setState({ showPincodeInput: false });
    }
  };

  changePlaces_edit = (e) => {
    this.setState({
      loading: false,
      searchKey: "",
    });
    let block, area, city, state, country, pincode;
    if (e && e.address_components && Array.isArray(e.address_components)) {
      e.address_components.map((item) => {
        let val = item.types.join();
        if (val.includes("sublocality_level_3")) {
          block = item.long_name;
        } else if (val.includes("sublocality_level_2")) {
          area = item.long_name;
        } else if (val.includes("locality")) {
          city = item.long_name;
        } else if (val.includes("administrative_area_level_1")) {
          state = item.long_name;
        } else if (val.includes("country")) {
          country = item.long_name;
        } else if (val.includes("postal_code")) {
          pincode = item.long_name;
        }
      });
    }
    this.setState({
      street_address: e.formatted_address,
      latitude: e.geometry.location.lat(),
      longitude: e.geometry.location.lng(),
      editpincode: pincode ? pincode : "",
      country: country ? country : "",
      state: state ? state : "",
      city: city ? city : "",
    });
    if (!pincode) {
      this.setState({ showPincodeInput: true });
    } else {
      this.setState({ showPincodeInput: false });
    }
  };

  onFocusChange(focusStatue) {
    // do something
  }

  plus = async (quantity, ide) => {
    this.setState({ [ide]: quantity + 1 });
    var productSelected = {
      product_id: await ide,
      quantity: (await quantity) + 1,
    };
    this._handleQuantityChange(productSelected);
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  formHandler(val) {
    var name = val.target.name;
    var value = val.target.value;
    this.setState({ [name]: value });
  }

  closeModal = () => {
    this.usersaddress("closePopup");
    this.setState({
      modalIsOpen: false,
      modalIsOpenedit: false,
      street_address: "",
      latitude: "",
      longitude: "",
      editstreet: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      showPincodeInput: true,
    });
  };

  openeditModal(ev) {
    this.setState({
      selectedEditAddress: ev,
      editcity: ev.city,
      editcountry: ev.country,
      editcreated_at: ev.created_at,
      edithouseNo: ev.houseNo,
      editlocattion_tag: ev.locationTag,
      editpincode: ev.pincode,
      editstate: ev.state,
      editstreet: ev.street,
      edituser_id: ev._id,
      locality: ev.locality,
      latitude: ev.latitude,
      longitude: ev.longitude,
      showPincodeInput: false,
    });
    this.setState({ modalIsOpenedit: true, showPincodeInput: true });
  }

  update = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (this.state.editlocattion_tag === "") {
      valueErr = document.getElementsByClassName("err_location_tag");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.edithouseNo === "") {
      valueErr = document.getElementsByClassName("err_edithouseNo");
      valueErr[0].innerText = "Field is Required";
    }
    if (!this.state.editstreet && !this.state.street_address) {
      valueErr = document.getElementsByClassName("err_editstreet");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.editpincode === "") {
      valueErr = document.getElementsByClassName("err_editpincode");
      valueErr[0].innerText = "Field is Required";
    } else if (this.state.editpincode.length !== 6) {
      valueErr = document.getElementsByClassName("err_editpincode");
      valueErr[0].innerText = "Incorrect Pincode";
    }
    if (
      this.state.edithouseNo &&
      this.state.editstreet &&
      this.state.editpincode.length === 6 &&
      this.state.editpincode &&
      this.state.editlocattion_tag
    ) {
      const requestData = {
        _id: this.state.edituser_id ? this.state.edituser_id : "",
        locationTag: this.state.editlocattion_tag
          ? this.state.editlocattion_tag
          : "",
        houseNo: this.state.edithouseNo ? this.state.edithouseNo : "",
        street: this.state.street_address
          ? this.state.street_address
          : this.state.editstreet,
        city: this.state.editcity ? this.state.editcity : "",
        locality: this.state.locality ? this.state.locality : "",
        state: this.state.editstate ? this.state.editstate : "",
        country: this.state.editcountry ? this.state.editcountry : "",
        pincode: this.state.editpincode ? this.state.editpincode : "",
        latitude: this.state.latitude || "",
        longitude: this.state.longitude || "",
      };
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      ApiRequest(requestData, "/updateUserAddress", "POST", token)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.usersaddress();
            this.getDeliverySlot(this.state.editpincode);
            this.setState({
              verifymobilestatus: "fullytrue",
              buttonstatus: false,
              modalIsOpenedit: false,
              street_address: "",
              latitude: "",
              longitude: "",
              editstreet: "",
              country: "",
              state: "",
              city: "",
              pincode: "",
            });
            swal({
              title: "Address Updated",
              icon: "success",
              dangerMode: false,
            });
          } else if (res.status === 503) {
          } else {
            swal({
              title: "Network Error",
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

  getCurrentPosition = async (e) => {
    e.preventDefault();
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        this.getPositionFromLatLon(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (err) => console.log(err)
    );
  };

  getPositionFromLatLon = (latitude, longitude) => {
    Geocode.fromLatLng(latitude, longitude).then(
      (response) => {
        const address = response.results[0].formatted_address;
        const pincode =
          response.results[0].address_components[
            response.results[0].address_components.length - 1
          ].short_name;
        let city, state, country;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }
        this.setState({
          city: city,
          state: state,
          country: country,
          street_address: address,
          pincode: pincode,
          editpincode: pincode,
        });
        if (!pincode) {
          this.setState({ showPincodeInput: true });
        } else {
          this.setState({ showPincodeInput: false });
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };

  onchangeinngGifting(ev) {
    let pin = ev.pincode ? ev.pincode.toString() : "";
    if (
      ev.city &&
      ev.country &&
      ev.state &&
      ev.street &&
      ev.pincode &&
      pin.length === 6
    ) {
      const state = ev.state.toLowerCase();
      const city = ev.city.toLowerCase();
      if (state.includes("delhi") || city.includes("delhi")) {
        this.setState({
          insideHaryana: true,
        });
      } else {
        this.setState({
          insideHaryana: false,
        });
      }
      this.setState({
        giftingContent: {
          ...this.state.giftingContent,
          address: {
            address:
              ev.houseNo +
              ", " +
              (ev.street || "") +
              (ev.city
                ? ev.street.includes(ev.city)
                  ? ""
                  : ", " + ev.city + " "
                : "") +
              (ev.state
                ? ev.street.includes(ev.state)
                  ? ""
                  : ev.state + " "
                : "") +
              (ev.country
                ? ev.street.includes(ev.country)
                  ? ""
                  : ev.country + " "
                : "") +
              (ev.pincode
                ? ev.street.includes(ev.pincode)
                  ? ""
                  : ev.pincode
                : "") +
              ", " +
              (ev.locality ? ev.locality : ""),
            city: ev.city,
            country: ev.country,
            houseNo: ev.houseNo,
            latitude: ev.latitude,
            locality: ev.locality,
            locationTag: ev.locationTag,
            longitude: ev.longitude,
            pincode: ev.pincode,
            state: ev.state,
          },
        },
        selectedgiftingaddress: ev,
        // selectedGiftingFullAddress:
        //   ev.houseNo +
        //   " ," +
        //   (ev.street || "") +
        //   " ," +
        //   (ev.city || "") +
        //   " " +
        //   (ev.state || "") +
        //   " " +
        //   (ev.country ? ev.country : "") +
        //   " " +
        //   (ev.pincode ? ev.pincode : "") +
        //   " ," +
        //   (ev.locality ? ev.locality : ""),
        showTaxFields: true,
      });
      setTimeout(() => {
        this.calculate_summry();
      }, 0);
      // let valueErr = document.getElementsByClassName("err_deliveryslot");
      // valueErr[0].innerText = "";
      // setTimeout(() => this.getDeliverySlot(ev.pincode), 50);
    } else {
      this.setState({
        selectedaddress: "",
        selectedFullAddress: "",
        deliveryslot: "",
        deliveryCharge: "",
        deliverySlotSlug: "",
        deliverySlotInfo: "",
      });
      swal({
        title: "Error",
        text: "Please update this address or add a new one to proceed.",
        icon: "warning",
      });
      document.getElementById("giftingaddress" + ev._id).checked = false;
    }
  }

  onchangeinng(ev, data, index) {
    let pin = ev.pincode ? ev.pincode.toString() : "";
    const previousAddress = this.state.selectedaddress;
    if (
      ev.city &&
      ev.country &&
      ev.state &&
      ev.street &&
      ev.pincode &&
      pin.length === 6
    ) {
      const state = ev.state.toLowerCase();
      const city = ev.city.toLowerCase();
      if (!this.state.giftingContent.status) {
        if (state.includes("delhi") || city.includes("delhi")) {
          this.setState({
            insideHaryana: true,
          });
        } else {
          this.setState({
            insideHaryana: false,
          });
        }
      }

      this.setState({
        selectedaddress: ev,
        selectedFullAddress:
          ev.houseNo +
          ", " +
          (ev.street || "") +
          (ev.city
            ? ev.street.includes(ev.city)
              ? ""
              : ", " + ev.city + " "
            : "") +
          (ev.state
            ? ev.street.includes(ev.state)
              ? ""
              : ev.state + " "
            : "") +
          (ev.country
            ? ev.street.includes(ev.country)
              ? ""
              : ev.country + " "
            : "") +
          (ev.pincode
            ? ev.street.includes(ev.pincode)
              ? ""
              : ev.pincode
            : "") +
          ", " +
          (ev.locality ? ev.locality : ""),
        showTaxFields: true,
        // giftingStatus: false,
      });
      let valueErr = document.getElementsByClassName("err_deliveryslot");
      valueErr[0].innerText = "";
      setTimeout(
        () => this.getDeliverySlot(ev.pincode, ev._id, previousAddress),
        50
      );
    } else {
      this.setState({
        selectedaddress: "",
        selectedFullAddress: "",
        deliveryslot: "",
        deliveryCharge: "",
        deliverySlotSlug: "",
        deliverySlotInfo: "",
      });
      swal({
        title: "Error",
        text: "Please update this address or add a new one to proceed.",
        icon: "warning",
      });
      document.getElementById("address" + ev._id).checked = false;
    }
  }

  getDeliverySlot(pincode, addressId, previousAddressId) {
    const freshrequestdata = { pincode: pincode };
    ApiRequest(freshrequestdata, "/pincode/one", "POST")
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          console.log(res.data.data.Region_ID._id);
          console.log(JSON.parse(localStorage.getItem("selectedRegionId")));
          if (
            res.data.data.Region_ID._id !==
            JSON.parse(localStorage.getItem("selectedRegionId"))
          ) {
            swal({
              title: "Changing Region?",
              text: "Your cart will get empty as you are changing region.",
              icon: "warning",
              dangerMode: true,
              buttons: {
                confirm: {
                  text: "Go ahead",
                  value: true,
                  visible: true,
                  className: "",
                  closeModal: true,
                },
                cancel: {
                  text: "Cancel",
                  value: false,
                  visible: true,
                  className: "back-swal-btn",
                  closeModal: true,
                },
              },
            }).then((status) => {
              if (status) {
                if (
                  res.data.data.Free_Shipping === "yes" &&
                  +this.state.subTotal_price >=
                    +res.data.data.Free_Shipping_amount
                ) {
                  this.setState({ Free_Shipping: true });
                }
                this.props.changeDelivery(res.data.data);
                localStorage.setItem(
                  "selectedRegionId",
                  JSON.stringify(res.data.data.Region_ID._id)
                );
                localStorage.setItem(
                  "selectedRegionName",
                  JSON.stringify(res.data.data.Region_ID.name)
                );
                localStorage.setItem(
                  "regionDetails",
                  JSON.stringify({
                    districtName: res.data.data.Region_ID.name,
                    regionName: res.data.data.Region_ID.name,
                    stateId: res.data.data.Region_ID._id.toString(""),
                    stateName: res.data.data.Region_ID.name,
                    pincode: pincode,
                    _id: res.data.data.Region_ID._id.toString(""),
                  })
                );
                this.setState({
                  deliverySlotInfo: res.data.data,
                  codCharges:
                    res.data.data.COD === "yes"
                      ? +res.data.data.COD_Charges
                      : 0,
                  codAvailable: res.data.data.COD !== "yes" ? false : true,
                  minimumOrderValue:
                    res.data.data.MOQ === "yes"
                      ? +res.data.data.MOQ_Charges || 0
                      : 0,
                });
                let noDeliverySlots = false;
                const preOrderStatus = this.state.cart_data.find(
                  (item) => item.preOrder == true
                );

                if (localStorage.getItem("status") === "true") {
                  if (res.data.data.Same_day_delivery_till_2pm === "yes") {
                    document.getElementById("slot0").checked = true;
                    this.changeDeliverySlot(
                      "Same_day_delivery_till_2pm",
                      "subscription"
                    );
                  } else if (res.data.data.Standard_delivery === "yes") {
                    document.getElementById("slot5").checked = true;
                    this.changeDeliverySlot(
                      "Standard_delivery",
                      "subscription"
                    );
                  } else {
                    this.setState({
                      deliveryslot: "",
                    });
                    swal({
                      title: "Error",
                      text: "We are currently not delivering in your area.",
                      icon: "warning",
                      dangerMode: true,
                    });
                    noDeliverySlots = true;
                  }
                }
                if (
                  res.data.data.Same_day_delivery_till_2pm !== "yes" &&
                  res.data.data.Next_day_delivery_Standard_9am_9pm !== "yes" &&
                  res.data.data.Next_day_delivery_2pm_8pm !== "yes" &&
                  res.data.data.Next_day_delivery_8am_2pm !== "yes" &&
                  res.data.data.Free_Shipping !== "yes" &&
                  res.data.data.Farm_pick_up !== "yes" &&
                  res.data.data.Standard_delivery !== "yes" &&
                  (preOrderStatus || localStorage.getItem("status") === "true")
                ) {
                  swal({
                    title: "Error",
                    text: "We are currently not delivering in your area.",
                    icon: "warning",
                    dangerMode: true,
                  });
                  noDeliverySlots = true;
                }
                setTimeout(() => {
                  this.setState({ noDeliverySlots: noDeliverySlots });
                  if (localStorage.getItem("status") !== "true") {
                    this.calculate_summry();
                  }
                }, 0);
                this.props.addToCart([]);
                localStorage.setItem("cartItem", []);
                const requestData = {
                  user_id: this.props.user_details._id,
                  CartDetail: [],
                  regionID: localStorage.getItem("selectedRegionId")
                    ? JSON.parse(localStorage.getItem("selectedRegionId"))
                    : "",
                  totalCartPrice: 0,
                  subscribe: localStorage.getItem("status")
                    ? JSON.parse(localStorage.getItem("status"))
                    : false,
                };
                ApiRequest(requestData, "/addtocart", "POST")
                  .then((res) => {
                    this.props.history.push("/");
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                if (addressId) {
                  document.getElementById(
                    "address" + addressId
                  ).checked = false;
                }
                setTimeout(() => {
                  if (previousAddressId._id) {
                    const state = previousAddressId.state.toLowerCase();
                    const city = previousAddressId.city.toLowerCase();
                    if (state.includes("delhi") || city.includes("delhi")) {
                      this.setState({
                        insideHaryana: true,
                      });
                    } else {
                      this.setState({
                        insideHaryana: false,
                      });
                    }

                    this.setState({
                      selectedaddress: previousAddressId,
                      selectedFullAddress:
                        previousAddressId.houseNo +
                        ", " +
                        (previousAddressId.street || "") +
                        (previousAddressId.city
                          ? previousAddressId.street.includes(
                              previousAddressId.city
                            )
                            ? ""
                            : ", " + previousAddressId.city + " "
                          : "") +
                        (previousAddressId.state
                          ? previousAddressId.street.includes(
                              previousAddressId.state
                            )
                            ? ""
                            : previousAddressId.state + " "
                          : "") +
                        (previousAddressId.country
                          ? previousAddressId.street.includes(
                              previousAddressId.country
                            )
                            ? ""
                            : previousAddressId.country + " "
                          : "") +
                        (previousAddressId.pincode
                          ? previousAddressId.street.includes(
                              previousAddressId.pincode
                            )
                            ? ""
                            : previousAddressId.pincode
                          : "") +
                        ", " +
                        (previousAddressId.locality
                          ? previousAddressId.locality
                          : ""),
                      showTaxFields: true,
                      // giftingStatus: false,
                    });
                    document.getElementById(
                      "address" + previousAddressId._id
                    ).checked = true;
                  }
                }, 0);
              }
            });
          } else {
            if (
              res.data.data.Free_Shipping === "yes" &&
              +this.state.subTotal_price >= +res.data.data.Free_Shipping_amount
            ) {
              this.setState({ Free_Shipping: true });
            }
            this.props.changeDelivery(res.data.data);
            localStorage.setItem(
              "selectedRegionId",
              JSON.stringify(res.data.data.Region_ID._id)
            );
            localStorage.setItem(
              "selectedRegionName",
              JSON.stringify(res.data.data.Region_ID.name)
            );
            localStorage.setItem(
              "regionDetails",
              JSON.stringify({
                districtName: res.data.data.Region_ID.name,
                regionName: res.data.data.Region_ID.name,
                stateId: res.data.data.Region_ID._id.toString(""),
                stateName: res.data.data.Region_ID.name,
                pincode: pincode,
                _id: res.data.data.Region_ID._id.toString(""),
              })
            );
            this.setState({
              deliverySlotInfo: res.data.data,
              codCharges:
                res.data.data.COD === "yes" ? +res.data.data.COD_Charges : 0,
              codAvailable: res.data.data.COD !== "yes" ? false : true,
              minimumOrderValue:
                res.data.data.MOQ === "yes"
                  ? +res.data.data.MOQ_Charges || 0
                  : 0,
            });
            let noDeliverySlots = false;
            const preOrderStatus = this.state.cart_data.find(
              (item) => item.preOrder == true
            );

            if (localStorage.getItem("status") === "true") {
              if (res.data.data.Same_day_delivery_till_2pm === "yes") {
                document.getElementById("slot0").checked = true;
                this.changeDeliverySlot(
                  "Same_day_delivery_till_2pm",
                  "subscription"
                );
              } else if (res.data.data.Standard_delivery === "yes") {
                document.getElementById("slot5").checked = true;
                this.changeDeliverySlot("Standard_delivery", "subscription");
              } else {
                this.setState({
                  deliveryslot: "",
                });
                swal({
                  title: "Error",
                  text: "We are currently not delivering in your area.",
                  icon: "warning",
                  dangerMode: true,
                });
                noDeliverySlots = true;
              }
            }
            if (
              res.data.data.Same_day_delivery_till_2pm !== "yes" &&
              res.data.data.Next_day_delivery_Standard_9am_9pm !== "yes" &&
              res.data.data.Next_day_delivery_2pm_8pm !== "yes" &&
              res.data.data.Next_day_delivery_8am_2pm !== "yes" &&
              res.data.data.Free_Shipping !== "yes" &&
              res.data.data.Farm_pick_up !== "yes" &&
              res.data.data.Standard_delivery !== "yes" &&
              (preOrderStatus || localStorage.getItem("status") === "true")
            ) {
              swal({
                title: "Error",
                text: "We are currently not delivering in your area.",
                icon: "warning",
                dangerMode: true,
              });
              noDeliverySlots = true;
            }
            setTimeout(() => {
              this.setState({ noDeliverySlots: noDeliverySlots });
              if (localStorage.getItem("status") !== "true") {
                this.calculate_summry();
              }
            }, 0);
          }
        } else if (res.status === 404) {
          this.setState({ noDeliverySlots: true });
          swal({
            title: "Error",
            text: res.data.data,
            icon: "warning",
            dangerMode: true,
          });
          this.setState({
            deliveryCharge: "",
            codCharges: "",
            deliverySlotInfo: {},
            deliveryslot: "",
            deliverySlotSlug: "",
          });
        } else {
          this.setState({ noDeliverySlots: true });
          this.setState({
            deliveryCharge: "",
            codCharges: "",
            deliverySlotInfo: {},
            deliveryslot: "",
            deliverySlotSlug: "",
          });
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

  changeDeliverySlot(e, callFrom) {
    let valueErr = document.getElementsByClassName("err_deliveryslot");
    valueErr[0].innerText = "";
    const selectedSlot = callFrom === "subscription" ? e : e.target.value;
    if (
      selectedSlot === "Same_day_delivery_till_2pm" &&
      !this.state.samDayDeliveryProductStatus.status
    ) {
      let products = this.state.samDayDeliveryProductStatus.products.filter(
        function (item, pos, self) {
          return self.indexOf(item) == pos;
        }
      );
      swal({
        title: "Error",
        text: `${products.join(
          ", "
        )} is not available for same day delivery. Please remove these from your cart to be able to avail same day delivery.`,
        icon: "warning",
      });
    } else if (
      selectedSlot === "Farm_pick_up" &&
      !this.state.farmPickupProductStatus.status
    ) {
      let products = this.state.farmPickupProductStatus.products.filter(
        function (item, pos, self) {
          return self.indexOf(item) == pos;
        }
      );
      swal({
        title: "Error",
        text: `${products.join(
          ", "
        )} is not available for farm pick up. Please remove these from your cart to be able to avail farm pick up option.`,
        icon: "warning",
      });
    } else {
      const deliveryInfo = this.state.deliverySlotInfo;
      let deliverySlug = "";
      let deliveryCharges = 0;
      if (selectedSlot === "Same_day_delivery_till_2pm") {
        deliveryCharges = deliveryInfo.Same_day_delivery_till_2pm_charges;
        deliverySlug = "Same Day Delivery";
      } else if (selectedSlot === "Next_day_delivery_Standard_9am_9pm") {
        deliveryCharges =
          deliveryInfo.Next_day_delivery_Standard_9am_9pm_charges;
        deliverySlug = "Next Day Standard Delivery (9am-9pm)";
      } else if (selectedSlot === "Next_day_delivery_2pm_8pm") {
        deliveryCharges = deliveryInfo.Next_day_delivery_2pm_8pm_charges;
        deliverySlug = "Next Day Delivery (2pm-8pm)";
      } else if (selectedSlot === "Next_day_delivery_8am_2pm") {
        deliveryCharges = deliveryInfo.Next_day_delivery_8am_2pm_charges;
        deliverySlug = "Next Day Delivery (8am-2pm)";
      } else if (selectedSlot === "Free_Shipping") {
        deliveryCharges = 0;
        deliverySlug = "Free Shipping";
      } else if (selectedSlot === "Farm_pick_up") {
        deliveryCharges = deliveryInfo.Farm_pick_up_delivery_charges;
        deliverySlug = "Farm Pickup";
      } else if (selectedSlot === "Standard_delivery") {
        deliveryCharges = deliveryInfo.Standard_delivery_charges;
        deliverySlug = "Standard Delivery";
      }

      this.setState({
        deliveryslot: selectedSlot,
        deliveryCharge: +deliveryCharges,
        deliverySlotSlug: deliverySlug,
      });

      setTimeout(() => {
        this.calculate_summry();
      }, 0);
    }
  }

  changeGiftingStatus() {
    this.setState({
      giftingStatus: false,
    });
    setTimeout(() => this.calculate_summry(), 50);
  }

  getGiftingContent(e) {
    this.setState({ giftingContent: e });
    // if (e.name) {
    //   if (e.address.state) {
    //     if (e.address.state.includes("haryana")) {
    //       this.setState({
    //         insideHaryana: true,
    //       });
    //     } else {
    //       this.setState({
    //         insideHaryana: false,
    //       });
    //     }
    //     this.setState({
    //       showTaxFields: true,
    //     });
    //     if (document.querySelector(".gifting_err") !== null) {
    //       document.querySelector(".gifting_err").innerHTML = "";
    //     }
    //   }
    //   else {
    //     if (document.querySelector(".gifting_err") !== null) {
    //       document.querySelector(".gifting_err").innerHTML =
    //         "Please select Proper Address for Gifting";
    //     }
    //   }
    // }

    setTimeout(() => this.calculate_summry(), 50);
  }

  saveing = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (this.state.location_tag === "") {
      valueErr = document.getElementsByClassName("err_add_location_tag");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.address === "") {
      valueErr = document.getElementsByClassName("err_add_houseNo");
      valueErr[0].innerText = "Field is Required";
    }
    if (!this.state.street_address) {
      valueErr = document.getElementsByClassName("err_add_fullAddress");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.pincode === "") {
      valueErr = document.getElementsByClassName("err_pincode");
      valueErr[0].innerText = "Field is Required";
    } else if (this.state.pincode.length !== 6) {
      valueErr = document.getElementsByClassName("err_pincode");
      valueErr[0].innerText = "Incorrect Pincode";
    }
    if (
      this.state.street_address &&
      this.state.location_tag &&
      this.state.address &&
      this.state.pincode &&
      this.state.pincode.length === 6
    ) {
      const requestData = {
        user_id: this.props.user_details._id ? this.props.user_details._id : "",
        locationTag: this.state.location_tag ? this.state.location_tag : "",
        houseNo: this.state.address ? this.state.address : "",
        street: this.state.street_address ? this.state.street_address : "",
        locality: this.state.locality ? this.state.locality : "",
        city: this.state.city ? this.state.city : "",
        state: this.state.state ? this.state.state : "",
        country: this.state.country ? this.state.country : "",
        pincode: this.state.pincode ? this.state.pincode : "",
        latitude: this.state.latitude ? this.state.latitude : "",
        longitude: this.state.longitude ? this.state.longitude : "",
      };
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      ApiRequest(requestData, "/addUserAddress", "POST", token)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              verifymobilestatus: "fullytrue",
              buttonstatus: false,
              modalIsOpen: false,
            });
            this.setState({
              location_tag: "",
              address: "",
              street_address: "",
              locality: "",
              city: "",
              state: "",
              country: "",
              pincode: "",
              latitude: "",
              longitude: "",
            });

            swal({
              title: "Address Saved",
              icon: "success",
              dangerMode: false,
            });
          } else if (res.status === 503) {
          } else {
            swal({
              title: "Network Error !",
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

  usersaddress(callFrom) {
    const requestData = {};
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/getUserAddress", "GET", token)
      .then((res) => {
        console.log("resresresres", res.status);
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_address: res.data.data,
          });
          if (callFrom !== "closePopup") {
            this.setState({
              deliverySlotInfo: {},
            });
          }

          setTimeout(() => {
            if (this.state.firstTimeLoadAddress && res.data.data.length > 0) {
              const addressList = res.data.data;
              const samePincodeAddress = addressList.filter((address, ix) => {
                return +address.pincode === +this.props.deliveryInfo.Pincode;
              });
              if (samePincodeAddress.length > 0) {
                this.setState({ firstTimeLoadAddress: false });
                this.onchangeinng(samePincodeAddress[0]);
                document.getElementById(
                  "address" + samePincodeAddress[0]._id
                ).checked = true;
              } else {
                this.setState({ firstTimeLoadAddress: false });
              }
            }
          }, 0);
        } else if (res.status === 503) {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    ApiRequest(requestData, "/usersGetOne", "GET", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            wallet_amount: res.data.data[0].walletAmount
              ? res.data.data[0].walletAmount
              : 0,
            creditPending: res.data.data[0].creditLimit
              ? res.data.data[0].creditLimit -
                (res.data.data[0].creditUsed || 0)
              : 0,
          });
        } else if (res.status === 503) {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async componentDidMount() {
    this.getCartData();
    await this.usersaddress();
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    await ApiRequest({}, "/payment/gateway/getAllActive", "GET", token)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          res.data.data.forEach((dt) => {
            if (dt.name === "Paytm") {
              this.setState({
                paytmShow: true,
              });
            }
            if (dt.name === "Razorpay") {
              this.setState({
                razorpayShow: true,
              });
              RAZORPAY_KEY = dt.keys.keyid;
            }
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    ApiRequest({}, "/storehey/getSetting", "GET")
      .then((res) => {
        if (res.status !== 401 || res.status !== 400) {
          this.setState({
            giftingOnOff: res.data.data[0].giftingOnOff,
            creditPaymentOnOff: res.data.data[0].creditPaymentOnline,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // this.onchangeinng.bind(this, this.state.all_address[0]);
    this.setState({ productData: await this.props.products.data });
    if (this.state.verifymobilestatus == "fullytrue") {
      this.setState({
        compopupstatus: false,
      });
    }

    // localStorage.setItem('discount_amount', 0)
    var aValue = localStorage.getItem("contact");
    if (aValue) {
      this.setState({
        compopupstatus: false,
        contact: aValue,
      });
    }
    this.setState({
      name: this.props.user_details.name,
      email: this.props.user_details.email,
      contact: this.props.user_details.contactNumber,
    });

    this.redeemReferralPoints();
    this.calculate_summry();
  }

  calculateDiscountPerItem = (newItemsArray) => {
    console.log("newItemsArraynewItemsArray", newItemsArray);
    console.log("cartdata", this.state.cart_data);
    let localProducts = newItemsArray || this.state.cart_data;
    let cart_data_dt = [];
    let localPrice = 0;
    let discount = localStorage.getItem("discount_amount");
    let discount_percentage = localStorage.getItem("discount_percentage");
    let discountLocation = JSON.parse(
      localStorage.getItem("discount_details")
    ).discountLocation;
    let discountProducts = JSON.parse(
      localStorage.getItem("discount_details")
    ).discountProducts;
    discount_percentage =
      discount_percentage /
      (this.state.selectdates.length === 0 ? 1 : this.state.selectdates.length);
    //getting single selected price
    localProducts.map((item, index) =>
      item.simpleData &&
      item.simpleData.length > 0 &&
      item.TypeOfProduct === "simple"
        ? item.simpleData[0].package
            .filter((dta) => dta.selected == true)
            .map((data, ind) => {
              localPrice = item.totalprice;
              cart_data_dt.push({
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
                productItemId: data._id,
                TypeOfProduct: item.TypeOfProduct,
                packet_size: data.packet_size,
                packetLabel: data.packetLabel,
                qty: data.quantity,
                price: item.price,
                totalprice: data.quantity * item.price,
                without_package: false,
              });
            })
        : (localPrice = item.totalprice)
    );

    localProducts.map((item, index) => {
      if (item.TypeOfProduct === "simple") {
        localPrice = item.totalPrice;
      } else {
        localPrice = item.totalPrice;
      }
      if (item.simpleData) {
        if (item.simpleData.length > 0) {
          if (item.TypeOfProduct === "simple") {
            if (item.simpleData[0].package.length === 0) {
              cart_data_dt.push({
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
                price: item.price,
                totalprice: item.simpleData[0].userQuantity * item.price,
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
          product_categories: item.product_categories || [],
          product_id: item._id,
          qty: item.qty,
          totalprice: item.qty * item.price,
          without_package: true,
        });
      }
    });

    // let totalredeemPercentage =
    //   (+this.state.totalSeedRedeem / +this.state.subTotalWithoutGST) * 100;
    let totalredeemPercentage =
      (+this.state.subscriptionRedeemPerDay / +this.state.subTotalWithoutGST) *
      100;
    if (!+discount) {
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
      if (discount_percentage) {
        console.log("discount_percentage");
        console.log(discount_percentage);
        // cart_data_dt.forEach((prd) => {
        //   let priceAfterDiscount = 0;
        //   priceAfterDiscount =
        //     prd.totalprice - prd.totalprice * (discount_percentage / 100);
        //   prd.priceAfterDiscount = localStorage.getItem("discount_amount")
        //     ? priceAfterDiscount.toFixed(2)
        //     : 0;
        //   if (this.state.loyaltyPointApplied) {
        //     if (priceAfterDiscount === 0) {
        //       priceAfterDiscount =
        //         +prd.totalprice -
        //         (+prd.totalprice * totalredeemPercentage) / 100;
        //     } else {
        //       priceAfterDiscount =
        //         +priceAfterDiscount -
        //         (+prd.totalprice * totalredeemPercentage) / 100;
        //     }
        //     return (prd.priceAfterDiscount = priceAfterDiscount.toFixed(2));
        //   }
        // });
        if (discountLocation === "product") {
          cart_data_dt.forEach((prd) => {
            let priceAfterDiscount = 0;
            discountProducts.forEach((discountItem) => {
              if (prd._id === discountItem._id) {
                priceAfterDiscount =
                  prd.totalprice -
                  prd.totalPriceBeforeGST * (discount_percentage / 100);
                return (prd.priceAfterDiscount = localStorage.getItem(
                  "discount_amount"
                )
                  ? priceAfterDiscount.toFixed(2)
                  : 0);
              } else {
                return (prd.priceAfterDiscount = 0);
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
              prd.totalPriceBeforeGST * (discount_percentage / 100);
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
    cart_data_dt.forEach((itm) =>
      localCart.push({ ...itm, itemDiscountAmount: itm.priceAfterDiscount })
    );
    setTimeout(() => {
      this.setState({
        cart_data: localCart,
      });
      this.calculateGST(
        localCart,
        this.state.selectdates.length === 0 ? 1 : this.state.selectdates.length
      );
      // this.props.addToCart([]);
      // this.props.addToCart(localCart);
      localStorage.setItem("cartItem", JSON.stringify(localCart));
      console.log(localCart);
      setTimeout(() => {
        this.calculate_summry("discountFunction");
      }, 0);
    }, 0);
  };

  calculate_summry(callFrom, cart) {
    var sub_total = 0;
    var discountApplied = false;
    var total_gst = 0;
    var allGsts = [];
    var cart_total = 0;
    var total_after_dis = 0;
    var localCart = cart || this.state.cart_data;

    //calculating price of each product and storing in sub_total
    localCart.map((item, index) => {
      if (
        item.TypeOfProduct === "group" ||
        item.TypeOfProduct === "configurable" ||
        item.TypeOfProduct === "simple"
      ) {
        sub_total = sub_total + item.price * item.qty;
      }
      // if (item.simpleData) {
      //   if (item.simpleData.length > 0) {
      //     if (item.TypeOfProduct === "simple") {
      //       if (item.simpleData[0].package[0]) {
      //         item.simpleData[0].package
      //           .filter((dta) => dta.selected == true)
      //           .map((data, ind) => {
      //             if (this.props.user_details.length !== 0) {
      //               if (this.props.user_details.user_type === "b2b") {
      //                 sub_total = sub_total + data.B2B_price * data.quantity;
      //               } else if (this.props.user_details.user_type === "retail") {
      //                 sub_total = sub_total + data.Retail_price * data.quantity;
      //               } else if (
      //                 this.props.user_details.user_type === "user" ||
      //                 this.props.user_details.user_type === null
      //               ) {
      //                 sub_total =
      //                   sub_total + data.selling_price * data.quantity;
      //               }
      //             } else {
      //               sub_total = sub_total + data.selling_price * data.quantity;
      //             }
      //           });
      //       } else {
      //         if (this.props.user_details.length !== 0) {
      //           if (this.props.user_details.user_type === "b2b") {
      //             sub_total =
      //               sub_total +
      //               item.simpleData[0].RegionB2BPrice *
      //                 item.simpleData[0].userQuantity;
      //           } else if (this.props.user_details.user_type === "retail") {
      //             sub_total =
      //               sub_total +
      //               item.simpleData[0].RegionRetailPrice *
      //                 item.simpleData[0].userQuantity;
      //           } else if (
      //             this.props.user_details.user_type === "user" ||
      //             this.props.user_details.user_type === null
      //           ) {
      //             sub_total =
      //               sub_total +
      //               item.simpleData[0].RegionSellingPrice *
      //                 item.simpleData[0].userQuantity;
      //           }
      //         } else {
      //           sub_total =
      //             sub_total +
      //             item.simpleData[0].RegionSellingPrice *
      //               item.simpleData[0].userQuantity;
      //         }
      //       }
      //     }
      //   }
      // }
    });

    //looping through cart and calcuating gst per product
    // if (this.state.showTaxFields) {
    let itemWiseData = [];
    const newLocalCart = localCart.map((itm) => {
      var totalpriceBeforeTax = 0; // total price (price * quantity) - single product
      var totalDiscountpriceBeforeTax = 0; // itemdiscountamount
      var singleProductTaxPrice = 0; // tax price total -- single product
      var singleProductDiscountedTaxPrice = 0;
      var totalTaxPercentage = 0; //tax percentage of single product
      var selectedTaxRegion;
      if (+itm.itemDiscountAmount > 0) {
        discountApplied = true;
      }
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
      //checking if tax data is provided in product or not and breaking loop if not
      if (this.state.insideHaryana) {
        if (!itm.salesTaxWithIn.totalTax) {
          return;
        }
      } else {
        if (!itm.salesTaxOutSide.totalTax) {
          return;
        }
      }

      //checking if user is inside haryana or outside haryana
      if (this.state.insideHaryana) {
        totalTaxPercentage = itm.salesTaxWithIn.totalTax || 0;
        selectedTaxRegion = itm.salesTaxWithIn;
      } else {
        totalTaxPercentage = itm.salesTaxOutSide.totalTax || 0;
        selectedTaxRegion = itm.salesTaxOutSide;
      }
      //calculating single product tax price
      singleProductTaxPrice =
        +totalpriceBeforeTax -
        +totalpriceBeforeTax * (100 / (100 + +totalTaxPercentage));
      total_gst += singleProductTaxPrice;
      // total_gst += singleProductDiscountedTaxPrice;

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
                  (+singleProductTaxPrice.toFixed(2) * +tx.tax_percent) /
                  +totalTaxPercentage;
                total = total;
                let totalprice = parseFloat(gst.totalPrice) + parseFloat(total);
                gst.totalPrice = totalprice;
                gst.tax_percent = +gst.tax_percent;
              }
            });
          } else {
            //if sub tax doesn't exist in array then pushing it directly to array
            let total =
              (+singleProductTaxPrice.toFixed(2) * +tx.tax_percent) /
              +totalTaxPercentage;
            allGsts.push({
              tax_name: tx.tax_name,
              totalPrice: total.toFixed(3),
              tax_percent: tx.tax_percent,
            });
          }
        });

      let amountBeforeGST = 0,
        itemDiscountAmountBeforeGST = 0;
      if (itm.simpleData[0] && itm.simpleData[0].package.length > 0) {
        console.log(itm.totalprice);
        amountBeforeGST = itm.totalprice - singleProductTaxPrice;
      } else {
        amountBeforeGST = itm.price * itm.qty - singleProductTaxPrice;
      }
      if (itm.itemDiscountAmount) {
        itemDiscountAmountBeforeGST =
          itm.itemDiscountAmount - singleProductTaxPrice;
      }
      itemWiseData.push({
        ...itm,
        itemWiseGst: singleProductTaxPrice.toFixed(2),
        itemDiscountAmount:
          +itm.itemDiscountAmount > 0 ? itm.itemDiscountAmount : null,
        totalPriceAfterGST: itm.totalprice,
        totalprice: itm.totalPriceBeforeGST,
        price: +itm.totalPriceBeforeGST / +itm.qty,
      });

      return {
        ...itm,
        itemDiscountAmount:
          +itm.itemDiscountAmount > 0 ? itm.itemDiscountAmount : null,
        totalPriceBeforeGST: amountBeforeGST.toFixed(2),
        itemDiscountAmountBeforeGST: itemDiscountAmountBeforeGST.toFixed(2),
      };
    });
    console.log(":::::::;", newLocalCart);
    this.setState({ cart_data: newLocalCart, itemWiseData: itemWiseData });
    // } else {
    //   alert(2);
    // }

    cart_total = sub_total; // cart price without gst
    // cart_total = total_gst + sub_total; // cart price with gst
    total_after_dis = cart_total;

    var final_total_price = 0;

    const localRegionDetails = JSON.parse(
      localStorage.getItem("regionDetails")
    );
    const deliveryCharge = +this.state.deliveryCharge;
    const codCharges = +this.state.codCharges;
    var discout_referral = 0;
    //referral & loyalty
    if (this.state.referralEligible) {
      discout_referral =
        ((+cart_total - +total_gst) * this.state.referralPercent) / 100;
      final_total_price = final_total_price - discout_referral;
      this.setState({
        referral_discount: discout_referral.toFixed(2),
      });
    }
    if (localStorage.getItem("status") === "true") {
      if (this.state.cashStatus) {
        final_total_price =
          (total_after_dis + deliveryCharge + codCharges - discout_referral) *
          (this.state.selectdates.length === 0
            ? 1
            : this.state.selectdates.length);
      } else {
        final_total_price =
          (total_after_dis + deliveryCharge - discout_referral) *
          (this.state.selectdates.length === 0
            ? 1
            : this.state.selectdates.length);
      }
    } else {
      if (this.state.cashStatus) {
        final_total_price =
          total_after_dis + deliveryCharge + codCharges - discout_referral;
      } else {
        final_total_price = total_after_dis + deliveryCharge - discout_referral;
      }
    }
    let redeemPoints = this.state.totalSeedRedeem;
    // if (!this.state.subscribe_status) {
    if (localStorage.getItem("status") === "true") {
      let redeemAccDates =
        +this.state.totalSeedRedeem * (+this.state.selectdates.length || 1);
      if (redeemAccDates > +this.state.maxLoyaltyRedeemAmount) {
        redeemPoints = +this.state.maxLoyaltyRedeemAmount;
      } else {
        redeemPoints = redeemAccDates;
      }
    } else {
      redeemPoints = this.state.totalSeedRedeem;
    }
    if (this.state.loyaltyPointApplied) {
      total_after_dis = total_after_dis - redeemPoints;
      final_total_price = final_total_price - redeemPoints;
      console.log(total_after_dis);
      this.setState({
        subscriptionLoyaltyPoints: redeemPoints,
      });
    }
    if (localStorage.getItem("discount_amount")) {
      total_after_dis =
        total_after_dis - localStorage.getItem("discount_amount");
      final_total_price =
        final_total_price - localStorage.getItem("discount_amount");
    }

    // this.calculateDiscountPerItem(this.state.cart_data);

    // }
    this.setState({
      subscriptionRedeem: redeemPoints,
      subscriptionRedeemPerDay:
        +redeemPoints / (+this.state.selectdates.length || 1),
      subTotal_price: sub_total,
      subTotalWithoutGST: +sub_total - +total_gst,
      gst_price: total_gst.toFixed(2),
      inclusiveGST: total_gst,
      total_price: cart_total,
      total_after_discount: total_after_dis.toFixed(2),
      final_total_price: final_total_price.toFixed(), //referral & redeem discount added
      discount_amount: localStorage.getItem("discount_amount"),
      allGstLists: allGsts,
    });
    setTimeout(() => {
      if (callFrom == "subscriptionDates") {
        this.calculateDiscountPerItem();
      } else {
        if (discountApplied) {
          this.calculateGST(
            this.state.cart_data,
            this.state.selectdates.length === 0
              ? 1
              : this.state.selectdates.length
          );
        }
      }
      if (callFrom !== "loyalty") {
        this.redeemLoyalityPoints();
      }
    }, 0);
  }

  calculateGST(newItemsArray, subscriptionDates) {
    var sub_total = 0;
    var gst = 0;
    var cart_total = 0;
    var allGsts = [];
    var total_gst = 0;
    var total_after_dis = 0;
    newItemsArray &&
      newItemsArray.map((item, index) => {
        sub_total = sub_total + item.price * item.qty;
      });
    //looping through cart and calcuating gst per product

    newItemsArray.forEach((itm) => {
      var totalpriceBeforeTax = 0; // total price (price * quantity) - single product
      var singleProductTaxPrice = 0; // tax price total -- single product
      var totalTaxPercentage = 0; //tax percentage of single product
      var selectedTaxRegion;
      if (itm.TypeOfProduct === "simple") {
        if (itm.simpleData[0].package.length > 0) {
          totalpriceBeforeTax = itm.itemDiscountAmount
            ? itm.itemDiscountAmount - itm.itemWiseGst
            : itm.totalprice;
        } else {
          totalpriceBeforeTax = itm.itemDiscountAmount
            ? itm.itemDiscountAmount - itm.itemWiseGst
            : itm.price * itm.qty;
        }
      } else {
        totalpriceBeforeTax = itm.itemDiscountAmount
          ? itm.itemDiscountAmount - itm.itemWiseGst
          : itm.price * itm.qty;
      }

      //checking if tax data is provided in product or not and breaking loop if not
      if (this.state.insideHaryana) {
        if (!itm.salesTaxWithIn.totalTax) {
          return;
        }
      } else {
        if (!itm.salesTaxOutSide.totalTax) {
          return;
        }
      }

      //checking if user is inside haryana or outside haryana
      if (this.state.insideHaryana) {
        totalTaxPercentage = itm.salesTaxWithIn.totalTax || 0;
        selectedTaxRegion = itm.salesTaxWithIn;
      } else {
        totalTaxPercentage = itm.salesTaxOutSide.totalTax || 0;
        selectedTaxRegion = itm.salesTaxOutSide;
      }

      // totalTaxPercentage = itm.salesTaxWithIn.totalTax || 0;
      // selectedTaxRegion = itm.salesTaxWithIn;
      singleProductTaxPrice = itm.itemDiscountAmount
        ? (+totalpriceBeforeTax * +totalTaxPercentage) / 100
        : +totalpriceBeforeTax -
          +totalpriceBeforeTax * (100 / (100 + +totalTaxPercentage));
      total_gst += singleProductTaxPrice;

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
                  (+singleProductTaxPrice.toFixed(2) * +tx.tax_percent) /
                  +totalTaxPercentage;
                total = total;
                let totalprice = parseFloat(gst.totalPrice) + parseFloat(total);
                gst.totalPrice = totalprice.toFixed(3);
                gst.tax_percent = +gst.tax_percent;
              }
            });
          } else {
            //if sub tax doesn't exist in array then pushing it directly to array
            let total =
              (+singleProductTaxPrice.toFixed(2) * +tx.tax_percent) /
              +totalTaxPercentage;
            allGsts.push({
              tax_name: tx.tax_name,
              totalPrice: total.toFixed(3),
              tax_percent: tx.tax_percent,
            });
          }
        });
    });

    gst = total_gst;
    let calculateivegst = +gst * +subscriptionDates;
    let inclusivegst = +this.state.inclusiveGST * +subscriptionDates;

    const final_total_price =
      +this.state.final_total_price - inclusivegst + calculateivegst;
    const total_after_discount =
      +this.state.total_after_discount - inclusivegst + calculateivegst;

    this.setState({
      final_total_price: final_total_price.toFixed(),
      total_after_discount: total_after_discount.toFixed(),
      gst_price: gst.toFixed(2),
      allGstLists: allGsts,
    });
  }

  _handleForm(val) {
    var name = val.target.name;
    var value = val.target.value;

    this.setState({ [name]: value });
  }

  _handleFormmobile(val) {
    var name = val.target.name;
    var value = val.target.value;

    this.setState({
      [name]: value,
    });
  }

  verify() {
    if (isNaN(this.state.contact)) {
      swal({
        title: "Please enter Number",
        // text: "Are you sure that you want to leave this page?",
        icon: "warning",
        dangerMode: true,
      });
    } else if (
      this.state.contact.length < 10 ||
      this.state.contact.length > 10
    ) {
      swal({
        title: "Please enter 10 Digit Number",
        // text: "Are you sure that you want to leave this page?",
        icon: "warning",
        dangerMode: true,
      });
    } else if (this.state.contact) {
      const requestData = {
        contactNumber: this.state.contact,
      };
      ApiRequest(requestData, "/mobileSignUp", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({ user_id: res.data.data._id });
            this.setState({
              verifymobilestatus: "semitrue",
              buttonstatus: false,
              readonlytrue: true,
            });
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      swal({
        title: "Please enter your number",
        // text: "Are you sure that you want to leave this page?",
        icon: "warning",
        dangerMode: true,
      });
    }
  }

  verifyagain() {
    const requestData = {
      contactNumber: this.state.contact,
    };
    ApiRequest(requestData, "/resendOtp", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          swal({
            title: "OTP Sent",
            // text: "Are you sure that you want to leave this page?",
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

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.dataInCart !== this.props.dataInCart &&
      this.props.dataInCart !== undefined
    ) {
      this.setState({
        cart_data: this.props.dataInCart,
      });
      this.calculate_summry();
    }
  }

  onotpchange(val) {
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
      };

      ApiRequest(requestData, "/userMobileVerification", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.props.userdetails(res.data.data);
            if (
              this.props.user_details.contactNumber &&
              this.props.user_details.name &&
              this.props.user_details.email
            ) {
              this.setState({
                verifymobilestatus: "fullytrue",
                compopupstatus: false,
              });
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
          this.props.userdetails(res.data.data);
          if (res.status === 201 || res.status === 200) {
            this.setState({
              verifymobilestatus: "fullytrue",
              buttonstatus: false,
            });

            this.props.history.push("/");
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

  _handlePaymentMode(val) {
    var name = val.target.name;

    if (name === "pay") {
      this.setState({
        payStatus: true,
        cashStatus: false,
        walletstatus: false,
        visaStatus: false,
        creditStatus: false,
        razorpayStatus: false,
      });
    } else if (name === "razorpay") {
      this.setState({
        payStatus: false,
        cashStatus: false,
        walletstatus: false,
        visaStatus: false,
        creditStatus: false,
        razorpayStatus: true,
      });
    } else if (name === "cash") {
      this.setState({
        payStatus: false,
        walletstatus: false,
        cashStatus: true,
        visaStatus: false,
        creditStatus: false,
        razorpayStatus: false,
      });
    } else if (name === "visa") {
      this.setState({
        payStatus: false,
        cashStatus: false,
        walletstatus: false,
        visaStatus: true,
        creditStatus: false,
        razorpayStatus: false,
      });
    } else if (name === "wallet") {
      this.setState({
        payStatus: false,
        cashStatus: false,
        visaStatus: false,
        walletstatus: true,
        creditStatus: false,
        razorpayStatus: false,
      });
    } else if (name === "credit") {
      this.setState({
        payStatus: false,
        walletstatus: true,
        cashStatus: false,
        visaStatus: false,
        creditStatus: true,
        razorpayStatus: false,
      });
    }
    // ;
    setTimeout(() => {
      this.calculate_summry();
    }, 100);
  }

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
              (res.data.data.redeemPercent * this.state.subTotalWithoutGST) /
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
              // maxLoyaltyPointToRedeem: Math.floor(loyaltyPoint * 100) / 100,
              // loyalty_point_input: Math.floor(loyaltyPoint * 100) / 100,
              // seedValue: seedValue ? Math.floor(seedValue * 100) / 100 : 0,
              // totalSeedRedeem: Math.floor(total * 100) / 100,
              maxLoyaltyPointToRedeem: Math.floor(loyaltyPoint),
              loyalty_point_input: Math.floor(loyaltyPoint),
              seedValue: seedValue ? Math.floor(seedValue) : 0,
              totalSeedRedeem: Math.floor(total),
            });
          }
        }
      })
      .then(() => {
        this.calculate_summry("loyalty");
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addPaymentDetail = () => {
    var preOrder = false;
    this.state.cart_data.map((itmpre, indpre) =>
      itmpre.preOrder === true ? (preOrder = true) : ""
    );
    const data = {};
    var cart_id = "";
    ApiRequest(data, "/get/addtocart/" + this.props.user_details._id, "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          cart_id = res.data.data.AddToCartId;
          localStorage.setItem("status", Boolean(res.data.data.subscribe));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    if (this.state.selectedaddress && cart_id) {
      const requestData = {
        user_id: this.props.user_details._id,
        user_email: this.state.email,
        preOrder: preOrder,
        user_name: this.state.name,
        addToCartID: cart_id,
        booking_address: this.state.selectedaddress,
        otheraddress: "",
        paymentmethod: "COD",
        payment_id: "",
        cod: "",
      };
      ApiRequest(requestData, "/createBooking", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.props.changethankyouAuth(true);
            this.setState({ paymentData: res.data });
            var a = [];
            this.props.addToCart(a);
            this.props.history.replace(`/Thankyou`);
          } else if (res.status === 500) {
            swal({
              title: res.data.title,
              text: res.data.msg,
              icon: "warning",
              dangerMode: true,
            });
            this.props.history.replace(`/`);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      var valueErr = document.getElementsByClassName("err");
      for (var i = 0; i < valueErr.length; i++) {
        valueErr[i].innerText = "";
      }

      if (!this.state.name) {
        valueErr = document.getElementsByClassName("err_name1");
        valueErr[0].innerText = "This Field is Required";
      }
      if (!this.state.email) {
        valueErr = document.getElementsByClassName("err_email1");
        valueErr[0].innerText = "This Field is Required";
      }
      if (!this.state.selectedaddress) {
        valueErr = document.getElementsByClassName("err_address");
        valueErr[0].innerText = "Please select an address or add a new one";
        swal({
          title: "Error",
          text: "Please select an address or add a new one.",
          icon: "warning",
          dangerMode: true,
        });
      } else if (this.state.selectedaddress) {
        valueErr = document.getElementsByClassName("err_address");
        valueErr[0].innerText = "";
      }
    }
  };

  payonline = () => {
    <script
      type="application/html"
      crossorigin="anonymous"
      src="https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/JyteFL05765187324122.js"
      onload="onScriptLoad();"
    ></script>;
    var config = {
      root: "",
      flow: "DEFAULT",
      data: {
        orderId: 1243456 /* update order id */,
        token:
          "fe795335ed3049c78a57271075f2199e1526969112097" /* update token value */,
        tokenType: "TXN_TOKEN",
        amount: 44546 /* update amount */,
      },
      handler: {
        notifyMerchant: function (eventName, data) {},
      },
    };

    if (window.Paytm && window.Paytm.CheckoutJS) {
      window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
        // initialze configuration using init method
        window.Paytm.CheckoutJS.init(config)
          .then(function onSuccess() {
            // after successfully updating configuration, invoke JS Checkout
            window.Paytm.CheckoutJS.invoke();
          })
          .catch(function onError(error) {
            console.log("error => ", error);
          });
      });
    }
  };

  getplaces = (e) => {
    if (e.coordinates.lat) {
      fetch(
        "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          e.coordinates.lat +
          "," +
          e.coordinates.lng +
          "&key=AIzaSyCazDplf1HtSAyvjhY40uqUaTBuSYoVyGE"
      )
        .then((response) => response.json())
        .then((json) => {
          if (json.results) {
            var length = json.results.length;
            if (length) {
              // document.getElementsByClassName('live-location1')[0].value = e.place;
              // document.getElementById('live-lat').value = e.coordinates.lat;
              // document.getElementById('live-long').value = e.coordinates.lng;
              this.setState({
                showGoggleAddress: false,
                showInputAddres: true,
                street_address: e.place,
                latitude: e.coordinates.lat,
                longitude: e.coordinates.lng,
                country: json.results[length - 2].formatted_address,
                state: json.results[length - 3].formatted_address,
                city: json.results[length - 4].formatted_address,
                pincode: "",
                // json.results[0].address_components[
                //   json.results[0].address_components.length - 1
                // ].long_name,
              });
            }
          }
        });
    } else {
      this.setState({ street_address: e });
    }
  };

  //checking all required fields when trying to place order
  checkValidations = () => {
    let errorExist = false;

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (+this.state.subTotal_price < +this.state.minimumOrderValue) {
      errorExist = true;
      swal({
        title: "Error",
        text:
          "Minimum order value for selected pincode is ₹" +
          this.state.minimumOrderValue,
        icon: "warning",
        dangerMode: true,
      });
    } else if (!this.state.giftingFormCompleted) {
      errorExist = true;
      swal({
        title: "Error",
        text: "Please complete gifting form or deselect gifting status.",
        icon: "warning",
        dangerMode: true,
      });
    }
    if (!this.state.name) {
      errorExist = true;
      valueErr = document.getElementsByClassName("err_name1");
      valueErr[0].innerText = "This Field is Required";
      swal({
        title: "Error",
        text: "Please Enter Name.",
        icon: "warning",
        dangerMode: true,
      });
    }
    if (!this.state.deliveryslot) {
      errorExist = true;
      valueErr = document.getElementsByClassName("err_deliveryslot");
      valueErr[0].innerText = this.state.selectedaddress
        ? this.state.noDeliverySlots
          ? "We are currently not delivering in your area."
          : "Please select a delivery slot."
        : "Please add Shipping Details.";
      swal({
        title: "Error",
        text: this.state.selectedaddress
          ? this.state.noDeliverySlots
            ? "We are currently not delivering in your area."
            : "Please select a delivery slot."
          : "Please add Shipping Details.",
        icon: "warning",
        dangerMode: true,
      });
    }
    if (!this.state.email) {
      errorExist = true;
      valueErr = document.getElementsByClassName("err_email1");
      valueErr[0].innerText = "This Field is Required";
      swal({
        title: "Error",
        text: "Please enter email.",
        icon: "warning",
        dangerMode: true,
      });
    }
    if (!this.state.selectedaddress) {
      errorExist = true;
      valueErr = document.getElementsByClassName("err_address");
      valueErr[0].innerText = "Please select an address or add a new one";
      swal({
        title: "Error",
        text: "Please select an address or add a new one.",
        icon: "warning",
        dangerMode: true,
      });
    } else if (this.state.selectedaddress) {
      valueErr = document.getElementsByClassName("err_address");
      valueErr[0].innerText = "";
    }
    if (
      this.state.giftingContent.status &&
      !this.state.selectedgiftingaddress
    ) {
      errorExist = true;
      valueErr = document.getElementsByClassName("err_giftingaddress");
      valueErr[0].innerText =
        "Please select a gifting address or add a new One";
      swal({
        title: "Error",
        text: "Please select a gifting address or add a new one.",
        icon: "warning",
        dangerMode: true,
      });
    }

    if (this.state.creditStatus) {
      if (this.state.creditPending < this.state.final_total_price) {
        errorExist = true;
        valueErr = document.getElementsByClassName("err_wallet");
        valueErr[0].innerText = "";
        swal({
          title: "Insufficient funds in credit!",
          icon: "warning",
          dangerMode: true,
        });
      }
    } else if (this.state.walletstatus) {
      if (this.state.wallet_amount < this.state.final_total_price) {
        errorExist = true;
        valueErr = document.getElementsByClassName("err_wallet");
        valueErr[0].innerText = "";
        swal({
          title: "Insufficient funds in the wallet!",
          text: "Please add money to your wallet",
          icon: "warning",
          dangerMode: true,
        });
      }
    }

    return errorExist;
  };

  //Making data to send in API
  makePlaceOrderData = (dt, orderType, paymentType, preOrderStatus1) => {
    let normalOrder = true;
    if (orderType !== "normal") {
      normalOrder = false;
    }
    const gstPrice = +this.state.gst_price;
    let preOrder = false;
    this.state.cart_data.map((itmpre, indpre) =>
      itmpre.preOrder === true ? (preOrder = true) : ""
    );
    const deliveryCharge = this.state.deliveryCharge;
    const codCharges = this.state.codCharges;

    //Making API object
    let requestData = {
      user_id: this.props.user_details._id,
      user_email: this.state.email,
      user_name: this.state.name,
      device_name: "web",
      deliverySlot: this.state.deliverySlotSlug,
      itemWiseData: this.state.itemWiseData,
      taxType: "inclusive",
      totalCouponDiscountAmount: localStorage.getItem("discount_amount") || 0,
      regionID: localStorage.getItem("selectedRegionId")
        ? JSON.parse(localStorage.getItem("selectedRegionId"))
        : "",
      regionName: localStorage.getItem("selectedRegionName")
        ? localStorage.getItem("selectedRegionName")
        : "",
      couponCode: localStorage.getItem("coupon_code")
        ? localStorage.getItem("coupon_code")
        : "",
      couponId: localStorage.getItem("couponId")
        ? localStorage.getItem("couponId")
        : "",
      delivery_instructions: this.state.delivery_instructions,
      address: this.state.selectedFullAddress
        ? this.state.selectedFullAddress
        : "",
      houseNo: this.state.selectedaddress.houseNo || "",
      locationTag: this.state.selectedaddress.locationTag || "",
      locality: this.state.selectedaddress.locality
        ? this.state.selectedaddress.locality
        : "",
      referralDiscount: this.state.referral_discount
        ? this.state.referral_discount
        : "",
      country: this.state.selectedaddress.country
        ? this.state.selectedaddress.country
        : "",
      state: this.state.selectedaddress.state
        ? this.state.selectedaddress.state
        : "",
      city: this.state.selectedaddress.city
        ? this.state.selectedaddress.city
        : "",
      pincode: this.state.selectedaddress.pincode
        ? this.state.selectedaddress.pincode
        : "",
      latitude: this.state.selectedaddress.latitude
        ? this.state.selectedaddress.latitude
        : "",
      longitude: this.state.selectedaddress.longitude
        ? this.state.selectedaddress.longitude
        : "",
      otheraddress: "",
      paymentmethod:
        paymentType === "wallet_credit"
          ? this.state.creditStatus
            ? "Credit"
            : "Wallet"
          : this.state.cashStatus === false
          ? this.state.razorpayStatus
            ? "Razorpay"
            : "Paytm"
          : "COD",
      preOrder: preOrder,
      payment_id: "",
      cod: this.state.cashStatus ? true : false,
      codCharges: this.state.cashStatus ? codCharges : 0,
      deliveryCharges: deliveryCharge,
      totalCartPrice: this.state.subTotal_price,
      totalCartPriceWithoutGST:
        Math.floor(+this.state.subTotalWithoutGST * 100) / 100,
      bookingMode: "online",
      gst: gstPrice.toFixed(2),
      allGstLists: this.state.allGstLists,
    };

    if (normalOrder) {
      //Normal Orders
      requestData.total_payment = this.state.final_total_price;
      requestData.redeem = this.state.loyaltyPointApplied
        ? +this.state.totalSeedRedeem / +this.state.seedValue
        : "";
      requestData.redeemDiscount = this.state.loyaltyPointApplied
        ? this.state.totalSeedRedeem
        : "";
      requestData.addToCartID = dt.AddToCartId;
      requestData.giftingStatus = this.state.giftingContent.status
        ? true
        : false;
      requestData.giftingName = this.state.giftingContent.name;
      requestData.giftingContact = this.state.giftingContent.contact;
      requestData.giftingAddress = this.state.giftingContent.address;
      requestData.giftingNote = this.state.giftingContent.note;
    } else {
      //Subscription & PreOrders

      const subscribeLoyalty =
        +this.state.subscriptionLoyaltyPoints / +this.state.selectdates.length;
      var noofdays = preOrderStatus1 ? 1 : +this.state.selectdates.length;

      var correctDates = [];

      this.state.selectdates &&
        this.state.selectdates.forEach((d) => {
          var dateNew = d.date;
          correctDates.push({ date: dateNew });
        });
      const cartData = dt.cartDetail.map((itm) => {
        return {
          ...itm,
          packet_size: itm.simpleItem ? itm.simpleItem.packet_size : null,
          packetLabel: itm.simpleItem ? itm.simpleItem.packetLabel : null,
          packet_id: itm.simpleItem ? itm.simpleItem._id : null,
        };
      });

      requestData.total_payment = +this.state.final_total_price / noofdays;
      requestData.redeem = this.state.loyaltyPointApplied
        ? subscribeLoyalty
          ? +subscribeLoyalty / +this.state.seedValue
          : +this.state.totalSeedRedeem / +this.state.seedValue
        : "";
      requestData.redeemDiscount = this.state.loyaltyPointApplied
        ? subscribeLoyalty
          ? subscribeLoyalty
          : this.state.totalSeedRedeem
        : "";
      requestData.cartDetail = cartData;
      requestData.userMobile = this.props.user_details.contactNumber;
      requestData.userType = this.props.user_details.user_type;
      requestData.dates = preOrderStatus1
        ? [{ date: preOrderStatus1.preOrderEndDate }]
        : correctDates;
      requestData.OrderTotal =
        (this.state.total_after_discount + deliveryCharge) *
        this.state.selectdates.length;
    }

    return requestData;
  };

  //Place order though cod/wallet/credit
  PlaceOrder_OFFLINE = (requestData, orderType) => {
    ApiRequest(
      requestData,
      orderType === "normal" ? "/createBooking" : "/subscription/addOne",
      "POST"
    )
      .then((res) => {
        this.setState({
          loading: false,
        });
        if (res.status === 201 || res.status === 200) {
          this.purchaseROAS(this.state.final_total_price);
          this.props.changethankyouAuth(true);
          this.setState({
            paymentData: res.data,
          });
          var a = [];
          this.props.addToCart(a);
          this.props.history.replace(`/Thankyou`);
        } else {
          if (res.data.status === "error") {
            swal({
              title: "Error",
              text:
                res.data.allErrors?.length > 0
                  ? "You can not add " + res.data.allErrors.join("")
                  : res.data.msg || "Something Went Wrong",
              icon: "warning",
              dangerMode: true,
            }).then(() => {
              this.props.history.push("/cart");
            });
          } else {
            swal({
              title: "Error",
              text: "Network Error",
              icon: "warning",
              dangerMode: true,
            });
          }
        }
      })
      .then(() => {
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Place order though Paytm
  PlaceOrder_PAYTM = (requestData, orderType) => {
    let errorFromAPI = false;
    fetch(
      DynamicUrl +
        (orderType === "normal" ? "/createBooking" : "/subscription/addOne"),
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    )
      .then(async (res) => {
        if (res.status === 201 || res.status === 200) {
          await this.props.changethankyouAuth(true);
          this.purchaseROAS(this.state.final_total_price);
          return res.text();
        } else {
          let response1 = await res.json();
          errorFromAPI = true;

          if (response1.status === "error") {
            swal({
              title: "Error",
              text:
                response1.allErrors?.length > 0
                  ? "You can not add " + response1.allErrors.join("")
                  : response1.msg || "Something Went Wrong",
              icon: "warning",
              dangerMode: true,
            }).then(() => {
              this.props.history.push("/cart");
            });
          } else {
            swal({
              title: "Error",
              text: "Network Error",
              icon: "warning",
              dangerMode: true,
            });
          }
        }
      })
      .then((data) => {
        if (data !== undefined && !errorFromAPI) {
          document.querySelector("html").innerHTML = data;
          document.f1.submit();
        }
      })
      .then(() => {
        if (!errorFromAPI) {
          this.setState({
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  PlaceOrder_RAZORPAY = (requestData, orderType) => {
    requestData.createDbDoc = false;
    ApiRequest(
      requestData,
      orderType === "normal" ? "/createBooking" : "/subscription/addOne",
      "POST"
    )
      .then((res) => {
        this.setState({
          loading: false,
        });
        if (res.status === 201 || res.status === 200) {
          let options = {
            key: RAZORPAY_KEY,
            amount: parseFloat(this.state.final_total_price) * 100, // 2000 paise = INR 20, amount in paisa
            name: this.state.name.toUpperCase(),
            description: "Purchase Description",
            image: krishiLogo,
            handler: (response) => {
              requestData.TXNID = response.razorpay_payment_id;
              requestData.createDbDoc = true;
              requestData.payment = "Complete";
              return new Promise((resolve, reject) => {
                ApiRequest(
                  requestData,
                  orderType === "normal"
                    ? "/createBooking"
                    : "/subscription/addOne",
                  "POST"
                )
                  .then((res) => {
                    this.setState({
                      loading: false,
                    });
                    if (res.status === 201 || res.status === 200) {
                      this.purchaseROAS(this.state.final_total_price);
                      this.props.changethankyouAuth(true);
                      this.setState({
                        paymentData: res.data,
                      });
                      var a = [];
                      this.props.addToCart(a);
                      this.props.history.replace(`/Thankyou`);
                    } else {
                      if (res.data.status === "error") {
                        swal({
                          title: "Error",
                          text:
                            res.data.allErrors?.length > 0
                              ? "You can not add " + res.data.allErrors.join("")
                              : res.data.msg || "Something Went Wrong",
                          icon: "warning",
                          dangerMode: true,
                        }).then(() => {
                          this.props.history.push("/cart");
                        });
                      } else {
                        swal({
                          title: "Error",
                          text: "Network Error",
                          icon: "warning",
                          dangerMode: true,
                        });
                      }
                    }
                  })
                  .then(() => {
                    this.setState({
                      loading: false,
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
            },
            modal: {
              ondismiss: (e) => {
                console.log(e);
              },
            },
            prefill: {
              name: this.state.name.toUpperCase(),
              email: this.props.user_details.email,
              contact: this.props.user_details.contactNumber,
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          if (res.data.status === "error") {
            swal({
              title: "Error",
              text:
                res.data.allErrors?.length > 0
                  ? "You can not add " + res.data.allErrors.join("")
                  : res.data.msg || "Something Went Wrong",
              icon: "warning",
              dangerMode: true,
            }).then(() => {
              this.props.history.push("/cart");
            });
          } else {
            swal({
              title: "Error",
              text: "Network Error",
              icon: "warning",
              dangerMode: true,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Subscription Orders and Pre-Orders
  opencashsubscribe = async () => {
    var valueErr = document.getElementsByClassName("err");
    const preOrderStatus1 = this.state.cart_data.find(
      (item) => item.preOrder == true
    );

    var submit_status = true;
    if (this.state.selectdates.length > 1) {
      submit_status = true;
    } else {
      if (preOrderStatus1) {
        submit_status = true;
      } else {
        submit_status = false;
      }
    }
    const errorsFound = this.checkValidations();

    if (!errorsFound) {
      if (this.state.walletstatus === true) {
        const data = { subscription_dates: +this.state.selectdates.length };
        var cart_id = "";
        if (
          this.props.user_details._id &&
          this.state.selectedaddress.houseNo &&
          submit_status === true &&
          this.state.wallet_amount > this.state.final_total_price &&
          this.state.deliveryslot
        ) {
          this.setState({
            loading: true,
          });

          await ApiRequest(
            data,
            "/get/addtocart/" + this.props.user_details._id,
            "GET"
          )
            .then((res) => {
              if (res.data.data.outOfStock.length !== 0) {
                this.setState({
                  loading: false,
                });
                swal({
                  title: "Please note!",
                  text: `${res.data.data.outOfStock.join(
                    ", "
                  )} is currently out of stock.`,
                  icon: "warning",
                  successMode: true,
                }).then(() => this.props.history.push("/cart"));
              } else {
                cart_id = res.data.data.AddToCartId;
                localStorage.setItem(
                  "status",
                  Boolean(res.data.data.subscribe)
                );
                const requestData = this.makePlaceOrderData(
                  {
                    cartDetail: res.data.data.cartDetail,
                  },
                  "subscription",
                  "wallet_credit",
                  preOrderStatus1
                );

                this.PlaceOrder_OFFLINE(requestData, "subscription");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          if (submit_status !== true) {
            if (this.state.selectdates.length <= 1) {
              valueErr = document.getElementsByClassName("err_dates");
              // valueErr[0].innerText = "Please select atleast 2 subscription Days";
              swal({
                title: "Minimum subscription dates not selected",
                text: "Please select minimum 2 subscription Days",
                icon: "warning",
                dangerMode: true,
                buttons: {
                  confirm: {
                    text: "Ok",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true,
                  },
                },
              });
            } else {
              valueErr = document.getElementsByClassName("err_dates");
              valueErr[0].innerText = "";
            }
          }
          this.setState({
            loading: false,
          });
        }
      } else {
        const data = { subscription_dates: +this.state.selectdates.length };
        var cart_id = "";

        if (
          this.props.user_details._id &&
          this.state.selectedaddress.houseNo &&
          submit_status === true &&
          this.state.deliveryslot
        ) {
          this.setState({
            loading: true,
          });
          await ApiRequest(
            data,
            "/get/addtocart/" + this.props.user_details._id,
            "GET"
          )
            .then((res) => {
              if (res.data.data.outOfStock.length !== 0) {
                this.setState({
                  loading: false,
                });
                swal({
                  title: "Please note!",
                  text: `${res.data.data.outOfStock.join(
                    ", "
                  )} is currently out of stock.`,
                  icon: "warning",
                  successMode: true,
                }).then(() => this.props.history.push("/cart"));
              } else {
                localStorage.setItem(
                  "status",
                  Boolean(res.data.data.subscribe)
                );

                const requestData = this.makePlaceOrderData(
                  {
                    cartDetail: res.data.data.cartDetail,
                  },
                  "subscription",
                  "cod_online",
                  preOrderStatus1
                );

                this.state.cashStatus === true
                  ? this.PlaceOrder_OFFLINE(requestData, "subscription")
                  : this.state.razorpayStatus
                  ? this.PlaceOrder_RAZORPAY(requestData, "subscription")
                  : this.PlaceOrder_PAYTM(requestData, "subscription");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          if (submit_status !== true) {
            if (this.state.selectdates.length <= 1) {
              valueErr = document.getElementsByClassName("err_dates");
              valueErr[0].innerText =
                "Please select atleast 2 subscription Days";
              swal({
                title: "Error",
                text: "Please select atleast 2 subscription Days",
                icon: "warning",
                dangerMode: true,
              });
            } else {
              valueErr = document.getElementsByClassName("err_dates");
              valueErr[0].innerText = "";
            }
          }
        }
      }
    }
  };

  //Normal Orders
  opencash = async () => {
    const errorsFound = this.checkValidations();

    if (!errorsFound) {
      if (this.state.walletstatus === true) {
        const data = {};
        if (
          this.props.user_details._id &&
          +this.state.wallet_amount > +this.state.final_total_price &&
          this.state.selectedaddress &&
          this.state.deliveryslot
        ) {
          if (
            this.state.selectedaddress.houseNo &&
            ((this.state.giftingContent.status &&
              this.state.selectedgiftingaddress) ||
              !this.state.giftingContent.status) &&
            this.state.deliveryslot
          ) {
            this.setState({
              loading: true,
            });
            await ApiRequest(
              data,
              "/get/addtocart/" + this.props.user_details._id,
              "GET"
            )
              .then((res) => {
                if (res.data.data.outOfStock.length !== 0) {
                  this.setState({
                    loading: false,
                  });
                  swal({
                    title: "Please note!",
                    text: `${res.data.data.outOfStock.join(
                      ", "
                    )} is currently out of stock.`,
                    icon: "warning",
                    successMode: true,
                  }).then(() => this.props.history.push("/cart"));
                } else {
                  localStorage.setItem(
                    "status",
                    Boolean(res.data.data.subscribe)
                  );
                  cart_id = res.data.data.AddToCartId;
                  const requestData = this.makePlaceOrderData(
                    { AddToCartId: res.data.data.AddToCartId },
                    "normal",
                    "wallet_credit"
                  );
                  this.PlaceOrder_OFFLINE(requestData, "normal");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      } else {
        const data = {};
        var cart_id = "";
        if (
          this.props.user_details._id &&
          this.state.selectedaddress &&
          this.state.deliveryslot &&
          ((this.state.giftingContent.status &&
            this.state.selectedgiftingaddress) ||
            !this.state.giftingContent.status)
        ) {
          if (this.state.selectedaddress.houseNo) {
            this.setState({
              loading: true,
            });
            await ApiRequest(
              data,
              "/get/addtocart/" + this.props.user_details._id,
              "GET"
            )
              .then((res) => {
                if (res.data.data.outOfStock.length !== 0) {
                  this.setState({
                    loading: false,
                  });
                  swal({
                    title: "Please note!",
                    text: `${res.data.data.outOfStock.join(
                      ", "
                    )} is currently out of stock.`,
                    icon: "warning",
                    successMode: true,
                  }).then(() => this.props.history.push("/cart"));
                } else {
                  localStorage.setItem(
                    "status",
                    Boolean(res.data.data.subscribe)
                  );
                  cart_id = res.data.data.AddToCartId;
                  const requestData = this.makePlaceOrderData(
                    { AddToCartId: res.data.data.AddToCartId },
                    "normal",
                    "cod_online"
                  );
                  {
                    this.state.cashStatus === true
                      ? this.PlaceOrder_OFFLINE(requestData, "normal")
                      : this.state.razorpayStatus
                      ? this.PlaceOrder_RAZORPAY(requestData, "normal")
                      : this.PlaceOrder_PAYTM(requestData, "normal");
                  }
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
    }
  };

  truncateToDecimals = (num, dec = 2) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };

  getplaces_edit = (e) => {
    if (e.coordinates.lat) {
      fetch(
        "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          e.coordinates.lat +
          "," +
          e.coordinates.lng +
          "&key=AIzaSyCazDplf1HtSAyvjhY40uqUaTBuSYoVyGE"
      )
        .then((response) => response.json())
        .then((json) => {
          if (json.results) {
            var length = json.results.length;
            if (length) {
              // document.getElementsByClassName('live-location1')[0].value = e.place;
              // document.getElementById('live-lat').value = e.coordinates.lat;
              // document.getElementById('live-long').value = e.coordinates.lng;
              this.setState({
                showGoggleAddress: false,
                showInputAddres: true,
                street_address: e.place,
                latitude: e.coordinates.lat,
                longitude: e.coordinates.lng,
                country: json.results[length - 2].formatted_address,
                state: json.results[length - 3].formatted_address,
                city: json.results[length - 4].formatted_address,
                pincode: "",
                // json.results[0].address_components[
                //   json.results[0].address_components.length - 1
                // ].long_name,
              });
            }
          }
        });
    }
    // this.setState({ editstreet: e })
  };

  truncateToDecimals = (num, dec = 2) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };

  closeCustomerPopup = () => {
    this.setState({
      customerProfileModal: false,
      name: this.props.user_details.name,
      email: this.props.user_details.email,
      contact: this.props.user_details.contactNumber,
    });
  };

  clearAddress = () => {
    this.setState({
      street_address: null,
      editstreet: null,
      pincode: "",
      editpincode: "",
      searchKey: null,
    });
  };

  purchaseROAS(value) {
    fbq("track", "Purchase", { currency: "INR", value: value });
  }

  render() {
    const localRegionDetails = JSON.parse(
      localStorage.getItem("regionDetails")
    );
    const deliveryCharge = this.state.deliveryCharge;
    const codCharges = this.state.codCharges;
    // const deliveryCharge = localRegionDetails.districDeliveryCharges;
    // const codCharges = localRegionDetails.districCODCharges;
    if (
      this.props.dataInCart === [] ||
      this.props.dataInCart === undefined ||
      this.props.dataInCart.length === 0
    ) {
      this.props.history.push("/");
    }
    const street = this.state.street_address;

    const preOrderStatus = this.state.cart_data.find(
      (item) => item.preOrder == true
    );
    console.log(this.state.cart_data);
    return (
      <>
        {this.state.compopupstatus == false ? (
          <main>
            {this.state.loading ? (
              <div className="checkout-loading">
                <ReactLoading
                  type={"bubbles"}
                  color={"#febc15"}
                  height={"50px"}
                  width={"100px"}
                />
              </div>
            ) : (
              ""
            )}
            <div className="mj-checkout-wrap">
              <div className="container-fluid">
                <div className="checkout-row">
                  <div className="checkout-left-col">
                    <div className="checout-info">
                      <h2 style={{ fontSize: 25 }}>
                        Customer Details{" "}
                        <span
                          style={{
                            marginLeft: 5,
                            fontSize: 18,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            this.setState({ customerProfileModal: true })
                          }
                        >
                          Edit
                          <i
                            className="fa fa-pencil-square-o"
                            style={{ marginLeft: 5 }}
                            aria-hidden="true"
                          ></i>
                        </span>
                      </h2>
                      <ul>
                        <li>
                          <span className="check-name">Mobile Number</span>
                          <span className="check-mail modal-right-bx">
                            <input
                              type="number"
                              readOnly
                              value={this.state.contact}
                              name="contact"
                              onChange={(val) => this._handleFormmobile(val)}
                              className="count border-none"
                              placeholder="Contact Number"
                            />
                            <span className="focus-border"></span>
                          </span>
                          <span className="focus-border"></span>
                        </li>

                        <li>
                          <span className="check-name">Name</span>
                          <span className="check-mail modal-right-bx">
                            <input
                              type="text"
                              value={this.state.name}
                              readOnly
                              name="name"
                              onChange={(val) => this._handleForm(val)}
                              className="count border-none"
                              placeholder="Name"
                            />
                            <span className="focus-border"></span>
                          </span>
                          <span
                            style={{ color: "red" }}
                            className="err_name1"
                          ></span>
                        </li>

                        <li>
                          <span className="check-name">Email</span>
                          <span className="check-mail modal-right-bx">
                            <input
                              type="text"
                              value={this.state.email}
                              readOnly
                              name="email"
                              onChange={(val) => this._handleForm(val)}
                              className="count border-none"
                              placeholder="Email"
                            />
                            <span className="focus-border"></span>
                          </span>
                          <span
                            style={{ color: "red" }}
                            className="err_email1"
                          ></span>
                        </li>
                        {preOrderStatus ? (
                          <>
                            <li>
                              <span
                                className="check-name"
                                style={{
                                  color: "black",
                                  fontSize: "25px",
                                  fontWeight: "bold",
                                  fontFamily: "Montserrat-Regular",
                                }}
                              >
                                Pre Order Date
                              </span>
                              <span className="check-mail modal-right-bx">
                                <DatePicker
                                  className="yellow"
                                  format="DD/MM/YYYY"
                                  value={preOrderStatus.preOrderEndDate}
                                  onChange={(date, ev) =>
                                    this.selectdates(date, ev)
                                  }
                                  readOnly
                                />
                                <span className="focus-border"></span>
                              </span>
                              <span
                                style={{ color: "red" }}
                                className="err_dates"
                              ></span>
                            </li>
                            <span>Note : This Cart Contain Pre-order Item</span>
                          </>
                        ) : localStorage.getItem("status") === "true" ? (
                          <>
                            <li>
                              <span
                                className="check-name"
                                style={{
                                  color: "#333232",
                                  fontSize: "25px",
                                  fontWeight: "bold",
                                  fontFamily: "Montserrat-Regular",
                                }}
                              >
                                Subscription Dates
                              </span>
                              <span className="check-mail modal-right-bx">
                                <DatePicker
                                  minDate={new Date().setDate(
                                    new Date().getDate() + 1
                                  )}
                                  maxDate={new Date().setMonth(
                                    new Date().getMonth() + 1
                                  )}
                                  className="yellow"
                                  placeholder="Select Dates..."
                                  multiple={true}
                                  format="DD/MM/YYYY"
                                  value={this.state.selecteddates}
                                  onChange={(date, ev) =>
                                    this.selectdates(date, ev)
                                  }
                                />
                                <span className="focus-border"></span>
                              </span>
                              <span
                                style={{ color: "red" }}
                                className="err_dates"
                              ></span>
                            </li>
                          </>
                        ) : (
                          ""
                        )}
                        {/* {this.state.cart_data ? (
                          this.state.cart_data.map((item, index) =>
                            item.preOrder === true ? (
                              <>
                                <li>
                                  <span
                                    className="check-name"
                                    style={{
                                      color: "black",
                                      fontSize: "25px",
                                      fontWeight: "bold",
                                      fontFamily: "Montserrat-Regular",
                                    }}
                                  >
                                    Pre Order Date
                                  </span>
                                  <span className="check-mail modal-right-bx">
                                    <DatePicker
                                      className="yellow"
                                      format="DD/MM/YYYY"
                                      value={item.preOrderEndDate}
                                      onChange={(date, ev) =>
                                        this.selectdates(date, ev)
                                      }
                                      readOnly
                                    />
                                    <span className="focus-border"></span>
                                  </span>
                                  <span
                                    style={{ color: "red" }}
                                    className="err_dates"
                                  ></span>
                                </li>
                              </>
                            ) : (
                              <></>
                            )
                          )
                        ) : (
                          <></>
                        )} */}
                        {/* {localStorage.getItem("status") === "true"
                          ? this.state.cart_data
                            ? this.state.cart_data.map((item, index) =>
                                item.preOrder === true ? (
                                  <></>
                                ) : (
                                  <>
                                    <li>
                                      <span
                                        className="check-name"
                                        style={{
                                          color: "black",
                                          fontSize: "25px",
                                          fontWeight: "bold",
                                          fontFamily: "Montserrat-Regular",
                                        }}
                                      >
                                        Subscription Dates
                                      </span>
                                      <span className="check-mail modal-right-bx">
                                        <DatePicker
                                          minDate={new Date().setDate(
                                            new Date().getDate() + 1
                                          )}
                                          maxDate={new Date().setMonth(
                                            new Date().getMonth() + 1
                                          )}
                                          className="yellow"
                                          multiple={true}
                                          format="DD/MM/YYYY"
                                          value={this.state.selecteddates}
                                          onChange={(date, ev) =>
                                            this.selectdates(date, ev)
                                          }
                                        />
                                        <span className="focus-border"></span>
                                      </span>
                                      <span
                                        style={{ color: "red" }}
                                        className="err_dates"
                                      ></span>
                                    </li>
                                  </>
                                )
                              )
                            : ""
                          : ""} */}
                      </ul>
                      {localStorage.getItem("status") === "false"
                        ? this.state.giftingOnOff && (
                            <>
                              <Gifting
                                passGiftingData={(e) =>
                                  this.getGiftingContent(e)
                                }
                                changeGiftingStatus={this.state.giftingStatus}
                                formCompleted={(e) =>
                                  this.setState({ giftingFormCompleted: e })
                                }
                              />
                            </>
                          )
                        : ""}

                      {this.state.giftingContent.status ? (
                        <>
                          {" "}
                          <h2 style={{ fontSize: 25 }}>
                            Shipping Address (For Gifting)
                          </h2>
                          {this.state.all_address.map((item, index) => (
                            <div className="Card_des">
                              <div className="modal-form-bx">
                                <div className="input_radio">
                                  <input
                                    type="radio"
                                    name="selectedgiftingaddress"
                                    onChange={this.onchangeinngGifting.bind(
                                      this,
                                      item,
                                      index
                                    )}
                                    value={"giftingaddress" + index}
                                    id={"giftingaddress" + item._id}
                                  />
                                  <span className="checkout-custom-radio"></span>
                                </div>
                                <div className="heading">
                                  <h2>
                                    {item.locationTag}{" "}
                                    <span
                                      onClick={this.openeditModal.bind(
                                        this,
                                        item
                                      )}
                                    >
                                      <i
                                        className="fa fa-pencil-square-o"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </h2>

                                  <p>
                                    {item.houseNo +
                                      " " +
                                      ", " +
                                      item.street +
                                      (item.pincode
                                        ? item.street?.includes(item.pincode)
                                          ? ""
                                          : ", " + item.pincode
                                        : "") +
                                      (item.locality
                                        ? ", near " + item.locality
                                        : "")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <span
                            className="err err_giftingaddress"
                            style={{ display: "block", marginBottom: 8 }}
                          ></span>
                        </>
                      ) : (
                        ""
                      )}

                      <h2 style={{ fontSize: 25 }}>Billing Details</h2>
                      {this.state.all_address.map((item, index) => (
                        <div className="Card_des">
                          <div className="modal-form-bx">
                            <div className="input_radio">
                              <input
                                type="radio"
                                name="selectedaddress"
                                onChange={this.onchangeinng.bind(
                                  this,
                                  item,
                                  index
                                )}
                                value={"address" + index}
                                id={"address" + item._id}
                              />
                              <span className="checkout-custom-radio"></span>
                            </div>
                            <div className="heading">
                              <h2>
                                {item.locationTag}{" "}
                                <span
                                  onClick={this.openeditModal.bind(this, item)}
                                >
                                  <i
                                    className="fa fa-pencil-square-o"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </h2>

                              <p>
                                {item.houseNo +
                                  " " +
                                  ", " +
                                  item.street +
                                  (item.pincode
                                    ? item.street?.includes(item.pincode)
                                      ? ""
                                      : ", " + item.pincode
                                    : "") +
                                  (item.locality
                                    ? ", near " + item.locality
                                    : "")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => this.openModal()}
                        className="submit blank-btn add_new_address"
                      >
                        <span className="button-text">Add New Address</span>
                        <span className="button-overlay"></span>
                      </button>
                    </div>
                    <span
                      className="err err_address"
                      style={{
                        display: "block",
                        marginBottom: 8,
                        textTransform: "unset",
                      }}
                    ></span>
                    <div className="payment-wrap">
                      <h2>Payment Method</h2>
                      <div className="payment-detail">
                        <ul>
                          {this.state.paytmShow ? (
                            <li>
                              <label className="click-redio">
                                <input
                                  type="radio"
                                  checked={
                                    this.state.payStatus ? "checked" : ""
                                  }
                                  name="pay"
                                  onClick={(val) =>
                                    this._handlePaymentMode(val)
                                  }
                                />
                                <span className="p-custom-btn"></span>
                                <span className="checkmark">
                                  Pay with Paytm
                                </span>
                              </label>
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.razorpayShow ? (
                            <li>
                              <label className="click-redio">
                                <input
                                  type="radio"
                                  checked={
                                    this.state.razorpayStatus ? "checked" : ""
                                  }
                                  name="razorpay"
                                  onClick={(val) =>
                                    this._handlePaymentMode(val)
                                  }
                                />
                                <span className="p-custom-btn"></span>
                                <span className="checkmark">
                                  Pay with Razorpay
                                </span>
                              </label>
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.creditPaymentOnOff ? (
                            <li>
                              <label className="click-redio">
                                <input
                                  type="radio"
                                  checked={
                                    this.state.creditStatus ? "checked" : ""
                                  }
                                  name="credit"
                                  onClick={(val) =>
                                    this._handlePaymentMode(val)
                                  }
                                />
                                <span className="p-custom-btn"></span>
                                <span className="checkmark">
                                  Credit (₹
                                  {this.state.creditPending
                                    ? this.state.creditPending.toFixed(2)
                                    : 0}
                                  )
                                </span>
                              </label>
                            </li>
                          ) : (
                            ""
                          )}
                          <li>
                            <label className="click-redio">
                              <input
                                type="radio"
                                checked={
                                  this.state.walletstatus
                                    ? this.state.creditStatus
                                      ? ""
                                      : "checked"
                                    : ""
                                }
                                name="wallet"
                                onClick={(val) => this._handlePaymentMode(val)}
                              />
                              <span className="p-custom-btn"></span>
                              <span className="checkmark">
                                Pay from wallet (₹
                                {this.state.wallet_amount
                                  ? this.state.wallet_amount.toFixed(2)
                                  : 0}
                                )
                              </span>
                              <span
                                className="err err_wallet"
                                style={{ display: "block", marginBottom: 8 }}
                              ></span>
                            </label>
                          </li>
                          {!this.state.giftingContent.status &&
                          this.state.codAvailable ? (
                            localStorage.getItem("status") === "true" ? (
                              ""
                            ) : (
                              <li>
                                <label className="click-redio">
                                  <input
                                    type="radio"
                                    checked={
                                      this.state.cashStatus ? "checked" : ""
                                    }
                                    name="cash"
                                    onClick={(val) =>
                                      this._handlePaymentMode(val)
                                    }
                                  />
                                  <span className="p-custom-btn"></span>
                                  <span className="checkmark">
                                    Cash on Delivery
                                  </span>
                                </label>
                              </li>
                            )
                          ) : (
                            ""
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="payment-wrap">
                      <h2>Delivery Slot</h2>
                      <div className="payment-detail">
                        <ul>
                          {/*Free Shipping */}
                          {this.state.Free_Shipping === "yes"
                            ? localStorage.getItem("status") !== "true" && (
                                <li>
                                  <label className="click-redio">
                                    <input
                                      type="radio"
                                      checked={
                                        this.state.deliveryslot ===
                                        "Free_Shipping"
                                          ? "checked"
                                          : ""
                                      }
                                      id="slot0"
                                      name="deliveryslot"
                                      value={"Free_Shipping"}
                                      onClick={(val) =>
                                        this.changeDeliverySlot(val)
                                      }
                                    />
                                    <span className="p-custom-btn"></span>
                                    <span className="checkmark">
                                      Free Shipping - Rs.0
                                    </span>
                                  </label>
                                </li>
                              )
                            : ""}

                          {/*Same Day Delivery */}
                          {this.state.deliverySlotInfo
                            .Same_day_delivery_till_2pm === "yes" &&
                          localStorage.getItem("status") !== "true" ? (
                            <li>
                              <label className="click-redio">
                                <input
                                  type="radio"
                                  checked={
                                    this.state.deliveryslot ===
                                    "Same_day_delivery_till_2pm"
                                      ? "checked"
                                      : ""
                                  }
                                  id="slot0"
                                  name="deliveryslot"
                                  value={"Same_day_delivery_till_2pm"}
                                  onClick={(val) =>
                                    this.changeDeliverySlot(val)
                                  }
                                />
                                <span className="p-custom-btn"></span>
                                <span className="checkmark">
                                  {this.state.deliverySlotInfo.Slot1String}
                                  {/* Same Day Delivery  */}- Rs.{" "}
                                  {this.state.deliverySlotInfo
                                    .Same_day_delivery_till_2pm_charges || 0}
                                </span>
                              </label>
                            </li>
                          ) : (
                            ""
                          )}

                          {/*Standard Delivery */}
                          {(localStorage.getItem("status") === "true" ||
                            preOrderStatus) &&
                          this.state.deliverySlotInfo.Standard_delivery ===
                            "yes" ? (
                            <li>
                              <label className="click-redio">
                                <input
                                  type="radio"
                                  checked={
                                    this.state.deliveryslot ===
                                    "Standard_delivery"
                                      ? "checked"
                                      : ""
                                  }
                                  id="slot5"
                                  name="deliveryslot"
                                  value={"Standard_delivery"}
                                  onClick={(val) =>
                                    this.changeDeliverySlot(val)
                                  }
                                />
                                <span className="p-custom-btn"></span>
                                <span className="checkmark">
                                  {this.state.deliverySlotInfo.Slot5String}
                                  {/* Same Day Delivery  */}- Rs.{" "}
                                  {this.state.deliverySlotInfo
                                    .Standard_delivery_charges || 0}
                                </span>
                              </label>
                            </li>
                          ) : (
                            ""
                          )}

                          {/*Next Day standard Delivery 9-9 */}
                          {this.state.deliverySlotInfo
                            .Next_day_delivery_Standard_9am_9pm === "yes"
                            ? localStorage.getItem("status") !== "true" && (
                                <li>
                                  <label className="click-redio">
                                    <input
                                      type="radio"
                                      checked={
                                        this.state.deliveryslot ===
                                        "Next_day_delivery_Standard_9am_9pm"
                                          ? "checked"
                                          : ""
                                      }
                                      name="deliveryslot"
                                      value={
                                        "Next_day_delivery_Standard_9am_9pm"
                                      }
                                      onClick={(val) =>
                                        this.changeDeliverySlot(val)
                                      }
                                    />
                                    <span className="p-custom-btn"></span>
                                    <span className="checkmark">
                                      {this.state.deliverySlotInfo.Slot2String}-
                                      {/* Next Day Standard Delivery (9am - 9pm) - */}
                                      Rs.{" "}
                                      {this.state.deliverySlotInfo
                                        .Next_day_delivery_Standard_9am_9pm_charges ||
                                        0}
                                    </span>
                                  </label>
                                </li>
                              )
                            : ""}

                          {/*Next Day Delivery 2-8*/}
                          {this.state.deliverySlotInfo
                            .Next_day_delivery_2pm_8pm === "yes"
                            ? localStorage.getItem("status") !== "true" && (
                                <li>
                                  <label className="click-redio">
                                    <input
                                      type="radio"
                                      checked={
                                        this.state.deliveryslot ===
                                        "Next_day_delivery_2pm_8pm"
                                          ? "checked"
                                          : ""
                                      }
                                      name="deliveryslot"
                                      value={"Next_day_delivery_2pm_8pm"}
                                      onClick={(val) =>
                                        this.changeDeliverySlot(val)
                                      }
                                    />
                                    <span className="p-custom-btn"></span>
                                    <span className="checkmark">
                                      {this.state.deliverySlotInfo.Slot4String}-
                                      {/* Next Day Delivery (2pm - 8pm)  */}-
                                      Rs.{" "}
                                      {this.state.deliverySlotInfo
                                        .Next_day_delivery_2pm_8pm_charges || 0}
                                    </span>
                                  </label>
                                </li>
                              )
                            : ""}

                          {/*Next Day Delivery 8-2*/}
                          {this.state.deliverySlotInfo
                            .Next_day_delivery_8am_2pm === "yes"
                            ? localStorage.getItem("status") !== "true" && (
                                <li>
                                  <label className="click-redio">
                                    <input
                                      type="radio"
                                      checked={
                                        this.state.deliveryslot ===
                                        "Next_day_delivery_8am_2pm"
                                          ? "checked"
                                          : ""
                                      }
                                      name="deliveryslot"
                                      value={"Next_day_delivery_8am_2pm"}
                                      onClick={(val) =>
                                        this.changeDeliverySlot(val)
                                      }
                                    />
                                    <span className="p-custom-btn"></span>
                                    <span className="checkmark">
                                      {this.state.deliverySlotInfo.Slot3String}-
                                      {/* Next Day Delivery (8am - 2pm)  */}-
                                      Rs.{" "}
                                      {this.state.deliverySlotInfo
                                        .Next_day_delivery_8am_2pm_charges || 0}
                                    </span>
                                  </label>
                                </li>
                              )
                            : ""}

                          {/*Farm Pickup*/}
                          {this.state.deliverySlotInfo.Farm_pick_up === "yes"
                            ? localStorage.getItem("status") !== "true" && (
                                <li>
                                  <label className="click-redio">
                                    <input
                                      type="radio"
                                      checked={
                                        this.state.deliveryslot ===
                                        "Farm_pick_up"
                                          ? "checked"
                                          : ""
                                      }
                                      name="deliveryslot"
                                      value={"Farm_pick_up"}
                                      onClick={(val) =>
                                        this.changeDeliverySlot(val)
                                      }
                                    />
                                    <span className="p-custom-btn"></span>
                                    <span className="checkmark">
                                      Farm Pickup - Rs.{" "}
                                      {this.state.deliverySlotInfo
                                        .Farm_pick_up_delivery_charges || 0}
                                    </span>
                                  </label>
                                </li>
                              )
                            : ""}
                        </ul>
                      </div>
                      <div className="err err_deliveryslot"></div>
                    </div>
                  </div>
                  <div className="checkout-right-col new_right_prod">
                    <div className="checkout-table-class">
                      <h2 style={{ fontSize: 25 }}>Shopping Cart</h2>
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
                                return item.simpleData &&
                                  item.simpleData.length > 0 &&
                                  item.TypeOfProduct === "simple" ? (
                                  item.simpleData[0].package.length > 0 ? (
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
                                            <td className="pointer new_pinter">
                                              <Link
                                                to={"/product/" + item.slug}
                                              >
                                                <div className="cart_itm_image">
                                                  <img
                                                    src={
                                                      item.images[0]
                                                        ? imageUrl +
                                                            item.images[0]
                                                              .image ||
                                                          item.images[0]
                                                        : imageUrl +
                                                          localStorage.getItem(
                                                            "prdImg"
                                                          )
                                                    }
                                                    alt=""
                                                  />{" "}
                                                </div>
                                              </Link>
                                            </td>
                                            <td>
                                              <div className="pro-cart-name">
                                                <Link
                                                  to={"/product/" + item.slug}
                                                >
                                                  <h4>
                                                    {item.product_name}
                                                    <span>
                                                      {data.packetLabel}
                                                    </span>
                                                  </h4>
                                                  <p>
                                                    <span>
                                                      ₹
                                                      {item.totalPriceBeforeGST &&
                                                      item.totalPriceBeforeGST !=
                                                        undefined
                                                        ? item.totalPriceBeforeGST
                                                        : item.totalprice}
                                                    </span>
                                                  </p>
                                                </Link>
                                              </div>
                                              <div className="cart-qty">
                                                <h5>Quantity</h5>
                                                <div className="qty-click">
                                                  <span
                                                    className="count"
                                                    type="text"
                                                  >
                                                    {data.quantity}
                                                  </span>{" "}
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })
                                  ) : (
                                    <tr>
                                      <td className="pointer">
                                        <Link to={"/product/" + item.slug}>
                                          <div className="cart_itm_image">
                                            <img
                                              src={
                                                item.images[0]
                                                  ? imageUrl +
                                                      item.images[0].image ||
                                                    item.images[0]
                                                  : imageUrl +
                                                    localStorage.getItem(
                                                      "prdImg"
                                                    )
                                              }
                                              alt=""
                                            />{" "}
                                          </div>
                                        </Link>
                                      </td>
                                      <td>
                                        <div className="pro-cart-name">
                                          <Link to={"/product/" + item.slug}>
                                            <h4>
                                              {item.product_name}
                                              <span>
                                                {item.unitQuantity +
                                                  " " +
                                                  item.unitMeasurement}
                                              </span>
                                            </h4>
                                            <p>
                                              <span>
                                                ₹
                                                {item.totalPriceBeforeGST ||
                                                  item.price * item.qty}
                                              </span>
                                            </p>
                                          </Link>
                                        </div>
                                        <div className="cart-qty">
                                          <h5>Quantity</h5>
                                          <div className="qty-click">
                                            <span className="count" type="text">
                                              {item.qty}
                                            </span>{" "}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                ) : (
                                  <tr>
                                    <td className="pointer new_pinter">
                                      <Link to={"/product/" + item.slug}>
                                        <div className="cart_itm_image">
                                          <img
                                            src={
                                              item.images[0]
                                                ? imageUrl +
                                                    item.images[0].image ||
                                                  item.images[0]
                                                : imageUrl +
                                                  localStorage.getItem("prdImg")
                                            }
                                            alt=""
                                          />{" "}
                                        </div>
                                      </Link>
                                    </td>
                                    <td>
                                      <div className="pro-cart-name">
                                        <Link to={"/product/" + item.slug}>
                                          <h4>
                                            {item.product_name}
                                            <span></span>
                                          </h4>
                                          <p>
                                            ₹
                                            {item.totalPriceBeforeGST ||
                                              item.totalprice}
                                          </p>
                                        </Link>
                                      </div>
                                      <div className="cart-qty">
                                        <h5>Quantity</h5>
                                        <div className="qty-click">
                                          <span className="count" type="text">
                                            {item.qty}
                                          </span>{" "}
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
                                    </td>
                                  </tr>
                                );
                              })
                            : null}
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
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label
                        htmlFor="delivery_instructions"
                        style={{ fontWeight: "800" }}
                      >
                        Delivery Instructions(If any)
                      </label>
                      <input
                        type="text"
                        name="delivery_instructions"
                        placeholder="Enter Delivery Instructions..."
                        value={this.state.delivery_instructions}
                        onChange={(val) =>
                          val.target.value.length <= 50
                            ? this._handleForm(val)
                            : ""
                        }
                        style={{ padding: 5 }}
                      />
                    </div>
                    {/* {!this.state.subscribe_status && (
                      <div className="checout-info">
                        <ul>
                          <li>
                            <span
                              className="check-name"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p style={{ margin: 0, padding: 0 }}>
                                Redeem Seeds
                              </p>
                              <p style={{ margin: 0, padding: 0 }}>
                                Redeemable Krishi Seeds available{" "}
                                {parseFloat(
                                  this.state.maxLoyaltyPointToRedeem
                                ).toFixed(2)}
                              </p>
                            </span>
                            <span className="check-mail modal-right-bx">
                              <input
                                type="number"
                                value={this.state.loyalty_point_input}
                                name="loyalty_point_input"
                                // min="0"
                                onChange={(val) => {
                                  if (
                                    +val.target.value <=
                                      +this.state.maxLoyaltyPointToRedeem &&
                                    +val.target.value > 0
                                  ) {
                                    this.setState({
                                      loyalty_point_input: +val.target.value,
                                    });
                                  }
                                  if (+val.target.value <= 0) {
                                    this.setState({
                                      loyalty_point_input: null,
                                    });
                                  }
                                  if (
                                    +val.target.value >
                                    +this.state.maxLoyaltyPointToRedeem
                                  ) {
                                    this.setState({
                                      loyalty_point_input:
                                        this.state.maxLoyaltyPointToRedeem,
                                    });
                                  }
                                  setTimeout(
                                    () => this.calculate_summry(),
                                    100
                                  );
                                }}
                                className="count"
                                placeholder="0"
                              />
                              <span className="focus-border"></span>
                            </span>
                            <span className="focus-border"></span>
                          </li>
                        </ul>
                      </div>
                    )} */}
                    {/* {!this.state.subscribe_status && ( */}
                    <div className="redeem_loyalty_container">
                      <input
                        type="checkbox"
                        name="loyaltyPoint"
                        checked={!!this.state.loyaltyPointApplied}
                        className="redeem_loyalty_input"
                        onChange={() => {
                          this.setState({
                            loyaltyPointApplied:
                              !this.state.loyaltyPointApplied,
                            loyalty_point_input:
                              this.state.maxLoyaltyPointToRedeem,
                          });

                          setTimeout(() => {
                            localStorage.setItem(
                              "loyaltyApplied",
                              JSON.stringify(this.state.loyaltyPointApplied)
                            );
                            this.calculateDiscountPerItem();
                          }, 50);
                        }}
                      />
                      <label htmlFor="loyaltyPoint">
                        <label htmlFor="loyaltyPoint">
                          Redeemable Krishi Seeds available -{" "}
                          {this.state.totalSeedRedeem &&
                          this.state.seedValue &&
                          this.state.subscriptionRedeem
                            ? this.state.subscriptionRedeem || 0
                            : this.truncateToDecimals(
                                +this.state.totalSeedRedeem /
                                  +this.state.seedValue
                              )}{" "}
                          (₹
                          {this.state.subscriptionRedeem ||
                            this.state.totalSeedRedeem}
                          )
                        </label>
                      </label>
                    </div>
                    {/* )} */}
                    {this.state.cart_data && this.state.cart_data[0] ? (
                      <div className="cart-summary">
                        <h2>Summary</h2>
                        <div className="summary-table-class">
                          <table className="summarytable">
                            <tbody>
                              {/* {this.state.showTaxFields ? ( */}
                              <tr>
                                <td>
                                  Sub-total{" "}
                                  {localStorage.getItem("status") ===
                                    "true" && (
                                    <small style={{ color: "#9b9b9b" }}>
                                      (per day)
                                    </small>
                                  )}
                                </td>
                                <td>
                                  ₹
                                  {this.truncateToDecimals(
                                    +this.state.subTotalWithoutGST
                                    // +this.state.subTotal_price -
                                    //   +this.state.gst_price
                                  )}
                                </td>
                              </tr>
                              {/* ) : (
                                ""
                              )} */}
                              {+this.state.discount_amount !== 0 ? (
                                <tr>
                                  <td>
                                    Discount (
                                    {localStorage.getItem("coupon_code")})
                                    {localStorage.getItem("status") ===
                                      "true" && (
                                      <small style={{ color: "#9b9b9b" }}>
                                        (Fixed)
                                      </small>
                                    )}
                                  </td>
                                  <td>
                                    {this.state.discount_amount &&
                                    this.state.discount_amount != ""
                                      ? "₹" + this.state.discount_amount
                                      : "--"}
                                  </td>
                                </tr>
                              ) : (
                                ""
                              )}
                              {this.state.referralEligible &&
                              this.state.referral_discount ? (
                                <tr>
                                  <td>
                                    Referral Discount{" "}
                                    {localStorage.getItem("status") ===
                                      "true" && (
                                      <small style={{ color: "#9b9b9b" }}>
                                        (per day)
                                      </small>
                                    )}
                                  </td>
                                  <td>₹{this.state.referral_discount}</td>
                                </tr>
                              ) : (
                                ""
                              )}
                              {this.state.loyaltyPointApplied &&
                              this.state.totalSeedRedeem ? (
                                <tr>
                                  <td>
                                    Redeem Points Discount{" "}
                                    {localStorage.getItem("status") ===
                                      "true" && (
                                      <small style={{ color: "#9b9b9b" }}>
                                        (per day)
                                      </small>
                                    )}
                                  </td>
                                  <td>
                                    ₹
                                    {this.state.subscriptionRedeemPerDay
                                      ? this.state.subscriptionRedeemPerDay.toFixed(
                                          2
                                        )
                                      : this.state.totalSeedRedeem}
                                  </td>
                                </tr>
                              ) : (
                                ""
                              )}

                              {this.state.showTaxFields ? (
                                <>
                                  <tr
                                    className="gst-dropdown-toggle"
                                    onClick={() =>
                                      this.setState({
                                        showGstDropdown:
                                          !this.state.showGstDropdown,
                                      })
                                    }
                                  >
                                    <td>
                                      GST{" "}
                                      {this.state.gst_price > 0 ? (
                                        this.state.showGstDropdown ? (
                                          <i className="fa fa-caret-up"></i>
                                        ) : (
                                          <i className="fa fa-caret-down"></i>
                                        )
                                      ) : (
                                        ""
                                      )}
                                      {localStorage.getItem("status") ===
                                        "true" && (
                                        <small style={{ color: "#9b9b9b" }}>
                                          (per day)
                                        </small>
                                      )}
                                    </td>
                                    <td>₹{this.state.gst_price}</td>
                                  </tr>
                                  {this.state.showGstDropdown &&
                                    this.state.gst_price > 0 && (
                                      <div className="gst-dropdown">
                                        {this.state.allGstLists.map((li) => {
                                          return (
                                            li.tax_name &&
                                            li.totalPrice && (
                                              <div style={{ display: "flex" }}>
                                                <p>
                                                  {li.tax_name} {li.tax_percent}
                                                  %
                                                </p>
                                                <p style={{ marginLeft: 20 }}>
                                                  ₹{li.totalPrice}
                                                </p>
                                              </div>
                                            )
                                          );
                                        })}
                                      </div>
                                    )}
                                </>
                              ) : (
                                ""
                              )}
                              {/* <tr>
                                <td>
                                  Sub-total <small>(including GST)</small>
                                </td>
                                <td>₹{this.state.subTotal_price}</td>
                              </tr> */}

                              {/* <tr>
                                <td>
                                  Sub-Total <small>(including GST)</small>
                                </td>
                                <td>₹{this.state.total_price.toFixed(2)}</td>
                              </tr> */}

                              {deliveryCharge
                                ? deliveryCharge !== null && (
                                    <tr>
                                      <td>
                                        Delivery Charges{" "}
                                        {localStorage.getItem("status") ===
                                          "true" && (
                                          <small style={{ color: "#9b9b9b" }}>
                                            (per day)
                                          </small>
                                        )}
                                      </td>
                                      <td>
                                        ₹
                                        {deliveryCharge !== null
                                          ? deliveryCharge
                                          : "0"}
                                      </td>
                                    </tr>
                                  )
                                : ""}

                              {this.state.cashStatus &&
                              this.state.codAvailable &&
                              codCharges ? (
                                <tr>
                                  <td>
                                    Cod Charges{" "}
                                    {localStorage.getItem("status") ===
                                      "true" && (
                                      <small style={{ color: "#9b9b9b" }}>
                                        (per day)
                                      </small>
                                    )}
                                  </td>
                                  <td>₹{codCharges}</td>
                                </tr>
                              ) : (
                                ""
                              )}
                              {!preOrderStatus &&
                              localStorage.getItem("status") === "true" ? (
                                <tr>
                                  <td>No. Of Days</td>
                                  <td>{this.state.selectdates.length}</td>
                                </tr>
                              ) : (
                                ""
                              )}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td>Total</td>
                                <td>₹{this.state.final_total_price}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    ) : (
                      "Cart is Empty"
                    )}
                    {localStorage.getItem("status") === "true" ? (
                      this.state.cart_data && this.state.cart_data[0] ? (
                        preOrderStatus ? (
                          <button
                            className="submit fill-btn"
                            onClick={() => this.opencashsubscribe()}
                          >
                            <span className="button-text">
                              {this.state.loading ? (
                                <i
                                  className="fa fa-spinner searchLoading"
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                "Place Order"
                              )}
                            </span>
                            <span className="button-overlay"></span>
                          </button>
                        ) : (
                          <div className="place-order">
                            {this.state.cashStatus == true ? (
                              <button
                                className="submit fill-btn"
                                onClick={() => this.opencashsubscribe()}
                              >
                                <span className="button-text">
                                  {this.state.loading ? (
                                    <i
                                      className="fa fa-spinner searchLoading"
                                      aria-hidden="true"
                                    ></i>
                                  ) : (
                                    "Start Subscription"
                                  )}
                                </span>
                                <span className="button-overlay"></span>
                              </button>
                            ) : (
                              <button
                                className="submit fill-btn"
                                onClick={() => this.opencashsubscribe()}
                              >
                                <span className="button-text">
                                  {this.state.loading ? (
                                    <i
                                      className="fa fa-spinner searchLoading"
                                      aria-hidden="true"
                                    ></i>
                                  ) : (
                                    "Start Subscription"
                                  )}
                                </span>
                                <span className="button-overlay"></span>
                              </button>
                            )}
                          </div>
                        )
                      ) : (
                        "Add item in Cart to proceed"
                      )
                    ) : (
                      ""
                    )}
                    {this.state.cart_data &&
                    this.state.cart_data[0] &&
                    localStorage.getItem("status") !== "true" ? (
                      <div className="place-order">
                        {this.state.cashStatus == true ? (
                          <button
                            className="submit fill-btn"
                            onClick={() => this.opencash()}
                          >
                            <span className="button-text">
                              {this.state.loading ? (
                                <i
                                  className="fa fa-spinner searchLoading"
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                "Place Order"
                              )}
                            </span>
                            <span className="button-overlay"></span>
                          </button>
                        ) : (
                          <button
                            className="submit fill-btn"
                            onClick={() => this.opencash()}
                          >
                            <span className="button-text">
                              {this.state.loading ? (
                                <i
                                  className="fa fa-spinner searchLoading"
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                "Place Order"
                              )}
                            </span>
                            <span className="button-overlay"></span>
                          </button>
                        )}
                      </div>
                    ) : localStorage.getItem("status") !== "false" ? (
                      ""
                    ) : (
                      "Add item in Cart to proceed"
                    )}
                    {+this.state.subTotal_price <
                    +this.state.minimumOrderValue ? (
                      <p style={{ color: "red" }} className="p-2">
                        Minimum order value for selected pincode is ₹
                        {this.state.minimumOrderValue}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <main className="page-content">
            <section className="page-banner">
              <div className="banner-figure">
                <img src={banner} alt="Account" />
              </div>
              <div className="banner-top-text">
                <h6>Explore</h6>
                <h1>My account</h1>
              </div>
            </section>
            <section className="center-form-single-col">
              <h3>Login/Sign up</h3>
              <form>
                <>
                  <div className="form-group">
                    <label>Mobile Number*</label>

                    <input
                      type="text"
                      name="contact"
                      onChange={(val) => this._handleFormmobile(val)}
                      className="count"
                      placeholder="Contact Number"
                      readOnly={this.state.readonlytrue == true ? true : false}
                    />
                  </div>
                  <div className="form-group">
                    <p>A OTP will be sent to your number.</p>
                    <p>
                      {" "}
                      Your personal data will be used to support your experience
                      throughout this website to manage access to your account,
                      and for other purposes described in our{" "}
                      <Link to="/Privacy-Policy">privacy policy.</Link>
                    </p>
                  </div>
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
                {this.state.buttonstatus == true ? (
                  <>
                    <div className="form-bottom">
                      <button
                        type="button"
                        className="button-design"
                        onClick={(ev) => this.verify(ev)}
                      >
                        <span className="button-text">Send OTP</span>
                        <span className="button-overlay"></span>
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {this.state.verifymobilestatus == "semitrue" ? (
                  <>
                    <span className="check-name">Enter Otp : </span>
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
                      <i className="fa fa-undo" aria-hidden="true"></i>
                      Resend OTP
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
                      />
                    </span>
                    <span style={{ color: "red" }} className="err_name"></span>
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
                      />
                    </span>
                    <span style={{ color: "red" }} className="err_email"></span>
                  </>
                ) : (
                  ""
                )}

                {this.state.verifymobilestatus == "fullytrue" ? (
                  <button
                    type="button"
                    className="button-design"
                    onClick={(ev) => this.forward(ev)}
                  >
                    Save and Continue
                  </button>
                ) : (
                  ""
                )}
              </form>
            </section>
          </main>
        )}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="adding-address"
          contentLabel="Add Address"
        >
          <Add_address
            addressSaved={() => this.closeModal()}
            adminPanel={false}
          />
          {/* <div role="dialog">
            <div className="modal-dialog manage-add NEW_ADD_NEW">
              <div className="modal-content">
                <button
                  type="button"
                  className="close"
                  onClick={this.closeModal}
                >
                  &times;
                </button>
                <h4 className="modal-title">Add Address</h4>
                <div className="modal-form-bx">
                  <form>
                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>
                          Address <span className="asterisk">*</span>
                          <a
                            className="pick-location-btn"
                            onClick={(e) => this.getCurrentPosition(e)}
                          >
                            Pick Current Location
                          </a>
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        {this.state.street_address ? (
                          <p>
                            {" "}
                            <span className="cross-address-btn">
                              <i
                                className="fas fa-times"
                                onClick={() => this.clearAddress()}
                              ></i>{" "}
                            </span>
                            {this.state.street_address}
                          </p>
                        ) : (
                          ""
                        )}
                        <Autocomplete
                          apiKey={GOOGLE_API_KEY}
                          placeholder={this.state.street_address}
                          options={{
                            types: ["geocode", "establishment"],
                            componentRestrictions: {
                              country: ["in"],
                            },
                          }}
                          onChange={(e) =>
                            this.setState({ searchKey: e.target.value })
                          }
                          value={
                            this.state.searchKey ||
                            this.state.street_address ||
                            ""
                          }
                          onPlaceSelected={(e) => this.changePlaces(e)}
                        />
                        <span className="focus-border"></span>
                        <span className="err err_street_address err_add_fullAddress"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>
                          Pincode
                          <span className="asterisk">*</span>
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        {this.state.showPincodeInput ? (
                          <input
                            type="number"
                            name="pincode"
                            className="form-control"
                            placeholder="Enter Pincode"
                            value={this.state.pincode}
                            onChange={(ev) => this.formHandler(ev)}
                          />
                        ) : (
                          <input
                            type="number"
                            name="pincode"
                            readOnly={true}
                            className="form-control"
                            placeholder="Enter Pincode"
                            value={this.state.pincode}
                            onChange={(ev) => this.formHandler(ev)}
                          />
                        )}
                        <span className="focus-border"></span>
                        <span className="err err_pincode"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>
                          Complete Address <span className="asterisk">*</span>
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="address"
                          className="form-control"
                          placeholder="Enter House / Flat No."
                          onChange={(ev) => this.formHandler(ev)}
                        />
                        <span className="focus-border"></span>
                        <span className="err err_location_tag err_add_houseNo"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Landmark</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="locality"
                          className="form-control"
                          placeholder="Enter Landmark"
                          onChange={(ev) => this.formHandler(ev)}
                        />
                        <span className="focus-border"></span>
                        <span className="err err_locality"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>
                          Location Tag<span className="asterisk">*</span> (Eg.
                          Home, Office, etc.)
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="location_tag"
                          className="form-control"
                          placeholder="Enter Location Tag"
                          onChange={(ev) => this.formHandler(ev)}
                        />
                        <span className="focus-border"></span>
                        <span className="err err_location_tag err_add_location_tag"></span>
                      </div>
                    </div>
                    <div>
                      Your google location (We suggest you put your delivery
                      address coordinates, will help us reach you faster)
                    </div>
                    <div className="modal-bottom">
                      <button
                        type="button"
                        className="submit fill-btn"
                        onClick={() => this.saveing()}
                      >
                        <span className="button-text">Save</span>
                        <span className="button-overlay"></span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div> */}
        </Modal>

        {/* edit addres modal start */}
        <Modal
          isOpen={this.state.modalIsOpenedit}
          onRequestClose={this.closeModal}
          className="adding-address"
          contentLabel="Add Address"
        >
          {" "}
          <Edit_address
            addressSaved={() => this.closeModal()}
            selectedEditAddress={this.state.selectedEditAddress}
            adminPanel={false}
          />
          {/* <div role="dialog">
            <div className="modal-dialog manage-add NEW_ADD_NEW">
              <div className="modal-content">
                <button
                  type="button"
                  className="close"
                  onClick={this.closeModal}
                >
                  &times;
                </button>
                <h4 className="modal-title">Edit Address</h4>
                <div className="modal-form-bx">
                  <form>
                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>
                          Address
                          <span className="asterisk">*</span>
                          <a
                            className="pick-location-btn"
                            onClick={(e) => this.getCurrentPosition(e)}
                          >
                            Pick Current Location
                          </a>
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        {this.state.street_address || this.state.editstreet ? (
                          <span>
                            {" "}
                            <span className="cross-address-btn">
                              <i
                                className="fas fa-times"
                                onClick={() => this.clearAddress()}
                              ></i>{" "}
                            </span>
                            {this.state.street_address
                              ? this.state.street_address
                              : this.state.editstreet}
                          </span>
                        ) : (
                          ""
                        )}
                        <Autocomplete
                          apiKey={GOOGLE_API_KEY}
                          options={{
                            types: ["geocode", "establishment"],
                            componentRestrictions: {
                              country: ["in"],
                            },
                          }}
                          onChange={(e) =>
                            this.setState({ searchKey: e.target.value })
                          }
                          value={
                            this.state.searchKey ||
                            this.state.street_address ||
                            ""
                          }
                          onPlaceSelected={(e) => this.changePlaces_edit(e)}
                        />
                        <span className="err err_editstreet"></span>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>
                          Pincode
                          <span className="asterisk">*</span>
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        {this.state.showPincodeInput ? (
                          <input
                            type="number"
                            name="editpincode"
                            className="form-control"
                            placeholder="Enter Pincode"
                            value={this.state.editpincode}
                            onChange={(ev) => this.formHandler(ev)}
                          />
                        ) : (
                          <input
                            type="number"
                            name="editpincode"
                            readOnly={true}
                            className="form-control"
                            placeholder="Enter Pincode"
                            value={this.state.editpincode}
                            onChange={(ev) => this.formHandler(ev)}
                          />
                        )}
                        <span className="focus-border"></span>
                        <span className="err err_editpincode"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>
                          Complete Address <span className="asterisk">*</span>
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="edithouseNo"
                          className="form-control"
                          placeholder="Enter Address"
                          onChange={(ev) => this.formHandler(ev)}
                          value={this.state.edithouseNo}
                        />
                        <span className="err err_edithouseNo"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Landmark</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="locality"
                          className="form-control"
                          placeholder="Enter Landmark"
                          onChange={(ev) => this.formHandler(ev)}
                          value={this.state.locality}
                        />
                        <span className="err err_editstreet"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>
                          Location Tag<span className="asterisk">*</span> (Eg.
                          Home, Office, etc.)
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="editlocattion_tag"
                          className="form-control"
                          placeholder="Enter Location Tag"
                          onChange={(ev) => this.formHandler(ev)}
                          value={this.state.editlocattion_tag}
                        />

                        <span className="err err_location_tag"></span>
                      </div>
                    </div>
                    <div>
                      Your google location (We suggest you put your delivery
                      address coordinates, will help us reach you faster)
                    </div>
                    <div className="modal-bottom">
                      <button
                        type="button"
                        className="submit fill-btn"
                        onClick={() => this.update()}
                      >
                        <span className="button-text">Update</span>
                        <span className="button-overlay"></span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
                      </div>*/}
        </Modal>

        {/* edit address modal end */}

        {/* customer details modal start*/}
        <Modal
          isOpen={this.state.customerProfileModal}
          onRequestClose={() => this.setState({ customerProfileModal: false })}
          className="adding-address"
          contentLabel="Add Address"
          style={{ overflow: "hidden" }}
        >
          <UserProfile close={() => this.closeCustomerPopup()} />
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

const dispatchStateToProps = (dispatch) => ({
  checkout: (data) => dispatch(checkout(data)),
  userdetails: (data) => dispatch(userdetails(data)),
  addToCart: (data) => dispatch(addToCart(data)),
  changeDelivery: (data) => dispatch(changeDelivery(data)),
  changethankyouAuth: (data) => dispatch(changethankyouAuth(data)),
});

export default connect(mapStateToProps, dispatchStateToProps)(Checkout);
