import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Geocode from "react-geocode";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import SelectSearch from "react-select-search";
import "react-times/css/classic/default.css";
import "react-times/css/material/default.css";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
import "../../../assets/css/common.css";
import "../../../assets/css/styles.css";
import Group_Product from "../../../components/Group/Group_Product";
import Adminfooter from "../elements/admin_footer";
import Adminheader from "../elements/admin_header";
import Adminsiderbar from "../elements/admin_sidebar";
import Tooltip from "./Tooltip";
const GOOGLE_API_KEY = "AIzaSyCazDplf1HtSAyvjhY40uqUaTBuSYoVyGE";
Geocode.setApiKey(GOOGLE_API_KEY);
Geocode.setRegion("in");

var all_products = [];
export default class Editorder extends Component {
  constructor(props) {
    super(props);
    var path = this.props.location.pathname;
    var book_id = path.substring(path.lastIndexOf("/") + 1, path.length);
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      pageLoading: false,
      admin_data: JSON.parse(dt),
      booking_id: book_id,
      all_address: [],
      state: "",
      unfilteredProducts: [],
      DeliveryDate: null,
      counter: 0,
      openGroupProduct: false,
      addedProducts: [],
      creditPaymentOnOff: false,
    };

    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.add = this.add.bind(this);
    this.onchangingaddress = this.onchangingaddress.bind(this);
  }
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
    this.calculateSummary();
  }
  add() {
    // return;
    let errorsPresent = false;

    if (!this.state.billType) {
      document.querySelector(".err_bill_type").innerHTML =
        "Please select Bill Type";
      errorsPresent = true;
    }
    if (this.state.addedProducts.length === 0 || !this.state.addedProducts) {
      document.querySelector(".err_product_id").innerHTML =
        "Please select Items";
      errorsPresent = true;
    }

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
    if (this.state.total_price < 0) {
      swal({
        text: "Price should not be in negative, Please review order.",
        icon: "warning",
      });
      errorsPresent = true;
    }
    const requestData = {
      booking_id: this.state.booking_id,
      RegionId: this.state.selectedRegion,
      regionName: this.state.selectedRegionName,
      delivery_instructions: this.state.delivery_instructions || "",
      DeliveryDate: this.state.DeliveryDate || null,
      total_payment: Number(this.state.total_price),
      // total_payment: this.state.total_payment,
      // gst: this.state.gst,
      gst: this.state.gst_price,
      allGstLists: this.state.allGstLists,
      po_number: this.state.po_number,
      paymentmethod: this.state.payment_method,
      challanNO: this.state.challanNO,
      invoiceNO: this.state.invoiceNO,
      billType: this.state.billType,
      allGstLists: this.state.allGstLists,
      taxType: this.state.taxType,
      deliveryCharges: Number(this.state.deliveryCharges),
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
        console.log(product.price);
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
          _id: product.product_id,
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
          barcode: product.barcode || "",
          booking_item_desc: product.booking_item_desc,
          qty: product.qty,
          price: product.price,
          totalprice: product.totalprice,
          packetLabel: product.packetLabel,
          packet_size: product.packet_size,
          packet_id: product.packet_id,
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
      deliverySlot: this.state.deliverySlotSlug,
      notifyUser: this.state.notifyUser,
      balance_payment: this.state.balance_payment,
      user_id: this.state.user_id,
      billingCompany: this.state.billingCompany,
      billType: this.state.billType,
      adminDiscountReason: this.state.discountReason,
      discountType: this.state.discountType,
      discountPercentage: this.state.discountPercentage,
      adminDiscountType: this.state.discountType,
      totalCouponDiscountAmount: this.state.onlineDiscountApplied
        ? 0
        : this.state.discountAmount || 0,
      orderDate: this.state.order_date,
      totalCartPrice: +this.state.subTotal + +this.state.gst_price,
      totalCartPriceWithoutGST: this.state.subTotal,
      booking_code: this.state.booking_code,
      total_payment: Number(this.state.total_price),
      // totalCartPrice: this.state.totalCartPrice,
      // totalCartPriceWithoutGST: this.state.totalCartPriceWithoutGST,
    };

    if (errorsPresent) {
      return;
    } else {
      this.setState({ loading: true });
    }
    // return;
    AdminApiRequest(requestData, "/admin/updateBooking", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          // if (res.data.status == "ok") {
          swal({
            title: "Order Updated",
            // text: "Your Booking ID is " + res.data.result,
            icon: "success",
            dangerMode: false,
          }).then(() => {
            this.props.history.push("/admin-orderdetails");
          });
          // }
          // this.setState({ paymentData: res.data });
          // this.openCheckout();
        } else if (res.status >= 400 && res.status <= 404) {
          swal({
            // title: "Order Placed",
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
  setOrderDate = (date) => {
    this.setState({
      order_date: date,
    });
  };
  setDeliveryDate = (date) => {
    this.setState({
      DeliveryDate: date,
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
            // this.usersaddress(data.value);
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
  changeDesc(e, prod) {
    document.querySelector(`.err_${prod._id}desc`).innerHTML = "";
    let localProducts = this.state.addedProducts;
    localProducts = localProducts.map((product) => {
      if (product.TypeOfProduct === "group") {
        if (prod.groupSlug === product.groupSlug) {
          prod.booking_item_desc = e.target.value;
        }
      } else {
        if (prod._id === product._id) {
          prod.booking_item_desc = e.target.value;
        }
      }
      return product;
    });
    this.setState({ addedProducts: localProducts });
  }

  changePackage = (e, packages, product_id, index) => {
    let localProducts = this.state.addedProducts;
    if (e.target.value === "none") {
      localProducts.forEach((prd) => {
        if (prd.product_unique_id === product_id) {
          prd.packetLabel = "";
          prd.packet_size = "";
          prd.without_package = true;
          prd.qty = "";
          prd.price = "";
          prd.packet_id = "";
          prd.totalprice = "";
        }
      });
      this.setState({
        addedProducts: localProducts,
      });
    } else {
      let localPackage;
      packages.map((pck) => {
        console.log(e.target.value, pck);
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
          prd.qty = "";
          prd.price = +localPrice;
          prd.packet_id = localPackage._id;
          prd.without_package = false;
          prd.totalprice = +prd.qty * +localPrice;
        }
      });
      this.setState({
        addedProducts: localProducts,
      });
    }
    this.calculateSummary();
  };

  onChange1(valu, callFrom) {
    if (document.querySelector(".err_product_id") !== null) {
      document.querySelector(".err_product_id").innerHTML = "";
    }

    let p_length = "";
    p_length = new Date().getTime();
    let alreadyExists = false;
    if (valu.TypeOfProduct === "group") {
      let product = [];
      // if (callFrom === "booking") {
      //   product = [{ ...valu.product_id }];
      // } else {
      product = this.state.unfilteredProducts.filter(
        (prod) => valu.value == prod._id
      );
      // }
      if (valu.price) {
        this.addGroup(valu);
      } else {
        this.setState({
          groupProductData: product[0],
        });
        setTimeout(() => {
          this.setState({
            openGroupProduct: true,
          });
        });
      }
    } else {
      this.setState((prev) => {
        let product = [];
        // if (callFrom === "booking") {
        //   product = [{ ...valu.product_id }];
        // } else {
        product = prev.unfilteredProducts.filter(
          (prod) => valu.value === prod._id
        );
        // }
        let price = 0;
        const user_type = this.state.user_type;
        const simpleData = product[0] ? product[0].simpleData[0] : "";
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
              ...valu,
              availableQuantity: product[0].availableQuantity
                ? typeof product[0].availableQuantity === "object"
                  ? product[0].availableQuantity
                  : product[0].availableQuantity
                : 0,
              product_id: product[0] && product[0]._id,
              simpleData: product[0] && product[0].simpleData,
              product_unique_id: product[0]._id + p_length,
              booking_item_desc: valu.booking_item_desc || "",
              unitMeasurement: product[0] && product[0].unitMeasurement,
              unitQuantity: product[0] && product[0].unitQuantity,
              unitId: "",
              without_package:
                valu.without_package !== undefined
                  ? valu.without_package !== "undefined"
                    ? valu.without_package
                    : true
                  : true,
              barcode: valu.barcode || "",
              barcodeList:
                product[0].barcode?.length > 0 ? product[0].barcode : [],
              packetLabel: valu.packetLabel ? valu.packetLabel : null,
              packet_size: valu.packet_size ? valu.packet_size : null,
              packet_id: valu.packet_id ? valu.packet_id : "",
              qty: valu.qty ? valu.qty : 0,
              initialQty: valu.initialQty || 0,
              price: valu.price ? valu.price : 0,
              totalprice: valu.totalprice ? valu.totalprice : 0,
            },
          ],
        };
      });
    }
    console.log("my_products", this.state.addedProducts);
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
        initialQty: data.initialQty,
        price: data.price,
        salesTaxOutSide:
          data.salesTaxOutSide || data.product_id.salesTaxOutSide,
        salesTaxWithIn: data.salesTaxWithIn || data.product_id.salesTaxWithIn,
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

  onchangingaddress(data, ev) {
    document.querySelector(".err_address").innerHTML = "";
    this.setState({
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
      this.getDeliverySlot(data.pincode);
    }, 0);
  }

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
            document.querySelector(
              `.err_${prod.product_unique_id}qty`
            ).innerHTML = `Only ${av ? av.toFixed(1) : 0} Quantity in stock`;
          }
        }
      } else {
        if (prod.product_unique_id === product.product_unique_id) {
          let av =
            typeof product.availableQuantity === "object"
              ? +product.availableQuantity + product.initialQty
              : +product.availableQuantity + product.initialQty;
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

  formHandler(ev) {
    const total = +this.state.total_price;
    if (ev.target.name === "discountAmount") {
      if (ev.target.value > total) {
        this.setState({ discountAmount: total.toFixed(2) });
      } else {
        this.setState({ discountAmount: ev.target.value });
      }
    } else if (ev.target.name === "discountPercentage") {
      if (+ev.target.value > 100) {
        this.setState({ discountPercentage: 100 });
      } else {
        this.setState({ discountPercentage: ev.target.value });
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

  calculateSummary() {
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
        if (itm.groupData[0]) {
          amountBeforeGST = itm.price * itm.qty - singleProductTaxPrice;
        } else {
          if (itm.simpleData[0] && itm.simpleData[0].package.length > 0) {
            amountBeforeGST = itm.totalprice - singleProductTaxPrice;
          } else {
            amountBeforeGST = itm.price * itm.qty - singleProductTaxPrice;
          }
        }
        itemWiseData.push({
          ...itm,
          itemWiseGst: singleProductTaxPrice.toFixed(2),
          totalPriceAfterGST: itm.totalprice,
          // totalprice: itm.totalPriceBeforeGST,
          // price: +itm.totalPriceBeforeGST / +itm.qty,
        });

        return {
          ...itm,
          totalPriceBeforeGST: amountBeforeGST.toFixed(2),
          itemWiseGst: singleProductTaxPrice.toFixed(2),
          totalPriceAfterGST: itm.totalprice,
        };
      });
      this.setState({
        addedProducts: modified,
        itemWiseData: itemWiseData,
      });
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
        ? itm.salesTaxWithIn
          ? itm.salesTaxWithIn.totalTax
          : 0
        : itm.salesTaxOutSide
        ? itm.salesTaxOutSide.totalTax
        : 0;
      selectedTaxRegion = this.state.state.toLocaleLowerCase().includes("delhi")
        ? itm.salesTaxWithIn
        : itm.salesTaxOutSide;
      singleProductTaxPrice = itm.itemDiscountAmount
        ? (+totalpriceBeforeTax * +totalTaxPercentage) / 100
        : +totalpriceBeforeTax -
          +totalpriceBeforeTax * (100 / (100 + +totalTaxPercentage));
      total_gst += singleProductTaxPrice;

      selectedTaxRegion.taxData.length > 0 &&
        selectedTaxRegion &&
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

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: "true" });
    } else {
      this.setState({ status: "false" });
    }
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

  getAllProducts = (regional_id, data) => {
    this.setState({ pageLoading: false, productOrderLoading: true });

    // this.setState({ pageLoading: false, productOrderLoading: false });
    const requestData = {
      RegionId: regional_id,
      subscribe: false,
      showall: true,
    };
    AdminApiRequest(requestData, "/admin/product/forAdmin/byregion", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          all_products = [];
          res.data.data.map((item, index) => {
            if (!item.outOfStock || item.TypeOfProduct === "group") {
              if (item.status && !item.preOrder) {
                all_products.push({
                  value: item._id,
                  name: item.product_name,
                  availableQuantity: +item.availableQuantity,
                  TypeOfProduct: item.TypeOfProduct,
                });
              }
            }
          });
          this.setState({
            unfilteredProducts: res.data.data,
            progress: this.state.progress + 30,
          });
          setTimeout(() => {
            data.bookingdetail.map((item, index) =>
              this.onChange1(
                {
                  ...item,
                  _id: item.product_id._id,
                  value: item.product_id._id,
                  TypeOfProduct: item.product_id.TypeOfProduct,
                  name: item.product_name || item.product_id.product_name,
                  index: index,
                  barcode: item.barcode || "",
                  availableQuantity: item.availableQuantity
                    ? typeof item.availableQuantity === "object"
                      ? item.availableQuantity
                      : item.availableQuantity
                    : item.product_id.availableQuantity,
                  qty: item.qty || 0,
                  packetLabel: item.packetLabel,
                  packet_size: item.packet_size,
                  booking_item_desc: item.booking_item_desc,
                  packet_id:
                    data.bookingMode === "offline"
                      ? item.packet_id
                      : item.productItemId || item.packet_id,
                  price: item.simpleItem
                    ? item.simpleItem.selling_price || 0
                    : item.price || 0,
                  totalprice: item.totalprice ? item.totalprice : 0,
                  initialQty: item.qty || 0,
                  without_package: item.without_package,
                },
                "booking"
              )
            );
          }, 0);
        } else {
          swal({
            title: "Network Issue",
            // text: "Are you sure that you want to leave this page?",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .then(() => {
        this.setState({ pageLoading: false, productOrderLoading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  get_unit_measurement = () => {
    let requestData = {};
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
  };

  getOneBooking = () => {
    let requestbookingid = { booking_id: this.state.booking_id };
    AdminApiRequest(requestbookingid, "/admin/getOneBooking", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          var data = res.data.data[0];
          let sregion = [];
          sregion.push({ value: data.regionID, label: data.regionName });
          // this.usersaddress(data.user_id._id);
          this.getAllProducts(data.regionID, data);
          var initial_data = [];
          this.setState({
            selectedRegiondata: sregion,
            selectedRegion: data.regionID,
            selectedRegionName: data.regionName,
            contactNumber: data.userMobile,
            name: data.userName,
            email: data.userEmail,
            challanNO: data.challanNO,
            invoiceNO: data.invoiceNO,
            billType: data.billType,
            order_date: data.backendOrderDate
              ? new Date(data.backendOrderDate)
              : new Date(data.createDate),
            billType: data.billType,
            billingCompany: data.billingCompany,
            bookingMode: data.bookingMode,
            payment_method: data.paymentmethod,
            booking_address: data.booking_address.address,
            po_number: data.po_number,
            state: data.booking_address.state
              ? data.booking_address.state
              : null,
            city: data.booking_address.city ? data.booking_address.city : null,
            booking_id: data._id,
            user_id: data.user_id._id,
            total_payment: data.total_payment,
            gst: data.gst,
            allGstLists: data.allGstLists,
            taxType: data.taxType,
            notifyUser: true,
            user_type: data.user_id.user_type,
            balance_payment: 50,
            totalCartPrice: data.totalCartPrice,
            totalCartPriceWithoutGST: data.totalCartPriceWithoutGST,
            subTotal: data.totalCartPriceWithoutGST,
            total_price: data.total_payment,
            showTaxFields: true,
            adminDiscount: 0,
            discountReason: data.adminDiscountReason,
            discountType:
              data.bookingMode === "online"
                ? "amount"
                : data.adminDiscountType || data.discountType,
            discountPercentage:
              data.adminDiscountPercentage || data.discountPercentage,
            delivery_instructions: data.delivery_instructions || "",
            discountAmount:
              data.bookingMode === "online"
                ? data.totalCouponDiscountAmount +
                  +data.redeemDiscount +
                  +data.referralDiscount
                : data.totalCouponDiscountAmount,
            onlineDiscountApplied:
              +data.redeemDiscount || +data.referralDiscount ? true : false,
            deliveryCharges: data.deliveryCharges,
            gst_price: data.gst,
            booking_code: data.booking_code,
            DeliveryDate: data.DeliveryDate
              ? new Date(data.DeliveryDate)
              : null,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.calculateSummary();
  };

  componentDidMount() {
    this.setState({ pageLoading: true });
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
    AdminApiRequest({}, "/admin/product/allActiveProducts", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          all_products = [];
          this.setState({
            unfilteredProducts: res.data.data,
          });
        } else {
          swal({
            title: "Network Issue",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .then(() => {
        this.getBillingCompanies();
        setTimeout(() => {
          this.getOneBooking();
        }, 0);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const street = this.state.street;
    return (
      <div className="wrapper add-order-wrapper">
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
          {this.state.pageLoading ? (
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 ml-auto mr-auto mb-5">
                    <div className="card" style={{ minHeight: "50vh" }}>
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">open_with</i>
                        </div>
                      </div>
                      <div className="card-body add_offline_order ">
                        <h4 className="card-title">
                          Edit Order{" "}
                          {this.state.booking_code
                            ? " - " + this.state.booking_code
                            : ""}{" "}
                        </h4>
                        <div className="text-center">
                          <ReactLoading type={"cylon"} color={"#febc12"} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                        <h4 className="card-title">
                          Edit Order{" "}
                          {this.state.booking_code
                            ? " - " + this.state.booking_code
                            : ""}{" "}
                        </h4>

                        <div className="modal-form-bx">
                          <div className="">
                            <h2 className="d-inline mr-4">Customer Detail</h2>
                            <Link to="/admin-orderdetails">
                              <button
                                type="button"
                                className="btn btn-primary m-r-5 float-right"
                                style={{ float: "right", minWidth: 150 }}
                              >
                                Back
                              </button>
                            </Link>
                          </div>
                          <form>
                            <div className="form-group new_order_1 separate_row">
                              <div className="modal-left-bx">
                                <label>Customer Location</label>
                              </div>
                              <div className="modal-right-bx">
                                <span>{this.state.selectedRegionName}</span>
                                <span className="err err_selected_region"></span>
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

                            {this.state.contactNumber ? (
                              <div className="form-group new_order_5 order5_shipping mt-3">
                                <div className="shipping_adrsses">
                                  {" "}
                                  <h2 className="d-inline mr-3">
                                    Shipping Address
                                  </h2>{" "}
                                </div>
                                <div className="modal-right-bx order-address-block">
                                  {/* {this.state.all_address.map((item, index) => ( */}
                                  <div className="Card_des">
                                    <div className="modal-form-bx">
                                      <div className="input_radio"></div>
                                      <div className="heading">
                                        <h2>
                                          {/* {item.locationTag} */}
                                          {this.state.booking_address}
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="err err_address"></span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}

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
                                  {this.state.DeliveryDate ? (
                                    <div className="col-md-3">
                                      <div className="form-group new_order_7">
                                        <div className="modal-left-bx">
                                          <label>
                                            Delivery Date
                                            <span className="asterisk">*</span>
                                          </label>
                                        </div>
                                        <div className="modal-right-bx">
                                          <DatePicker
                                            selected={
                                              this.state.DeliveryDate || ""
                                            }
                                            dateFormat="dd/MM/yyyy"
                                            onChange={(date) =>
                                              this.setDeliveryDate(date)
                                            }
                                          />
                                          <span className="err err_DeliveryDate"></span>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
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
                                          value={this.state.billType}
                                        >
                                          <option value="">
                                            Select Bill Type
                                          </option>
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
                                          value={this.state.billingCompany}
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
                                    onChange={(e) => this.onChange1(e, "new")}
                                    className="select-search"
                                  />
                                </div>
                              </div>
                              <div className="mb-3 mt-4 add-order-backends">
                                <>
                                  <div className="row pr-2 mb-3">
                                    <div className="col-2">Name</div>
                                    <div className="col-2">Description</div>
                                    <div className="col-1">Quantity</div>
                                    <div className="col-1">Unit</div>
                                    <div className="col-2">Package</div>
                                    <div className="col-2">Barcode</div>
                                    <div className="col-1">Price</div>
                                    <div className="col-1">Total</div>
                                  </div>
                                  {!this.state.productOrderLoading ? (
                                    this.state.addedProducts &&
                                    this.state.addedProducts.length > 0 ? (
                                      this.state.addedProducts &&
                                      this.state.addedProducts.map(
                                        (product, index) => (
                                          <div
                                            key={
                                              product.TypeOfProduct !== "group"
                                                ? product.product_unique_id
                                                : product.groupSlug
                                            }
                                            className="row mb-2 pr-2 backend-col-order"
                                          >
                                            <div className="col-2">
                                              {product.TypeOfProduct ===
                                              "group" ? (
                                                product.innerProducts.length >
                                                0 ? (
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
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
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
                                                value={
                                                  product.booking_item_desc
                                                }
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
                                              {product.unitQuantity}
                                              {product.unitMeasurement &&
                                              product.unitMeasurement.name
                                                ? product.unitMeasurement.name
                                                : ""}
                                            </div>
                                            <div className="col-2">
                                              {/* {product  &&
                                          product.simpleData.length === 0 ? (
                                            product.unitMeasurement.name
                                          ) : ( */}
                                              {product.TypeOfProduct ===
                                              "simple" ? (
                                                <select
                                                  name="packagelabel"
                                                  onChange={(e) =>
                                                    this.changePackage(
                                                      e,
                                                      product.simpleData[0]
                                                        .package,
                                                      product.product_unique_id,
                                                      index
                                                    )
                                                  }
                                                  value={
                                                    product.packet_id || "none"
                                                  }
                                                >
                                                  <option value="none">
                                                    None
                                                  </option>
                                                  {product.simpleData &&
                                                    product.simpleData[0].package.map(
                                                      (pck) => {
                                                        return (
                                                          <option
                                                            value={pck._id}
                                                          >
                                                            {pck.packetLabel}
                                                          </option>
                                                        );
                                                      }
                                                    )}
                                                </select>
                                              ) : (
                                                ""
                                              )}
                                              {/* // )} */}
                                            </div>
                                            <div className="col-2">
                                              <select
                                                name="barcode"
                                                onChange={(e) =>
                                                  this.changeBarcode(
                                                    e,
                                                    product.product_unique_id
                                                  )
                                                }
                                                value={product.barcode || ""}
                                              >
                                                <option value="none">
                                                  None
                                                </option>
                                                {product.barcodeList?.map(
                                                  (pck) => {
                                                    return (
                                                      <option value={pck}>
                                                        {pck}
                                                      </option>
                                                    );
                                                  }
                                                )}
                                              </select>
                                            </div>

                                            <div className="col-2 d-flex align-items-center">
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
                                            <div className="col-1">
                                              ₹{product.totalprice}
                                              <span
                                                className="material-icons float-right"
                                                onClick={() =>
                                                  this.deleteAddedProduct(
                                                    product
                                                  )
                                                }
                                                style={{ cursor: "pointer" }}
                                              >
                                                clear
                                              </span>
                                            </div>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    <div className="row backend-col-order align-items-center justify-content-center p-2 w-100">
                                      <i
                                        className="fa fa-spinner searchLoading mr-2"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Loading...
                                    </div>
                                  )}
                                </>
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
                                    className="form-contDiscountrol"
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
                              {/* <h2 className="mt-3">Discount</h2>
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
                                        value={this.state.discountType}
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
                                          value={this.state.discountAmount}
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
                               */}
                              {/* <div className="payment-wrap">
                                <h2>Delivery Slot</h2>
                                <div className="payment-detail">
                                  <ul>
                                  
                                    {this.state.deliverySlotInfo && 
                                      this.state.deliverySlotInfo.Same_day_delivery_till_2pm === "yes" ? (
                                      <li style={{ listStyle: "none" }}>
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
                                            {this.state.deliverySlotInfo
                                              .Same_day_delivery_till_2pm_charges ||
                                              0}
                                          </span>
                                        </label>
                                      </li>
                                    ) : (
                                      ""
                                    )}

                                  
                                    {this.state.deliverySlotInfo
                                      .Next_day_delivery_Standard_9am_9pm ===
                                    "yes" ? (
                                      <li style={{ listStyle: "none" }}>
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
                                            Next Day Standard Delivery (9am -
                                            9pm) - Rs.{" "}
                                            {this.state.deliverySlotInfo
                                              .Next_day_delivery_Standard_9am_9pm_charges ||
                                              0}
                                          </span>
                                        </label>
                                      </li>
                                    ) : (
                                      ""
                                    )}

                                    
                                    {this.state.deliverySlotInfo
                                      .Next_day_delivery_2pm_8pm === "yes" ? (
                                      <li style={{ listStyle: "none" }}>
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
                                            Next Day Delivery (2pm - 8pm) - Rs.{" "}
                                            {this.state.deliverySlotInfo
                                              .Next_day_delivery_2pm_8pm_charges ||
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
                              </div> */}

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
                                                {/* {
                                                  +this.state
                                                    .discountAmodiscount
                                                } */}
                                                ₹{this.state.discountAmount}
                                                {/* {(
                                                  (+this.state
                                                    .discountPercentage *
                                                    (+this.state.subTotal )) /
                                                  100
                                                ).toFixed(2)} */}
                                              </td>
                                            ) : this.state.discountType ==
                                              "percentage" ? (
                                              <td>
                                                ₹{this.state.discountAmount}
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
                              {this.state.bookingMode == "offline" &&
                              (this.state.payment_method == "COD" ||
                                this.state.payment_method == "Credit") ? (
                                <div className="payment order-pay-block order-method-pay">
                                  <h2>Payment Method</h2>
                                  <div className="form-group">
                                    <input
                                      type="radio"
                                      name="payment_method"
                                      value="COD"
                                      checked={
                                        this.state.payment_method == "COD"
                                          ? true
                                          : false
                                      }
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
                                          checked={
                                            this.state.payment_method ==
                                            "Credit"
                                              ? true
                                              : false
                                          }
                                          onChange={this.formHandler}
                                        />
                                        <label for="Credit">Credit</label>
                                      </>
                                    ) : (
                                      ""
                                    )}

                                    <div>
                                      <span className="err err_payment_method"></span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="modal-bottom">
                                {!this.state.loading &&
                                !this.state.productOrderLoading ? (
                                  <button
                                    type="button"
                                    className="btn btn-primary m-r-5 float-right"
                                    onClick={this.add}
                                  >
                                    Update Order
                                  </button>
                                ) : (
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
                                )}
                              </div>
                            </>
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
          )}
        </div>

        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
