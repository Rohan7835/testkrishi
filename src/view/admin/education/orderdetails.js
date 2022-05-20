import moment from "moment-timezone";
import React, { Component } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import DatePicker from "react-date-picker";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import SelectSearch from "react-select-search";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
import "../../../assets/css/cart.css";
import { imageUrl } from "../../../imageUrl";
import DynamicUrl from "../../../main_url";
import Adminheader from "../elements/admin_header";
import Adminsiderbar from "../elements/admin_sidebar";
import Footer from "../elements/footer";
// import MultiselectCheckbox from "react-multiselect-checkbox";

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
    var date = new Date();

    // Add a day
    date.setDate(date.getDate() + 1);
    this.state = {
      admin_data: ad_data,
      modalIsOpen: false,
      BulkPaymentStatus: false,
      pendingCODModal: false,
      DriverUpdateStatus: false,
      bulkAcceptedStatus: false,
      subscriptionPendingOrder: false,
      editmodalIsOpen: false,
      show: false,
      mdl_layout__obfuscator_hide: false,
      status: true,
      customer_name: "",
      search_driver: "",
      email: "",
      payment_method_search: "",
      mobile_no: "",
      total_amount: "",
      created_date: new Date(),
      paymentstatusbyadmin: new Date(),
      newdatetime: date,
      order_status: "",
      order_status_show: "All",
      orderdata: [],
      allsingledata: "",
      category: [],
      product: [],
      openMarkAsDeliveryPopup: false,
      markAsDeliveryData: {},
      Payment_Status_byadmin_data: {},
      markAsDeliveredPaymentStatus: "",
      customer_data: [],
      dropdownColor: [],
      dropdownSize: [],
      activ_supplier: [],
      options: [
        { name: "Swedish", value: "sv" },
        { name: "English", value: "en" },
      ],
      count: "",
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
      status_search: "",
      tabLoading: true,
      searchLoading: false,
      active_billingCompany: [],
      search_billingCompany: {},
      bill_type_search: "",
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.vieworderdetails = this.vieworderdetails.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.delievered = this.delievered.bind(this);
    this.editopenmodal = this.editopenmodal.bind(this);
    this.closeordermodel = this.closeordermodel.bind(this);
    this.ClosePaymentStatusByAdmin = this.ClosePaymentStatusByAdmin.bind(this);
    this.sendfordelivery = this.sendfordelivery.bind(this);
    this.editclosemodal = this.editclosemodal.bind(this);
    this.closesendtodel = this.closesendtodel.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
    this.downloadbill = this.downloadbill.bind(this);
  }

  downloadbill(ev) {
    let requestData = {
      booking_code: ev.booking_code,
    };
    AdminApiRequest(requestData, "/admin/invoice/generate", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          //
          const newWindow = window.open(
            DynamicUrl + res.data.pdf.filename,
            "_blank",
            "noopener,noreferrer"
            // "https://kc.storehey.com:3003/" + res.data.pdf.filename,
            // "_blank",
            // "noopener,noreferrer"
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
    const LocalOrderData = this.state.orderdata.filter(
      (a) => a.frontendCheckedStatus
    );
    var dateNew = this.state.newdatetime
      ? moment(this.state.newdatetime).format("YYYY-MM-DD")
      : "";
    // dateNew.setDate(dateNew.getDate() + 1);
    let correctDates = dateNew;
    const requestData = this.state.bulkAcceptedStatus
      ? {
          arrayData: LocalOrderData.map((a) => {
            return {
              booking_id: a._id,
              user_id: a.user_id._id,
            };
          }),
          BookingStatusByAdmin: "Accepted",
          DeliveryDate: correctDates,
          adminID: this.state.admin_data._id,
        }
      : {
          user_id: this.state.user_id,
          booking_id: this.state.booking_id,
          BookingStatusByAdmin: "Accepted",
          DeliveryDate: correctDates,
          adminID: this.state.admin_data._id,
        };
    AdminApiRequest(
      requestData,
      this.state.bulkAcceptedStatus
        ? "/admin/BulkUpdateBookingStatus"
        : "/admin/UpdateBookingStatus",
      "POST"
    )
      .then((res) => {
        this.setState({ bulkAcceptedStatus: false });
        if (res.status === 201 || res.status === 200) {
          this.onChangelist(this.state.order_status_show);
          swal({
            title: "Order Accepted",
            // text: "Are you sure that you want to leave this page?",
            icon: "success",
            dangerMode: false,
          });
          var date = new Date();

          // Add a day
          date.setDate(date.getDate() + 1);

          this.setState({ newdatetime: date });
        } else {
          const errorMsg = res.data.message || "Network Issue";
          swal({
            title: errorMsg,
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
    const errorEl = document.querySelector(".select_driver_error");
    if (this.state.driver_id) {
      const requestData = {
        user_id: this.state.sendtodel_data.user_id._id,
        booking_id: this.state.sendtodel_data._id,
        driver_id: this.state.driver_id,
        adminID: this.state.admin_data._id,
      };
      AdminApiRequest(requestData, "/UpdateDriverDetail", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.onChangelist(this.state.order_status_show);
            swal({
              title: this.state.DriverUpdateStatus
                ? "Driver changed successfully"
                : "Order Send for delivery",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            errorEl.innerHTML = "";
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
        sento_delivery: false,
      });
      this.fetchoredercount();
    } else {
      errorEl.innerHTML = "Please Select a Driver to Proceed";
    }
  };

  updatestatusoutfordelForAllOrders = () => {
    const errorEl = document.querySelector(".select_driver_error");
    const LocalOrderData = this.state.orderdata.filter(
      (a) => a.frontendCheckedStatus
    );
    if (this.state.driver_id) {
      const requestData = {
        ofdData: LocalOrderData.map((a) => {
          return { booking_id: a._id, user_id: a.user_id._id };
        }),
        driver_id: this.state.driver_id,
        adminID: this.state.admin_data._id,
      };
      this.setState({
        searchLoading: true,
        mdl_layout__obfuscator_hide: true,
      });
      AdminApiRequest(requestData, "/admin/bulk/UpdateDriverDetail", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.onChangelist(this.state.order_status_show);
            swal({
              title: "Order Send for delivery",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            errorEl.innerHTML = "";
            this.setState({
              mdl_layout__obfuscator_hide: false,
              tabLoading: false,
            });
          } else {
            this.setState({
              mdl_layout__obfuscator_hide: false,
              tabLoading: false,
            });
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
        sento_delivery: false,
      });
      this.setState({
        searchLoading: false,
      });
      this.fetchoredercount();
    } else {
      errorEl.innerHTML = "Please Select a Driver to Proceed";
    }
  };
  openMarkAsDelivery = (data) => {
    this.setState({
      sendingAllOrdersToCompleted: data ? false : true,
      markAsDeliveryData: data || {},
      openMarkAsDeliveryPopup: true,
    });
    if (data && data.payment.toLowerCase().includes("complete")) {
      this.setState({ markAsDeliveredPaymentStatus: "Complete" });
    }
  };

  closeMarkAsDelivery = () => {
    this.setState({
      openMarkAsDeliveryPopup: false,
      markAsDeliveryData: {},
    });
  };

  OpenPaymentStatusByAdmin = (data, cod) => {
    this.setState({
      OpenPaymentStatusByAdmin: true,
      Payment_Status_byadmin_data: data || "",
      BulkPaymentStatus: data ? false : true,
      pendingCODModal: cod,
    });
  };
  bulkPaymentComplete = () => {
    const errorEl = document.querySelector(
      ".select_markAsDeliveredPaymentStatus"
    );
    const LocalOrderData = this.state.orderdata.filter(
      (a) => a.frontendCheckedStatus
    );
    // if (this.state.markAsDeliveredPaymentStatus) {
    const requestData = {
      DeliveryData: LocalOrderData.map((a) => {
        return {
          booking_id: a._id,
          user_id: a.user_id._id,
          payment_method: a.paymentmethod,
        };
      }),
      adminID: this.state.admin_data._id,
      payment_method: this.state.pendingCODModal ? "COD" : "Credit",
      payment_status: this.state.markAsDeliveredPaymentStatus,
      paymentDateByAdmin: new Date(this.state.paymentstatusbyadmin),
    };
    this.ClosePaymentStatusByAdmin();
    AdminApiRequest(requestData, "/admin/bulk/UpdateDeliveryStatus", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.onChangelist(this.state.order_status_show);
          swal({
            title: "Order Delievered",
            // text: "Are you sure that you want to leave this page?",
            icon: "success",
            dangerMode: false,
          });
          this.closeMarkAsDelivery();
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
    // }
  };

  ClosePaymentStatusByAdmin = () => {
    this.setState({
      OpenPaymentStatusByAdmin: false,
      Payment_Status_byadmin_data: {},
    });
  };

  delievered = (data) => {
    const errorEl = document.querySelector(
      ".select_markAsDeliveredPaymentStatus"
    );
    if (this.state.markAsDeliveredPaymentStatus) {
      const requestData = {
        user_id: data.user_id._id,
        booking_id: data._id,
        adminID: this.state.admin_data._id,
        payment_method: data.paymentmethod,
        payment_status: this.state.markAsDeliveredPaymentStatus,
        paymentDateByAdmin: new Date(this.state.paymentstatusbyadmin),
      };
      this.ClosePaymentStatusByAdmin();
      AdminApiRequest(requestData, "/admin/UpdateDeliveryStatus", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.onChangelist(this.state.order_status_show);
            swal({
              title: "Order Delievered",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.closeMarkAsDelivery();
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
    } else {
      errorEl.innerHTML = "Please select payment status";
    }
  };

  bulkDelivered = (data) => {
    const errorEl = document.querySelector(
      ".select_markAsDeliveredPaymentStatus"
    );
    const LocalOrderData = this.state.orderdata.filter(
      (a) => a.frontendCheckedStatus
    );
    if (this.state.markAsDeliveredPaymentStatus) {
      const requestData = {
        DeliveryData: LocalOrderData.map((a) => {
          return {
            booking_id: a._id,
            user_id: a.user_id._id,
            payment_method: a.paymentmethod,
          };
        }),
        adminID: this.state.admin_data._id,
        payment_method: data.paymentmethod,
        payment_status: this.state.markAsDeliveredPaymentStatus,
        paymentDateByAdmin: new Date(this.state.paymentstatusbyadmin),
      };
      this.ClosePaymentStatusByAdmin();
      AdminApiRequest(requestData, "/admin/bulk/UpdateDeliveryStatus", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.onChangelist(this.state.order_status_show);
            swal({
              title: "Order Delievered",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.closeMarkAsDelivery();
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
    } else {
      errorEl.innerHTML = "Please select payment status";
    }
  };
  bulkupdatestatuskey = (data, type) => {
    const LocalOrderData = this.state.orderdata.filter(
      (a) => a.frontendCheckedStatus
    );
    swal({
      title: "Are You Sure?",
      text: "",
      icon: "warning",
      dangerMode: true,
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "back-swal-btn",
          closeModal: true,
        },
      },
    }).then((confirm) => {
      if (confirm) {
        if (data) {
          this.setState({
            booking_id: data._id,
            user_id: data.user_id._id,
          });
        } else {
          this.setState({
            bulkAcceptedStatus: true,
          });
        }
        if (type === "accept") {
          this.setState({
            mdl_layout__obfuscator_hide: false,
            editmodalIsOpen: true,
          });
        } else {
          const requestData = {
            arrayData: LocalOrderData.map((a) => {
              return {
                booking_id: a._id,
                user_id: a.user_id._id,
              };
            }),
            // user_id: data.user_id._id,
            // booking_id: data._id,
            BookingStatusByAdmin: "Rejected",
            DeliveryDate: "",
            adminID: this.state.admin_data._id,
          };
          AdminApiRequest(requestData, "/admin/BulkUpdateBookingStatus", "POST")
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
      } else {
      }
    });
  };
  ordernowcompleted = (data) => {
    swal({
      title: "Are You Sure?",
      text: "",
      icon: "warning",
      dangerMode: true,
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "back-swal-btn",
          closeModal: true,
        },
      },
    }).then((confirm) => {
      if (confirm) {
        const requestData = {
          user_id: data.user_id._id,
          booking_id: data._id,
          adminID: this.state.admin_data._id,
          paymentDateByAdmin: this.state.paymentstatusbyadmin,
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
              this.ClosePaymentStatusByAdmin();
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
      } else {
      }
    });
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

  sendfordelivery(dt, callFrom) {
    this.setState({
      sendtodel_data: dt || {},
      sendingAllOrders: dt ? false : true,
      DriverUpdateStatus: callFrom === "driverChange" ? true : false,
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
      subscriptionPendingOrder: false,
      newdatetime: new Date(),
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
      sendingAllOrders: false,
      acceptedOrderStatus: false,
      order_status_show: data,
      user_name_search: "",
      user_email_search: "",
      user_mobile_search: "",
      booking_mode_search: "",
      booking_code_search: "",
      search_billingCompany: "",
      search_driver: "",
      total_payment_search: "",
      payment_method_search: "",
      date_search: "",
      status_search: "",
      skip: 0,
      limit: this.state.limit,
    });
    const requestData = {
      listStatus: data,
      skip: this.state.skip,
      limit: this.state.limit,
      keyword: "",
    };
    AdminApiRequest(requestData, "/admin/getAllBooking", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            orderdata: res.data.data.map((a) => {
              return { ...a, frontendCheckedStatus: false };
            }),
            count: res.data.count,
            currentPage: 1,
            tabLoading: false,
          });
        } else {
        }
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
  acceptFailedOrder = (item) => {
    swal({
      title: "Are You Sure?",
      text: "",
      icon: "warning",
      dangerMode: true,
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "back-swal-btn",
          closeModal: true,
        },
      },
    }).then((confirm) => {
      if (confirm) {
        const requestData = {
          booking_id: item._id,
          adminID: this.state.admin_data._id,
        };
        AdminApiRequest(requestData, "/AcceptFailedOrder", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              this.onChangelist(this.state.order_status_show);
              swal({
                title: "Order Updated",
                // text: "Are you sure that you want to leave this page?",
                icon: "success",
                dangerMode: false,
              });
            } else {
              swal({
                title: res.data.data || "Network Issue",
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
      }
    });
  };
  updatestatuskey = (data, type) => {
    swal({
      title: "Are You Sure?",
      text: "",
      icon: "warning",
      dangerMode: true,
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "back-swal-btn",
          closeModal: true,
        },
      },
    }).then((confirm) => {
      if (confirm) {
        this.setState({
          booking_id: data._id,
          user_id: data.user_id._id,
        });
        if (type === "accept") {
          this.setState({
            newdatetime: data.DeliveryDate || new Date(),
            subscriptionPendingOrder: data.DeliveryDate ? true : false,
            mdl_layout__obfuscator_hide: false,
            editmodalIsOpen: true,
          });
        } else {
          const requestData = {
            user_id: data.user_id._id,
            booking_id: data._id,
            BookingStatusByAdmin: "Rejected",
            DeliveryDate: "",
            adminID: this.state.admin_data._id,
          };
          AdminApiRequest(requestData, "/admin/UpdateBookingStatus", "POST")
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
      } else {
      }
    });
  };

  fetchoredercount() {
    const requestData = {};
    AdminApiRequest(requestData, "/admin/getTotalNumberOrder", "GET")
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
  getBillingCompanies = () => {
    AdminApiRequest({}, "/admin/company/getAll", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let data = [];
          res.data.data.forEach((dta) =>
            data.push({ value: dta._id, name: dta.name })
          );
          this.setState({
            active_billingCompany: data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.fetchoredercount();
    this.getBillingCompanies();
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

    const requestData_new = {
      listStatus: this.state.order_status_show,
      skip: this.state.skip,
      limit: this.state.limit,
      keyword: "",
    };
    AdminApiRequest(requestData_new, "/admin/getAllBooking", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            orderdata: res.data.data.map((a) => {
              return { ...a, frontendCheckedStatus: false };
            }),
            count: res.data.count,
            currentPage: 1,
            tabLoading: false,
          });
        } else {
        }
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
  getcustomerfilter1 = () => {
    this.setState({
      currentPage: 1,
      orderdata: [],
      tabLoading: true,
    });
    this.getcustomerfilter();
  };
  getcustomerfilter = (skipParam) => {
    const requestData = {
      skip: skipParam ? skipParam : 0,
      limit: this.state.limit,
      listStatus: this.state.order_status_show,
      userName: this.state.user_name_search,
      userEmail: this.state.user_email_search,
      billingCompany: this.state.search_billingCompany.value || null,
      billType: this.state.bill_type_search || null,
      userMobile: this.state.user_mobile_search,
      // bookingMode: this.state.booking_mode_search,
      paymentmethod: this.state.payment_method_search,
      booking_code: this.state.booking_code_search,
      total_payment: this.state.total_payment_search,
      date: this.state.date_search,
      driver_id: this.state.search_driver ? this.state.search_driver.value : "",
      status:
        this.state.status_search === "active"
          ? true
          : this.state.status_search === ""
          ? ""
          : this.state.status_search === "inactive" && false,
    };
    AdminApiRequest(requestData, "/admin/getAllBooking", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            orderdata: res.data.data.map((a) => {
              return { ...a, frontendCheckedStatus: false };
            }),
            count: res.data.count,
            currentPage: skipParam ? this.state.currentPage : 1,
            tabLoading: false,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  resetFilter = () => {
    this.setState({
      user_name_search: "",
      user_email_search: "",
      user_mobile_search: "",
      booking_mode_search: "",
      booking_code_search: "",
      total_payment_search: "",
      search_billingCompany: "",
      bill_type_search: "",
      payment_method_search: "",
      date_search: "",
      status_search: "",
      search_driver: "",
      skip: 0,
      limit: this.state.limit,
      currentPage: 1,
      orderdata: [],
      tabLoading: true,
    });
    const requestData = {
      listStatus: this.state.order_status_show,
      skip: this.state.skip,
      limit: this.state.limit,
      keyword: "",
    };
    AdminApiRequest(requestData, "/admin/getAllBooking", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            orderdata: res.data.data.map((a) => {
              return { ...a, frontendCheckedStatus: false };
            }),
            count: res.data.count,
            currentPage: 1,
            tabLoading: false,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  truncateToDecimals = (num, dec = 2) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };

  //checkboxes toggle functionalities.
  changeStatusFrontend = (id) => {
    let orderData = this.state.orderdata;
    let newData = orderData.map((a) => {
      return a._id !== id
        ? { ...a }
        : { ...a, frontendCheckedStatus: !a.frontendCheckedStatus };
    });
    let allSelected = true;
    newData.forEach((a) => {
      if (!a.frontendCheckedStatus) {
        allSelected = false;
      }
    });
    setTimeout(() => {
      this.setState({
        orderdata: newData,
        acceptedOrderStatus: allSelected,
      });
    }, 0);
  };
  selectAllOrders = () => {
    let orderData = this.state.orderdata;
    let newData = orderData.map((a) => {
      return { ...a, frontendCheckedStatus: !this.state.acceptedOrderStatus };
    });
    this.setState({
      orderdata: newData,
      acceptedOrderStatus: !this.state.acceptedOrderStatus,
    });
  };

  selectAllOrdersDelivered = () => {
    let orderData = this.state.orderdata;
    let newData = orderData.map((a) => {
      return a.payment === "Pending"
        ? { ...a, frontendCheckedStatus: !this.state.acceptedOrderStatus }
        : { ...a, frontendCheckedStatus: false };
    });
    this.setState({
      orderdata: newData,
      acceptedOrderStatus: !this.state.acceptedOrderStatus,
    });
  };
  //

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
                        <h4 className="card-title"> Orders </h4>
                        <Link to="addorder">
                          <button className="btn btn-primary m-r-5 float-right">
                            <i className="fa fa-plus"></i> Add Order
                          </button>
                        </Link>
                      </div>
                      <ul
                        className="nav nav-tabs inner-tab showinonelinetab"
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
                          All{" ("}
                          {this.state.ordercount
                            ? this.state.ordercount.All
                            : 0}
                          {")"}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "Pending"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Pending")}
                        >
                          Pending{" ("}
                          {this.state.ordercount
                            ? this.state.ordercount.Pending
                            : 0}
                          {")"}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "Accepted"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Accepted")}
                        >
                          Accepted{" ("}
                          {this.state.ordercount
                            ? this.state.ordercount.Accepted
                            : 0}
                          {")"}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "Out For Delivery"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Out For Delivery")}
                        >
                          Delivery{" ("}
                          {this.state.ordercount
                            ? this.state.ordercount.OutForDelivery
                            : 0}
                          {")"}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "Payment_Pending"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Payment_Pending")}
                        >
                          Pending Cod{" ("}
                          {this.state.ordercount
                            ? this.state.ordercount.Payment_Pending
                            : 0}
                          {")"}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "credit_payment"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("credit_payment")}
                        >
                          Pending Credit{" ("}
                          {this.state.ordercount
                            ? this.state.ordercount.Credit_Payment_Pending
                            : 0}
                          {")"}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "Delivered"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Delivered")}
                        >
                          Completed{" ("}
                          {this.state.ordercount
                            ? this.state.ordercount.Delivered
                            : 0}
                          {")"}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "Rejected"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Rejected")}
                        >
                          Rejected{" ("}
                          {this.state.ordercount
                            ? this.state.ordercount.Rejected
                            : 0}
                          {")"}
                        </li>
                        <li
                          className={
                            this.state.order_status_show === "Payment_failed"
                              ? "nav-item onchang active"
                              : "nav-item onchang"
                          }
                          onClick={() => this.onChangelist("Payment_failed")}
                        >
                          Failed{" ("}
                          {this.state.ordercount
                            ? this.state.ordercount.Payment_failed
                            : 0}
                          {")"}
                        </li>
                      </ul>
                      <div className="searching-every searching-6-col popup-arrow-select">
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
                            placeholder="Order Id"
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
                          <SelectSearch
                            placeholder={
                              this.state.activ_supplier &&
                              this.state.activ_supplier.length > 0
                                ? "Search Driver"
                                : "Loading..."
                            }
                            name="search_driver"
                            options={this.state.activ_supplier}
                            onChange={(e) => {
                              this.setState({
                                search_driver: e,
                              });
                            }}
                            value={this.state.search_driver.value}
                            className="select-search"
                          />
                        </span>
                        <span>
                          <select
                            name="payment_method_search"
                            value={this.state.payment_method_search}
                            className="form-control"
                            onChange={this.formHandler1}
                          >
                            <option value="">Payment Method</option>
                            <option value="Paytm">Paytm</option>
                            <option value="cod">COD</option>
                            <option value="Credit">Credit</option>
                          </select>
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

                        <span>
                          <SelectSearch
                            placeholder={
                              this.state.active_billingCompany &&
                              this.state.active_billingCompany.length > 0
                                ? "Search Billing Company"
                                : "Loading..."
                            }
                            name="search_billingCompany"
                            options={this.state.active_billingCompany}
                            onChange={(e) => {
                              this.setState({
                                search_billingCompany: e,
                              });
                            }}
                            value={this.state.search_billingCompany.value}
                            className="select-search"
                          />
                        </span>

                        <span>
                          <select
                            name="bill_type_search"
                            value={this.state.bill_type_search}
                            className="form-control"
                            onChange={this.formHandler1}
                          >
                            <option value="">Bill Type</option>
                            <option value="invoice">Invoice</option>
                            <option value="challan">Challan</option>
                          </select>
                        </span>

                        <span className="search-btn-every or-der-sar-btn">
                          <button
                            type="submit"
                            onClick={() => this.getcustomerfilter1()}
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
                      {
                        this.state.order_status_show === "Accepted" ? (
                          <button
                            className="btn btn-primary m-r-5 reset_button_new"
                            onClick={() => {
                              if (
                                this.state.orderdata.filter(
                                  (a) => a.frontendCheckedStatus
                                ).length > 0
                              ) {
                                this.sendfordelivery();
                              } else {
                                swal({
                                  text: "Please select atleast one order to continue",
                                  icon: "warning",
                                });
                              }
                            }}
                          >
                            Send for delivery
                          </button>
                        ) : this.state.order_status_show ===
                          "Out For Delivery" ? (
                          <button
                            className="btn btn-primary m-r-5 reset_button_new"
                            onClick={() => {
                              if (
                                this.state.orderdata.filter(
                                  (a) => a.frontendCheckedStatus
                                ).length > 0
                              ) {
                                this.openMarkAsDelivery();
                              } else {
                                swal({
                                  text: "Please select atleast one order to continue",
                                  icon: "warning",
                                });
                              }
                            }}
                          >
                            Mark as completed
                          </button>
                        ) : (
                          ""
                        )
                        // this.state.order_status_show === "Pending" ? (
                        //   <>
                        //     <button
                        //       className="btn btn-primary m-r-5 reset_button_new"
                        //       onClick={() => {
                        //         if (
                        //           this.state.orderdata.filter(
                        //             (a) => a.frontendCheckedStatus
                        //           ).length > 0
                        //         ) {
                        //           this.bulkupdatestatuskey("", "accept");
                        //         } else {
                        //           swal({
                        //             text: "Please select atleast one order to continue",
                        //             icon: "warning",
                        //           });
                        //         }
                        //       }}
                        //     >
                        //       Accept
                        //     </button>
                        //     <button
                        //       className="btn btn-primary m-r-5 reset_button_new"
                        //       onClick={() => {
                        //         if (
                        //           this.state.orderdata.filter(
                        //             (a) => a.frontendCheckedStatus
                        //           ).length > 0
                        //         ) {
                        //           this.bulkupdatestatuskey("", "reject");
                        //         } else {
                        //           swal({
                        //             text: "Please select atleast one order to continue",
                        //             icon: "warning",
                        //           });
                        //         }
                        //       }}
                        //     >
                        //       Reject
                        //     </button>
                        //   </>
                        // ) : this.state.order_status_show === "Payment_Pending" ? (
                        //   <button
                        //     className="btn btn-primary m-r-5 reset_button_new"
                        //     onClick={() => {
                        //       if (
                        //         this.state.orderdata.filter(
                        //           (a) => a.frontendCheckedStatus
                        //         ).length > 0
                        //       ) {
                        //         this.OpenPaymentStatusByAdmin();
                        //       } else {
                        //         swal({
                        //           text: "Please select atleast one order to continue",
                        //           icon: "warning",
                        //         });
                        //       }
                        //     }}
                        //   >
                        //     Mark as completed
                        //   </button>
                        // ) : this.state.order_status_show === "credit_payment" ? (
                        //   <button
                        //     className="btn btn-primary m-r-5 reset_button_new"
                        //     onClick={() => {
                        //       if (
                        //         this.state.orderdata.filter(
                        //           (a) => a.frontendCheckedStatus
                        //         ).length > 0
                        //       ) {
                        //         this.OpenPaymentStatusByAdmin();
                        //       } else {
                        //         swal({
                        //           text: "Please select atleast one order to continue",
                        //           icon: "warning",
                        //         });
                        //       }
                        //     }}
                        //   >
                        //     Mark as completed
                        //   </button>
                        // ) : (
                        //   ""
                        // )
                      }
                      <div className="table-responsive general-data-search-block">
                        <table
                          id="datatables"
                          className="table table-striped table-no-bordered table-hover new_tabulardesign"
                          cellSpacing="0"
                          width="100%"
                        >
                          {this.state.order_status_show === "All" ? (
                            <>
                              <thead>
                                <tr>
                                  <th scope="col">Date</th>
                                  <th scope="col">Date of Bill</th>
                                  <th scope="col">Order Id</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Delivery Slot</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Bill Type</th>
                                  <th scope="col">Billing Company</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Driver Name</th>
                                  <th scope="col">Order Status</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>
                                        {item.backendOrderDate ? (
                                          <Moment format="DD/MM/YYYY">
                                            {item.backendOrderDate}
                                          </Moment>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                      <td>{item.booking_code}</td>
                                      <td>{item.subscriptionCode}</td>
                                      <td>{item.deliverySlot}</td>

                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.total_payment &&
                                          item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>{item.billType}</td>
                                      <td>{item.billingCompany?.name}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>{item.driverName}</td>
                                      <td>{item.BookingStatusByAdmin}</td>

                                      <td className="hover-icon-custom">
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        ></i>
                                        <i
                                          onClick={this.downloadbill.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-print"
                                          aria-hidden="true"
                                        ></i>
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
                                      colSpan="9"
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
                                      You haven't recieved any orders yet.
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
                                  {/* <th
                                    scope="col"
                                    className="select-all-checkbox"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={this.state.acceptedOrderStatus}
                                      onChange={() => this.selectAllOrders()}
                                    />
                                  </th> */}
                                  <th scope="col">Date</th>
                                  <th scope="col">Date of Bill</th>
                                  <th scope="col">Order Id</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Delivery Slot</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Bill Type</th>
                                  <th scope="col">Billing Company</th>
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
                                      {/* <td className="select-all-checkbox">
                                        <input
                                          type="checkbox"
                                          name="acceptedAllOrders"
                                          value={item._id}
                                          onChange={(e) =>
                                            this.changeStatusFrontend(item._id)
                                          }
                                          checked={item.frontendCheckedStatus}
                                        />
                                      </td> */}
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>
                                        {item.backendOrderDate ? (
                                          <Moment format="DD/MM/YYYY">
                                            {item.backendOrderDate}
                                          </Moment>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                      <td>{item.booking_code}</td>
                                      <td>{item.subscriptionCode}</td>
                                      <td>{item.deliverySlot}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.total_payment &&
                                          item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>{item.billType}</td>
                                      <td>{item.billingCompany?.name}</td>
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

                                      <td className="hover-icon-custom">
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        ></i>
                                        <Link
                                          to={"/admin-edit-order/" + item._id}
                                        >
                                          <i
                                            className="fa fa-pencil"
                                            aria-hidden="true"
                                          ></i>
                                        </Link>
                                        <i
                                          onClick={this.downloadbill.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-print"
                                          aria-hidden="true"
                                        ></i>
                                      </td>
                                    </tr>
                                  ))
                                ) : this.state.tabLoading ? (
                                  <tr>
                                    <td
                                      colSpan="9"
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
                                      You haven't recieved any orders yet.
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
                                  <th
                                    scope="col"
                                    className="select-all-checkbox"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={this.state.acceptedOrderStatus}
                                      onChange={() => this.selectAllOrders()}
                                    />
                                  </th>
                                  <th scope="col">Date</th>
                                  <th scope="col">Date of Bill</th>
                                  <th scope="col">Order Id</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Delivery Slot</th>
                                  <th scope="col">D.O.D.</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Bill Type</th>
                                  <th scope="col">Billing Company</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      <td className="select-all-checkbox">
                                        <input
                                          type="checkbox"
                                          name="acceptedAllOrders"
                                          value={item._id}
                                          onChange={(e) =>
                                            this.changeStatusFrontend(item._id)
                                          }
                                          checked={item.frontendCheckedStatus}
                                        />
                                        {/* <input
                                          type="checkbox"
                                          className="select-checkbox"
                                          value={item._id}
                                        /> */}
                                      </td>
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>
                                        {item.backendOrderDate ? (
                                          <Moment format="DD/MM/YYYY">
                                            {item.backendOrderDate}
                                          </Moment>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                      <td>{item.booking_code}</td>
                                      <td>{item.subscriptionCode}</td>
                                      <td>{item.deliverySlot}</td>
                                      <td>
                                        <Moment format="DD/MM/YYYY">
                                          {item.DeliveryDate}
                                        </Moment>
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
                                        {item.total_payment &&
                                          item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>{item.billType}</td>
                                      <td>{item.billingCompany?.name}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td className="hover-icon-custom">
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        ></i>
                                        <Link
                                          to={"/admin-edit-order/" + item._id}
                                        >
                                          <i
                                            className="fa fa-pencil"
                                            aria-hidden="true"
                                          ></i>
                                        </Link>
                                        <i
                                          onClick={this.downloadbill.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-print"
                                          aria-hidden="true"
                                        ></i>
                                        <i
                                          className="fa fa-motorcycle hover-with-cursor m-r-5"
                                          title="Send for Delivery"
                                          aria-hidden="true"
                                          onClick={this.sendfordelivery.bind(
                                            this,
                                            item
                                          )}
                                        ></i>
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
                                    </tr>
                                  ))
                                ) : this.state.tabLoading ? (
                                  <tr>
                                    <td
                                      colSpan="9"
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
                                      You haven't recieved any orders yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </>
                          ) : (
                            <></>
                          )}
                          {this.state.order_status_show ===
                          "Out For Delivery" ? (
                            <>
                              <thead>
                                <tr>
                                  <th
                                    scope="col"
                                    className="select-all-checkbox"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={this.state.acceptedOrderStatus}
                                      onChange={() =>
                                        this.selectAllOrdersDelivered()
                                      }
                                    />
                                  </th>
                                  <th scope="col">Date</th>
                                  <th scope="col">Order Id</th>
                                  <th scope="col">Subscription Id</th>
                                  <th scope="col">Delivery Slot</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Payment Status</th>
                                  <th scope="col">Bill Type</th>
                                  <th scope="col">Billing Company</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Delivery Date</th>
                                  <th scope="col">Driver Name</th>
                                  {/* <th scope="col">
                                     <MultiselectCheckbox
                                      checkboxes=".table .select-checkbox"
                                      sync=".table .row"
                                      onNotAllChecked={(selectedMap) => {
                                        console.log(
                                          "Not all checked",
                                          selectedMap.orderedByI()
                                        );
                                      }}
                                      onAllChecked={(selectedMap) => {
                                        console.log(
                                          "All checked",
                                          selectedMap.orderedByI()
                                        );
                                      }}
                                      onAllUnchecked={(selectedMap) => {
                                        console.log(
                                          "All unchecked",
                                          selectedMap.orderedByI()
                                        );
                                      }}
                                    /> 
                                  </th>*/}
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      <td className="select-all-checkbox">
                                        {item.payment === "Pending" ? (
                                          <input
                                            type="checkbox"
                                            name="DeliveredAllOrders"
                                            value={item._id}
                                            onChange={(e) =>
                                              this.changeStatusFrontend(
                                                item._id
                                              )
                                            }
                                            checked={item.frontendCheckedStatus}
                                          />
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>{item.booking_code}</td>
                                      <td>{item.subscriptionCode}</td>
                                      <td>{item.deliverySlot}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.total_payment &&
                                          item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>{item.payment}</td>
                                      <td>{item.billType}</td>
                                      <td>{item.billingCompany?.name}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>
                                        <Moment format="DD/MM/YYYY">
                                          {item.DeliveryDate}
                                        </Moment>
                                      </td>
                                      <td>
                                        <i
                                          className="fa fa-pencil hover-with-cursor"
                                          title="Send for Delivery"
                                          aria-hidden="true"
                                          onClick={() => {
                                            this.setState({
                                              driver_id: item.driver_id._id,
                                            });
                                            this.sendfordelivery(
                                              item,
                                              "driverChange"
                                            );
                                          }}
                                        ></i>
                                        {item.driverName}
                                      </td>

                                      <td className="hover-icon-custom">
                                        {item.driverName && item.user_id && (
                                          <CopyToClipboard
                                            text={
                                              "Hello " +
                                              item.driverName +
                                              ",\nYou have been allotted Krishi Cress Order Number: " +
                                              item.booking_code +
                                              ",\nCustomer Name: " +
                                              (item.user_id.name
                                                ? item.user_id.name
                                                : "") +
                                              ",\nDelivery Address: " +
                                              item.booking_address.address +
                                              ",\nContact Number: " +
                                              (item.user_id.contactNumber
                                                ? item.user_id.contactNumber
                                                : "") +
                                              ",\nLocation : https://www.google.com/maps/place/" +
                                              item.booking_address.latitude +
                                              "," +
                                              item.booking_address.longitude +
                                              ",\nThank you- Team Krishi Cress"
                                            }
                                            onCopy={() =>
                                              swal({
                                                title: "",
                                                text: "Address Copied",
                                              })
                                            }
                                          >
                                            <span
                                              style={{
                                                cursor: "pointer",
                                                color: "#febc15",
                                              }}
                                            >
                                              Copy Address
                                            </span>
                                          </CopyToClipboard>
                                        )}
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye ml-3"
                                          aria-hidden="true"
                                        ></i>
                                        <Link
                                          to={"/admin-edit-order/" + item._id}
                                        >
                                          <i
                                            className="fa fa-pencil"
                                            aria-hidden="true"
                                          ></i>
                                        </Link>
                                        <i
                                          onClick={this.downloadbill.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-print"
                                          aria-hidden="true"
                                        ></i>
                                        <i
                                          className="fa fa-thumbs-o-up hover-with-cursor m-r-5"
                                          title="Mark as Delivered"
                                          onClick={this.openMarkAsDelivery.bind(
                                            this,
                                            item
                                          )}
                                          aria-hidden="true"
                                        ></i>

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
                                      colSpan="9"
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
                                      You haven't recieved any orders yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </>
                          ) : (
                            <></>
                          )}
                          {this.state.order_status_show ===
                          "Payment_Pending" ? (
                            <>
                              <thead>
                                <tr>
                                  {" "}
                                  {/* <th
                                    scope="col"
                                    className="select-all-checkbox"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={this.state.acceptedOrderStatus}
                                      onChange={() => this.selectAllOrders()}
                                    />
                                  </th> */}
                                  <th scope="col">Date</th>
                                  <th scope="col">Order Id</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Bill Type</th>
                                  <th scope="col">Billing Company</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Delivery Date</th>
                                  <th scope="col">Driver Name</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      {/* <td className="select-all-checkbox">
                                        <input
                                          type="checkbox"
                                          name="acceptedAllOrders"
                                          value={item._id}
                                          onChange={(e) =>
                                            this.changeStatusFrontend(item._id)
                                          }
                                          checked={item.frontendCheckedStatus}
                                        />
                                      </td> */}
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>{item.booking_code}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.total_payment &&
                                          item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>{item.billType}</td>
                                      <td>{item.billingCompany?.name}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>
                                        <Moment format="DD/MM/YYYY">
                                          {item.DeliveryDate}
                                        </Moment>
                                      </td>
                                      <td>{item.driverName}</td>
                                      <td className="hover-icon-custom">
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        ></i>
                                        {/*  */}
                                        <Link
                                          to={"/admin-edit-order/" + item._id}
                                        >
                                          <i
                                            className="fa fa-pencil"
                                            aria-hidden="true"
                                          ></i>
                                        </Link>
                                        <i
                                          className="fa fa-thumbs-o-up hover-with-cursor m-r-5"
                                          title="Order Completed"
                                          onClick={this.OpenPaymentStatusByAdmin.bind(
                                            this,
                                            item,
                                            true
                                          )}
                                          aria-hidden="true"
                                        ></i>
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
                                      colSpan="9"
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
                                      You haven't recieved any orders yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </>
                          ) : (
                            <></>
                          )}
                          {this.state.order_status_show === "credit_payment" ? (
                            <>
                              <thead>
                                <tr>
                                  {" "}
                                  {/* <th
                                    scope="col"
                                    className="select-all-checkbox"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={this.state.acceptedOrderStatus}
                                      onChange={() => this.selectAllOrders()}
                                    />
                                  </th> */}
                                  <th scope="col">Date</th>
                                  <th scope="col">Order Id</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Bill Type</th>
                                  <th scope="col">Billing Company</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Delivery Date</th>
                                  <th scope="col">Driver Name</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.orderdata &&
                                this.state.orderdata.length > 0 ? (
                                  this.state.orderdata.map((item, Index) => (
                                    <tr key={Index}>
                                      {/* <td className="select-all-checkbox">
                                        <input
                                          type="checkbox"
                                          name="acceptedAllOrders"
                                          value={item._id}
                                          onChange={(e) =>
                                            this.changeStatusFrontend(item._id)
                                          }
                                          checked={item.frontendCheckedStatus}
                                        />
                                      </td> */}
                                      <td>
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {item.createDate}
                                        </Moment>
                                      </td>
                                      <td>{item.booking_code}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.total_payment &&
                                          item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>{item.billType}</td>
                                      <td>{item.billingCompany?.name}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>
                                        <Moment format="DD/MM/YYYY">
                                          {item.DeliveryDate}
                                        </Moment>
                                      </td>
                                      <td>{item.driverName}</td>
                                      <td className="hover-icon-custom">
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        ></i>
                                        <Link
                                          to={"/admin-edit-order/" + item._id}
                                        >
                                          <i
                                            className="fa fa-pencil"
                                            aria-hidden="true"
                                          ></i>
                                        </Link>
                                        <i
                                          onClick={this.downloadbill.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-print"
                                          aria-hidden="true"
                                        ></i>
                                        <i
                                          className="fa fa-thumbs-o-up hover-with-cursor m-r-5"
                                          title="Order Completed"
                                          onClick={this.OpenPaymentStatusByAdmin.bind(
                                            this,
                                            item,
                                            false
                                          )}
                                          aria-hidden="true"
                                        ></i>

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
                                      colSpan="9"
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
                                      You haven't recieved any orders yet.
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
                                  <th scope="col">Date of payment</th>
                                  <th scope="col">Order Id</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Bill Type</th>
                                  <th scope="col">Billing Company</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Delivery Date</th>
                                  <th scope="col">Driver Name</th>
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

                                      <td>
                                        {item.paymentDateByAdmin ? (
                                          <Moment format="DD/MM/YYYY hh:mm:ss A">
                                            {item.paymentDateByAdmin}
                                          </Moment>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                      <td>{item.booking_code}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.total_payment &&
                                          item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>{item.billType}</td>
                                      <td>{item.billingCompany?.name}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td>
                                        <Moment format="DD/MM/YYYY">
                                          {item.DeliveryDate}
                                        </Moment>
                                      </td>
                                      <td>{item.driverName}</td>
                                      <td className="hover-icon-custom">
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        ></i>
                                        {/* <Link
                                          to={"/admin-edit-order/" + item._id}
                                        >
                                          <i
                                            className="fa fa-pencil"
                                            aria-hidden="true"
                                          ></i>
                                        </Link> */}
                                        <i
                                          onClick={this.downloadbill.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-print"
                                          aria-hidden="true"
                                        ></i>

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
                                      colSpan="9"
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
                                      You haven't recieved any orders yet.
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
                                  <th scope="col">Order Id</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Bill Type</th>
                                  <th scope="col">Billing Company</th>
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
                                      <td>{item.booking_code}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.total_payment &&
                                          item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>{item.billType}</td>
                                      <td>{item.billingCompany?.name}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td className="hover-icon-custom">
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        ></i>
                                        <i
                                          onClick={this.downloadbill.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-print"
                                          aria-hidden="true"
                                        ></i>

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
                                      colSpan="9"
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
                                      You haven't recieved any orders yet.
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
                                  <th scope="col">Order Id</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Type Of User</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Bill Type</th>
                                  <th scope="col">Billing Company</th>
                                  <th scope="col">Contact</th>
                                  <th scope="col">Paytm Response</th>
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
                                      <td>{item.booking_code}</td>
                                      <td>
                                        {item.user_id ? item.user_id.name : ""}
                                      </td>
                                      <td
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.userType ? item.userType : ""}
                                      </td>
                                      <td>
                                        {item.total_payment &&
                                          item.total_payment.toFixed(2)}
                                      </td>
                                      <td>{item.paymentmethod}</td>
                                      <td>{item.billType}</td>
                                      <td>{item.billingCompany?.name}</td>
                                      <td>
                                        {item.user_id
                                          ? item.user_id.contactNumber
                                          : ""}
                                      </td>
                                      <td className="text-center">
                                        {item.RESPMSG ? (
                                          <i
                                            className="fa fa-info"
                                            aria-hidden="true"
                                            style={{
                                              cursor: "pointer",
                                              padding: "0px 4px",
                                            }}
                                            onClick={() =>
                                              swal({ text: item.RESPMSG })
                                            }
                                          ></i>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                      <td className="hover-icon-custom">
                                        <button
                                          type="button"
                                          className="accept"
                                          onClick={() =>
                                            this.acceptFailedOrder(item)
                                          }
                                        >
                                          Accept
                                        </button>
                                        <i
                                          onClick={this.vieworderdetails.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        ></i>
                                        <i
                                          onClick={this.downloadbill.bind(
                                            this,
                                            item
                                          )}
                                          className="fa fa-print"
                                          aria-hidden="true"
                                        ></i>

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
                                      colSpan="9"
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
                                      You haven't recieved any orders yet.
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
                                      <option value={item._id}>
                                        {item.name
                                          ? item.name + " " + item.contactNumber
                                          : item.contactNumber}
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
                              Customer Mobile Number
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
                                    <li>
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
                                                    {this.state[item._id]
                                                      ? this.state[item._id]
                                                      : 1}
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
                                                          (i) => {
                                                            return (
                                                              <option>
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
                                                          (i) => {
                                                            return (
                                                              <option>
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
                    ? this.state.allsingledata.bookingdetail.map((item) =>
                        item.simpleItem ? (
                          <>
                            <div className="order_details">
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
              className="new_cal_des"
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
                    <h4 className="modal-title">Update Order Delivery date</h4>
                    <div className="modal-form-bx">
                      <div className="view-box">
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Status</label>
                          </div>
                          <div className="modal-right-bx">
                            {this.state.subscriptionPendingOrder ? (
                              <Moment format="DD/MM/YYYY">
                                {this.state.newdatetime}
                              </Moment>
                            ) : (
                              <DatePicker
                                onChange={(ev) => this.ontimechange(ev)}
                                value={this.state.newdatetime}
                              />
                            )}
                          </div>
                        </div>
                      </div>
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
                <div role="dialog">
                  <div className="modal-dialog our_order_new new_des_apr9">
                    <div className="modal-content default_form_design">
                      <div>
                        <h4 className="modal-title">
                          <span>{this.state.order_detail.booking_code}</span>
                          <span className="capitalize">
                            {this.state.order_detail.BookingStatusByAdmin}
                          </span>
                        </h4>
                        <span>
                          <Moment format="DD/MM/YYYY hh:mm:ss A">
                            {this.state.order_detail.createDate}
                          </Moment>
                        </span>
                        <button
                          type="button"
                          className="close"
                          onClick={this.closeordermodel}
                        >
                          &times;
                        </button>
                      </div>
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>Delivery Slot</label>
                        </div>
                        <div className="modal-right-bx">
                          {this.state.order_detail.deliverySlot || ""}
                        </div>
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
                                          <div className="flex">
                                            <div className="left_main_card_new">
                                              <Link
                                                to={"/product/" + item.slug}
                                              >
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
                                                  style={{ maxWidth: "80%" }}
                                                />
                                              </Link>
                                            </div>
                                            <div className="right_main_card_new">
                                              <div className="new_pro_custommer">
                                                {" "}
                                                <span>
                                                  <Link
                                                    to={"/product/" + item.slug}
                                                    style={{ color: "#febc15" }}
                                                  >
                                                    {item.product_name}
                                                  </Link>
                                                  {item.TypeOfProduct ===
                                                    "simple" && (
                                                    <span>
                                                      {!item.without_package
                                                        ? item.packetLabel
                                                        : item.unitQuantity +
                                                          " " +
                                                          (item.unitMeasurement
                                                            ?.name ||
                                                            item.unitMeasurement ||
                                                            "")}
                                                    </span>
                                                  )}
                                                </span>
                                                <span>
                                                  ₹
                                                  {item.itemWiseGst
                                                    ? (
                                                        +item.totalprice -
                                                        +item.itemWiseGst
                                                      ).toFixed(2)
                                                    : item.totalprice}
                                                </span>{" "}
                                              </div>
                                              <div>
                                                <span>Quantity {item.qty}</span>
                                              </div>
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
                                Billing Details
                              </label>
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
                                    {
                                      this.state.order_detail.booking_address
                                        .address
                                    }
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
                                  <span style={{ fontWeight: "600" }}>
                                    Name
                                  </span>
                                  <span>
                                    {this.state.order_detail &&
                                    this.state.order_detail.giftingName
                                      ? this.state.order_detail.giftingName
                                      : "--"}
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
                                <div className="flex_justify border_bottom">
                                  <span style={{ fontWeight: "600" }}>
                                    Address
                                  </span>
                                  <span>
                                    {this.state.order_detail.giftingAddress &&
                                      this.state.order_detail.giftingAddress
                                        .address}
                                  </span>
                                </div>
                                <div className="flex_justify border_bottom"></div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {this.state.order_detail.delivery_instructions ? (
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label style={{ fontWeight: "600" }}>
                                  Delivery Instructions
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
                                  <span>
                                    {
                                      this.state.order_detail
                                        .delivery_instructions
                                    }
                                  </span>
                                </p>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
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
                                {this.state.order_detail.paymentmethod} -{" "}
                                <span>{this.state.order_detail.payment}</span>
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
              ) : (
                ""
              )}
            </Modal>
            {/* // order modal end */}
            <Modal
              isOpen={this.state.sento_delivery}
              onRequestClose={this.closesendtodel}
              style={customStyles}
              className="delivery-send-pp"
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
                    <h4 className="modal-title">Assign Driver</h4>
                    <div className="modal-form-bx">
                      <div className="view-box">
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
                          <div
                            className="err select_driver_error"
                            style={{ margin: "20px 5px" }}
                          ></div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (this.state.sendingAllOrders) {
                            this.updatestatusoutfordelForAllOrders();
                          } else {
                            this.updatestatusoutfordel();
                          }
                        }}
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            {/*Mark As deliveredPopup */}
            <Modal
              isOpen={this.state.openMarkAsDeliveryPopup}
              onRequestClose={this.closeMarkAsDelivery}
              style={customStyles}
              contentLabel="Edit Modal"
            >
              <div role="dialog driver_oreder">
                <div className="modal-dialog driver_order_detail">
                  <div className="modal-content">
                    <button
                      type="button"
                      className="close"
                      onClick={this.closeMarkAsDelivery}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Mark As Delivered</h4>
                    <div className="modal-form-bx">
                      <div className="view-box">
                        {this.state.markAsDeliveryData?.payment
                          ?.toLowerCase()
                          .includes("complete") ? (
                          <div className="form-group mt-4">
                            <div className="modal-left-bx">
                              <label>Are you sure you want to Proceed?</label>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Payment Status</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="radio"
                                  name="markAsDeliveredPaymentStatus"
                                  id=""
                                  value="Pending"
                                  onChange={this.formHandler1}
                                />
                                <label>Pending</label>
                                <br />
                                <input
                                  type="radio"
                                  name="markAsDeliveredPaymentStatus"
                                  id=""
                                  value="Complete"
                                  onChange={this.formHandler1}
                                />
                                <label>Completed</label>
                              </div>
                              <div
                                className="err select_markAsDeliveredPaymentStatus"
                                style={{ margin: "20px 5px" }}
                              ></div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Date</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="date"
                                  name="paymentstatusbyadmin"
                                  onChange={this.formHandler1}
                                />
                              </div>
                              <div
                                className="err select_markAsDeliveredPaymentStatus"
                                style={{ margin: "20px 5px" }}
                              ></div>
                            </div>
                          </>
                        )}{" "}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (this.state.sendingAllOrdersToCompleted) {
                            this.bulkDelivered(this.state.markAsDeliveryData);
                          } else {
                            this.delievered(this.state.markAsDeliveryData);
                          }
                        }}
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            {/* ens send to delivery */}

            {/*Payment Status By admin start*/}
            <Modal
              isOpen={this.state.OpenPaymentStatusByAdmin}
              onRequestClose={this.ClosePaymentStatusByAdmin}
              style={customStyles}
              contentLabel="Edit Modal"
            >
              <div role="dialog driver_oreder">
                <div className="modal-dialog driver_order_detail">
                  <div className="modal-content">
                    <button
                      type="button"
                      className="close"
                      onClick={this.ClosePaymentStatusByAdmin}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Payment Recieved Date</h4>
                    <div className="modal-form-bx">
                      <div className="view-box">
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Payment Date</label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="date"
                              name="paymentstatusbyadmin"
                              onChange={this.formHandler1}
                            />
                          </div>
                          <div
                            className="err select_markAsDeliveredPaymentStatus"
                            style={{ margin: "20px 5px" }}
                          ></div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={
                          this.state.BulkPaymentStatus
                            ? this.bulkPaymentComplete.bind(this)
                            : this.ordernowcompleted.bind(
                                this,
                                this.state.Payment_Status_byadmin_data
                              )
                        }
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            {/* end payment status by admin */}

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
