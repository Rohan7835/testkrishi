import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import Moment from "react-moment";
import SelectSearch from "react-select-search";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
import "../../../assets/css/cart.css";
import { imageUrl } from "../../../imageUrl";
import Adminheader from "../elements/admin_header";
import Adminsiderbar from "../elements/admin_sidebar";
import Footer from "../elements/footer";

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
var activesupplier = [];
export default class orderdetails extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
      var ad_data = JSON.parse(dt);
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_data: ad_data,
      modalIsOpen: false,
      editmodalIsOpen: false,
      sento_delivered: false,
      sento_delivered_data: null,
      show: false,
      mdl_layout__obfuscator_hide: false,
      status: true,
      customer_name: "",
      email: "",
      mobile_no: "",
      total_amount: "",
      created_date: new Date(),
      newdatetime: new Date(),
      order_status: "",
      order_status_show: "All",
      orderdata: [],
      allsingledata: "",
      category: [],
      product: [],
      customer_data: [],
      dropdownColor: [],
      dropdownSize: [],
      driverData: null,
      activ_supplier: [],
      options: [
        { name: "Swedish", value: "sv" },
        { name: "English", value: "en" },
      ],
      count: 0,
      skip: 0,
      limit: 20,
      currentPage: 1,
      user_name_search: "",
      user_email_search: "",
      user_mobile_search: "",
      booking_mode_search: "",
      booking_code_search: "",
      total_payment_search: "",
      date_search: "",
      tabLoading: true,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.vieworderdetails = this.vieworderdetails.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.delievered = this.delievered.bind(this);
    this.editopenmodal = this.editopenmodal.bind(this);
    this.closeordermodel = this.closeordermodel.bind(this);
    this.sendfordelivery = this.sendfordelivery.bind(this);
    this.editclosemodal = this.editclosemodal.bind(this);
    this.closesendtodel = this.closesendtodel.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
  }

  vieworderdetails(ev, dt) {
    this.setState({
      order_detail: ev,
      userAddress:
        typeof ev.booking_address === "object"
          ? ev.booking_address
          : JSON.parse(ev.booking_address),
    });
    this.setState({ vieworderdetails: true });
  }

  closeordermodel() {
    this.setState({ vieworderdetails: false });
  }

  _handleProduct(item) {
    var productSelected = {
      data: item,
      quantity: this.state[item._id] ? this.state[item._id] : 1,
    };
    // localStorage.setItem('data', JSON.stringify(productSelected))
    // window.location = '/product'
  }

  onChange11(valu) {
    this.setState({
      driver_id: valu.value,
      driverData: valu,
    });
  }

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

  minus = (quantity, ide) => {
    if (quantity <= 1) {
    } else {
      this.setState({ [ide]: quantity - 1 });
    }
  };

  plus = (quantity, ide) => {
    this.setState({ [ide]: quantity + 1 });
  };

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: "true" });
    } else {
      this.setState({ status: "false" });
    }
  }

  selectonchnhe = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  updatestatus = () => {
    const requestData = {
      user_id: this.state.user_id,
      subscription_id: this.state.subscriptionId,
      BookingStatusByAdmin: "Accepted",
      DeliveryDate: this.state.newdatetime,
      adminID: this.state.admin_data._id,
    };
    AdminApiRequest(
      requestData,
      "/admin/subscription/UpdateBookingStatus",
      "POST"
    )
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.onChangelist(this.state.order_status_show);
          swal({
            title: "Order Accepted",
            // text: "Are you sure that you want to leave this page?",
            icon: "success",
            dangerMode: false,
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
      editclosemodal: false,
      editmodalIsOpen: false,
    });
    this.fetchoredercount();
  };

  updatestatusoutfordel = () => {
    let localDriverData = {
      driver_id: this.state.driverData.value,
      driver_name: this.state.driverData.name,
      driver_email: this.state.driverData.email,
      driver_mobile: this.state.driverData.mobile,
    };

    const requestData = {
      user_id: this.state.sendtodel_data.user_id._id,
      subscription_id: this.state.sendtodel_data._id,
      driverData: localDriverData,
      adminID: this.state.admin_data._id,
      date: this.state.selected_del_date,
      BookingStatusByAdmin: "Out For Delivery",
    };
    if (this.state.driver_id && this.state.selected_del_date) {
      AdminApiRequest(
        requestData,
        "/admin/subscription/UpdateBookingStatus",
        "POST"
      )
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.onChangelist(this.state.order_status_show);
            swal({
              title: "Order Send for delivery",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.setState({
              sento_delivery: false,
              driver_id: "",
            });
            this.fetchoredercount();
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
    } else {
      var valueErr = document.getElementsByClassName("err_del_update");
      valueErr[0].innerText = "*Please Fill Correct Info";
    }
  };

  delievered = (data, selectedDate) => {
    const requestData = {
      user_id: data.user_id._id,
      subscription_id: data._id,
      adminID: this.state.admin_data._id,
      BookingStatusByAdmin: "Delivered",
      date: selectedDate.date,
    };
    AdminApiRequest(
      requestData,
      "/admin/subscription/UpdateBookingStatus",
      "POST"
    )
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.onChangelist(this.state.order_status_show);
          swal({
            title: "Order Delievered",
            // text: "Are you sure that you want to leave this page?",
            icon: "success",
            dangerMode: false,
          });
          this.setState({
            sento_delivered: false,
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
    this.fetchoredercount();
  };

  ordernowcompleted = (data) => {
    const requestData = {
      user_id: data.user_id._id,
      subscription_id: data._id,
      adminID: this.state.admin_data._id,
    };
    AdminApiRequest(requestData, "/admin/UpdatePaymentStatus", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.onChangelist(this.state.order_status_show);
          swal({
            title: "Order Completed",
            // text: "Are you sure that you want to leave this page?",
            icon: "success",
            dangerMode: false,
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
    this.fetchoredercount();
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
      customer_name: dt.user_id.name,
      email: dt.user_id.email,
      mobile_no: dt.user_id.contactNumber,
      total_amount: dt.totalCartPrice,
      created_date: dt.created_at,
    });

    this.setState({ editmodalIsOpen: true });
    // this.setState({ mdl_layout__obfuscator_hide: true });
  }

  sendfordelivery(dt) {
    this.setState({
      sendtodel_data: dt,
    });

    this.setState({ sento_delivery: true });
    // this.setState({ mdl_layout__obfuscator_hide: true });
    this.fetchoredercount();
  }

  closesendtodel() {
    this.setState({
      mdl_layout__obfuscator_hide: false,
      sento_delivery: false,
    });
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
    this.setState({
      orderdata: [],
      tabLoading: true,
      order_status_show: data,
      date_search: "",
      booking_code_search: "",
      user_name_search: "",
      user_mobile_search: "",
      skip: 0,
      limit: this.state.limit,
    });
    let requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
      listStatus: data,
    };
    AdminApiRequest(requestData, "/admin/subscription/admin-getAll", "POST")
      .then((res) => {
        this.setState({
          orderdata: res.data.data,
          count: res.data.count,
          currentPage: 1,
          tabLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    this.fetchoredercount();
  };

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;
    this.getcustomerfilter(skip);
    let requestData = {
      skip: skip,
      limit: this.state.limit,
      listStatus: this.state.order_status_show,
    };
    AdminApiRequest(requestData, "/admin/subscription/admin-getAll", "POST")
      .then((res) => {
        this.setState({
          orderdata: res.data.data,
        });
        this.setState({
          tabLoading: false,
        });
      })
      .catch((error) => {
        alert(error);
      });

    this.fetchoredercount();
  }

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
    this.fetchoredercount();
  };

  ontimechange = (ev) => {
    this.setState({
      newdatetime: new Date(ev),
    });
  };

  updatestatuskey = (data, type) => {
    this.setState({
      subscriptionId: data._id,
      user_id: data.user_id._id,
    });
    if (type === "accept") {
      this.setState({
        mdl_layout__obfuscator_hide: false,
        editmodalIsOpen: true,
      });
    } else {
      const requestData = {
        user_id: data.user_id._id,
        subscription_id: data._id,
        BookingStatusByAdmin: "Rejected",
        DeliveryDate: "",
        adminID: this.state.admin_data._id,
      };
      AdminApiRequest(
        requestData,
        "/admin/subscription/UpdateBookingStatus",
        "POST"
      )
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.onChangelist(this.state.order_status_show);
            swal({
              title: "Order Request Rejected",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
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
    this.fetchoredercount();
  };

  fetchoredercount() {
    const requestData = {};
    AdminApiRequest(requestData, "/admin/getTotalNumberSubscriptions", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            ordercount: res.data,
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

  componentDidMount() {
    this.fetchoredercount();
    const requestData = {};
    AdminApiRequest(requestData, "/admin/getDriver", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          if (res.data.data) {
            activesupplier = res.data.data.filter(
              (item) => item.status == true
            );
            activesupplier.forEach((item) => {
              this.state.activ_supplier.push({
                value: item._id,
                name: item.name,
                mobile: item.mobile,
                email: item.email,
              });
            });
          } else {
          }
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

    AdminApiRequest(
      {
        listStatus: "All",
        skip: this.state.skip,
        limit: this.state.limit,
      },
      "/admin/subscription/admin-getAll",
      "POST"
    )
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            orderdata: res.data.data,
            count: res.data.count,
            currentPage: 1,
          });
        } else {
        }
      })
      .then(() => {
        this.setState({
          tabLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    AdminApiRequest(requestData, "/admin/product_category", "GET")
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

    const data1 = {
      skip: 0,
      limit: 50,
    };
    AdminApiRequest(data1, "/admin/usersGetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            customer_data: res.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  formHandler1(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  getcustomerfilter = (skipParam) => {
    this.setState({
      tabLoading: true,
      orderdata: [],
    });
    const requestData = {
      skip: skipParam ? skipParam : 0,
      limit: this.state.limit,
      listStatus: this.state.order_status_show,
      userName: this.state.user_name_search
        ? this.state.user_name_search
        : null,
      userEmail: this.state.user_email_search
        ? this.state.user_email_search
        : null,
      userMobile: this.state.user_mobile_search
        ? this.state.user_mobile_search
        : null,
      // bookingMode: this.state.booking_mode_search,
      SubscriptionID: this.state.booking_code_search
        ? this.state.booking_code_search
        : null,
      date: this.state.date_search ? this.state.date_search : null,
      // total_payment: this.state.total_payment_search,
    };
    AdminApiRequest(requestData, "/admin/subscription/admin-getAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            orderdata: res.data.data,
            count: res.data.count,
            currentPage: skipParam ? this.state.currentPage : 1,
          });
        }
        this.setState({
          tabLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  resetFilter = () => {
    this.setState({
      date_search: "",
      booking_code_search: "",
      user_name_search: "",
      user_mobile_search: "",
      skip: 0,
      limit: this.state.limit,
      currentPage: 1,
      orderdata: [],
      tabLoading: true,
    });
    AdminApiRequest(
      {
        listStatus: this.state.order_status_show,
        skip: this.state.skip,
        limit: this.state.limit,
      },
      "/admin/subscription/admin-getAll",
      "POST"
    )
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            orderdata: res.data.data,
            count: res.data.count,
            currentPage: this.state.currentPage,
          });
        } else {
        }
        this.setState({
          tabLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  truncateToDecimals = (num, dec = 2) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };

  render() {
    return (
      <div className="wrapper ">
        <Adminsiderbar />
        <div className="main-panel">
          <Adminheader />
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 ml-auto mr-auto order_new_det">
                  <div className="card">
                    <div className="card-header card-header-primary card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">shopping_cart</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="manage_up_add_btn">
                        <h4 className="card-title"> Subscription </h4>
                      </div>
                      <ul
                        className="nav nav-tabs inner-tab"
                        id="myTab"
                        role="tablist"
                      >
                        <li
                          className={
                            this.state.order_status_show === "All"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("All")}
                        >
                          All{" "}
                          {this.state.ordercount
                            ? this.state.ordercount.All
                            : 0}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "Pending"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Pending")}
                        >
                          Pending{" "}
                          {this.state.ordercount
                            ? this.state.ordercount.Pending
                            : 0}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "Accepted"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Accepted")}
                        >
                          Accepted{" "}
                          {this.state.ordercount
                            ? this.state.ordercount.Accepted
                            : 0}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "Payment_failed"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Payment_failed")}
                        >
                          Failed{" "}
                          {this.state.ordercount
                            ? this.state.ordercount.Payment_failed
                            : 0}
                        </li>
                        {/* <li
                          className={
                            this.state.order_status_show === "Out For Delivery"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Out For Delivery")}
                        >
                          Out For Delivery{" "}
                          {this.state.ordercount
                            ? this.state.ordercount.OutForDelivery
                            : 0}
                        </li> */}
                        {/* <li
                          className={
                            this.state.order_status_show === "Payment_Pending"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Payment_Pending")}
                        >
                          Payment Pending{" "}
                          {this.state.ordercount
                            ? this.state.ordercount.Payment_Pending
                            : 0}
                        </li> */}
                        {/* <li
                          className={
                            this.state.order_status_show === "Delivered"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Delivered")}
                        >
                          Order Completed{" "}
                          {this.state.ordercount
                            ? this.state.ordercount.Delivered
                            : 0}
                        </li> */}
                        <li
                          className={
                            this.state.order_status_show === "Rejected"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Rejected")}
                        >
                          Rejected{" "}
                          {this.state.ordercount
                            ? this.state.ordercount.Rejected
                            : 0}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "unsubscribed"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("unsubscribed")}
                        >
                          Cancelled{" "}
                          {this.state.ordercount
                            ? this.state.ordercount.cancelled
                            : 0}
                        </li>
                      </ul>
                      <div className="searching-every searching-4-col search-five-field">
                        <span>
                          <input
                            type="date"
                            name="date_search"
                            value={this.state.date_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="Date"
                          ></input>
                        </span>
                        <span>
                          <input
                            type="text"
                            name="booking_code_search"
                            value={this.state.booking_code_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="Subscription Id"
                          ></input>
                        </span>
                        <span>
                          <input
                            type="text"
                            name="user_name_search"
                            value={this.state.user_name_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="Customer Name"
                          ></input>
                        </span>
                        <span>
                          <input
                            type="text"
                            name="user_mobile_search"
                            value={this.state.user_mobile_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="Contact"
                          ></input>
                        </span>
                        <span className="search-btn-every">
                          <button
                            type="submit"
                            onClick={() => this.getcustomerfilter()}
                            className="btn btn-primary m-r-5"
                          >
                            Search
                          </button>
                          <button
                            onClick={() => this.resetFilter()}
                            className="btn btn-primary m-r-5 reset_button_new"
                          >
                            Reset
                          </button>
                        </span>
                      </div>

                      <div className="table-responsive general-data-admin-block">
                        <table
                          id="datatables"
                          className="table table-striped table-no-bordered table-hover"
                          cellSpacing="0"
                          width="100%"
                        >
                          {this.state.order_status_show === "All" ? (
                            <>
                              <thead>
                                <tr>
                                  <th scope="col">Date</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Order Status</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>{item.SubscriptionID}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.OrderTotal
                                          ? item.OrderTotal.toFixed(2)
                                          : item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>{item.BookingStatusByAdmin}</td>

                                      <td>
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>
                                        {/* <i
                                        className="fa fa-eye hover-with-cursor m-r-5"
                                        onClick={this.viewopenModal.bind(
                                          this,
                                          item
                                        )}
                                      ></i> */}
                                      </td>
                                    </tr>
                                  ))
                                ) : this.state.tabLoading ? (
                                  <tr>
                                    <td
                                      colSpan="8"
                                      style={{ textAlign: "center" }}
                                    >
                                      <i
                                        className="fa fa-spinner searchLoading"
                                        aria-hidden="true"
                                      ></i>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="9"
                                      style={{ textAlign: "center" }}
                                    >
                                      You haven't recieved any Subscription yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </>
                          ) : (
                            <></>
                          )}
                          {this.state.order_status_show === "Pending" ? (
                            <>
                              <thead>
                                <tr>
                                  <th scope="col">Date</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Pre-Order</th>
                                  <th scope="col">Date of Delivery</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>{item.SubscriptionID}</td>
                                      <td>
                                        {item.preOrder === true ? "Yes" : "No"}
                                      </td>
                                      <td>
                                        {item.dates.map((item1, i) => {
                                          if (i <= 2) {
                                            return (
                                              <p>
                                                <Moment format="DD/MM/YYYY">
                                                  {item1.date}
                                                </Moment>
                                                {/* {" - " + item1.status} */}
                                              </p>
                                            );
                                          } else if (i == 3) {
                                            return (
                                              <p
                                                onClick={this.vieworderdetails.bind(
                                                  this,
                                                  item
                                                )}
                                                className="fa fa-eye"
                                                aria-hidden="true"
                                              >
                                                {"View All Dates"}
                                              </p>
                                            );
                                          } else {
                                            return null;
                                          }
                                          return (
                                            <p>
                                              <Moment format="DD/MM/YYYY">
                                                {item1.date}
                                              </Moment>
                                              {/* {" - " + item1.status} */}
                                            </p>
                                          );
                                        })}
                                      </td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.OrderTotal
                                          ? item.OrderTotal.toFixed(2)
                                          : item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="accept"
                                          onClick={() =>
                                            this.updatestatuskey(item, "accept")
                                          }
                                        >
                                          Accept
                                        </button>
                                        <button
                                          type="button"
                                          className="reject"
                                          onClick={() =>
                                            this.updatestatuskey(item, "reject")
                                          }
                                        >
                                          Reject
                                        </button>
                                      </td>

                                      <td>
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>
                                      </td>
                                    </tr>
                                  ))
                                ) : this.state.tabLoading ? (
                                  <tr>
                                    <td
                                      colSpan="8"
                                      style={{ textAlign: "center" }}
                                    >
                                      <i
                                        className="fa fa-spinner searchLoading"
                                        aria-hidden="true"
                                      ></i>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="9"
                                      style={{ textAlign: "center" }}
                                    >
                                      You haven't recieved any Subscription yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </>
                          ) : (
                            <></>
                          )}
                          {this.state.order_status_show === "Accepted" ? (
                            <>
                              <thead>
                                <tr>
                                  <th scope="col">Date</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Pre-Order</th>
                                  <th scope="col">Date of Delivery</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>{item.SubscriptionID}</td>
                                      <td>
                                        {item.preOrder === true ? "Yes" : "No"}
                                      </td>
                                      <td>
                                        {item.dates.map((item1, i) => {
                                          if (i <= 2) {
                                            return (
                                              <p>
                                                <Moment format="DD/MM/YYYY">
                                                  {item1.date}
                                                </Moment>
                                                {" - " + item1.status}
                                              </p>
                                            );
                                          } else if (i == 3) {
                                            return (
                                              <p
                                                onClick={this.vieworderdetails.bind(
                                                  this,
                                                  item
                                                )}
                                                className="fa fa-eye"
                                                aria-hidden="true"
                                              >
                                                {"View All Dates"}
                                              </p>
                                            );
                                          } else {
                                            return null;
                                          }
                                        })}
                                      </td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      {/* <td>{item.total_payment}</td> */}
                                      <td>
                                        {item.OrderTotal
                                          ? item.OrderTotal.toFixed(2)
                                          : item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>
                                        {/* <i
                                          className="fa fa-motorcycle hover-with-cursor m-r-5"
                                          title="Send for Delivery"
                                          aria-hidden="true"
                                          onClick={this.sendfordelivery.bind(
                                            this,
                                            item
                                          )}
                                        ></i> */}

                                        {/* <i
                                      className="fa fa-pencil-square-o hover-with-cursor m-r-5"
                                      aria-hidden="true"
                                      onClick={this.editopenmodal.bind(
                                        this,
                                        item
                                      )}
                                    ></i> */}
                                      </td>
                                    </tr>
                                  ))
                                ) : this.state.tabLoading ? (
                                  <tr>
                                    <td
                                      colSpan="8"
                                      style={{ textAlign: "center" }}
                                    >
                                      <i
                                        className="fa fa-spinner searchLoading"
                                        aria-hidden="true"
                                      ></i>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="9"
                                      style={{ textAlign: "center" }}
                                    >
                                      You haven't recieved any Subscription yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </>
                          ) : (
                            <></>
                          )}
                          {this.state.order_status_show === "Payment_failed" ? (
                            <>
                              <thead>
                                <tr>
                                  <th scope="col">Date</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>{item.SubscriptionID}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.OrderTotal
                                          ? item.OrderTotal.toFixed(2)
                                          : item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye  hover-with-cursor m-r-5"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>
                                      </td>
                                    </tr>
                                  ))
                                ) : this.state.tabLoading ? (
                                  <tr>
                                    <td
                                      colSpan="8"
                                      style={{ textAlign: "center" }}
                                    >
                                      <i
                                        className="fa fa-spinner searchLoading"
                                        aria-hidden="true"
                                      ></i>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="9"
                                      style={{ textAlign: "center" }}
                                    >
                                      You haven't recieved any Subscription yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </>
                          ) : (
                            <></>
                          )}
                          {this.state.order_status_show === "Delivered" ? (
                            <>
                              <thead>
                                <tr>
                                  <th scope="col">Date</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>{item.SubscriptionID}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.OrderTotal
                                          ? item.OrderTotal.toFixed(2)
                                          : item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>

                                        {/* <i
                                      className="fa fa-pencil-square-o hover-with-cursor m-r-5"
                                      aria-hidden="true"
                                      onClick={this.editopenmodal.bind(
                                        this,
                                        item
                                      )}
                                    ></i> */}
                                      </td>
                                    </tr>
                                  ))
                                ) : this.state.tabLoading ? (
                                  <tr>
                                    <td
                                      colSpan="8"
                                      style={{ textAlign: "center" }}
                                    >
                                      <i
                                        className="fa fa-spinner searchLoading"
                                        aria-hidden="true"
                                      ></i>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="9"
                                      style={{ textAlign: "center" }}
                                    >
                                      You haven't recieved any Subscription yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </>
                          ) : (
                            <></>
                          )}
                          {this.state.order_status_show === "Rejected" ? (
                            <>
                              <thead>
                                <tr>
                                  <th scope="col">Date</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>{item.SubscriptionID}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.OrderTotal
                                          ? item.OrderTotal.toFixed(2)
                                          : item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>

                                        {/* <i
                                      className="fa fa-pencil-square-o hover-with-cursor m-r-5"
                                      aria-hidden="true"
                                      onClick={this.editopenmodal.bind(
                                        this,
                                        item
                                      )}
                                    ></i> */}
                                      </td>
                                    </tr>
                                  ))
                                ) : this.state.tabLoading ? (
                                  <tr>
                                    <td
                                      colSpan="8"
                                      style={{ textAlign: "center" }}
                                    >
                                      <i
                                        className="fa fa-spinner searchLoading"
                                        aria-hidden="true"
                                      ></i>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="9"
                                      style={{ textAlign: "center" }}
                                    >
                                      You haven't recieved any Subscription yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </>
                          ) : (
                            <></>
                          )}
                          {this.state.order_status_show === "unsubscribed" ? (
                            <>
                              <thead>
                                <tr>
                                  <th scope="col">Date</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>{item.SubscriptionID}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.OrderTotal
                                          ? item.OrderTotal.toFixed(2)
                                          : item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>

                                        {/* <i
                                      className="fa fa-pencil-square-o hover-with-cursor m-r-5"
                                      aria-hidden="true"
                                      onClick={this.editopenmodal.bind(
                                        this,
                                        item
                                      )}
                                    ></i> */}
                                      </td>
                                    </tr>
                                  ))
                                ) : this.state.tabLoading ? (
                                  <tr>
                                    <td
                                      colSpan="8"
                                      style={{ textAlign: "center" }}
                                    >
                                      <i
                                        className="fa fa-spinner searchLoading"
                                        aria-hidden="true"
                                      ></i>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="9"
                                      style={{ textAlign: "center" }}
                                    >
                                      You haven't recieved any Subscription yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </>
                          ) : (
                            <></>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Pagination
                hideNavigation
                activePage={this.state.currentPage}
                itemsCountPerPage={this.state.limit}
                totalItemsCount={parseInt(this.state.count)}
                onChange={this.handlePageChange}
              />
            </div>
            {/* Add model here */}
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <button
                      type="button"
                      className="close"
                      onClick={this.closeModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Add Order</h4>
                    <div className="modal-form-bx">
                      <form>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Select Customer</label>
                          </div>
                          <div className="modal-right-bx">
                            <select
                              name="select_customer"
                              onChange={(val) => this.onchangingcustomer(val)}
                            >
                              <option value="">Select Customer </option>
                              {this.state.customer_data &&
                              this.state.customer_data.length > 0
                                ? this.state.customer_data.map(
                                    (item, index) => (
                                      <option value={item._id} key={index}>
                                        {item.name
                                          ? item.name + " " + item.contactNumber
                                          : item.contactNumber}{" "}
                                      </option>
                                    )
                                  )
                                : ""}
                            </select>

                            <span className="err err_name"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Customer Name <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="customer_name"
                              className="form-control"
                              placeholder="Enter Customer Name"
                              onChange={this.formHandler}
                            />
                            <span className="err err_customer_name"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Customer Email <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="customer_email"
                              className="form-control"
                              placeholder="Enter Customer E-Mail"
                              onChange={this.formHandler}
                            />
                            <span className="err err_customer_email"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Customer Mobile Number{" "}
                              <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="customer_moible"
                              className="form-control"
                              placeholder="Enter Customer Mobile NUmber"
                              onChange={this.formHandler}
                            />
                            <span className="err err_customer_moible"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Select Category</label>
                          </div>
                          <div className="modal-right-bx">
                            <select
                              name="select_customer"
                              onChange={(val) => this.onchangingcategory(val)}
                            >
                              <option value="">Select Category</option>
                              {this.state.category &&
                              this.state.category.length > 0
                                ? this.state.category.map((item, index) => (
                                    <option value={item._id} key={index}>
                                      {item.category_name}
                                    </option>
                                  ))
                                : ""}
                            </select>
                            <span className="err err_name"></span>
                          </div>
                        </div>

                        <div className="product-category_adm">
                          <ul>
                            {this.state.product && this.state.product.length > 0
                              ? this.state.product.map((item, index) => {
                                  return (
                                    <li key={index}>
                                      <div className="produc_adm">
                                        <div className="product-figure_adm">
                                          <picture>
                                            <source
                                              srcset="main-banner.jpg"
                                              media="(max-width: 767px)"
                                            />
                                            <img
                                              src={imageUrl + item.base_image1}
                                              alt=""
                                            />
                                          </picture>
                                          <div className="buy-now"></div>
                                        </div>
                                        <div className="product-figcaption">
                                          <h4 className="pro-title">
                                            {item.product_name}
                                          </h4>
                                          <div className="price-bx">
                                            <div className="pro-price">
                                              ${item.selling_price}
                                            </div>
                                            <div className="qty">
                                              <div className="qty-click">
                                                <td>
                                                  <span
                                                    onClick={this.minus.bind(
                                                      this,
                                                      this.state[item._id]
                                                        ? this.state[item._id]
                                                        : 1,
                                                      item._id
                                                    )}
                                                  >
                                                    <button
                                                      type="button"
                                                      className="sub"
                                                    >
                                                      -
                                                    </button>
                                                  </span>
                                                  <span className="count">
                                                    {" "}
                                                    {this.state[item._id]
                                                      ? this.state[item._id]
                                                      : 1}{" "}
                                                  </span>
                                                  <span
                                                    onClick={this.plus.bind(
                                                      this,
                                                      this.state[item._id]
                                                        ? this.state[item._id]
                                                        : 1,
                                                      item._id
                                                    )}
                                                  >
                                                    <button
                                                      type="button"
                                                      className="add"
                                                    >
                                                      +
                                                    </button>
                                                  </span>
                                                </td>
                                              </div>
                                              <div>
                                                <div className="metal-select">
                                                  <label>Color</label>
                                                  <div className="cselect">
                                                    <select
                                                      className="form-control"
                                                      id="exampleFormControlSelect1"
                                                      value={this.state.color}
                                                      onChange={(val) =>
                                                        this._handleVariant(
                                                          val,
                                                          "color"
                                                        )
                                                      }
                                                    >
                                                      <option value="">
                                                        Select Color
                                                      </option>
                                                      {this.state
                                                        .dropdownColor &&
                                                      this.state
                                                        .dropdownColor[0] ? (
                                                        this.state.dropdownColor.map(
                                                          (i, ix) => {
                                                            return (
                                                              <option key={ix}>
                                                                {i.name}
                                                              </option>
                                                            );
                                                          }
                                                        )
                                                      ) : (
                                                        <option>N/A</option>
                                                      )}
                                                    </select>
                                                    <span
                                                      style={{ color: "red" }}
                                                      className="err_color"
                                                    ></span>
                                                  </div>
                                                </div>
                                                <div className="metal-select">
                                                  <label>Size</label>
                                                  <div className="cselect">
                                                    <select
                                                      className="form-control"
                                                      id="exampleFormControlSelect1"
                                                      value={this.state.size}
                                                      onChange={(val) =>
                                                        this._handleVariant(
                                                          val,
                                                          "size"
                                                        )
                                                      }
                                                    >
                                                      <option value="">
                                                        Select Size
                                                      </option>
                                                      {this.state
                                                        .dropdownSize &&
                                                      this.state
                                                        .dropdownSize[0] ? (
                                                        this.state.dropdownSize.map(
                                                          (i, ix) => {
                                                            return (
                                                              <option key={ix}>
                                                                {i.name}
                                                              </option>
                                                            );
                                                          }
                                                        )
                                                      ) : (
                                                        <option>N/A</option>
                                                      )}
                                                    </select>
                                                    <span
                                                      style={{ color: "red" }}
                                                      className="err_size"
                                                    ></span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <a
                                            onClick={() =>
                                              this._handleProduct(item)
                                            }
                                            className="add-cart"
                                          >
                                            ADD
                                          </a>
                                        </div>
                                      </div>
                                    </li>
                                  );
                                })
                              : ""}
                          </ul>
                        </div>

                        <div className="modal-bottom">
                          {/* <button className="cancel" onClick={this.closeModal}>
                            Cancel
                          </button> */}
                          <button
                            type="button"
                            className="submit"
                            onClick={this.add}
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
            {/* View Model */}
            <div
              className={
                this.state.show
                  ? "view-section order_detai_main show"
                  : "view-section order_detai_main hide"
              }
            >
              <button
                type="button"
                className="close"
                onClick={this.viewcloseModal}
              >
                &times;
              </button>
              <h4 className="modal-title">View Details </h4>
              {this.state.allsingledata ? (
                <div className="view-box">
                  <h3>User Details - </h3>
                  <div className="usre_detaisls">
                    <div className="customer_detail">
                      <span className="view-title">Customer Name</span>
                      <span className="view-status">
                        {this.state.allsingledata.user_id.name}
                      </span>
                    </div>
                    <div className="customer_detail">
                      <span className="view-title">Mobile Number</span>
                      <span className="view-status">
                        {this.state.allsingledata.user_id.contactNumber}
                      </span>
                    </div>
                    <div className="customer_detail">
                      <span className="view-title">Email Id</span>
                      <span className="view-status">
                        {" "}
                        {this.state.allsingledata.user_id.email}
                      </span>
                    </div>
                  </div>
                  <h3>Booking Details - </h3>
                  <div className="booking_details">
                    <div className="book_detail">
                      <span className="view-title">Booking ID</span>
                      <span className="view-status">
                        {this.state.allsingledata.booking_code}
                      </span>
                    </div>

                    <div className="book_detail">
                      <span className="view-title">Payment</span>
                      <span className="view-status">
                        {this.state.allsingledata.payment}
                      </span>
                    </div>
                    <div className="book_detail">
                      <span className="view-title">Total Payment</span>
                      <span className="view-status">
                        {this.state.allsingledata.total_payment}
                      </span>
                    </div>
                    <div className="book_detail">
                      <span className="view-title">Gst</span>
                      <span className="view-status">
                        {this.state.allsingledata.gst}
                      </span>
                    </div>
                    <div className="book_detail">
                      <span className="view-title">Date</span>
                      <span className="view-status">
                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                          {this.state.created_at}
                        </Moment>
                      </span>
                    </div>
                  </div>
                  <h3>Product Details - </h3>
                  {this.state.allsingledata.bookingdetail.length > 0
                    ? this.state.allsingledata.bookingdetail.map((item, ix) =>
                        item.simpleItem ? (
                          <>
                            <div className="order_details" key={ix}>
                              <span className="view-title">Product Name</span>
                              <span className="view-status">
                                {item.product_name}
                              </span>
                            </div>
                            <div className="order_details">
                              <span className="view-title">Package</span>
                              <span className="view-status">
                                {item.simpleItem.packetLabel}
                              </span>
                            </div>
                            <div className="order_details">
                              <span className="view-title">Quantity</span>
                              <span className="view-status">{item.qty}</span>
                            </div>

                            <div className="order_details">
                              <span className="view-title">Price</span>
                              <span className="view-status">
                                {item.simpleItem.selling_price}
                              </span>
                            </div>
                          </>
                        ) : (
                          ""
                        )
                      )
                    : ""}
                </div>
              ) : (
                ""
              )}
            </div>

            {/* view edit modal */}
            <Modal
              isOpen={this.state.editmodalIsOpen}
              onRequestClose={this.editclosemodal}
              style={customStyles}
              contentLabel="Edit Modal"
            >
              <div role="dialog">
                <div className="modal-dialog select_time">
                  <div className="modal-content select_time_order">
                    <button
                      type="button"
                      className="close"
                      onClick={this.editcloseModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Update Order</h4>
                    <div className="modal-form-bx">
                      {/* <div className="view-box">
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Status</label>
                          </div>
                          <div className="modal-right-bx">
                            <DateTimePicker
                              onChange={(ev) => this.ontimechange(ev)}
                              value={this.state.newdatetime}
                            />
                          </div>
                        </div>
                      </div> */}
                      <button type="button" onClick={() => this.updatestatus()}>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
            {/* edit  Model end*/}
            {/* send to delivery modal */}
            {/* // order modal start */}
            <Modal
              isOpen={this.state.vieworderdetails}
              onRequestClose={this.closeordermodel}
              className="adding-address"
              contentLabel="Add Address"
            >
              {this.state.order_detail ? (
                <div
                  role="dialog"
                  className="order-custome-wrapper subs-custome-order-popup"
                >
                  <div className="modal-dialog our_order_new">
                    <div className="modal-content">
                      <div>
                        <h4 className="modal-title">
                          <span>{this.state.order_detail.booking_code}</span>
                          <span>
                            {this.state.order_detail.BookingStatusByAdmin}
                          </span>
                        </h4>
                        <span>
                          Order placed on{"  "}
                          <Moment format="DD/MM/YYYY hh:mm:ss A">
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
                                    <Moment format="DD/MM/YYYY">
                                      {dt.date}
                                    </Moment>
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
                          onClick={this.closeordermodel}
                        >
                          &times;
                        </button>
                      </div>
                      <div className="modal-form-bx">
                        <form>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Order items</label>
                            </div>
                            <div className="modal-right-bx">
                              <div className="all_items_new">
                                {this.state.order_detail.bookingdetail
                                  ? this.state.order_detail.bookingdetail.map(
                                      (item, index) => {
                                        let groupItem = [];
                                        if (item.TypeOfProduct === "group") {
                                          item.groupData &&
                                            item.groupData.map((group) => {
                                              group.sets.map((set) => {
                                                if (set.qty && set.qty > 0) {
                                                  groupItem.push({
                                                    name: set.product
                                                      .product_name,
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
                                        return (
                                          <div className="flex" key={index}>
                                            <div className="left_main_card_new">
                                              <img
                                                src={
                                                  imageUrl +
                                                  (item.product_images
                                                    .length !== 0
                                                    ? item.product_images[0]
                                                        .image
                                                      ? item.product_images[0]
                                                          .image
                                                      : item.product_images[0]
                                                    : localStorage.getItem(
                                                        "prdImg"
                                                      ))
                                                }
                                                alt="image"
                                              />
                                            </div>
                                            <div className="right_main_card_new">
                                              <div className="new_pro_custommer">
                                                <span>
                                                  {item.product_name}
                                                  {item.TypeOfProduct ===
                                                    "simple" && (
                                                    <span>
                                                      {!item.without_package
                                                        ? item.simpleItem
                                                            .packetLabel
                                                        : item.unitQuantity +
                                                          " " +
                                                          (item.unitMeasurement
                                                            .name ||
                                                            item.unitMeasurement)}
                                                    </span>
                                                  )}
                                                </span>
                                                <span>
                                                  <span>
                                                    ₹
                                                    {item.itemWiseGst
                                                      ? +item.totalprice -
                                                        +item.itemWiseGst
                                                      : item.totalprice}
                                                  </span>{" "}
                                                </span>
                                              </div>
                                              Quantity <span>{item.qty}</span>
                                              {item.TypeOfProduct ===
                                              "group" ? (
                                                <ul>
                                                  {groupItem.map((group) => {
                                                    return (
                                                      <li
                                                        style={{
                                                          textTransform:
                                                            "capitalize",
                                                          listStyle: "none",
                                                          color: "gray",
                                                          padding: "2px 0px",
                                                          fontSize: "13px",
                                                        }}
                                                      >
                                                        {group.name}-
                                                        {group.package}- [
                                                        {group.qty}]
                                                      </li>
                                                    );
                                                  })}
                                                </ul>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </div>
                                        );
                                      }
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
                            {this.state.order_detail.giftingStatus ? (
                              <div className="modal-right-bx white_bg">
                                <div className="flex_justify border_bottom">
                                  <span style={{ fontWeight: "600" }}>
                                    Name
                                  </span>
                                  <span>
                                    {this.state.order_detail.giftingName &&
                                      this.state.order_detail.giftingName}
                                  </span>
                                </div>
                                <div className="flex_justify border_bottom">
                                  <span style={{ fontWeight: "600" }}>
                                    Contact
                                  </span>
                                  <span>
                                    {this.state.order_detail.giftingContact &&
                                      this.state.order_detail.giftingContact}
                                  </span>
                                </div>
                                <div className="flex_justify border_bottom">
                                  <span style={{ fontWeight: "600" }}>
                                    Note
                                  </span>
                                  <span>
                                    {this.state.order_detail.giftingNote &&
                                      this.state.order_detail.giftingNote}
                                  </span>
                                </div>
                                <div className="flex_justify">
                                  <span>Address</span>
                                  <span>
                                    {this.state.order_detail.giftingAddress &&
                                      this.state.order_detail.giftingAddress
                                        .street_address}
                                  </span>
                                </div>
                                <div>
                                  <label
                                    style={{
                                      color: "black",
                                      display: "block",
                                      marginTop: 10,
                                    }}
                                  >
                                    Delivery Instructions
                                  </label>
                                  <span>
                                    {this.state.order_detail
                                      .delivery_instructions &&
                                      this.state.order_detail
                                        .delivery_instructions}
                                  </span>
                                </div>
                              </div>
                            ) : (
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
                                    {this.state.order_detail.booking_address
                                      .address +
                                      (this.state.order_detail
                                        .booking_address &&
                                      this.state.order_detail.booking_address
                                        .pincode
                                        ? " - " +
                                          this.state.order_detail
                                            .booking_address.pincode
                                        : "")}
                                  </span>
                                )}
                                <div>
                                  <label
                                    style={{
                                      color: "black",
                                      display: "block",
                                      marginTop: 10,
                                    }}
                                  >
                                    Delivery Instructions
                                  </label>
                                  <span>
                                    {this.state.order_detail
                                      .delivery_instructions &&
                                      this.state.order_detail
                                        .delivery_instructions}
                                  </span>
                                </div>
                              </div>
                            )}{" "}
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
                                  <span>
                                    -{" "}
                                    {
                                      this.state.order_detail
                                        .BookingStatusByAdmin
                                    }
                                  </span>
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
                                <span style={{ fontWeight: "600" }}>
                                  Status
                                </span>
                                

                              </div> */}
                              <div className="flex_justify border_bottom">
                                <span style={{ fontWeight: "600" }}>
                                  Sub-Total
                                </span>
                                <span>
                                  ₹
                                  {this.truncateToDecimals(
                                    +this.state.order_detail
                                      .totalCartPriceWithoutGST
                                  )}
                                </span>
                              </div>
                              {this.state.order_detail
                                .totalCouponDiscountAmount ? (
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
                                              {gst.tax_name && (
                                                <>
                                                  <span
                                                    style={{ fontSize: "12px" }}
                                                  >
                                                    {gst.tax_name}{" "}
                                                    {gst.tax_percent}% - ₹
                                                    {+gst.totalPrice || "0"}
                                                  </span>
                                                  <br />
                                                </>
                                              )}
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

                              {/* {this.state.order_detail.couponApplied ? (
                                <div className="flex_justify border_bottom">
                                  <span style={{ fontWeight: "600" }}>
                                    Coupon Discount
                                  </span>
                                  <span>
                                    ₹ {this.state.order_detail.coupon_code}
                                  </span>
                                </div>
                              ) : (
                                ""
                              )} */}
                              {this.state.order_detail.deliveryCharges ? (
                                <div className="flex_justify border_bottom">
                                  <span style={{ fontWeight: "600" }}>
                                    Delivery Charges
                                  </span>
                                  <span>
                                    ₹ {this.state.order_detail.deliveryCharges}
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                              {this.state.order_detail.cod ? (
                                <div className="flex_justify border_bottom">
                                  <span style={{ fontWeight: "600" }}>
                                    COD Charges
                                  </span>
                                  <span>
                                    ₹ {this.state.order_detail.codCharges}
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                              {/* <div className="flex_justify border_bottom">
                                <span style={{ fontWeight: "600" }}>
                                  Status
                                </span>
                                <span>
                                  {this.state.order_detail.BookingStatusByAdmin}
                                </span>
                              </div> */}
                              <div
                                className="flex_justify"
                                style={{ padding: "4px 0px" }}
                              >
                                <span style={{ fontWeight: "600" }}>
                                  Total Price Per Day
                                </span>
                                <span>
                                  ₹{" "}
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
                              <div
                                className="flex_justify"
                                style={{ padding: "4px 0px" }}
                              >
                                <span style={{ fontWeight: "600" }}>
                                  Total Payment
                                </span>
                                <span>
                                  ₹{" "}
                                  {this.truncateToDecimals(
                                    this.state.order_detail.OrderTotal
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </Modal>
            {/* // order modal end */}
            <Modal
              isOpen={this.state.sento_delivery}
              onRequestClose={this.closesendtodel}
              style={customStyles}
              className="subscribe-driver-main"
              contentLabel="Edit Modal"
            >
              <div role="dialog driver_oreder">
                <div className="modal-dialog driver_order_detail">
                  <div className="modal-content sub-send-deliv-ppopup">
                    <button
                      type="button"
                      className="close"
                      onClick={this.editcloseModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Send to Delivery</h4>
                    <div className="modal-form-bx">
                      <div className="view-box">
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Select Date</label>
                          </div>
                          <div className="modal-right-bx">
                            <div className="checkout-left-col">
                              {this.state.sendtodel_data !== undefined &&
                                this.state.sendtodel_data.dates.map(
                                  (item, index) => (
                                    <div className="Card_des">
                                      <div
                                        className="modal-form-bx"
                                        style={{ alignItems: "center" }}
                                      >
                                        <div className="input_radio">
                                          {item.status === "Pending" ? (
                                            <input
                                              type="radio"
                                              name="selected_del_date"
                                              onChange={() => {
                                                this.setState({
                                                  selected_del_date: item.date,
                                                });
                                              }}
                                              style={{ appearance: "auto" }}
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <div className="heading">
                                          <h2>
                                            <Moment format="DD/MM/YYYY hh:mm:ss A">
                                              {item.date}
                                            </Moment>
                                          </h2>
                                          <p>{item.status}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Driver</label>
                          </div>
                          <div className="modal-right-bx">
                            {this.state.activ_supplier &&
                            this.state.activ_supplier.length > 0 ? (
                              <SelectSearch
                                placeholder={
                                  this.state.activ_supplier &&
                                  this.state.activ_supplier.length > 0
                                    ? "Search Driver"
                                    : "Loading..."
                                }
                                options={this.state.activ_supplier}
                                onChange={(e) => this.onChange11(e)}
                                value={this.state.driver_id}
                                className="select-search"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <span
                          style={{ color: "red" }}
                          className="err_del_update"
                        ></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => this.updatestatusoutfordel()}
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            {/* // Delivered modal end */}
            <Modal
              isOpen={this.state.sento_delivered}
              onRequestClose={() => {
                this.setState({
                  mdl_layout__obfuscator_hide: false,
                  sento_delivered: false,
                });
              }}
              style={customStyles}
              contentLabel="Edit Modal"
            >
              <div role="dialog driver_oreder">
                <div className="modal-dialog driver_order_detail">
                  <div className="modal-content">
                    <button
                      type="button"
                      className="close"
                      onClick={this.editcloseModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Mark As Delivered</h4>
                    <div className="modal-form-bx">
                      <div className="view-box">
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Select Date</label>
                          </div>
                          <div className="modal-right-bx">
                            <div className="checkout-left-col">
                              {this.state.sento_delivered_data !== null &&
                                this.state.sento_delivered_data.dates.map(
                                  (item, index) => (
                                    <div className="Card_des">
                                      <div
                                        className="modal-form-bx"
                                        style={{ alignItems: "center" }}
                                      >
                                        <div className="input_radio">
                                          {item.status ===
                                          "Out For Delivery" ? (
                                            <i
                                              className="fa fa-thumbs-o-up hover-with-cursor m-r-5"
                                              title="Mark as Delivered"
                                              onClick={this.delievered.bind(
                                                this,
                                                this.state.sento_delivered_data,
                                                item
                                              )}
                                              aria-hidden="true"
                                            ></i>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <div className="heading">
                                          <h2>
                                            <Moment format="DD/MM/YYYY hh:mm:ss A">
                                              {item.date}
                                            </Moment>
                                          </h2>
                                          <p>{item.status}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        </div>
                        <span
                          style={{ color: "red" }}
                          className="err_del_update"
                        ></span>
                      </div>
                      {/* <button
                        type="button"
                        onClick={() => this.updatestatusoutfordel()}
                      >
                        Update Status
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
            {/* ens send to delivery */}
            <div
              onClick={this.viewcloseModal}
              className={
                this.state.mdl_layout__obfuscator_hide
                  ? "mdl_layout__obfuscator_show"
                  : "mdl_layout__obfuscator_hide"
              }
            ></div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
