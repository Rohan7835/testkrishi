import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Geocode from "react-geocode";
import Modal from "react-modal";
import Select from "react-select";
import SelectSearch from "react-select-search";
import Switch from "react-switch";
import "react-times/css/classic/default.css";
import "react-times/css/material/default.css";
import LoadingBar from "react-top-loading-bar";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
import "../../../assets/css/common.css";
import "../../../assets/css/styles.css";
import Add_address from "../../../components/Address/Add_address";
import Edit_address from "../../../components/Address/Edit_address";
import Group_Product from "../../../components/Group/Group_Product";
import Adminfooter from "../elements/admin_footer";
import Adminheader from "../elements/admin_header";
import Adminsiderbar from "../elements/admin_sidebar";
import Tooltip from "./Tooltip";
const google = window.google;
const GOOGLE_API_KEY = "AIzaSyCazDplf1HtSAyvjhY40uqUaTBuSYoVyGE";
Geocode.setApiKey(GOOGLE_API_KEY);
Geocode.setRegion("in");
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

const selectStyle = {
  option: (provided, state) => ({
    ...provided,
    color: "black",
    padding: 15,
    background: state.isFocused ? "#febc15" : "white",
    color: state.isFocused ? "white" : "black",
    cursor: state.isFocused ? "pointer" : "default",
  }),
  singleValue: (provided, state) => {
    return { ...provided };
  },
};

var all_products = [];

