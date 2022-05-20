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

export default class AddInventory extends Component {
  constructor() {
    MultipleArray = [];
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_data: JSON.parse(dt),
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
      invoice_number: "",
      bill_kcNumber: "",
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
      delivery_charges: 0,
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
    console.log(e, index, ind, type);
    if (type === "product_costPrice") {
      MultipleArray[index].product_costPrice = +e.target.value;
      // total calculation
      MultipleArray[index].product_quantity = 0;
      MultipleArray[index].regionalData.map(
        (item) =>
          (MultipleArray[index].product_quantity =
            MultipleArray[index].product_quantity + +item.quantity)
      );
      if (MultipleArray[index].regionalData[ind]) {
        MultipleArray[index].regionalData.forEach((m, i) => {
          MultipleArray[index].regionalData[i].total_amount =
            e.target.value === ""
              ? 0
              : +e.target.value *
                +MultipleArray[index].regionalData[i].quantity;
        });

        // MultipleArray[index].regionalData[ind].total_amount =
        // e.target.value === ""
        // ? 0
        // : +e.target.value * MultipleArray[index].product_quantity;
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
    if (type === "variant_name") {
      MultipleArray[index].regionalData[ind].variant_name = e.target.value;
    }
    if (type === "quantity") {
      MultipleArray[index].regionalData[ind].quantity = +e.target.value;
      MultipleArray[index].product_quantity = 0;
      MultipleArray[index].regionalData.map(
        (item) =>
          (MultipleArray[index].product_quantity =
            MultipleArray[index].product_quantity + +item.quantity)
      );
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

    if (type === "total_amount") {
      MultipleArray[index].regionalData[ind].total_amount = e.target.value;
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
    var total_invoice = 0;
    MultipleArray.forEach((item, index) => {
      item.regionalData.forEach((itm, idx) => {
        total_invoice = total_invoice + itm.total_amount;
      });
    });
    this.setState({
      total_invoice: total_invoice,
      loading: false,
    });
    this.forceUpdate();
  }

  addnewproduct(type = "AddMore", index) {
    if (type === "AddMore") {
      this.setState({ loading: true });
      MultipleArray.push({
        product: "",
        product_name: "",
        variants: [],
        unit_quantity: "",
        product_costPrice: 0,
        product_quantity: 0,
        gst_percentage: 0,
        gst: 0,
        singlepricewithoutgst: 0,
        invoice_without_gst: 0,
        availableQuantity: 0,
        product_expiry: "",
        prodType: "",
        product_measurment: "",
        batchID: "",
        regionalData: [],
        variant_dta: [],
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
        quantity: "",
        cost_price: 0,
        total_amount: 0,
        expiration: "",
      });
    } else {
      data[ind].regionalData.push({
        region: "",
        quantity: "",
        variant_name: "",
        seleted_variant: "",
        variant_data: [],
        cost_price: 0,
        total_amount: 0,
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
  };

  removeproduct = (index) => {
    this.setState({
      loading: true,
    });
    let dt = [];
    dt = MultipleArray.filter((m, i) => i !== index);
    MultipleArray = dt;
    this.setState({
      loading: false,
    });
  };

  onChange1 = (valu) => {
    this.setState({ account_head: valu.value });
  };

  onChangeregion = (valu, index, ind, prod_id) => {
    // variant_data
    this.setState({
      loading: true,
    });
    let data = MultipleArray;
    data[index].regionalData[ind].region = valu.value;
    if(data[index].configurableData?.length > 0){
      let newVariants = []
      data[index].configurableData.forEach(a => {
        if(a.region._id === valu.value){
          newVariants.push({value: a.variant_name,
            name: a.variant_name,})
        }
      })
      data[index].variants = newVariants
    }
    var data_to_filer = MultipleArray.filter((itm) => itm.product == prod_id);
    this.setState({
      loading: false,
    });
  };

  setStartDate = (date) => {
    this.setState({
      startDate: date,
    });
  };

  setexpdate11 = (date, index) => {
    MultipleArray[index].product_expiry = date;
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
    const data = {
      _id: this.state.supplier,
      bill_date: date,
    };
    AdminApiRequest(data, "/admin/GetInvoiceDueDate", "POST", "")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            due_date: res.data.data ? new Date(res.data.data) : new Date(),
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
    this.setState({ loading: true });
    AdminApiRequest(requestData, "/admin/product/" + valu.value, "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          MultipleArray[index].product = res.data.data._id;
          MultipleArray[index].product_name = res.data.data.product_name;
          MultipleArray[index].slug = res.data.data.slug;
          MultipleArray[index].availableQuantity =
            +res.data.data.availableQuantity ;
          MultipleArray[index].regionalData =
            res.data.data.TypeOfProduct === "simple"
              ? [
                  {
                    region: "",
                    quantity: "",
                    cost_price: 0,
                    total_amount: 0,
                    expiration: "",
                  },
                ]
              : [
                  {
                    region: "",
                    quantity: "",
                    variant_name: "",
                    seleted_variant: "",
                    variant_data: [],
                    cost_price: 0,
                    total_amount: 0,
                    expiration: "",
                  },
                ];
          MultipleArray[index].totalAvailableQuantity =
            +res.data.data.availableQuantity ;
          MultipleArray[index].prodType = res.data.data.TypeOfProduct;
          MultipleArray[index].unit_quantity =
            res.data.data.unitMeasurement?.name;
          MultipleArray[index].gst_percentage =
            res.data.data.purchaseTax && +res.data.data.purchaseTax.totalTax
              ? +res.data.data.purchaseTax.totalTax
              : 0;
          MultipleArray[index].batchID = res.data.data.batchID;

          MultipleArray[index].singlepricewithoutgst = 0;
          MultipleArray[index].product_measurment =
            res.data.data.unitMeasurement?.name;
          MultipleArray[index].configurableData = res.data.data.configurableData;

          var new_data = [];
          var variant_data = [];
          res.data.data.TypeOfProduct === "simple"
            ? res.data.data.simpleData.forEach((item) => {
                if (
                  new_data.filter((a) => a.value === item.region._id).length > 0
                ) {
                } else {
                  new_data.push({
                    value: item.region._id,
                    name: item.region.name,
                  });
                }
              })
            : res.data.data.configurableData.forEach((item) => {
                if (
                  new_data.filter((a) => a.value === item.region._id).length > 0
                ) {
                } else {
                  new_data.push({
                    value: item.region._id,
                    name: item.region.name,
                  });
                }

                // variant_data.push({
                //   value: item.variant_name,
                //   name: item.variant_name,
                // });
              });
          MultipleArray[index].variants = variant_data;
          let a = "single_product" + index;
          let abab = "regiondata" + res.data.data.slug;
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
      .then(() => {
        this.setState({ loading: false });
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
      bill_date: this.state.invoice_date ? this.state.invoice_date : new Date(),
    };
    AdminApiRequest(data, "/admin/GetInvoiceDueDate", "POST", "")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            due_date: res.data.data ? new Date(res.data.data) : new Date(),
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
        }
        if (item.prodType === "configurable") {
          if (!daat.variant_name) {
            status = true;
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
      MultipleArray.map((item, index) => {
        total_gst = total_gst + item.gst;
        InvoiceAmountWithoutGST =
          InvoiceAmountWithoutGST + item.invoice_without_gst;
      });
      const data = {
        admin_id: this.state.admin_data._id,
        Date: this.state.startDate ? this.state.startDate : "",
        Time: this.state.time ? this.state.time : "",
        AccountHead: this.state.account_head ? this.state.account_head : "",
        InvoiceNumber: this.state.invoice_number
          ? this.state.invoice_number
          : "",
        InvoiceAmount: this.state.total_invoice
          ? this.state.total_invoice + +this.state.delivery_charges
          : "",
        InvoiceDate: this.state.invoice_date ? this.state.invoice_date : "",
        supplier_id: this.state.supplier ? this.state.supplier : "",
        delivery_charges: this.state.delivery_charges
          ? this.state.delivery_charges
          : "",
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
        total_gst: total_gst,
        AmountWithoutGSTandDelivery: InvoiceAmountWithoutGST,
        Bank: this.state.bank ? this.state.bank : "",
        product_data: JSON.stringify(MultipleArray),
      };
      AdminApiRequest(data, "/admin/addInventory", "POST", "")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              loading: false,
            });
            swal({
              title: "Success",
              text: "Inventory Added Successfully !",
              icon: "success",
              successMode: true,
            });
            MultipleArray = [];
            this.setState({
              all_product: [],
              activ_supplier: [],
            });
            this.props.history.push("admin-view-inventory");
          } else if (res.status === 400) {
            this.setState({
              loading: false,
            });
            swal({
              title: "Bill number already exist",
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
    const requestData = {};
    var activesupplier = [];
    MultipleArray = [];
    await AdminApiRequest(requestData, "/admin/product/active", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let data = [];
          if (res.data.data && res.data.data.length > 0) {
            res.data.data.forEach((item) => {
              if (item.TypeOfProduct !== "group") {
                data.push({
                  value: item._id,
                  name: item.product_name,
                });
              }
            });
          }
          setTimeout(() => {
            this.setState({
              loading: false,
              all_product: data || [],
            });
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
      .catch((error) => {
        console.log(error);
      });

    await AdminApiRequest(requestData, "/admin/GetNewBillNo ", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            bill_kcNumber: res.data.data,
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

    await AdminApiRequest(requestData, "/admin/supplier_master", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          activesupplier = res.data.data.filter((item) => item.status === true);
          var aa = [];
          activesupplier.forEach((item, index) => {
            aa.push({
              name: item.name,
              value: item._id,
            });
          });
          this.setState({
            activ_supplier: aa || [],
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
    var d = new Date();
    var a = d.getHours() + ":" + d.getMinutes();
    this.setState({
      loading: false,
      time: a,
    });
  }

  render() {
    console.log("MultipleArrayMultipleArray", MultipleArray);
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
                      <h4 className="card-title">Add Inventory</h4>
                      {/* <Link to="view-inventory">
                      <button
                        className="btn btn-primary m-r-5 float-right"
                        onClick={this.openModal}
                      >
                        <i className="material-icons">arrow_back_ios</i> View
                        Inventory
                      </button>
                      </Link> */}
                      <form className="add_product_new inventrory-block-wrp-latest">
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
                                value={this.state.supplier}
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
                                className="form-control"
                                placeholder="Enter Bill Number"
                                value={this.state.invoice_number}
                                onChange={this.formHandler}
                              />
                              <span className="err err_invoice"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Bill KC Number</label>
                              <span className="asterisk">*</span>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="invoice_number"
                                className="form-control"
                                placeholder="Bill KC Number"
                                readOnly
                                value={this.state.bill_kcNumber}
                                // onChange={this.formHandler}
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
                                maxDate={new Date()}
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
                              <label>Delivery Charge</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="delivery_charges"
                                value={this.state.delivery_charges}
                                className="form-control"
                                placeholder="Delivery Charge"
                                onChange={this.formHandler}
                              />
                              <span className="err err_parentCat_id"></span>
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
                                value={this.state.total_invoice}
                                className="form-control"
                                placeholder="Total Bill Amount"
                                readOnly
                              />
                              <span className="err err_parentCat_id"></span>
                            </div>
                          </div>
                        </div>
                        {MultipleArray.length > 0 &&
                          MultipleArray.map((item, index) => {
                            console.log("sdfdfdsf", item);
                            return (
                              <div className="productvariant" key={index}>
                                <div className="form-group inventory_three">
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>
                                        {" "}
                                        Product
                                        <span className="asterisk">*</span>
                                      </label>
                                    </div>
                                    <div className="modal-right-bx">
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
                                      {/* <input type="text" autoComplete="off" name={"product" + index} className="form-control" value={item.product} onChange={(e) => this.formHandler1(e, index, "product")} placeholder="Enter Product" /> */}

                                      <span
                                        className={
                                          "err err_productsearch" + index
                                        }
                                      ></span>
                                    </div>
                                  </div>

                                  {/* <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label> Unit Quantity</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      autoComplete="off"
                                      name={"product_costPrice" + index}
                                      className="form-control"
                                      value={item.unit_quantity}
                                      readOnly
                                      
                                    />
                                    <span
                                      className={
                                        "err err_product_costPrice" + index
                                      }
                                    ></span>
                                  </div>
                                </div> */}

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
                                    onClick={() => this.removeproduct(index)}
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
                                              <span className="asterisk">
                                                *
                                              </span>
                                            </label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <SelectSearch
                                              placeholder="Search Region"
                                              options={
                                                this.state[
                                                  "regiondata" + item.slug
                                                ]
                                              }
                                              onChange={(e) =>
                                                this.onChangeregion(
                                                  e,
                                                  index,
                                                  ind,
                                                  item.product
                                                )
                                              }
                                              className="select-search"
                                              value={it.region}
                                              autoComplete="off"
                                            />
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
                                                Variant name
                                                <span className="asterisk">
                                                  *
                                                </span>
                                              </label>
                                            </div>
                                            <div className="modal-right-bx">
                                              <select
                                                name="variant_name"
                                                className="form-control"
                                                onChange={(e) =>
                                                  this.formHandler1(
                                                    e,
                                                    index,
                                                    ind,
                                                    "variant_name"
                                                  )
                                                }
                                              >
                                                <option value="">
                                                  Select variant name
                                                </option>
                                                {item.variants.map((dta) => {
                                                  return (
                                                    <option value={dta.value}>
                                                      {dta.name}
                                                    </option>
                                                  );
                                                })}
                                              </select>
                                              <span
                                                className={
                                                  "err err_variant" +
                                                  index +
                                                  ind
                                                }
                                              ></span>
                                            </div>
                                          </div>
                                        ) : null}
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>
                                              {" "}
                                              Quantity{" "}
                                              {" (in " +
                                                item.unit_quantity +
                                                ")"}
                                              <span className="asterisk">
                                                *
                                              </span>
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
                                      </div> */}
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
                                        <div className="modal-right-bx">
                                          <DatePicker
                                            selected={it.expiration}
                                            dateFormat="dd/MM/yyyy"
                                            onChange={(date) =>
                                              this.setexpdate(date, index, ind)
                                            }
                                            minDate={new Date()}
                                          />
                                          <span className={"err err_expiration" + index + ind}></span>
                                        </div>
                                      </div> */}
                                        {/* <i
                                        className="fa fa-times"
                                        onClick={() =>
                                          this.removeregion(
                                            "Remove",
                                            index,
                                            ind
                                          )
                                        }
                                        aria-hidden="true"
                                      ></i> */}
                                      </div>
                                    );
                                  })}
                                </div>
                                {/* {item.product ? (
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
                              )} */}
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
                              Save
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-header footer-admin-block">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
