import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectSearch from "react-select-search";
import TimePicker from "react-time-picker";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Loader from "../../components/loader/loader";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";

var MultipleArray = [];
var final_ddda = [];

export default class EditInventory extends Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("adminInfo");
    var path = this.props.location.pathname;
    var q_id = path.substring(path.lastIndexOf("/") + 1, path.length);
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_data: JSON.parse(dt),
      invoicenumber: q_id,
      status: true,
      long_description: "",
      short_description: "",
      options: [],
      related_product: [],
      related_recipes: [],
      region: [],
      unit: [],
      addpackage: [],
      package_length: 1,
      regionlength: 0,
      regionlengthconfig: 0,
      addregion: [],
      addregionconfig: [],
      checkvariant: [],
      addlast: 0,
      startDate: new Date(),
      invoice_date: new Date(),
      due_date: new Date(),
      time: "10:00",
      all_product: [],
      regiondata: [],
      finalvar_data: [],
      account_head: "6017bcbd6a0475eb30a643b6",
      invoice_amount: 0,
      activ_supplier: [],
      newproductlength: 0,
      newproduct: [],
      loading: true,
    };

    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.add = this.add.bind(this);
    this.onChange1 = this.onChange1.bind(this);
    this.addnewproduct = this.addnewproduct.bind(this);
    this.onChange11 = this.onChange11.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
  }

  formHandler1(e, index, ind, type) {
    console.log(MultipleArray);
    if (type === "product_costPrice") {
      MultipleArray[index].product_costPrice = e.target.value;
      MultipleArray[index].product_quantity = 0;
      MultipleArray[index].regionalData.map(
        (item) =>
          (MultipleArray[index].product_quantity =
            MultipleArray[index].product_quantity + +item.quantity)
      );
      if (MultipleArray[index].regionalData[ind]) {
        MultipleArray[index].regionalData[ind].total_amount =
          e.target.value === ""
            ? 0
            : +e.target.value * MultipleArray[index].product_quantity;
      }
      // total calculation
      var cpgst =
        +e.target.value * (100 / (100 + MultipleArray[index].gst_percentage));
      MultipleArray[index].singlepricewithoutgst = cpgst;
      MultipleArray[index].gst =
        +MultipleArray[index].product_costPrice *
          MultipleArray[index].product_quantity -
        [
          +MultipleArray[index].product_costPrice *
            MultipleArray[index].product_quantity *
            (100 / (100 + MultipleArray[index].gst_percentage)),
        ];
      MultipleArray[index].invoice_without_gst =
        +MultipleArray[index].product_costPrice *
          MultipleArray[index].product_quantity -
        MultipleArray[index].gst;
    }
    if (type === "variant") {
      MultipleArray[index].regionalData[ind].variant = e.target.value;
    }
    if (type === "quantity") {
      let diff =
        +e.target.value -
        (+MultipleArray[index].regionalData[ind].initial_product_quantity || 0);

      MultipleArray[index].regionalData[ind].quantity = +e.target.value;
      MultipleArray[index].regionalData[ind].availQuantity =
        (+MultipleArray[index].regionalData[ind].initial_availQuantity || 0) +
        diff;

      var abc = 0;
      let ava = 0;
      MultipleArray[index].regionalData.map((item, index) => {
        abc = abc + +item.quantity;
        ava = ava + +item.availQuantity;
      });
      MultipleArray[index].product_quantity = abc;
      MultipleArray[index].AvailableQuantity = ava;
      // product_quantity;
      var a =
        MultipleArray[index].product_costPrice ||
        MultipleArray[index].product_costPrice === null ||
        MultipleArray[index].product_costPrice === undefined
          ? MultipleArray[index].product_costPrice
          : 0;
      MultipleArray[index].regionalData[ind].total_amount =
        e.target.value === "" ? 0 : a * +e.target.value;
      MultipleArray[index].gst =
        +MultipleArray[index].product_costPrice *
          MultipleArray[index].product_quantity -
        [
          +MultipleArray[index].product_costPrice *
            MultipleArray[index].product_quantity *
            (100 / (100 + MultipleArray[index].gst_percentage)),
        ];
      MultipleArray[index].invoice_without_gst =
        +MultipleArray[index].product_costPrice *
          MultipleArray[index].product_quantity -
        MultipleArray[index].gst;
    }
    if (type === "cost_price") {
      MultipleArray[index].regionalData[ind].cost_price = e.target.value;
      var b =
        MultipleArray[index].regionalData[ind].quantity ||
        MultipleArray[index].regionalData[ind].quantity === null ||
        MultipleArray[index].regionalData[ind].quantity === undefined
          ? JSON.parse(MultipleArray[index].regionalData[ind].quantity)
          : 0;
      MultipleArray[index].regionalData[ind].total_amount =
        b * JSON.parse(e.target.value);
    }
    if (type === "total_amount") {
      MultipleArray[index].regionalData[ind].total_amount = e.target.value;
    }
    // MultipleArray[index].regionalData[ind].quantity_differnce =
    //   +MultipleArray[index].regionalData[ind].quantity -
    //   (+MultipleArray[index].regionalData[ind].initial_product_quantity || 0);
    var InvoiceAmount = 0;
    MultipleArray.forEach((item, index) => {
      item.regionalData.forEach((itm, idx) => {
        InvoiceAmount = InvoiceAmount + itm.total_amount;
      });
    });
    this.setState({
      InvoiceAmount: InvoiceAmount,
      loading: false,
    });
    setTimeout(() => {
      console.log(MultipleArray);
    }, 0);
  }

  addnewproduct(type = "AddMore", index) {
    if (type === "AddMore") {
      this.setState({ loading: true });
      MultipleArray.push({
        product: "",
        product_name: "",
        product_costPrice: 0,
        product_quantity: 0,
        BookingQuantity: 0,
        returnQuantity: 0,
        inhouseQuantity: 0,
        lostQuantity: 0,
        gst_percentage: 0,
        gst: 0,
        singlepricewithoutgst: 0,
        invoice_without_gst: 0,
        AvailableQuantity: 0,
        product_expiry: "",
        prodType: "",
        product_measurment: "",
        batchID: "",
        regionalData: [],
      });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true });
      MultipleArray.splice(index, 1);
    }
  }

  addmoregion = (ind) => {
    let data = MultipleArray;
    if (data[ind].prodType === "simple") {
      data[ind].regionalData.push({
        region: "",
        quantity: 0,
        availQuantity: 0,
        bookingQuantity: 0,
        inhouseQuantity: 0,
        returnQuantity: 0,
        lostQuantity: 0,
        cost_price: 0,
        total_amount: 0,
        expiration: "",
      });
    } else {
      data[ind].regionalData.push({
        region: "",
        quantity: "",
        variant: "",
        variant_data: [],
        cost_price: "",
        total_amount: "",
        expiration: "",
      });
    }
    MultipleArray = data;
    this.setState({});
  };

  removeregion = (type = "remove", index, ind) => {
    this.setState({
      loading: true,
    });
    MultipleArray[index].regionalData.splice(ind, 1);
    this.setState({
      loading: false,
    });
    var InvoiceAmount = 0;
    MultipleArray.forEach((item, index) => {
      item.regionalData.forEach((itm, idx) => {
        InvoiceAmount = InvoiceAmount + itm.total_amount;
      });
    });
    this.setState({
      InvoiceAmount: InvoiceAmount,
      loading: false,
    });
  };
  setexpdate11 = (date, index) => {
    MultipleArray[index].product_expiry = date;
    this.setState({
      loading: false,
    });
  };

  removeproduct = (type = "remove", index) => {
    this.setState({
      loading: true,
    });
    MultipleArray.splice(index, 1);
    this.setState({
      loading: false,
    });
    var InvoiceAmount = 0;
    MultipleArray.forEach((item, index) => {
      item.regionalData.forEach((itm, idx) => {
        InvoiceAmount = InvoiceAmount + itm.total_amount;
      });
    });
    this.setState({
      InvoiceAmount: InvoiceAmount,
      loading: false,
    });
  };

  onChange1 = (valu) => {
    this.setState({ account_head: valu.value });
  };

  onChangeregion = (valu, index, ind) => {
    this.setState({
      loading: true,
    });
    let data = MultipleArray;
    data[index].regionalData[ind].region = valu.value;
    var reData = {
      product_id: MultipleArray[index].product,
      region_id: valu.value,
    };
    // AdminApiRequest(reData, "/admin/getConProductByRegion", "POST")
    //   .then((res) => {
    //     if (res.status === 201 || res.status === 200) {
    //       final_ddda = [];
    //       res.data.data.configurableData.forEach((item, index) => {
    //         var daat = [];
    //         item.variant_id.forEach((data, indexing) => {
    //           daat.push(
    //             data.variantId.item.filter(
    //               (item1) => item1._id === data.variantItem
    //             )[0]
    //           );
    //         });
    //         var new_fiu_data = "";
    //         daat.forEach((itemqw, indexqw) => {
    //           new_fiu_data =
    //             indexqw === 0
    //               ? new_fiu_data + itemqw.item_name
    //               : new_fiu_data + " " + itemqw.item_name;
    //         });
    //         final_ddda.push({ _id: item._id, item: new_fiu_data });
    //         MultipleArray[index].regionalData[ind].variant_data = final_ddda;
    //       });
    //     } else {
    //       swal({
    //         title: "Network Issue",
    //         // text: "Are you sure that you want to leave this page?",
    //         icon: "warning",
    //         dangerMode: true,
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    this.setState({
      loading: false,
    });
  };

  setStartDate = (date) => {
    this.setState({
      startDate: date,
    });
  };

  setexpdate = (date, index, ind) => {
    MultipleArray[index].regionalData[ind].expiration = date;
    this.setState({
      loading: false,
    });
  };

  setexpdatecon = (date, l1, length) => {
    var b = "expdatecon" + l1 + length;
    this.setState({
      [b]: date,
    });
  };

  setinvoiceDate = (date) => {
    this.setState({
      invoice_date: date,
    });
  };

  setdueDate = (date) => {
    this.setState({
      due_date: date,
    });
  };

  timepick = (time) => {
    this.setState({
      time: time,
    });
  };

  onChange112(valu, index) {
    const requestData = {};
    AdminApiRequest(requestData, "/admin/product/" + valu.value, "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          // MultipleArray[index].AvailableQuantity =
          //   +res.data.data.AvailableQuantity.$numberDecimal;
          // MultipleArray[index].BookingQuantity =
          //   +res.data.data.BookingQuantity.$numberDecimal;
          // MultipleArray[index].returnQuantity =
          //   +res.data.data.returnQuantity.$numberDecimal;
          // MultipleArray[index].inhouseQuantity =
          //   +res.data.data.inhouseQuantity.$numberDecimal;
          // MultipleArray[index].lostQuantity =
          //   +res.data.data.lostQuantity.$numberDecimal;
          MultipleArray[index].product_name = res.data.data.product_name;
          MultipleArray[index].product = res.data.data._id;
          MultipleArray[index].prodType = res.data.data.TypeOfProduct;
          MultipleArray[index].gst_percentage =
            res.data.data.purchaseTax && +res.data.data.purchaseTax.totalTax
              ? +res.data.data.purchaseTax.totalTax
              : 0;
          MultipleArray[index].singlepricewithoutgst = 0;
          MultipleArray[index].batchID = res.data.data.batchID;
          MultipleArray[index].product_measurment =
            res.data.data.unitMeasurement.name;
          var new_data = [];
          res.data.data.TypeOfProduct === "simple"
            ? res.data.data.simpleData.forEach((item, index) => {
                new_data.push({
                  value: item.region._id,
                  name: item.region.name,
                });
              })
            : res.data.data.configurableData.forEach((item, index) => {
                new_data.push({
                  value: item.region._id,
                  name: item.region.name,
                });
              });
          let a = "single_product" + index;
          let abab = "regiondata" + index;
          this.setState({
            [abab]: new_data,
            [a]: res.data.data,
            loading: false,
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
    this.setState({ ["selected_product" + index]: valu.value });
  }

  onChange11(valu) {
    this.setState({
      supplier: valu.value,
    });
    const data = {
      _id: valu.value,
    };
    AdminApiRequest(data, "/admin/GetInvoiceDueDate", "POST", "")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            due_date: res.data.data,
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

    this.setState({
      loading: false,
    });
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
    this.setState({ loading: false });
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({
        status: true,
        edit_status: true,
      });
    } else {
      this.setState({
        status: false,
        edit_status: false,
      });
    }
  }

  add() {
    var valueErr = document.getElementsByClassName("err");
    for (let i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    // if (!this.state.invoice_number) {
    //   valueErr = document.getElementsByClassName("err_invoice");
    //   valueErr[0].innerText = "This Field is Required";
    // }
    if (!this.state.startDate) {
      valueErr = document.getElementsByClassName("err_startDate");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.invoice_date) {
      valueErr = document.getElementsByClassName("err_invoice_date");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.due_date) {
      valueErr = document.getElementsByClassName("err_due_date");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.supplier) {
      valueErr = document.getElementsByClassName("err_supplier");
      valueErr[0].innerText = "This Field is Required";
    }
    var status = false;
    if (MultipleArray.length === 0) {
      status = true;
      valueErr = document.getElementsByClassName("err_producter");
      valueErr[0].innerText = "Add Product";
    }
    MultipleArray.forEach((item, index) => {
      if (!item.product) {
        status = true;
        valueErr = document.getElementsByClassName("err_productsearch" + index);
        valueErr[0].innerText = "Search / Select Product";
      }
      if (item.product) {
        if (item.regionalData.length === 0) {
          status = true;
          valueErr = document.getElementsByClassName(
            "err_regionselection" + index
          );
          valueErr[0].innerText = "Add Region";
        }
      }
      item.regionalData.forEach((daat, indes) => {
        if (!daat.region) {
          status = true;
          valueErr = document.getElementsByClassName(
            "err_region" + index + indes
          );
          valueErr[0].innerText = "Field Required";
        }
        if (!daat.quantity) {
          status = true;
          valueErr = document.getElementsByClassName(
            "err_quantity" + index + indes
          );
          valueErr[0].innerText = "Field Required";
        } else if (isNaN(daat.quantity)) {
          status = true;
          valueErr = document.getElementsByClassName(
            "err_quantity" + index + indes
          );
          valueErr[0].innerText = "Enter Numeric Digit";
        } else if (daat.quantity <= 0) {
          status = true;
          valueErr = document.getElementsByClassName(
            "err_quantity" + index + indes
          );
          valueErr[0].innerText = "Number Should be greater than 0";
        } else if (
          daat.quantity <
          +daat.initial_product_quantity - +daat.initial_availQuantity
        ) {
          status = true;
          valueErr = document.getElementsByClassName(
            "err_quantity" + index + indes
          );
          valueErr[0].innerText =
            "Number Should be greater than " +
            (+daat.initial_product_quantity - +daat.initial_availQuantity);
        }
        if (daat.prodType === "configurable") {
          if (!daat.variant) {
            valueErr = document.getElementsByClassName(
              "err_variant" + index + indes
            );
            valueErr[0].innerText = "Field Required";
          }
        }

        // if (!daat.cost_price) {
        //   status = true;
        //   valueErr = document.getElementsByClassName(
        //     "err_cost_price" + index + indes
        //   );
        //   valueErr[0].innerText = "Field Required";
        // } else if (isNaN(daat.cost_price)) {
        //   status = true;
        //   valueErr = document.getElementsByClassName(
        //     "err_cost_price" + index + indes
        //   );
        //   valueErr[0].innerText = "Enter Numeric Digit";
        // } else if (daat.cost_price <= 0) {
        //   status = true;
        //   valueErr = document.getElementsByClassName(
        //     "err_cost_price" + index + indes
        //   );
        //   valueErr[0].innerText = "Number Should be greater than 0";
        // }
      });
    });
    this.setState({
      loading: false,
    });
    if (
      // this.state.invoice_number &&
      this.state.startDate &&
      this.state.invoice_date &&
      this.state.due_date &&
      status === false &&
      this.state.supplier
    ) {
      this.setState({
        loading: true,
      });
      var total_gst = 0;
      var InvoiceAmountWithoutGST = 0;
      MultipleArray.forEach((item, index) => {
        total_gst = total_gst + item.gst;
        InvoiceAmountWithoutGST =
          InvoiceAmountWithoutGST + item.invoice_without_gst;
      });
      const data = {
        _id: this.state._id,
        admin_id: this.state.admin_data._id,
        Date: this.state.startDate,
        Time: this.state.time ? this.state.time : "",
        AccountHead: this.state.account_head ? this.state.account_head : "",
        InvoiceNumber: this.state.invoice_number
          ? this.state.invoice_number
          : "",
        InvoiceAmount: this.state.InvoiceAmount ? this.state.InvoiceAmount : "",
        InvoiceDate: this.state.invoice_date ? this.state.invoice_date : "",
        supplier_id: this.state.supplier ? this.state.supplier : "",
        InvoiceDueDate: this.state.due_date ? this.state.due_date : "",
        CashAmount: this.state.invoice_amount ? this.state.invoice_amount : "",
        CardAmount: this.state.card_amount ? this.state.card_amount : "",
        CardType: this.state.approval_number ? this.state.approval_number : "",
        CardType: this.state.card_type ? this.state.card_type : "",
        ChequeAmount: this.state.cheque_amount ? this.state.cheque_amount : "",
        ChequeNumber: this.state.cheque_number ? this.state.cheque_number : "",
        TypeOfProduct: this.state.single_product
          ? this.state.single_product.TypeOfProduct
          : "",
        Bank: this.state.bank ? this.state.bank : "",
        product_data: JSON.stringify(MultipleArray),
        total_gst: total_gst,
        AmountWithoutGSTandDelivery: InvoiceAmountWithoutGST,
      };
      AdminApiRequest(data, "/admin/editInventory", "POST", "")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              loading: false,
            });
            swal({
              title: "Success",
              text: "Inventory Updated Successfully !",
              icon: "success",
              successMode: true,
            });
            this.props.history.push("/admin-view-inventory");
          } else if (res.status === 400) {
            this.setState({
              loading: false,
            });
            swal({
              title: res.data.result[0].InvoiceNumber || "Network Error",
              icon: "warning",
              dangerMode: true,
            });
          } else if (res.status === 401) {
            this.setState({
              loading: false,
            });
            swal({
              title: "Please select Different Product",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
          } else {
            swal({
              title: "Network Issue",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
            this.setState({
              loading: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async componentDidMount() {
    if (window.localStorage) {
      if (!localStorage.getItem("firstLoad")) {
        localStorage["firstLoad"] = true;
        window.location.reload();
      } else localStorage.removeItem("firstLoad");
    }
    var finaldata = { _id: this.state.invoicenumber };
    AdminApiRequest(finaldata, "/admin/GetOneInventory", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            invoice_number: res.data.data.InvoiceNumber,
            _id: res.data.data._id,
            InvoiceAmount: res.data.data.InvoiceAmount,
            invoice_date: new Date(res.data.data.InvoiceDate),
            due_date: new Date(res.data.data.InvoiceDueDate),
            supplier: res.data.data.supplier_id
              ? res.data.data.supplier_id._id
              : "",
            gst: res.data.data.gst,
            invoice_without_gst: res.data.data.invoice_without_gst,
            startDate: new Date(res.data.data.Date),
            time: res.data.data.Time,
          });
          this.forceUpdate();
          res.data.data.productData.forEach((item, index) => {
            this.onChange112({ value: item.product_id._id }, index);
            var dtta = [];
            item.simpleData.forEach((itm, ind) => {
              dtta.push({
                region: itm.region._id,
                quantity: itm.quantity.$numberDecimal || 0,
                cost_price: itm.costPrice || 0,
                availQuantity: itm.availQuantity.$numberDecimal || 0,
                initial_availQuantity: itm.availQuantity.$numberDecimal || 0,
                bookingQuantity: itm.bookingQuantity.$numberDecimal || 0,
                initial_product_quantity:
                  item.product_quantity.$numberDecimal || 0,
                inhouseQuantity: itm.inhouseQuantity.$numberDecimal || 0,
                returnQuantity: itm.returnQuantity.$numberDecimal || 0,
                lostQuantity: itm.lostQuantity.$numberDecimal || 0,
                total_amount: itm.total_amount || 0,
                expiration:
                  itm.ExpirationDate === null ? "" : itm.ExpirationDate,
              });
            });
            console.log(":::::===>>", item.configurableData);
            item.configurableData.forEach((itm, ind) => {
              dtta.push({
                region: itm.region._id,
                quantity: itm.quantity.$numberDecimal || 0,
                cost_price: itm.costPrice || 0,
                availQuantity: itm.availQuantity.$numberDecimal || 0,
                initial_availQuantity: itm.availQuantity.$numberDecimal || 0,
                bookingQuantity: itm.bookingQuantity.$numberDecimal || 0,
                initial_product_quantity:
                  item.product_quantity.$numberDecimal || 0,
                inhouseQuantity: itm.inhouseQuantity.$numberDecimal || 0,
                returnQuantity: itm.returnQuantity.$numberDecimal || 0,
                lostQuantity: itm.lostQuantity.$numberDecimal || 0,
                total_amount: itm.total_amount || 0,
                variant_name: itm.variant_name,
                // variant:"",
                expiration:
                  itm.ExpirationDate === null ? "" : itm.ExpirationDate,
              });
            });
            MultipleArray.push({
              product: item.product_id._id,
              prodType: item.TypeOfProduct,
              product_name: item.product_name,
              product_costPrice: item.product_costPrice || 0,
              totalAvailableQuantity:
                +item.product_id.AvailableQuantity.$numberDecimal || 0,
              AvailableQuantity: +item.AvailableQuantity.$numberDecimal || 0,
              BookingQuantity: +item.BookingQuantity.$numberDecimal || 0,
              returnQuantity: +item.returnQuantity.$numberDecimal || 0,
              inhouseQuantity: +item.inhouseQuantity.$numberDecimal || 0,
              lostQuantity: +item.lostQuantity.$numberDecimal || 0,
              product_quantity: +item.product_quantity.$numberDecimal || 0,
              initial_product_quantity:
                +item.product_quantity.$numberDecimal || 0,
              product_expiry: item.product_expiry
                ? new Date(item.product_expiry)
                : "",
              product_measurment: item.product_measurment,
              batchID: item.batchID,
              regionalData: dtta,
              gst: +item.gst,
              invoice_without_gst: +item.invoice_without_gst,
            });
            item.simpleData.forEach((item1, index) => {
              var new_data = [];
              new_data.push({
                value: item1.region._id,
                name: item1.region.name,
              });
              let abab = "regiondata" + index;
              this.setState({
                [abab]: new_data,
              });
            });
          });
          this.forceUpdate();
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
    const requestData = {};
    var activesupplier = [];
    await AdminApiRequest(requestData, "/admin/product/active", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item) => {
            if (item.TypeOfProduct !== "group") {
              this.state.all_product.push({
                value: item._id,
                name: item.product_name,
              });
            }
          });
          this.setState({
            loading: false,
          });
        } else {
          swal({
            title: "Network Issue",
            // text: "Are you sure that you want to leave this page?",
            icon: "warning",
            dangerMode: true,
          });
        }
        this.forceUpdate();
      })
      .catch((error) => {
        console.log(error);
      });

    await AdminApiRequest(requestData, "/admin/supplier_master", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          activesupplier = res.data.data.filter((item) => item.status === true);
          activesupplier.forEach((item) => {
            this.state.activ_supplier.push({
              value: item._id,
              name: item.name,
            });
          });
        } else {
          swal({
            title: "Network Issue",
            // text: "Are you sure that you want to leave this page?",
            icon: "warning",
            dangerMode: true,
          });
        }
        this.forceUpdate();
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({
      loading: false,
    });
  }

  render() {
    console.log("::::::::::::", MultipleArray);
    return (
      <div className="wrapper ">
        <Adminsiderbar />
        <div className="main-panel">
          <Adminheader />
          <div className="content">
            {this.state.loading === true ? <Loader></Loader> : ""}
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 ml-auto mr-auto">
                  <div className="card">
                    <div className="card-header card-header-primary card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">inventory_2</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">Edit Inventory</h4>
                      {/* <Link to="view-inventory">
                      <button
                        className="btn btn-primary m-r-5 float-right"
                        onClick={this.openModal}
                      >
                        <i className="material-icons">arrow_back_ios</i> View
                        Inventory
                      </button>
                      </Link> */}
                      <form className="add_product_new">
                        <div className="inventory_fields">
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Date
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <DatePicker
                                selected={this.state.startDate}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => this.setStartDate(date)}
                              />
                              <span className="err err_startDate"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Time</label>
                            </div>
                            <div className="modal-right-bx">
                              <TimePicker
                                onChange={(time) => this.timepick(time)}
                                value={this.state.time}
                              />
                              <span className="err err_name"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Select Supplier</label>
                              <span className="asterisk">*</span>
                            </div>
                            <div className="modal-right-bx">
                              <SelectSearch
                                placeholder={
                                  this.state.activ_supplier &&
                                  this.state.activ_supplier.length > 0
                                    ? "Search Supplier"
                                    : "Loading..."
                                }
                                options={this.state.activ_supplier}
                                onChange={(e) => this.onChange11(e)}
                                className="select-search"
                                value={
                                  this.state.supplier ? this.state.supplier : ""
                                }
                                name="supplier"
                              />
                              <span className="err err_supplier"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Bill Number</label>
                              {/* <span className="asterisk">*</span> */}
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="invoice_number"
                                value={this.state.invoice_number}
                                className="form-control"
                                placeholder="Enter Bill Number"
                                onChange={this.formHandler}
                              />
                              <span className="err err_invoice"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Bill Date
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <DatePicker
                                selected={this.state.invoice_date}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => this.setinvoiceDate(date)}
                              />
                              <span className="err err_invoice_date"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Bill Due Date
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <DatePicker
                                selected={new Date(this.state.due_date)}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => this.setdueDate(date)}
                              />
                              <span className="err err_due_date"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Bill Amount</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="invoice_amount"
                                value={this.state.InvoiceAmount}
                                className="form-control"
                                placeholder="Total Bill Amount"
                                readOnly
                              />
                              <span className="err err_parentCat_id"></span>
                            </div>
                          </div>
                        </div>

                        {MultipleArray.map((item, index) => {
                          return (
                            <div className="productvariant" key={index}>
                              <div className="form-group inventory_three">
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      {" "}
                                      Product<span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    {this.state.all_product &&
                                    this.state.all_product.length > 0 ? (
                                      <SelectSearch
                                        placeholder="Search Product"
                                        options={this.state.all_product}
                                        onChange={(e) =>
                                          this.onChange112(e, index)
                                        }
                                        className="select-search"
                                        value={item.product}
                                        name={"selected_product" + index}
                                      />
                                    ) : (
                                      <></>
                                    )}
                                    <span
                                      className={
                                        "err err_productsearch" + index
                                      }
                                    ></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label> Cost Price</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      autoComplete="off"
                                      name={"product_costPrice" + index}
                                      className="form-control"
                                      value={item.product_costPrice}
                                      onChange={(e) =>
                                        this.formHandler1(
                                          e,
                                          index,
                                          0,
                                          "product_costPrice"
                                        )
                                      }
                                      placeholder="Enter Cost Price"
                                    />
                                    <span
                                      className={
                                        "err err_product_costPrice" + index
                                      }
                                    ></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label> Expiration</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <DatePicker
                                      selected={item.product_expiry}
                                      dateFormat="dd/MM/yyyy"
                                      onChange={(date) =>
                                        this.setexpdate11(date, index)
                                      }
                                      minDate={new Date()}
                                    />
                                    <span
                                      className={
                                        "err err_product_expiry" + index
                                      }
                                    ></span>
                                  </div>
                                </div>

                                <i
                                  className="fa fa-times"
                                  onClick={() =>
                                    this.removeproduct("Remove", index)
                                  }
                                  aria-hidden="true"
                                ></i>
                              </div>
                              <div>
                                {item.regionalData.map((it, ind) => {
                                  return (
                                    <div className="simple_single">
                                      <div className="form-group">
                                        <div className="modal-left-bx">
                                          <label>
                                            {" "}
                                            Region
                                            <span className="asterisk">*</span>
                                          </label>
                                        </div>
                                        <div className="modal-right-bx">
                                          {this.state["regiondata" + index] &&
                                          this.state["regiondata" + index]
                                            .length > 0 ? (
                                            <SelectSearch
                                              placeholder="Search Region"
                                              options={
                                                this.state["regiondata" + index]
                                              }
                                              onChange={(e) =>
                                                this.onChangeregion(
                                                  e,
                                                  index,
                                                  ind
                                                )
                                              }
                                              className="select-search"
                                              value={it.region ? it.region : ""}
                                            />
                                          ) : (
                                            <></>
                                          )}
                                          <span
                                            className={
                                              "err err_region" + index + ind
                                            }
                                          ></span>
                                        </div>
                                      </div>
                                      {item.prodType === "configurable" ? (
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              {" "}
                                              Variant
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            {it.variant_name}
                                            {/*<select
                                              name={"variant" + index}
                                              className="form-control"
                                              onChange={(e) =>
                                                this.formHandler1(
                                                  e,
                                                  index,
                                                  ind,
                                                  "variant"~
                                                )
                                              }
                                            >
                                              <option value="">
                                                Select Variant
                                              </option>
                                              {it.variant_data.map((dta) => {
                                                return (
                                                  <option value={dta._id}>
                                                    {dta.item}
                                                  </option>
                                                );
                                              })}
                                            </select>
                                            <span
                                              className={
                                                "err err_variant" + index + ind
                                              }
                                            ></span>*/}
                                          </div>
                                        </div>
                                      ) : null}
                                      <div className="form-group">
                                        <div className="modal-left-bx">
                                          <label>
                                            {" "}
                                            Quantity{" "}
                                            {" (in " +
                                              item.product_measurment +
                                              ")"}
                                            <span className="asterisk">*</span>
                                          </label>
                                        </div>
                                        <div className="modal-right-bx">
                                          <input
                                            type="number"
                                            autoComplete="off"
                                            name={"quantity" + index}
                                            className="form-control"
                                            value={it.quantity || ""}
                                            onChange={(e) =>
                                              this.formHandler1(
                                                e,
                                                index,
                                                ind,
                                                "quantity"
                                              )
                                            }
                                            placeholder="Enter Quantity"
                                          />
                                          <span
                                            className={
                                              "err err_quantity" + index + ind
                                            }
                                          ></span>
                                        </div>
                                      </div>
                                      {/* <div className="form-group">
                                        <div className="modal-left-bx">
                                          <label>
                                            {" "}
                                            Cost Price
                                            <span className="asterisk">*</span>
                                          </label>
                                        </div>
                                        <div className="modal-right-bx">
                                          <input
                                            type="text"
                                            autoComplete="off"
                                            name={"cost_price" + index}
                                            className="form-control"
                                            value={it.cost_price}
                                            onChange={(e) =>
                                              this.formHandler1(
                                                e,
                                                index,
                                                ind,
                                                "cost_price"
                                              )
                                            }
                                            placeholder="Enter Cost Price"
                                          />
                                          <span
                                            className={
                                              "err err_cost_price" + index + ind
                                            }
                                          ></span>
                                        </div>
                                      </div>
                                      */}
                                      <div className="form-group">
                                        <div className="modal-left-bx">
                                          <label> Total Amount</label>
                                        </div>
                                        <div className="modal-right-bx">
                                          <input
                                            type="text"
                                            autoComplete="off"
                                            name={"total_amount" + index}
                                            className="form-control"
                                            value={it.total_amount}
                                            onChange={(e) =>
                                              this.formHandler1(
                                                e,
                                                index,
                                                ind,
                                                "total_amount"
                                              )
                                            }
                                            placeholder="Enter total_amount"
                                            readOnly
                                          />
                                          <span
                                            className={
                                              "err err_total_amount" +
                                              index +
                                              ind
                                            }
                                          ></span>
                                        </div>
                                      </div>
                                      {/* <div className="form-group">
                                        <div className="modal-left-bx">
                                          <label> Expiration</label>
                                        </div>
                                        {it.expiration ? (
                                          <div className="modal-right-bx">
                                            <DatePicker
                                              selected={
                                                new Date(
                                                  it.expiration.toLocaleString(
                                                    "en-US",
                                                    {
                                                      timeZone: "UTC",
                                                    }
                                                  )
                                                )
                                              }
                                              dateFormat="dd/MM/yyyy"
                                              onChange={(date) =>
                                                this.setexpdate(
                                                  date,
                                                  index,
                                                  ind
                                                )
                                              }
                                              minDate={new Date()}
                                            />
                                            <span
                                              className={
                                                "err err_expiration" +
                                                index +
                                                ind
                                              }
                                            ></span>
                                          </div>
                                        ) : (
                                          <div className="modal-right-bx">
                                            <DatePicker
                                              // selected={
                                              //   new Date(
                                              //     it.expiration.toLocaleString(
                                              //       "en-US",
                                              //       {
                                              //         timeZone: "UTC",
                                              //       }
                                              //     )
                                              //   )
                                              // }
                                              dateFormat="dd/MM/yyyy"
                                              onChange={(date) =>
                                                this.setexpdate(
                                                  date,
                                                  index,
                                                  ind
                                                )
                                              }
                                              minDate={new Date()}
                                            />
                                            <span
                                              className={
                                                "err err_expiration" +
                                                index +
                                                ind
                                              }
                                            ></span>
                                          </div>
                                        )}
                                      </div>
                                       */}
                                      <i
                                        className="fa fa-times"
                                        onClick={() =>
                                          this.removeregion(
                                            "Remove",
                                            index,
                                            ind
                                          )
                                        }
                                        aria-hidden="true"
                                      ></i>
                                    </div>
                                  );
                                })}
                              </div>
                              {item.product ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-primary feel-btnv2"
                                    onClick={() => this.addmoregion(index)}
                                  >
                                    <i
                                      className="fa fa-plus"
                                      aria-hidden="true"
                                    ></i>
                                    Add Region
                                  </button>
                                  <span
                                    className={
                                      "err err_regionselection" + index
                                    }
                                  ></span>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        })}
                        <div className="form-group single-col">
                          <div className="modal-bottom">
                            <button
                              type="button"
                              className="btn btn-primary feel-btn"
                              onClick={() => this.addnewproduct("AddMore")}
                            >
                              Add Product
                            </button>
                            <span className="err err_producter"></span>
                          </div>
                        </div>
                        <div className="form-group single-col">
                          <div className="modal-bottom">
                            <button
                              type="button"
                              className="btn btn-primary feel-btn"
                              onClick={this.add}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="admin-header">
                  <Adminfooter />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