export default class Addorder extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_data: JSON.parse(dt),
      modalIsOpen: false,
      editmodalIsOpen: false,
      deliverySlotInfo: {},
      Free_Shipping: false,
      deliveryslot: "",
      deliverySlotSlug: "",
      addressModalIsOpen: false,
      editAddressModalIsOpen: false,
      show: false,
      progress: 0,
      mdl_layout__obfuscator_hide: false,
      status: true,
      user_id: "",
      name: "",
      counter: 0,
      showPincodeInput: true,
      email: "",
      contactNumber: "",
      addressSelected: false,
      all_address: [],
      delivery_instructions: "",
      address: "",
      state: "",
      city: "",
      pincode: "",
      selectedRegion: "",
      allCityRegions: [],
      locality: "",
      latitude: "",
      location_tag: "",
      longitude: "",
      addedProducts: [],
      order_date: new Date(),
      total_amount: "",
      total_price: "",
      cart_total: "",
      subTotal: 0,
      deliveryCharges: "",
      gst_price: "",
      allGstLists: [],
      showTaxFields: false,
      showGstDropdown: false,
      selectedFullAddress: "",
      addcustomer_name: "",
      addcustomer_email: "",
      addcustomer_gst: "",
      addcustomer_mobile: "",
      itemWiseData: [],
      created_date: new Date(),
      order_status: "",
      order_status_show: "pending",
      orderdata: [],
      allsingledata: "",
      category: [],
      product: [],
      customer_data: [],
      dropdownColor: [],
      dropdownSize: [],
      admin_cart_data: [],
      options: [
        { name: "Swedish", value: "sv" },
        { name: "English", value: "en" },
      ],
      po_number: "",
      discountType: "none",
      discountAmount: "",
      discountPercentage: "",
      discountReason: "",
      billingCompany: "",
      billType: "invoice",
      billingCompanyData: [],
      loading: false,
      editcity: "",
      editcountry: "",
      editcreated_at: "",
      edithouseNo: "",
      editpincode: "",
      user_type: "",
      editlocality: "",
      editstate: "",
      editstreet: "",
      locality: "",
      edituser_id: "",
      street: "",
      firstSectionDataLoaded: false,
      openGroupProduct: false,
      creditPaymentOnOff: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.editopenmodal = this.editopenmodal.bind(this);
    this.editclosemodal = this.editclosemodal.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.formHandlerAddress = this.formHandlerAddress.bind(this);
    this.add = this.add.bind(this);

    // new
    this.onchangeinng = this.onchangeinng.bind(this);
    this.openAddressModal = this.openAddressModal.bind(this);
    this.closeAddressModal = this.closeAddressModal.bind(this);
    this.openEditAddressModal = this.openEditAddressModal.bind(this);
    this.closeEditAddressModal = this.closeEditAddressModal.bind(this);
    this.addCustomer = this.addCustomer.bind(this);
  }

  findObjectByKey = (array, key, value) => {
    for (var i = 0; i < array.length; i++) {
      if (array[i].data._id == value) {
        alert("already in cart");
        return "already_cart";
      }
    }
    return null;
  };

  add() {
    // return;
    let errorsPresent = false;

    if (!this.state.user_id) {
      document.querySelector(".err_name").innerHTML = "No Customer selected";
      errorsPresent = true;
    }
    if (!this.state.deliveryslot) {
      document.querySelector(".err_deliveryslot").innerHTML =
        "Please select a delivery slot.";
      errorsPresent = true;
    } else {
      document.querySelector(".err_deliveryslot").innerHTML = "";
    }
    if (!this.state.selectedRegion) {
      document.querySelector(".err_selected_region").innerHTML =
        "Please Select a region";
      errorsPresent = true;
    }
    if (!this.state.addressSelected) {
      document.querySelector(".err_address").innerHTML = "No Address selected";
      errorsPresent = true;
    }
    if (!this.state.addedProducts || this.state.addedProducts.length === 0) {
      document.querySelector(".err_product_id").innerHTML =
        "Add at least one product to place an order";
      errorsPresent = true;
    }
    if (!this.state.payment_method) {
      document.querySelector(".err_payment_method").innerHTML =
        "Please select a payment method";
      errorsPresent = true;
    }
    if (!this.state.billType) {
      document.querySelector(".err_bill_type").innerHTML =
        "Please select Bill Type";
      errorsPresent = true;
    }
    // if (!this.state.po_number) {
    //   document.querySelector(".err_po_number").innerHTML =
    //     "Please enter PO number";
    //   errorsPresent = true;
    // }
    if (!this.state.billingCompany) {
      document.querySelector(".err_billing_company").innerHTML =
        "Please select a Billing Company";
      errorsPresent = true;
    }
    if (!this.state.order_date) {
      document.querySelector(".err_order_date").innerText =
        "This Field is Required";
      errorsPresent = true;
    }

    const requestData = {
      user_id: this.state.user_id,
      user_email: this.state.name,
      delivery_instructions: this.state.delivery_instructions || "",
      user_name: this.state.email,
      deliverySlot: this.state.deliverySlotSlug,
      // contactNumber: this.state.contactNumber,
      regionName: "",
      totalCouponDiscountAmount: this.state.discountAmount || 0,
      RegionId: this.state.selectedRegion,
      regionName: this.state.selectedRegionName,
      address: this.state.selectedFullAddress
        ? this.state.selectedFullAddress
        : "",
      locality: this.state.locality ? this.state.locality : null,
      country: "India",
      state: this.state.state ? this.state.state : null,
      city: this.state.city ? this.state.city : null,
      pincode: this.state.pincode ? this.state.pincode : null,
      latitude: this.state.latitude ? this.state.latitude : null,
      longitude: this.state.longitude ? this.state.longitude : null,
      otheraddress: "",
      deliveryCharges: Number(this.state.deliveryCharges),
      totalCartPrice: +this.state.subTotal + +this.state.gst_price,
      totalCartPriceWithoutGST: this.state.subTotal,
      paymentmethod: this.state.payment_method,
      payment_id: "",
      cod: this.state.cashStatus ? true : false,
      codCharges: "",
      po_number: this.state.po_number,
      discountType: this.state.discountType,
      discountPercentage: this.state.discountPercentage,
      adminDiscountType: this.state.discountType,
      adminDiscount:
        this.state.discountType == "percentage"
          ? this.state.discountPercentage
          : this.state.discountType == "amount"
          ? this.state.discountAmount
          : 0,
      adminDiscountReason: this.state.discountReason,
      billingCompany: this.state.billingCompany,
      billType: this.state.billType,
      total_payment: Number(this.state.total_price),
      bookingMode: "offline",
      challanNO: this.state.challanNO,
      invoiceNO: this.state.invoiceNO,
      gst: this.state.gst_price,
      allGstLists: this.state.allGstLists,
      orderDate: this.state.order_date,

      // bookingItems: this.state.addedProducts,

      bookingItems: this.state.addedProducts.map((product) => {
        if (!+product.qty) {
          document.querySelector(
            `.err_${product._id}qty`
          ).innerHTML = `This field is required`;
          errorsPresent = true;
        } else if (+product.qty <= 0) {
          document.querySelector(
            `.err_${product._id}qty`
          ).innerHTML = `Enter a valid number`;
          errorsPresent = true;
        }
        // let simple__newdata = [];
        if (product.without_package === false) {
          var simple__newdata = {
            packetLabel: product.packetLabel,
            packet_size: product.packet_size,
            packetmrp: product.price,
            selling_price: product.price,
            _id: product.packet_id,
          };
        }
        if (!product.price) {
          if (product.price === 0 || product.price === "0") {
          } else {
            document.querySelector(
              `.err_${product._id}price`
            ).innerHTML = `This field is required`;
            errorsPresent = true;
          }
        }
        if (+product.price < 0) {
          document.querySelector(
            `.err_${product._id}price`
          ).innerHTML = `Enter a valid number`;
          errorsPresent = true;
        }
        return {
          ...product,
          _id: product._id,
          salesTaxWithIn: this.state.state.toLocaleLowerCase().includes("delhi")
            ? product.salesTaxWithIn
            : null,
          salesTaxOutSide: this.state.state
            .toLocaleLowerCase()
            .includes("delhi")
            ? null
            : product.salesTaxOutSide,
          unitMeasurement: product.unitMeasurement
            ? product.unitMeasurement.name
            : "",
          unitQuantity: product.unitQuantity,
          TypeOfProduct: product.TypeOfProduct,
          booking_item_desc: product.booking_item_desc,
          barcode: product.barcode || "",
          qty: product.qty,
          price: product.price,
          totalprice: product.totalprice,
          packetLabel: product.packetLabel,
          packet_size: product.packet_size,
          without_package: product.without_package,
          itemDiscountAmount: product.itemDiscountAmount || null,
          itemDiscountPercentage: product.itemDiscountPercentage,
          itemDiscountAmountBeforeGST: product.itemDiscountAmountBeforeGST,
          itemWiseGst: product.itemWiseGst,
          totalPriceAfterGST: product.totalPriceAfterGST,
          totalPriceBeforeGST: product.totalPriceBeforeGST,
          simpleItem: simple__newdata,
        };
      }),
    };

    if (errorsPresent) {
      return;
    } else {
      this.setState({ loading: true });
    }

    // return;

    AdminApiRequest(requestData, "/admin/createBookingFromAdmin", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          if (res.data.status == "ok") {
            swal({
              title: "Order Placed",
              text: "Your Booking ID is " + res.data.result,
              icon: "success",
              dangerMode: false,
            }).then(() => {
              this.props.history.push("/admin-orderdetails");
            });
          }
          // this.setState({ paymentData: res.data });
          // this.openCheckout();
        } else if (res.status >= 400 && res.status <= 404) {
          swal({
            title: "Error!",
            text: res.data.msg,
            icon: "warning",
            dangerMode: false,
          });
        } else {
          swal({
            title: "Error!",
            text: res.data.msg,
            icon: "warning",
            dangerMode: false,
          });
        }
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addCustomer() {
    var name = this.state.addcustomer_name;
    var user_type = this.state.user_type;
    var email = this.state.addcustomer_email;
    var gst_number = this.state.addcustomer_gst;
    var mobile = this.state.addcustomer_mobile;
    var creditLimit = this.state.creditLimit ? this.state.creditLimit : "";
    var valueErr = document.getElementsByClassName("err_addcustomer");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    var add_status = true;
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!name) {
      valueErr = document.getElementsByClassName("err_addcustomer_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!user_type) {
      valueErr = document.getElementsByClassName("err_user_type");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!email) {
      valueErr = document.getElementsByClassName("err_addcustomer_email");
      valueErr[0].innerText = "This Field is Required";
    } else if (!email.match(mailformat)) {
      add_status = false;
      valueErr = document.getElementsByClassName("err_addcustomer_email");
      valueErr[0].innerText = "Enter valid email address";
    }
    if (!mobile) {
      valueErr = document.getElementsByClassName("err_addcustomer_mobile");
      valueErr[0].innerText = "This Field is Required";
    } else if (isNaN(mobile)) {
      add_status = false;
      valueErr = document.getElementsByClassName("err_addcustomer_mobile");
      valueErr[0].innerText = "Enter Numeric Value";
    }

    if (name && mobile && add_status === true && user_type) {
      const requestData = {
        adminID: this.state.admin_data._id,
        name: name,
        email: email,
        user_type: user_type,
        contactNumber: mobile,
        gst_number: gst_number,
        creditLimit,
      };

      AdminApiRequest(requestData, "/admin/userCreateByAdmin", "POST")
        .then((res) => {
          if (res.data.status == "error") {
            if (res.data.result[0].name) {
              valueErr = document.getElementsByClassName(
                "err_addcustomer_name"
              );
              valueErr[0].innerText = res.data.result[0].name;
            }
            if (res.data.result[0].email) {
              valueErr = document.getElementsByClassName(
                "err_addcustomer_email"
              );
              valueErr[0].innerText = res.data.result[0].email;
            }
            if (res.data.result[0].contactNumber) {
              valueErr = document.getElementsByClassName(
                "err_addcustomer_mobile"
              );
              valueErr[0].innerText = res.data.result[0].contactNumber;
            }
          } else {
            this.getcustomer("addcustomer");
            swal({
              title: "Customer Created Successfully",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.setState({
              loading: false,
              modalIsOpen: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async calculateAmount() {
    var gst_price = 0;
    var subTotal_price = 0;

    await this.state.admin_cart_data.map(
      (item, ind) => (
        (subTotal_price +=
          parseInt(item.variant.price) * parseInt(item.quantity)),
        (gst_price += parseInt(item.gstPrice) * parseInt(item.quantity))
      )
    );

    this.setState({
      total_price: await subTotal_price,
      subTotal_price: (await subTotal_price) - (await gst_price),
      gst_price: gst_price.toFixed(2),
      total_after_discount:
        (await parseInt(subTotal_price)) - parseInt(this.state.discountAmount),
    });

    this.forceUpdate();
  }

  setOrderDate = (date) => {
    this.setState({
      order_date: date,
    });
  };

  handlecolor() {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!this.state.color) {
      valueErr = document.getElementsByClassName("err_color");
      valueErr[0].innerText = "Please Select Color";
    } else {
      valueErr = document.getElementsByClassName("err_color");
      valueErr[0].innerText = "";
    }
    if (!this.state.size) {
      valueErr = document.getElementsByClassName("err_size");
      valueErr[0].innerText = "Please Select Size";
    } else {
      valueErr = document.getElementsByClassName("err_size");
      valueErr[0].innerText = "";
    }
  }

  _handleVariant(ev, type) {
    const value = ev.target.value;
    var variants = [];
    var size = this.state.size;
    var color = this.state.color;

    if (type == "color") {
      this.state.all_Variants.map((i) =>
        i.color === value && i.size === size ? variants.push(i) : ""
      );
      if (variants.length > 0) {
        this.setState({
          color: value,
          selected_Variants: variants,
          variantStatus: true,
        });
        // this.getProductSizes()
        // this.getProductColor()
      } else {
        this.setState({ variantStatus: false, color: value });
      }
    } else if (type == "size") {
      this.state.all_Variants.map((i) =>
        i.size === value && i.color === color ? variants.push(i) : ""
      );

      if (variants.length > 0) {
        this.setState({
          size: value,
          selected_Variants: variants,
          variantStatus: true,
        });
        // this.getProductSizes()
        // this.getProductColor()
      } else {
        this.setState({ variantStatus: false, size: value });
      }
    }
    this.handlecolor();
  }

  formHandler(ev) {
    const total = +this.state.total_price;

    if (ev.target.name === "discountAmount") {
      if (ev.target.value > total) {
        this.setState({ discountAmount: total.toFixed(2) });
      } else {
        this.setState({ discountAmount: ev.target.value });
      }
    } else if (ev.target.name === "addcustomer_mobile") {
      if (ev.target.value.length <= 10) {
        this.setState({ [ev.target.name]: ev.target.value });
      }
    } else {
      this.setState({ [ev.target.name]: ev.target.value });
    }
    let element = document.querySelector(`.err_${ev.target.name}`);
    if (element) {
      element.innerHTML = "";
    }
    setTimeout(() => {
      this.calculateSummary();
    }, 50);
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: "true" });
    } else {
      this.setState({ status: "false" });
    }
  }
  //
  selectonchnhe = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };
  updatestatus = () => {
    var id = this.state.edit_id;
    var status = this.state.order_status;

    if ((id, status)) {
      const requestData = {
        id: id,
        status: status,
      };
      AdminApiRequest(requestData, "/admin/updateOrderStatus", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Order updated Successfully !",
              icon: "success",
              successMode: true,
            }).then((willDelete) => {
              window.location.reload();
            });
            this.setState({
              mdl_layout__obfuscator_hide: false,
              editmodalIsOpen: false,
            });
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  viewopenModal(dt) {
    this.setState({
      // customer_name: dt.user_id.name,
      // email: dt.user_id.email,
      // mobile_no: dt.user_id.contactNumber,
      allsingledata: dt,
      total_amount: dt.amount,
      created_date: dt.created_at,
    });

    this.setState({ show: true });
    this.setState({ mdl_layout__obfuscator_hide: true });
  }
  editopenmodal(dt) {
    this.setState({
      edit_id: dt._id,
      // customer_name: dt.user_id.name,
      // email: dt.user_id.email,
      // mobile_no: dt.user_id.contactNumber,
      total_amount: dt.amount,
      created_date: dt.created_at,
    });

    this.setState({ editmodalIsOpen: true });
    this.setState({ mdl_layout__obfuscator_hide: true });
  }
  editclosemodal() {
    this.setState({
      mdl_layout__obfuscator_hide: false,
      editmodalIsOpen: false,
    });
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  viewcloseModal() {
    this.setState({ show: false });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }
  onChangelist = (data) => {
    const requestData = {
      listStatus: data,
    };
    AdminApiRequest(requestData, "/admin/getAllBooking", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            orderdata: res.data.data,
            count: res.data.count,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  onchangingcategory = (data) => {
    const requestData = {
      cat_id: data.target.value,
    };
    AdminApiRequest(requestData, "/admin/FilterProducts", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            product: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  onchangingcustomer = (data) => {
    const requestData = {
      user_id: data.value,
    };

    this.setState({
      address: "",
      state: "",
      city: "",
      pincode: "",
      locality: "",
      latitude: "",
      longitude: "",
      showTaxFields: false,
      addressSelected: false,
    });
    if (data.value) {
      document.querySelector(".err_name").innerHTML = "";
      AdminApiRequest(requestData, "/admin/usersGetOne", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              user_id: res.data.data[0]._id,
              name: res.data.data[0].name,
              email: res.data.data[0].email,
              contactNumber: res.data.data[0].contactNumber,
              user_type: res.data.data[0].user_type,
            });
            this.usersaddress(data.value);
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        user_id: "",
        name: "",
        email: "",
        contactNumber: "",
        all_address: [],
      });
    }
  };
  usersaddress(user_id) {
    const requestData = {
      user_id,
    };
    AdminApiRequest(requestData, "/admin/getUserAddress", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_address: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getDeliverySlot(pincode, currentAddressID, previousAddress) {
    const freshrequestdata = { pincode: pincode };
    AdminApiRequest(freshrequestdata, "/pincode/one", "POST")
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          if (res.data.data.Region_ID._id !== this.state.selectedRegion) {
            swal({
              title: "Error",
              text: "This address is not available in selected region. Please change region to select this address.",
              icon: "warning",
            });
            this.setState({
              selectedAddressData: previousAddress,
              address: previousAddress.houseNo,
              selectedFullAddress:
                previousAddress.houseNo +
                " ," +
                (previousAddress.street || "") +
                ", near " +
                (previousAddress.locality ? previousAddress.locality : ""),
              state: previousAddress.state,
              city: previousAddress.city,
              pincode: previousAddress.pincode,
              locality: previousAddress.locality,
              latitude: previousAddress.latitude,
              longitude: previousAddress.longitude,
              addressSelected: true,
              showTaxFields: true,
              firstSectionDataLoaded: true,
            });
            document.getElementById(
              "address" + currentAddressID
            ).checked = false;
            if (previousAddress._id) {
              document.getElementById(
                "address" + previousAddress._id
              ).checked = true;
            }
          } else {
            if (
              res.data.data.Free_Shipping === "yes" &&
              +this.state.subTotal_price >= +res.data.data.Free_Shipping_amount
            ) {
              this.setState({ Free_Shipping: true });
            }
            this.setState({
              deliverySlotInfo: res.data.data,
            });
            setTimeout(() => {
              this.calculateSummary();
            }, 0);
          }
        } else if (res.status === 404) {
          this.setState({
            selectedAddressData: previousAddress,
            address: previousAddress.houseNo,
            selectedFullAddress:
              previousAddress.houseNo +
              " ," +
              (previousAddress.street || "") +
              ", near " +
              (previousAddress.locality ? previousAddress.locality : ""),
            state: previousAddress.state,
            city: previousAddress.city,
            pincode: previousAddress.pincode,
            locality: previousAddress.locality,
            latitude: previousAddress.latitude,
            longitude: previousAddress.longitude,
            addressSelected: true,
            showTaxFields: true,
            firstSectionDataLoaded: true,
          });
          document.getElementById("address" + currentAddressID).checked = false;
          if (previousAddress._id) {
            document.getElementById(
              "address" + previousAddress._id
            ).checked = true;
          }
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

  changeDeliverySlot(e) {
    const selectedSlot = e.target.value;
    const deliveryInfo = this.state.deliverySlotInfo;
    let deliverySlug = "";
    let deliveryCharges = 0;

    if (selectedSlot === "Same_day_delivery_till_2pm") {
      deliveryCharges = deliveryInfo.Same_day_delivery_till_2pm_charges;
      deliverySlug = "Same Day Delivery";
    } else if (selectedSlot === "Next_day_delivery_Standard_9am_9pm") {
      deliveryCharges = deliveryInfo.Next_day_delivery_Standard_9am_9pm_charges;
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
      deliveryCharges: +deliveryCharges,
      deliverySlotSlug: deliverySlug,
    });

    setTimeout(() => {
      this.calculateSummary();
    }, 0);
  }

  onchangeinng(data, ev) {
    const previousAddress = this.state.selectedAddressData;
    document.querySelector(".err_address").innerHTML = "";
    this.setState({
      selectedAddressData: data,
      address: data.houseNo,
      selectedFullAddress:
        data.houseNo +
        " ," +
        (data.street || "") +
        ", near " +
        (data.locality ? data.locality : ""),
      state: data.state,
      city: data.city,
      pincode: data.pincode,
      locality: data.locality,
      latitude: data.latitude,
      longitude: data.longitude,
      addressSelected: true,
      showTaxFields: true,
      firstSectionDataLoaded: true,
    });
    setTimeout(() => {
      this.getDeliverySlot(data.pincode, data._id, previousAddress);
    }, 0);
  }

  getcustomer(from = null) {
    AdminApiRequest(null, "/admin/usersGetAllActive", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let customerArr = [];
          res.data.data.forEach((customer) => {
            customerArr.push({
              value: customer._id,
              label: customer.name + " " + customer.contactNumber,
            });
          });
          this.setState({
            customer_data: customerArr,
            progress: from ? 0 : this.state.progress + 30,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getAllCity = () => {
    let requestData = {};
    AdminApiRequest(requestData, "/admin/GetAllCity", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          var activ_supplier = [];
          res.data.data.map((item, index) => {
            activ_supplier.push({
              value: item._id,
              label: item.districtName,
            });
            this.setState({
              allCityRegions: activ_supplier,
            });
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  getAllProducts = () => {
    const requestData = {
      RegionId: this.state.selectedRegion,
      subscribe: false,
      showall: false,
    };
    AdminApiRequest(requestData, "/admin/product/forAdmin/byregion", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          all_products = [];
          res.data.data.map((item, index) => {
            if (!item.outOfStock && !item.preOrder) {
              all_products.push({
                value: item._id,
                name: item.product_name,
                availableQuantity: +item.availableQuantity,
                TypeOfProduct: item.TypeOfProduct,
              });
            }
          });
          this.setState({
            unfilteredProducts: res.data.data,
            progress: this.state.progress + 30,
          });
        } else {
          swal({
            title: "Network Issue",
            // text: "Are you sure that you want to leave this page?",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  formHandlerAddress(val) {
    var name = val.target.name;
    var value = val.target.value;
    this.setState({ [name]: value });
  }
  getBillingCompanies = () => {
    AdminApiRequest({}, "/admin/company/getAll", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            billingCompanyData: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.setState({ progress: this.state.progress + 30 });
    this.getAllCity();
    this.getBillingCompanies();
    const requestData = {
      listStatus: this.state.order_status_show,
    };
    AdminApiRequest({}, "/storehey/getSetting", "GET")
      .then((res) => {
        if (res.status !== 401 || res.status !== 400) {
          this.setState({
            creditPaymentOnOff: res.data.data[0].creditPaymentOffline,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    AdminApiRequest(requestData, "/admin/getAllBooking", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            orderdata: res.data.data,
            count: res.data.count,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    const requestData_add = {};
    AdminApiRequest(requestData_add, "/admin/product_category", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            category: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.getcustomer();

    AdminApiRequest(requestData, "/admin/GetAllActiveUnitMeasurement", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_units: res.data.data,
            progress: this.state.progress + 10,
          });
        } else {
          swal({
            title: "Network Issue",
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

  // new
  openAddressModal() {
    this.state.user_id
      ? this.setState({ addressModalIsOpen: true, pincode: "" })
      : alert("Select a customer first");
  }
  closeAddressModal() {
    this.usersaddress(this.state.user_id);
    this.setState({
      addressModalIsOpen: false,
      street_address: "",
      latitude: "",
      longitude: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    });
  }

  openEditAddressModal(ev) {
    this.setState({
      selectedEditAddress: ev,
      showPincodeInput: true,
      editcity: ev.city,
      editcountry: ev.country,
      editcreated_at: ev.created_at,
      edithouseNo: ev.houseNo,
      editlocattion_tag: ev.locationTag,
      editpincode: ev.pincode,
      editstate: ev.state,
      editstreet: ev.street,
      edituser_id: ev._id,
      editlocality: ev.locality,
      latitude: ev.latitude,
      longitude: ev.longitude,
    });
    this.setState({ editAddressModalIsOpen: true, showPincodeInput: true });
  }
  closeEditAddressModal() {
    this.usersaddress(this.state.user_id);
    this.setState({ editAddressModalIsOpen: false, showPincodeInput: true });
  }

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
                pincode:
                  json.results[0].address_components[
                    json.results[0].address_components.length - 1
                  ].long_name,
              });
            }
          }
        });
    } else {
      this.setState({ street_address: e });
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

  saveing = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (this.state.location_tag === "") {
      valueErr = document.getElementsByClassName("err_location_tag");
      valueErr[0].innerText = "Field is Required";
    }
    // if (this.state.location_tag === "") {
    //   valueErr = document.getElementsByClassName("err_add_location_tag");
    //   valueErr[0].innerText = "Field is Required";
    // }
    if (this.state.address === "") {
      valueErr = document.getElementsByClassName("err_add_houseNo");
      valueErr[0].innerText = "Field is Required";
    }
    // if (this.state.address === "") {
    //   valueErr = document.getElementsByClassName("err_address");
    //   valueErr[0].innerText = "Field is Required";
    // }
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
      this.state.location_tag &&
      this.state.address &&
      this.state.pincode &&
      this.state.pincode.length === 6
    ) {
      const requestData = {
        user_id: this.state.user_id,
        locationTag: this.state.location_tag,
        houseNo: this.state.address,
        street: this.state.street_address,
        locality: this.state.locality,
        city: this.state.city,
        state: this.state.state,
        country: this.state.country,
        pincode: this.state.pincode,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      };

      AdminApiRequest(requestData, "/admin/addUserAddress", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              verifymobilestatus: "fullytrue",
              buttonstatus: false,
              addressModalIsOpen: false,
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
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
          } else {
            swal({
              title: "Network Error !",
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

  onChange1(valu) {
    document.querySelector(".err_product_id").innerHTML = "";
    let p_length = "";
    p_length = new Date().getTime();
    console.log(this.state.addedProducts);
    console.log(valu);
    let alreadyExists = false;
    // this.state.addedProducts.forEach((product) => {
    // console.log("productproduct",product)
    // console.log("valuvalu",valu)
    // if (product._id == valu.value && product.TypeOfProduct !== "group") {
    //   alreadyExists = true;
    // }
    // });
    // if (alreadyExists) {
    //   this.state.product_id = "";
    //   alert("Product already added!");
    //   return;
    // }
    if (valu.TypeOfProduct === "group") {
      let product = this.state.unfilteredProducts.filter(
        (prod) => valu.value == prod._id
      );
      this.setState({
        groupProductData: product[0],
      });
      setTimeout(() => {
        this.setState({
          openGroupProduct: true,
        });
      });
    } else {
      this.setState((prev) => {
        let product = prev.unfilteredProducts.filter(
          (prod) => valu.value == prod._id
        );
        let price = 0;
        const user_type = this.state.user_type;
        const simpleData = product[0].simpleData[0];
        if (simpleData.package && simpleData.package.length > 0) {
          if (user_type === "b2b") {
            price = simpleData.package[0].B2B_price;
          } else if (user_type === "retail") {
            price = simpleData.package[0].Retail_price;
          } else {
            price = simpleData.package[0].selling_price;
          }
        } else {
          if (user_type === "b2b") {
            price = simpleData.RegionB2BPrice;
          } else if (user_type === "retail") {
            price = simpleData.RegionRetailPrice;
          } else {
            price = simpleData.RegionSellingPrice;
          }
        }
        return {
          ...prev,
          addedProducts: [
            ...prev.addedProducts,
            {
              ...product[0],
              product_id: product[0]._id,
              product_unique_id: product[0]._id + p_length,
              booking_item_desc: "",
              unitQuantity: product[0].unitQuantity,
              unitMeasurement: product[0].unitMeasurement,
              unitId: "",
              without_package: true,
              barcode: "",
              barcodeList:
                product[0].barcode?.length > 0 ? product[0].barcode : [],
              packetLabel: "",
              packet_size: "",
              qty: "",
              price: "",
              totalprice: "",
            },
          ],
        };
      });
    }
    console.log("new_data", this.state.addedProducts);
  }
  addGroup(data) {
    let allInnerProd = [];
    let counter = this.state.counter;
    data.groupData.forEach((dt) => {
      dt.sets.forEach((set) => {
        if (+set.qty > 0) {
          allInnerProd.push({
            unitMeasurement: set.unitMeasurement,
            unitQuantity: set.unitQuantity,
            without_package: set.without_package,
            qty: set.qty,
            package: set.package,
            price: set.price,
            product_name: set.product.product_name,
          });
        }
      });
    });
    const newData = [
      ...this.state.addedProducts,
      {
        ...data,
        product_id: data._id,
        booking_item_desc: "",
        unitMeasurement: data.unitMeasurement,
        unitId: "",
        without_package: true,
        packetLabel: "",
        paket_size: "",
        qty: data.qty,
        groupSlug: data.product_name + counter,
        price: data.price,
        totalprice: data.totalprice,
        innerProducts: allInnerProd,
      },
    ];
    this.setState({
      addedProducts: newData,
      counter: counter + 1,
    });
    setTimeout(() => {
      this.calculateSummary();
    }, 0);
  }

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

  changeQty(e, prod) {
    document.querySelector(`.err_${prod._id}qty`).innerHTML = "";
    let localProducts = this.state.addedProducts;
    localProducts = localProducts.map((product) => {
      if (product.TypeOfProduct === "group") {
        if (prod.groupSlug === product.groupSlug) {
          let av = +product.availableQuantity;
          av = product.packet_size
            ? +av / +product.packet_size
            : +av / (+product.unitQuantity || 1);
          if (av >= e.target.value || prod.TypeOfProduct === "group") {
            product.qty = +e.target.value;
            product.totalprice = +product.price * +product.qty;
          } else {
            document.querySelector(`.err_${prod._id}qty`).innerHTML = `Only ${
              av ? av.toFixed(1) : 0
            } Quantity in stock`;
          }
        }
      } else {
        if (prod.product_unique_id === product.product_unique_id) {
          let av = +product.availableQuantity;
          av = product.packet_size
            ? +av / +product.packet_size
            : +av / (+product.unitQuantity || 1);
          if (av >= e.target.value || prod.TypeOfProduct === "group") {
            product.qty = +e.target.value;
            product.totalprice = +product.price * +product.qty;
          } else {
            document.querySelector(`.err_${prod._id}qty`).innerHTML = `Only ${
              av ? av.toFixed(1) : 0
            } Quantity in stock`;
          }
        }
      }
      return product;
    });
    this.setState({ addedProducts: localProducts });
    this.calculateSummary();
  }

  changeDesc(e, prod) {
    document.querySelector(`.err_${prod._id}desc`).innerHTML = "";
    let localProducts = this.state.addedProducts;
    localProducts = localProducts.map((product) => {
      if (product.TypeOfProduct === "group") {
        if (prod.groupSlug === product.groupSlug) {
          prod.booking_item_desc = e.target.value;
        }
      } else {
        if (prod.product_unique_id === product.product_unique_id) {
          prod.booking_item_desc = e.target.value;
        }
      }
      return product;
    });
    this.setState({ addedProducts: localProducts });
  }

  update = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (this.state.edithouseNo === "") {
      valueErr = document.getElementsByClassName("err_edithouseNo");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.editlocattion_tag === "") {
      valueErr = document.getElementsByClassName("err_editlocationtag");
      valueErr[0].innerText = "Field is Required";
    }
    if (!this.state.editpincode) {
      valueErr = document.getElementsByClassName("err_editpincode");
      valueErr[0].innerText = "Field is Required";
    } else if (this.state.editpincode.length !== 6) {
      valueErr = document.getElementsByClassName("err_editpincode");
      valueErr[0].innerText = "Incorrect Pincode";
    }
    if (!this.state.editstreet && !this.state.street_address) {
      valueErr = document.getElementsByClassName("err_editstreet");
      valueErr[0].innerText = "Field is Required";
    }
    if (
      (this.state.editstreet || this.state.street_address) &&
      this.state.edithouseNo &&
      this.state.editpincode &&
      this.state.editpincode.length === 6 &&
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
        state: this.state.editstate ? this.state.editstate : "",
        country: this.state.editcountry ? this.state.editcountry : "",
        pincode: this.state.editpincode ? this.state.editpincode : "",
        locality: this.state.editlocality ? this.state.editlocality : "",
        latitude: this.state.latitude ? this.state.latitude : "",
        longitude: this.state.longitude ? this.state.longitude : "",
      };

      AdminApiRequest(requestData, "/admin/updateUserAddress", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              verifymobilestatus: "fullytrue",
              buttonstatus: false,
            });
            this.closeEditAddressModal();
            swal({
              title: "Address Updated",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.usersaddress(this.state.user_id);
          } else {
            swal({
              title: "Network Error !",
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

  changePrice(e, prod) {
    document.querySelector(`.err_${prod._id}price`).innerHTML = "";
    let localProducts = this.state.addedProducts;
    localProducts = localProducts.map((product) => {
      if (product.TypeOfProduct === "group") {
        if (prod.groupSlug === product.groupSlug) {
          product.price = +e.target.value;
          product.totalprice = +product.price * +product.qty;
        }
      } else {
        if (prod.product_unique_id === product.product_unique_id) {
          product.price = +e.target.value;
          product.totalprice = +product.price * +product.qty;
        }
      }
      return product;
    });
    this.setState({ addedProducts: localProducts });
    console.log("data_data", this.state.addedProducts);
    this.calculateSummary();
  }

  deleteAddedProduct(prod) {
    let localProducts = this.state.addedProducts;
    localProducts = localProducts.filter((product) => {
      if (product.TypeOfProduct === "group") {
        if (prod.groupSlug !== product.groupSlug) {
          return product;
        }
      } else {
        if (prod.product_unique_id !== product.product_unique_id) {
          return product;
        }
      }
    });
    console.log("localProducts", localProducts);
    this.setState({ addedProducts: localProducts });
    // this.forceUpdate()
    setTimeout(() => {
      this.calculateSummary();
    }, 0);
  }

  calculateSummary() {
    console.log("testing");
    let subTotal = 0;
    var cart_total = 0;
    var total_gst = 0;
    var subTotalWithoutGST = 0;
    var allGsts = [];
    var itemWiseData = [];
    let localProducts = this.state.addedProducts;
    localProducts.forEach((itm) => {
      cart_total += +itm.totalprice;
    });
    if (this.state.showTaxFields) {
      const modified = localProducts.map((itm) => {
        var itempriceBeforeTax = Number(itm.totalprice);
        var singleProductTaxPrice = 0;
        var itemTaxPercentage = 0;
        var taxRegion;

        if (this.state.state.toLocaleLowerCase().includes("delhi")) {
          itemTaxPercentage = itm.salesTaxWithIn.totalTax
            ? Number(itm.salesTaxWithIn.totalTax)
            : 0;
          taxRegion = itm.salesTaxWithIn;
        } else {
          itemTaxPercentage = itm.salesTaxOutSide.totalTax
            ? Number(itm.salesTaxOutSide.totalTax)
            : 0;
          taxRegion = itm.salesTaxOutSide;
        }
        singleProductTaxPrice =
          +itempriceBeforeTax -
          +itempriceBeforeTax * (100 / (100 + +itemTaxPercentage));
        singleProductTaxPrice = +singleProductTaxPrice.toFixed(2);
        total_gst += singleProductTaxPrice;
        taxRegion.taxData.length > 0 &&
          taxRegion.taxData.map((tx) => {
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
                    +itemTaxPercentage;
                  total = total.toFixed(2);
                  let totalprice =
                    parseFloat(gst.totalPrice) + parseFloat(total);
                  gst.totalPrice = totalprice.toFixed(2);
                  gst.tax_percent = +gst.tax_percent;
                }
              });
            } else {
              //if sub tax doesn't exist in array then pushing it directly to array
              let total =
                (+singleProductTaxPrice * +tx.tax_percent) / +itemTaxPercentage;
              allGsts.push({
                tax_name: tx.tax_name,
                totalPrice: total.toFixed(2),
                tax_percent: tx.tax_percent,
              });
            }
          });

        let amountBeforeGST = 0;
        if (itm.simpleData[0] && itm.simpleData[0].package.length > 0) {
          amountBeforeGST = +itm.totalprice - +singleProductTaxPrice;
        } else {
          amountBeforeGST = +itm.price * +itm.qty - +singleProductTaxPrice;
        }
        itemWiseData.push({
          ...itm,
          itemWiseGst: singleProductTaxPrice.toFixed(2),
          totalPriceAfterGST: +itm.totalprice,
          // totalprice: itm.totalPriceBeforeGST,
          // price: +itm.totalPriceBeforeGST / +itm.qty,
        });

        return {
          ...itm,
          totalPriceBeforeGST: amountBeforeGST.toFixed(2),
          itemWiseGst: singleProductTaxPrice.toFixed(2),
          totalPriceAfterGST: +itm.totalprice,
        };
      });
      this.setState({
        addedProducts: modified,
        itemWiseData: itemWiseData,
      });
      console.log("after_calculation", modified);
    }

    // cart_total = total_gst + subTotal;
    subTotal = cart_total;
    subTotalWithoutGST = +cart_total - +total_gst;
    let discountAmount = 0;
    if (this.state.discountType == "percentage") {
      discountAmount = (
        (+this.state.discountPercentage * +subTotalWithoutGST) /
        100
      ).toFixed(2);
    } else if (this.state.discountType == "amount") {
      discountAmount = +this.state.discountAmount;
    }
    let total_price =
      Number(subTotal) + +this.state.deliveryCharges - Number(discountAmount);
    this.setState({
      subTotal: subTotal - total_gst,
      gst_price: total_gst.toFixed(2),
      inclusiveGST: total_gst.toFixed(2),
      cart_total: cart_total,
      total_price,
      allGstLists: allGsts,
      discountAmount: discountAmount,
    });

    setTimeout(() => {
      this.calculateDiscountPerItem();
    }, 0);

    this.forceUpdate();
  }

  calculateDiscountPerItem = (newItemsArray) => {
    let localProducts = newItemsArray || this.state.addedProducts;
    // let cart_data_dt = [];
    let localPrice = 0;
    let totalCartPriceWithGst = +this.state.subTotal + +this.state.gst_price;
    // let discount = this.state.discountAmount;
    let discount_percentage = this.state.discountPercentage
      ? this.state.discountPercentage
      : (+this.state.discountAmount / +this.state.subTotal) * 100;
    let modified = [];
    if (discount_percentage) {
      modified = localProducts.map((prd) => {
        let priceAfterDiscount = 0;
        priceAfterDiscount =
          +prd.totalprice -
          +prd.totalPriceBeforeGST * (discount_percentage / 100);
        return {
          ...prd,
          priceAfterDiscount: priceAfterDiscount
            ? priceAfterDiscount.toFixed(2)
            : 0,
          itemDiscountAmountBeforeGST: +priceAfterDiscount - +prd.itemWiseGst,

          itemDiscountPercentage: discount_percentage,
        };
      });

      var localCart = [];
      modified.forEach((itm) => {
        localCart.push({ ...itm, itemDiscountAmount: itm.priceAfterDiscount });
      });
      setTimeout(() => {
        this.setState({
          addedProducts: localCart,
          itemWiseData: localCart,
        });
      }, 0);
    } else {
      modified = localProducts.map((prd) => {
        let priceAfterDiscount = null;
        return {
          ...prd,
          priceAfterDiscount: priceAfterDiscount,
          itemDiscountAmountBeforeGST: "0",
          itemDiscountPercentage: 0,
        };
      });

      var localCart = [];
      modified.forEach((itm) => {
        localCart.push({ ...itm, itemDiscountAmount: 0 });
      });
      setTimeout(() => {
        this.setState({
          addedProducts: localCart,
          itemWiseData: localCart,
        });
      }, 0);
    }

    setTimeout(() => {
      this.calculateGST(localCart);
    }, 0);
  };

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
                      if (this.state.user_type === "b2b") {
                        sub_total = sub_total + data.B2B_price * data.quantity;
                      } else if (this.state.user_type === "retail") {
                        sub_total =
                          sub_total + data.Retail_price * data.quantity;
                      } else if (
                        this.state.user_type === "user" ||
                        this.state.user_type === null
                      ) {
                        sub_total =
                          sub_total + data.selling_price * data.quantity;
                      }
                    });
                } else {
                  if (this.state.user_type === "b2b") {
                    sub_total =
                      sub_total +
                      item.simpleData[0].RegionB2BPrice *
                        item.simpleData[0].userQuantity;
                  } else if (this.state.user_type === "retail") {
                    sub_total =
                      sub_total +
                      item.simpleData[0].RegionRetailPrice *
                        item.simpleData[0].userQuantity;
                  } else if (
                    this.state.user_type === "user" ||
                    this.state.user_type === null
                  ) {
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
      totalTaxPercentage = this.state.state
        .toLocaleLowerCase()
        .includes("delhi")
        ? itm.salesTaxWithIn.totalTax || 0
        : itm.salesTaxOutSide.totalTax || 0;
      selectedTaxRegion = this.state.state.toLocaleLowerCase().includes("delhi")
        ? itm.salesTaxWithIn
        : itm.salesTaxOutSide;
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
    total_after_dis = +this.state.total_price - +this.state.inclusiveGST + +gst;
    this.setState({
      total_price: Math.round(+total_after_dis),
      gst_price: gst.toFixed(2),
      allGstLists: allGsts,
    });
  }
  changeBarcode = (e, product_id) => {
    let localProducts = this.state.addedProducts;
    if (e.target.value === "none") {
      localProducts.forEach((prd) => {
        if (prd.product_unique_id === product_id) {
          prd.barcode = "";
        }
      });
      this.setState({
        addedProducts: localProducts,
      });
    } else {
      localProducts.forEach((prd) => {
        if (prd.product_unique_id === product_id) {
          prd.barcode = e.target.value;
        }
      });
      this.setState({
        addedProducts: localProducts,
      });
    }
    console.log(localProducts);
    this.calculateSummary();
  };
  changePackage = (e, packages, product_id) => {
    let localProducts = this.state.addedProducts;
    if (e.target.value === "none") {
      localProducts.forEach((prd) => {
        if (prd.product_unique_id === product_id) {
          prd.packetLabel = "";
          prd.packet_size = "";
          prd.without_package = true;
          prd.qty = "";
          prd.price = "";
          prd.totalprice = "";
        }
      });
      this.setState({
        addedProducts: localProducts,
      });
    } else {
      let localPackage;
      packages.map((pck) => {
        if (e.target.value === pck._id) {
          localPackage = pck;
        }
      });
      localProducts.forEach((prd) => {
        let localPrice = 0;
        if (this.state.user_type === "b2b") {
          localPrice = localPackage.B2B_price;
        } else if (this.state.user_type === "retail") {
          localPrice = localPackage.Retail_price;
        } else {
          localPrice = localPackage.selling_price;
        }
        if (prd.product_unique_id === product_id) {
          prd.packetLabel = localPackage.packetLabel;
          prd.packet_size = localPackage.packet_size;
          prd.price = +localPrice;
          prd.qty = "";
          prd.without_package = false;
          prd.totalprice = +prd.qty * +localPrice;
          prd.packet_id = localPackage._id;
        }
      });
      this.setState({
        addedProducts: localProducts,
      });
    }
    this.calculateSummary();
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
  render() {
    const street = this.state.street;
    return (
      <div className="wrapper add-order-wrapper">
        <LoadingBar
          color="#febc15"
          progress={this.state.progress}
          className="top-progress-bar"
          shadow={false}
          onLoaderFinished={() =>
            this.setState({
              progress: 0,
            })
          }
        />
        {this.state.openGroupProduct ? (
          <Group_Product
            closeGroup={() => this.setState({ openGroupProduct: false })}
            groupProductData={this.state.groupProductData}
            addGroupOffline={(data) => this.addGroup(data)}
            orderType="offline"
          />
        ) : (
          ""
        )}
        <Adminsiderbar />
        <div className="main-panel">
          <Adminheader />
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 ml-auto mr-auto mb-5">
                  <div className="card">
                    <div className="card-header card-header-primary card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">open_with</i>
                      </div>
                    </div>
                    <div className="card-body add_offline_order">
                      <h4 className="card-title">Create Order</h4>

                      <div className="modal-form-bx">
                        <div className="">
                          <h2 className="d-inline mr-4">Customer Detail</h2>
                          <button
                            type="button"
                            onClick={this.openModal}
                            className="submit blank-btn add_new_address"
                          >
                            <span
                              className="button-text"
                              style={{ fontSize: 12 }}
                            >
                              Add New Customer
                            </span>
                            <span className="button-overlay"></span>
                          </button>
                          {/* <button
                            className="btn btn-primary m-r-5"
                            style={{ zIndex: 1 }}
                            onClick={this.openModal}
                          >
                            Add New Customer
                          </button> */}
                        </div>
                        <form>
                          <div className="form-group new_order_1 separate_row">
                            <div className="modal-left-bx">
                              <label>Select Customer Location</label>
                            </div>
                            <div className="modal-right-bx">
                              <Select
                                options={this.state.allCityRegions}
                                onChange={(e) => {
                                  this.setState({
                                    selectedRegion: e.value,
                                    selectedRegionName: e.label,
                                  });
                                  setTimeout(() => {
                                    this.getAllProducts();
                                  }, 50);
                                }}
                                styles={selectStyle}
                                placeholder="E.g: Faridabad, Centra Delhi..."
                                noOptionsMessage={() => "No more options"}
                                matchFrom="start"
                                className="select-search"
                                name="supplier"
                              />

                              <span className="err err_selected_region"></span>
                            </div>
                          </div>

                          <div className="form-group new_order_1">
                            <div className="modal-left-bx">
                              <label>Select Customer</label>
                            </div>
                            <div className="modal-right-bx">
                              <Select
                                options={this.state.customer_data}
                                name="select_customer"
                                closeOnSelect={false}
                                value={this.state.product_id}
                                placeholder="Search Customer"
                                noOptionsMessage={() => "No more options"}
                                matchFrom="start"
                                onChange={(val) => this.onchangingcustomer(val)}
                                className="select-search"
                              />
                              {/* <select
                                name="select_customer"
                                className="form-control"
                                onChange={(val) => this.onchangingcustomer(val)}
                              >
                                <option value="">Select Customer </option>
                                {this.state.customer_data &&
                                this.state.customer_data.length > 0
                                  ? this.state.customer_data.map(
                                      (item, index) => (
                                        <option value={item._id}>
                                          {item.name
                                            ? item.name +
                                              " " +
                                              item.contactNumber
                                            : item.contactNumber}
                                        </option>
                                      )
                                    )
                                  : ""}
                              </select> */}

                              <span className="err err_name"></span>
                            </div>
                          </div>

                          <div
                            className="form-group new_order_2"
                            style={
                              !this.state.contactNumber
                                ? { visibility: "hidden" }
                                : {}
                            }
                          >
                            <div className="modal-left-bx">
                              <label>
                                Customer Details
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <p className="m-0 p-0">
                                <span>{this.state.name}</span>
                              </p>
                              <p className="m-0 p-0">
                                <span>{this.state.email}</span>
                              </p>
                              <p className="m-0 p-0">
                                <span>{this.state.contactNumber}</span>
                              </p>
                            </div>
                          </div>
                          {/* <div className="form-group new_order_2">
                            <div className="modal-left-bx">
                              <label>
                                Customer Name
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="name"
                                readOnly
                                value={this.state.name}
                                className="form-control"
                                placeholder="Enter Customer Name"
                                onChange={this.formHandler}
                              />
                              <span className="err err_customer_name"></span>
                            </div>
                          </div>
                          <div className="form-group new_order_3">
                            <div className="modal-left-bx">
                              <label>Customer Email</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="email"
                                readOnly
                                value={this.state.email}
                                className="form-control"
                                placeholder="Enter Customer E-Mail"
                                onChange={this.formHandler}
                              />
                              <span className="err err_customer_email"></span>
                            </div>
                          </div>
                          <div className="form-group new_order_4">
                            <div className="modal-left-bx">
                              <label>
                                Customer Mobile
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="contactNumber"
                                readOnly
                                value={this.state.contactNumber}
                                className="form-control"
                                placeholder="Enter Customer Mobile"
                                onChange={this.formHandler}
                              />
                              <span className="err err_customer_moible"></span>
                            </div>
                          </div>
                           */}

                          {this.state.contactNumber ? (
                            <div className="form-group new_order_5 order5_shipping mt-3">
                              <div className="shipping_adrsses">
                                {" "}
                                <h2 className="d-inline mr-3">
                                  Shipping Address
                                </h2>{" "}
                                <button
                                  type="button"
                                  onClick={() => this.openAddressModal()}
                                  className="submit blank-btn add_new_address"
                                >
                                  <span className="button-text">
                                    Add New Address
                                  </span>
                                  <span className="button-overlay"></span>
                                </button>
                              </div>
                              <div className="modal-right-bx order-address-block">
                                {this.state.all_address.map((item, index) => (
                                  <div key={item._id} className="Card_des">
                                    <div className="modal-form-bx">
                                      <div className="input_radio">
                                        <input
                                          type="radio"
                                          name="selectedaddress"
                                          onChange={this.onchangeinng.bind(
                                            this,
                                            item
                                          )}
                                          id={"address" + item._id}
                                        />
                                      </div>
                                      <div className="heading">
                                        <h2>
                                          {item.locationTag}
                                          <span
                                            onClick={this.openEditAddressModal.bind(
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
                                            (item.locality
                                              ? ", near " + item.locality
                                              : "")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <div>
                                  <span className="err err_address"></span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {this.state.firstSectionDataLoaded ? (
                            <>
                              <div
                                className="form-group new_order_6 w-100"
                                style={{ marginLeft: 0 }}
                              >
                                <h2>order Details</h2>

                                <div className="row" style={{ width: "100%" }}>
                                  <div className="col-md-3">
                                    <div className="form-group new_order_7">
                                      <div className="modal-left-bx">
                                        <label>
                                          Order Date
                                          <span className="asterisk">*</span>
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <DatePicker
                                          selected={this.state.order_date}
                                          dateFormat="dd/MM/yyyy"
                                          onChange={(date) =>
                                            this.setOrderDate(date)
                                          }
                                        />
                                        <span className="err err_order_date"></span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="form-group new_order_7">
                                      <div className="modal-left-bx">
                                        <label>Bill Type</label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <select
                                          name="billType"
                                          style={{
                                            width: "80%",
                                            height: "40px",
                                            background: "white",
                                            border: "none",
                                            borderBottom: "1px solid #cacaca",
                                          }}
                                          onChange={(e) =>
                                            this.setState({
                                              billType: e.target.value,
                                            })
                                          }
                                        >
                                          <option value="invoice">
                                            Invoice
                                          </option>
                                          <option value="challan">
                                            Challan
                                          </option>
                                        </select>
                                      </div>
                                      <span className="err err_bill_type"></span>
                                    </div>
                                  </div>
                                  {this.state.billType === "invoice" ? (
                                    <div className="col-md-3">
                                      <div className="form-group new_order_7">
                                        <div className="modal-left-bx">
                                          <label>Invoice Number</label>
                                        </div>
                                        <div className="modal-right-bx">
                                          <input
                                            type="text"
                                            name="invoiceNO"
                                            value={this.state.invoiceNO}
                                            className="form-control"
                                            placeholder="Enter Invoice Number"
                                            onChange={this.formHandler}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="col-md-3">
                                      <div className="form-group new_order_7">
                                        <div className="modal-left-bx">
                                          <label>Challan Number</label>
                                        </div>
                                        <div className="modal-right-bx">
                                          <input
                                            type="text"
                                            name="challanNO"
                                            value={this.state.challanNO}
                                            className="form-control"
                                            placeholder="Enter Challan Number"
                                            onChange={this.formHandler}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="col-md-3">
                                    <div className="form-group new_order_7">
                                      <div className="modal-left-bx">
                                        <label>Billing Company</label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <select
                                          name="billingCompany"
                                          style={{
                                            width: "80%",
                                            height: "40px",
                                            background: "white",
                                            border: "none",
                                            borderBottom: "1px solid #cacaca",
                                          }}
                                          onChange={(e) =>
                                            this.setState({
                                              billingCompany: e.target.value,
                                            })
                                          }
                                        >
                                          <option value="">
                                            Select billing company
                                          </option>
                                          {this.state.billingCompanyData &&
                                            this.state.billingCompanyData.map(
                                              (dta) => {
                                                return (
                                                  <option value={dta._id}>
                                                    {dta.name}
                                                  </option>
                                                );
                                              }
                                            )}
                                        </select>
                                      </div>
                                      <span className="err err_billing_company"></span>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="form-group new_order_7">
                                      <div className="modal-left-bx">
                                        <label>PO Number</label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="text"
                                          name="po_number"
                                          value={this.state.po_number}
                                          className="form-control"
                                          placeholder="Enter PO number"
                                          onChange={this.formHandler}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="modal-left-bx">
                                  <h2 className="mb-2">Product Details</h2>
                                </div>
                                <div className="modal-right-bx">
                                  <SelectSearch
                                    options={all_products}
                                    name="product_id"
                                    closeOnSelect={false}
                                    value={this.state.product_id}
                                    placeholder={
                                      all_products &&
                                      all_products.length > 0 &&
                                      all_products[0]
                                        ? "Search and Add Product"
                                        : "Select Region to get Products"
                                    }
                                    onChange={(e) => this.onChange1(e)}
                                    className="select-search"
                                  />
                                </div>
                              </div>
                              <div className="mb-3 mt-4 add-order-backends">
                                {this.state.addedProducts.length > 0 ? (
                                  <>
                                    <div className="row pr-2 mb-3">
                                      <div className="col-2">Name</div>
                                      <div className="col-2">Description</div>
                                      <div className="col-1">Quantity</div>
                                      <div className="col-1">Unit</div>
                                      <div className="col-2">Package</div>
                                      <div className="col-1">Barcode</div>
                                      <div className="col-1">Price</div>
                                      <div className="col-2">Total</div>
                                    </div>

                                    {this.state.addedProducts.map((product) => (
                                      <div
                                        key={
                                          product.TypeOfProduct !== "group"
                                            ? product._id
                                            : product.groupSlug
                                        }
                                        className="row mb-2 pr-2 backend-col-order"
                                      >
                                        <div className="col-2">
                                          {product.TypeOfProduct === "group" ? (
                                            product.innerProducts.length > 0 ? (
                                              <Tooltip
                                                content={product.innerProducts
                                                  .map(
                                                    (prod) =>
                                                      prod.product_name +
                                                      // "( ₹" +
                                                      // prod.price +
                                                      // " )" +
                                                      " [" +
                                                      prod.qty +
                                                      "]. <br/>"
                                                  )
                                                  .join("")}
                                                direction="right"
                                              >
                                                <i
                                                  className="fas fa-info-circle"
                                                  style={{ cursor: "pointer" }}
                                                ></i>
                                              </Tooltip>
                                            ) : (
                                              ""
                                            )
                                          ) : (
                                            ""
                                          )}
                                          {product.product_name}
                                        </div>
                                        <div className="col-2">
                                          <input
                                            type="text"
                                            placeholder="Enter Description"
                                            value={product.booking_item_desc}
                                            onChange={(e) => {
                                              this.changeDesc(e, product);
                                            }}
                                          />
                                          <span
                                            className={`err err_${product._id}desc`}
                                          ></span>
                                        </div>
                                        <div className="col-2">
                                          <input
                                            type="number"
                                            onWheel={(e) => e.target.blur()}
                                            placeholder="Enter Quantity"
                                            value={product.qty}
                                            onChange={(e) => {
                                              this.changeQty(e, product);
                                            }}
                                          />
                                          <span
                                            className={`err err_${product._id}qty`}
                                          ></span>
                                        </div>
                                        <div className="col-1">
                                          {/* {product.unitQuantity} */}
                                          {product.unitMeasurement?.name}
                                        </div>
                                        <div className="col-2">
                                          {product.simpleData.length > 0 ? (
                                            product.simpleData[0].package
                                              .length === 0 ? (
                                              product.unitMeasurement.name
                                            ) : (
                                              <select
                                                name="packagelabel"
                                                onChange={(e) =>
                                                  this.changePackage(
                                                    e,
                                                    product.simpleData[0]
                                                      .package,
                                                    product.product_unique_id
                                                  )
                                                }
                                              >
                                                <option value="none">
                                                  None
                                                </option>
                                                {product.simpleData[0].package.map(
                                                  (pck) => {
                                                    return (
                                                      <option value={pck._id}>
                                                        {pck.packetLabel}
                                                      </option>
                                                    );
                                                  }
                                                )}
                                              </select>
                                            )
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <div className="col-1">
                                          <select
                                            name="barcode"
                                            onChange={(e) =>
                                              this.changeBarcode(
                                                e,
                                                product.product_unique_id
                                              )
                                            }
                                          >
                                            <option value="none">None</option>
                                            {product.barcodeList?.map((pck) => {
                                              return (
                                                <option value={pck}>
                                                  {pck}
                                                </option>
                                              );
                                            })}
                                          </select>
                                        </div>
                                        <div className="col-1 d-flex align-items-center">
                                          ₹
                                          <input
                                            type="number"
                                            onWheel={(e) => e.target.blur()}
                                            placeholder="Enter Price"
                                            value={product.price}
                                            onChange={(e) => {
                                              this.changePrice(e, product);
                                            }}
                                          />
                                          <span
                                            className={`err err_${product._id}price`}
                                          ></span>
                                        </div>
                                        <div className="col-2">
                                          ₹{product.totalprice}
                                          <span
                                            className="material-icons float-right"
                                            onClick={() =>
                                              this.deleteAddedProduct(product)
                                            }
                                            style={{ cursor: "pointer" }}
                                          >
                                            clear
                                          </span>
                                        </div>
                                      </div>
                                    ))}

                                    {/* <div className="row pr-2">
                                      <div className="col-7"></div>
                                      <div className="col-2 text-right">
                                        Sub-Total:
                                      </div>
                                      <div className="col-3">
                                        {this.state.subTotal}
                                      </div>
                                    </div> */}
                                  </>
                                ) : (
                                  ""
                                )}
                                <div>
                                  <span className="err err_product_id"></span>
                                </div>
                              </div>

                              <div className="form-group new_order_7">
                                <div className="modal-left-bx">
                                  <h2>Delivery Charges</h2>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="number"
                                    name="deliveryCharges"
                                    value={this.state.deliveryCharges}
                                    className="form-control"
                                    placeholder="Enter Delivery Charges"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_delivery_charges"></span>
                                </div>
                              </div>
                              <div className="form-group new_order_7">
                                <div className="modal-left-bx">
                                  <h2>Delivery Instructions</h2>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="delivery_instructions"
                                    value={this.state.delivery_instructions}
                                    className="form-control"
                                    placeholder="Enter Delivery Instructions"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_delivery_instructions"></span>
                                </div>
                              </div>

                              <h2 className="mt-3">Discount</h2>
                              <div className="row" style={{ width: "100%" }}>
                                <div className="col-md-4">
                                  <div className="form-group new_order_7">
                                    <div className="modal-left-bx">
                                      <label>Discount Type</label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <select
                                        name="discountType"
                                        style={{
                                          width: "80%",
                                          height: "40px",
                                          background: "white",
                                          border: "none",
                                          borderBottom: "1px solid #cacaca",
                                        }}
                                        onChange={(e) => {
                                          this.setState({
                                            discountType: e.target.value,
                                            discountPercentage: 0,
                                          });
                                          this.calculateSummary();
                                        }}
                                      >
                                        <option value="none">None</option>
                                        <option value="percentage">
                                          Percentage
                                        </option>
                                        <option value="amount">Amount</option>
                                      </select>
                                    </div>
                                    <span className="err err_discount_type"></span>
                                  </div>
                                </div>
                                {this.state.discountType == "percentage" ? (
                                  <div className="col-md-4">
                                    <div className="form-group new_order_7">
                                      <div className="modal-left-bx">
                                        <label>Discount Percentage</label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="number"
                                          name="discountPercentage"
                                          value={this.state.discountPercentage}
                                          className="form-control"
                                          placeholder="Enter Discount Percentage"
                                          onChange={this.formHandler}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : this.state.discountType == "amount" ? (
                                  <div className="col-md-4">
                                    <div className="form-group new_order_7">
                                      <div className="modal-left-bx">
                                        <label>Discount Amount</label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="number"
                                          name="discountAmount"
                                          value={
                                            this.state.discountAmount || ""
                                          }
                                          className="form-control"
                                          placeholder="Enter Discount Amount"
                                          onChange={this.formHandler}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {this.state.discountType == "percentage" ||
                                this.state.discountType == "amount" ? (
                                  <div className="col-md-4">
                                    <div className="form-group new_order_7">
                                      <div className="modal-left-bx">
                                        <label>Discount Reason</label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="text"
                                          name="discountReason"
                                          value={this.state.discountReason}
                                          className="form-control"
                                          placeholder="Enter Discount Reason"
                                          onChange={this.formHandler}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className="payment-wrap">
                                <h2>Delivery Slot</h2>
                                <div className="payment-detail">
                                  <ul>
                                    {/*Free Shipping */}
                                    {this.state.Free_Shipping === "yes" ? (
                                      <li
                                        style={{
                                          listStyle: "none",
                                          textTransform: "capitalize",
                                        }}
                                      >
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
                                    ) : (
                                      ""
                                    )}
                                    {/*Same Day Delivery */}
                                    {this.state.deliverySlotInfo &&
                                    this.state.deliverySlotInfo
                                      .Same_day_delivery_till_2pm === "yes" ? (
                                      <li
                                        style={{
                                          listStyle: "none",
                                          textTransform: "capitalize",
                                        }}
                                      >
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
                                            Same Day Delivery - Rs.{" "}
                                            {(this.state.deliverySlotInfo &&
                                              this.state.deliverySlotInfo
                                                .Same_day_delivery_till_2pm_charges) ||
                                              0}
                                          </span>
                                        </label>
                                      </li>
                                    ) : (
                                      ""
                                    )}
                                    {/*Standard Delivery */}
                                    {this.state.deliverySlotInfo
                                      .Standard_delivery === "yes" ? (
                                      <li
                                        style={{
                                          listStyle: "none",
                                          textTransform: "capitalize",
                                        }}
                                      >
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
                                            {
                                              this.state.deliverySlotInfo
                                                .Slot5String
                                            }
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
                                    {this.state.deliverySlotInfo &&
                                    this.state.deliverySlotInfo
                                      .Next_day_delivery_Standard_9am_9pm ===
                                      "yes" ? (
                                      <li
                                        style={{
                                          listStyle: "none",
                                          textTransform: "capitalize",
                                        }}
                                      >
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
                                            {
                                              this.state.deliverySlotInfo
                                                .Slot2String
                                            }
                                            -
                                            {/* Next Day Standard Delivery (9am - 9pm) - */}
                                            Rs.{" "}
                                            {this.state.deliverySlotInfo
                                              .Next_day_delivery_Standard_9am_9pm_charges ||
                                              0}
                                          </span>
                                        </label>
                                      </li>
                                    ) : (
                                      ""
                                    )}

                                    {/*Next Day Delivery 2-8*/}
                                    {this.state.deliverySlotInfo &&
                                    this.state.deliverySlotInfo
                                      .Next_day_delivery_2pm_8pm === "yes" ? (
                                      <li
                                        style={{
                                          listStyle: "none",
                                          textTransform: "capitalize",
                                        }}
                                      >
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
                                            {
                                              this.state.deliverySlotInfo
                                                .Slot4String
                                            }
                                            -
                                            {/* Next Day Delivery (2pm - 8pm)  */}
                                            - Rs.{" "}
                                            {this.state.deliverySlotInfo
                                              .Next_day_delivery_2pm_8pm_charges ||
                                              0}
                                          </span>
                                        </label>
                                      </li>
                                    ) : (
                                      ""
                                    )}
                                    {/*Next Day Delivery 8-2*/}
                                    {this.state.deliverySlotInfo
                                      .Next_day_delivery_8am_2pm === "yes" ? (
                                      <li
                                        style={{
                                          listStyle: "none",
                                          textTransform: "capitalize",
                                        }}
                                      >
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
                                            {
                                              this.state.deliverySlotInfo
                                                .Slot3String
                                            }
                                            -
                                            {/* Next Day Delivery (8am - 2pm)  */}
                                            - Rs.{" "}
                                            {this.state.deliverySlotInfo
                                              .Next_day_delivery_8am_2pm_charges ||
                                              0}
                                          </span>
                                        </label>
                                      </li>
                                    ) : (
                                      ""
                                    )}

                                    {/*Farm Pickup*/}
                                    {this.state.deliverySlotInfo
                                      .Farm_pick_up === "yes" ? (
                                      <li
                                        style={{
                                          listStyle: "none",
                                          textTransform: "capitalize",
                                        }}
                                      >
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
                                              .Farm_pick_up_delivery_charges ||
                                              0}
                                          </span>
                                        </label>
                                      </li>
                                    ) : (
                                      ""
                                    )}
                                  </ul>
                                </div>
                                <div className="err err_deliveryslot"></div>
                              </div>

                              <div></div>

                              {this.state.addedProducts &&
                              this.state.addedProducts[0] ? (
                                <div className="cart-summary order-summary-box">
                                  <h2>Summary</h2>
                                  <div className="summary-table-class">
                                    <table className="summarytable">
                                      <tbody>
                                        <tr>
                                          <td>
                                            Sub-Total{" "}
                                            {/* <small>(including GST)</small> */}
                                          </td>
                                          <td>₹{this.state.subTotal}</td>
                                        </tr>
                                        {this.state.discountType != "none" ? (
                                          <tr>
                                            <td>Discount</td>
                                            {this.state.discountType ==
                                            "amount" ? (
                                              <td>
                                                ₹{+this.state.discountAmount}
                                              </td>
                                            ) : this.state.discountType ==
                                              "percentage" ? (
                                              <td>
                                                ₹{this.state.discountAmount}
                                                {/* {(
                                                  (+this.state
                                                    .discountPercentage *
                                                    (+this.state.subTotal )) /
                                                  100
                                                ).toFixed(2)} */}
                                              </td>
                                            ) : (
                                              <td>₹0</td>
                                            )}
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
                                              style={{
                                                userSelect: "none",
                                                cursor: "pointer",
                                              }}
                                            >
                                              <td>
                                                GST
                                                {this.state.showGstDropdown ? (
                                                  <i className="fa fa-caret-up"></i>
                                                ) : (
                                                  <i className="fa fa-caret-down"></i>
                                                )}
                                              </td>
                                              <td>₹{this.state.gst_price}</td>
                                            </tr>
                                            {this.state.showGstDropdown && (
                                              <div className="gst-dropdown">
                                                {this.state.allGstLists.map(
                                                  (li) => {
                                                    return (
                                                      li.tax_name &&
                                                      li.totalPrice && (
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            justifyContent:
                                                              "space-between",
                                                            alignItems:
                                                              "center",
                                                            fontSize: 12,
                                                          }}
                                                        >
                                                          <p
                                                            style={{
                                                              textTransform:
                                                                "uppercase",
                                                            }}
                                                          >
                                                            {li.tax_name}{" "}
                                                            {li.tax_percent}%
                                                          </p>
                                                          <p>
                                                            ₹{li.totalPrice}
                                                          </p>
                                                        </div>
                                                      )
                                                    );
                                                  }
                                                )}
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          ""
                                        )}

                                        {/* <tr>
                                          <td>
                                            Cart Total
                                            <small>(including GST)</small>
                                          </td>
                                          <td>
                                            ₹
                                            {this.state.cart_total
                                              ? this.state.cart_total
                                              : "0"}
                                          </td>
                                        </tr> */}
                                        <tr>
                                          <td>Delivery Charges</td>
                                          <td>
                                            ₹
                                            {this.state.deliveryCharges
                                              ? this.state.deliveryCharges
                                              : "0"}
                                          </td>
                                        </tr>
                                      </tbody>
                                      <tfoot>
                                        <tr>
                                          <td>Total</td>
                                          <td>
                                            ₹
                                            {this.state.total_price
                                              ? this.state.total_price
                                              : "0"}
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="payment order-pay-block order-method-pay">
                                <h2>Payment Method</h2>
                                <div className="form-group">
                                  <input
                                    type="radio"
                                    name="payment_method"
                                    value="COD"
                                    onChange={this.formHandler}
                                  />
                                  <label for="COD">COD</label>
                                  <br />
                                  {this.state.creditPaymentOnOff ? (
                                    <>
                                      <input
                                        type="radio"
                                        name="payment_method"
                                        value="Credit"
                                        onChange={this.formHandler}
                                      />
                                      <label for="Credit">Credit</label>
                                      <br />
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* <input
                                type="radio"
                                name="payment_method"
                                value="Paytm_link"
                                onChange={this.formHandler}
                              />
                              <label for="Paytm Link">Paytm Link</label> */}
                                  <div>
                                    <span className="err err_payment_method"></span>
                                  </div>
                                </div>
                              </div>

                              <div className="modal-bottom">
                                {this.state.loading ? (
                                  <button
                                    type="button"
                                    className="btn btn-primary m-r-5 float-right"
                                  >
                                    <i
                                      className="fa fa-spinner searchLoading"
                                      aria-hidden="true"
                                      style={{ position: "static" }}
                                    ></i>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-primary m-r-5 float-right"
                                    onClick={this.add}
                                  >
                                    Place Order
                                  </button>
                                )}
                              </div>
                            </>
                          ) : (
                            <p>
                              Please Select Location and customer to proceed
                            </p>
                          )}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={this.viewcloseModal}
              className={
                this.state.mdl_layout__obfuscator_hide
                  ? "mdl_layout__obfuscator_show"
                  : "mdl_layout__obfuscator_hide"
              }
            ></div>
          </div>
        </div>

        {/* add address modal start */}
        <Modal
          isOpen={this.state.addressModalIsOpen}
          onRequestClose={() => this.closeAddressModal()}
          className="adding-address"
          contentLabel="Add Address"
        >
          <Add_address
            addressSaved={() => this.closeAddressModal()}
            adminPanel={true}
            user_id={this.state.user_id}
            gifting={false}
          />
          {/* <div role="dialog">
            <div className="modal-dialog manage-add">
              <div className="modal-content">
                <button
                  type="button"
                  className="close"
                  onClick={() => this.closeAddressModal()}
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
                            style={{
                              color: "#febc15",
                              padding: "4px",
                              fontSize: "13px",
                              display: "inline",
                              cursor: "pointer",
                            }}
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
                          placeholder={
                            this.state.street_address || "Enter a location.."
                          }
                          onChange={(e) =>
                            this.setState({ searchKey: e.target.value })
                          }
                          value={
                            this.state.searchKey ||
                            this.state.street_address ||
                            ""
                          }
                          options={{
                            types: ["geocode", "establishment"],
                            componentRestrictions: {
                              country: ["in"],
                            },
                          }}
                          onPlaceSelected={(e) => this.changePlaces(e)}
                        />
                        <span className="focus-border"></span>
                        <span className="err err_add_fullAddress"></span>
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
                        <span className="err err_add_houseNo"></span>
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
                          Location Tag <span className="asterisk">*</span> (Eg.
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
          isOpen={this.state.editAddressModalIsOpen}
          onRequestClose={this.closeEditAddressModal}
          className="adding-address"
          contentLabel="Add Address"
        >
          <Edit_address
            addressSaved={() => this.closeEditAddressModal()}
            selectedEditAddress={this.state.selectedEditAddress}
            adminPanel={true}
          />
          {/* <div role="dialog">
            <div className="modal-dialog manage-add NEW_ADD_NEW">
              <div className="modal-content" style={{ padding: "0px" }}>
                <button
                  type="button"
                  className="close"
                  onClick={this.closeEditAddressModal}
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
                          House / Flat No. <span className="asterisk">*</span>
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="edithouseNo"
                          className="form-control"
                          placeholder="Enter Address"
                          onChange={(ev) => this.formHandlerAddress(ev)}
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
                          name="editlocality"
                          className="form-control"
                          placeholder="Enter Landmark"
                          onChange={(ev) => this.formHandlerAddress(ev)}
                          value={this.state.editlocality}
                        />
                        <span className="err err_editlandmark"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>
                          Location Tag <span className="asterisk">*</span> (Eg.
                          Home, Office, etc.)
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="editlocattion_tag"
                          className="form-control"
                          placeholder="Enter Location Tag"
                          onChange={(ev) => this.formHandlerAddress(ev)}
                          value={this.state.editlocattion_tag}
                        />

                        <span className="err err_editlocationtag"></span>
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
          </div> */}
        </Modal>

        {/* Add customer model start */}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div role="dialog">
            <div className="modal-dialog add-loyality-block-pop">
              <div className="modal-content">
                <button
                  type="button"
                  className="close"
                  onClick={this.closeModal}
                >
                  &times;
                </button>
                <h4 className="modal-title">Add Customer</h4>
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
                          name="addcustomer_name"
                          className="form-control"
                          placeholder="Enter Customer Name"
                          onChange={this.formHandler}
                        />
                        <span className="err err_addcustomer_name"></span>
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
                          name="addcustomer_mobile"
                          className="form-control"
                          value={this.state.addcustomer_mobile}
                          placeholder="Enter Mobile Number"
                          onChange={this.formHandler}
                        />
                        <span className="err err_addcustomer_mobile"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Email</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="addcustomer_email"
                          className="form-control"
                          placeholder="Enter Email"
                          onChange={this.formHandler}
                        />
                        <span className="err err_addcustomer_email"></span>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>GST number</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="addcustomer_gst"
                          className="form-control"
                          placeholder="Enter GST number"
                          onChange={this.formHandler}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>
                          User Type <span className="asterisk">*</span>
                        </label>
                      </div>
                      <div className="modal-right-bx">
                        <select
                          name="user_type"
                          className="form-control"
                          onChange={this.formHandler}
                        >
                          <option value="">Select User Type</option>
                          <option value="user">User</option>
                          <option value="b2b">B2B</option>
                          <option value="retail">Retail</option>
                        </select>
                        <span className="err err_user_type"></span>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Credit Limit</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          name="creditLimit"
                          className="form-control"
                          placeholder="Enter Credit Limit"
                          onChange={this.formHandler}
                        />
                        <span className="err err_creditLimit"></span>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Status</label>
                      </div>
                      <div className="modal-right-bx">
                        <Switch
                          onChange={this.handleChangeStatus}
                          checked={this.state.status}
                          id="normal-switch"
                        />
                      </div>
                    </div>
                    <div className="modal-bottom">
                      {/* <button
                        className="btn btn-primary feel-btn"
                        onClick={this.closeModal}
                      >
                        Cancel
                      </button> */}
                      <button
                        type="button"
                        className="btn btn-primary feel-btn"
                        onClick={this.addCustomer}
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

        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
