import React, { Component } from "react";
import Pagination from "react-js-pagination";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import Moment from "react-moment";
import SelectSearch from "react-select-search";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { imageUrl } from "../../imageUrl";
import DynamicUrl from "../../main_url";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";
import CustomerAddress from "./CustomerAddress";

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

export default class Customer extends Component {
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
      show: false,
      mdl_layout__obfuscator_hide: false,
      status: true,
      customer: [],
      customer_order_data: [],
      customer_single_data: "",
      skip: 0,
      count: 1,
      limit: 20,
      currentPage: 1,
      customer_name: "",
      customer_email: "",
      customer_mobile: "",
      user_name_search: "",
      user_mobile_search: "",
      user_email_search: "",
      status_search: "",
      active_customers: [],
      edit_gst_number: "",
      edit_user_type: "",
      creditPaymentOnOff: false,
      gst_number: "",
    };

    this.openModal = this.openModal.bind(this);
    this.vieworderdetails = this.vieworderdetails.bind(this);
    this.closeordermodel = this.closeordermodel.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editopenModal = this.editopenModal.bind(this);
    this.editcloseModal = this.editcloseModal.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
    this.getcustomerfilter = this.getcustomerfilter.bind(this);
    this.downloadbill = this.downloadbill.bind(this);
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChangeStatus(checked, nameOfStatus) {
    if (nameOfStatus === "add") {
      this.setState({ status: checked });
    } else if (nameOfStatus === "edit") {
      this.setState({ edit_status: checked });
    }
  }

  formHandler1(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  vieworderdetails(ev, dt) {
    console.log("qwertyui", ev);
    this.setState({
      order_detail: ev,
      userAddress:
        typeof ev.booking_address === "object"
          ? ev.booking_address
          : JSON.parse(ev.booking_address),
    });
    console.log("open modal ==>>", ev, dt);
    this.setState({ vieworderdetails: true });
  }
  downloadbill(ev) {
    console.log("evevevev", ev);
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
  closeordermodel() {
    this.setState({ vieworderdetails: false });
  }

  add() {
    var name = this.state.name ? this.state.name : "";
    var email = this.state.email ? this.state.email : "";
    var mobile = this.state.mobile ? this.state.mobile : "";
    var user_type = this.state.user_type ? this.state.user_type : "";
    var status = this.state.status ? this.state.role_id : "";
    var gst_number = this.state.gst_number ? this.state.gst_number : "";
    var creditLimit = this.state.creditLimit ? this.state.creditLimit : 0;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    var add_status = true;
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var gstinformat = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
    var status = true;
    if (gst_number) {
      if (gstinformat.test(gst_number)) {
      } else {
        status = false;
        valueErr = document.getElementsByClassName("err_gst_number");
        valueErr[0].innerText = "Enter a valid GSTTIN Number";
      }
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!user_type) {
      valueErr = document.getElementsByClassName("err_user_type");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!email) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "This Field is Required";
    } else if (!email.match(mailformat)) {
      add_status = false;
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "Enter valid email address";
    }
    if (!mobile) {
      valueErr = document.getElementsByClassName("err_mobile_number");
      valueErr[0].innerText = "This Field is Required";
    } else if (!mobile.match(/^[1-9]{1}[0-9]{9}$/)) {
      add_status = false;
      valueErr = document.getElementsByClassName("err_mobile_number");
      valueErr[0].innerText = "Please Enter Valid Number";
    }

    if (
      name &&
      email &&
      mobile &&
      mobile.match(/^[1-9]{1}[0-9]{9}$/) &&
      add_status === true &&
      user_type &&
      status === true
    ) {
      const requestData = {
        adminID: this.state.admin_data._id,
        name: name,
        email: email,
        contactNumber: mobile,
        user_type: user_type,
        status: status,
        gst_number: gst_number,
        creditLimit,
      };

      AdminApiRequest(requestData, "/admin/userCreateByAdmin", "POST")
        .then((res) => {
          if (res.data.message == "error" || res.data.status == "error") {
            if (res.data.result[0].name) {
              valueErr = document.getElementsByClassName("err_name");
              valueErr[0].innerText = res.data.result[0].name;
            }
            if (res.data.result[0].email) {
              valueErr = document.getElementsByClassName("err_email");
              valueErr[0].innerText = res.data.result[0].name
                ? res.data.result[0].name
                : res.data.result[0].email;
            }
            if (res.data.result[0].mobile || res.data.result[0].contactNumber) {
              valueErr = document.getElementsByClassName("err_mobile_number");
              valueErr[0].innerText = res.data.result[0].name
                ? res.data.result[0].name
                : res.data.result[0].contactNumber;
            }
          } else {
            this.getcustomer();
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

  edit() {
    var name = this.state.edit_name ? this.state.edit_name : "";
    var edit_mobile = this.state.edit_mobile
      ? this.state.edit_mobile.toString()
      : "";
    var email = this.state.edit_email ? this.state.edit_email : "";
    var status = this.state.edit_status ? this.state.edit_status : "";
    var edit_id = this.state.edit_id ? this.state.edit_id : "";
    var gst_number = this.state.edit_gst_number
      ? this.state.edit_gst_number
      : "";
    var user_type = this.state.edit_user_type ? this.state.edit_user_type : "";
    var creditLimit = this.state.edit_creditLimit
      ? this.state.edit_creditLimit
      : 0;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    var gstinformat = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
    var status = true;
    if (gst_number) {
      if (gstinformat.test(gst_number)) {
      } else {
        status = false;
        valueErr = document.getElementsByClassName("err_edit_gst_number");
        valueErr[0].innerText = "Enter a valid GSTTIN Number";
      }
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_edit_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!edit_mobile) {
      valueErr = document.getElementsByClassName("err_edit_mobile");
      valueErr[0].innerText = "This Field is Required";
    } else if (edit_mobile.length !== 10) {
      valueErr = document.getElementsByClassName("err_edit_mobile");
      valueErr[0].innerText = "Please Enter Valid Number";
    }
    if (!email) {
      valueErr = document.getElementsByClassName("err_edit_email");
      valueErr[0].innerText = "This Field is Required";
    }
    // if (!creditLimit) {
    //   valueErr = document.getElementsByClassName("err_edit_creditLimit");
    //   valueErr[0].innerText = "This Field is Required";
    // }

    if (
      name &&
      edit_mobile &&
      edit_mobile.length === 10 &&
      email &&
      status === true
      // creditLimit
    ) {
      const requestData = {
        adminID: this.state.admin_data._id,
        user_id: edit_id,
        name: name,
        email: email,
        creditLimit: creditLimit,
        user_type: user_type,
        contactNumber: edit_mobile,
        status: status ? true : false,
        gst_number: gst_number,
      };

      AdminApiRequest(requestData, "/admin/userUpdateByAdmin", "POST")
        .then((res) => {
          if (res.data.status === "error") {
            valueErr = document.getElementsByClassName("err_name");
            valueErr[0].innerText = res.data.result[0].name;
          } else {
            this.getcustomer();
            swal({
              title: "Customer updated Successfully",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.setState({
              loading: false,
              tags: [],
              parentCat_id: "",
              name: "",
              modalIsOpen: false,
              editmodalIsOpen: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  async deleteRecord(id) {
    await swal({
      title: "Delete",
      text: "Delete this record?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const requestData = { _id: id };
        AdminApiRequest(requestData, "/admin/usersDeleteOne", "POST", "")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              swal({
                title: "Success",
                text: "Record Added Successfully !",
                icon: "success",
                successMode: true,
              });
              this.getcustomer();
              this.setState({ modalIsOpen: false });
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
            alert(error);
          });
        // deletecustomer(id)
        //   .then((res) => {
        //     this.setState({
        //       data1: res.data,
        //     });
        //     this.getcustomer();
        //     swal({
        //       title: "Success",
        //       text: "Record Deleted Successfully !",
        //       icon: "success",
        //       successMode: true,
        //     });

        //   })
        //   .catch((error) => {
        //     alert(error);
        //   });
      }
    });
  }

  editopenModal(data) {
    console.log(data);
    this.setState({
      editmodalIsOpen: true,
      edit_name: data.user.name,
      edit_mobile: data.user.contactNumber,
      edit_email: data.user.email,
      edit_id: data.user._id,
      edit_status: data.user.status,
      edit_gst_number: data.user.gst_no,
      edit_user_type: data.user.user_type,
      edit_creditLimit: data.user.creditLimit,
    });
  }

  viewopenModal(data, id) {
    const requestData = {
      user_id: data.user._id,
    };
    AdminApiRequest(requestData, "/admin/TopTenProductsOfUser", "POST")
      .then((res) => {
        console.log(res);
        if (res.status === 201 || res.status === 200) {
          console.log("testingtesttestingtest", res.data);
          this.setState({
            top10products: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({
      customer_single_data: data,
    });
    this.setState({
      loading: false,
    });
  }

  backtohome = () => {
    this.setState({
      customer_single_data: "",
      customer_order_data: "",
    });
  };

  closeModal() {
    this.setState({
      modalIsOpen: false,
      name: "",
      email: "",
      mobile: "",
      user_type: "",
    });
  }

  editcloseModal() {
    this.setState({ editmodalIsOpen: false });
  }

  viewcloseModal() {
    this.setState({ show: false });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;
    this.getcustomerfilter(skip);
    // const requestData = {
    //   skip: skip,
    //   limit: this.state.limit,
    //   name: this.state.customer_name,
    //   email: this.state.customer_email,
    //   contactNumber: this.state.customer_mobile,
    // };
    // AdminApiRequest(requestData, "/admin/AdminUsersGetAll", "POST")
    //   .then((res) => {
    //     console.log(res);
    //     if (res.status === 201 || res.status === 200) {
    //       this.setState({
    //         customer: res.data.data,
    //       });
    //     } else {
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  getcustomer() {
    this.setState({ loading: true });
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
    };
    AdminApiRequest(requestData, "/admin/AdminUsersGetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            customer: res.data.data,
            count: res.data.count,
          });
        } else {
        }
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getcustomer();
    AdminApiRequest({}, "/admin/getAllUsersBrief ", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item) => {
            this.state.active_customers.push({
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
      })
      .catch((error) => {
        console.log(error);
      });

    AdminApiRequest({}, "/storehey/getSetting", "GET")
      .then((res) => {
        if (res.status !== 401 || res.status !== 400) {
          this.setState({
            creditPaymentOnOff: res.data.data[0].creditPaymentOnOff,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //search
  searchHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  getcustomerfilter = (skipParam) => {
    const requestData = {
      skip: skipParam ? skipParam : 0,
      limit: this.state.limit,
      customer_id: this.state.user_name_search.value,
      // name: this.state.user_name_search.value,
      contactNumber: this.state.user_mobile_search,
      email: this.state.user_email_search,
      user_type: this.state.status_search.value,
    };
    AdminApiRequest(requestData, "/admin/AdminUsersGetAll", "POST")
      .then((res) => {
        console.log(res);
        if (res.status === 201 || res.status === 200) {
          this.setState({
            customer: res.data.data,
            count: res.data.count,

            currentPage: skipParam ? this.state.currentPage : 1,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  resetFilters() {
    this.getcustomer();
    this.setState({
      user_name_search: "",
      user_mobile_search: "",
      user_email_search: "",
      status_search: "",
      currentPage: 1,
    });
  }
  render() {
    return (
      <div className="wrapper ">
        <Adminsiderbar />
        <div className="main-panel">
          <Adminheader />
          <div className="content">
            {this.state.customer_single_data ? (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 ml-auto mr-auto">
                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">person_add</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn">
                          <h4 className="card-title"> Customers</h4>

                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={() => this.backtohome()}
                          >
                            {" "}
                            {/* <i className="fa fa-plus"></i> */}
                            Back{" "}
                          </button>
                        </div>

                        <div className="table-responsive">
                          <h3>Personal Details</h3>
                          <div className="form-box new_us_ordr">
                            <p>
                              <span> Name</span>
                              <span>
                                {this.state.customer_single_data.user.name}
                              </span>
                            </p>
                            <p>
                              {" "}
                              <span>Email</span>
                              <span>
                                {this.state.customer_single_data.user.email}
                              </span>
                            </p>
                            <p>
                              <span>Mobile Number</span>
                              <span>
                                {
                                  this.state.customer_single_data.user
                                    .contactNumber
                                }
                              </span>
                            </p>
                            <p>
                              <span>GST Number</span>
                              <span>
                                {this.state.customer_single_data.user.gst_no}
                              </span>
                            </p>
                            <p>
                              <span>User Type</span>
                              <span>
                                {this.state.customer_single_data.user.user_type}
                              </span>
                            </p>
                            <p>
                              <span>Loyalty Point</span>
                              <span>
                                {
                                  this.state.customer_single_data.user
                                    .TotalPoint
                                }
                              </span>
                            </p>
                            <p>
                              <span>Wallet Amount</span>
                              <span>
                                {
                                  this.state.customer_single_data.user
                                    .walletAmount
                                }
                              </span>
                            </p>
                            <p>
                              <span>Total Amount Spent</span>
                              <span>
                                {this.state.customer_single_data.totalAmount}
                              </span>
                            </p>

                            <p>
                              <span>Joining Date</span>
                              <span>
                                <Moment format="DD/MM/YYYY hh:mm:ss A">
                                  {
                                    this.state.customer_single_data.user
                                      .created_at
                                  }
                                </Moment>
                              </span>
                            </p>
                            {this.state.creditPaymentOnOff ? (
                              <>
                                <p>
                                  <span>Total Credit Limit</span>
                                  <span>
                                    {this.state.customer_single_data.user
                                      .creditLimit || 0}
                                  </span>
                                </p>
                                <p>
                                  <span>Credit Due</span>
                                  <span>
                                    {this.state.customer_single_data.user
                                      .creditUsed || 0}
                                  </span>
                                </p>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                          <div style={{ marginTop: 20 }}>
                            <CustomerAddress
                              id={this.state.customer_single_data.user._id}
                            />
                          </div>
                          <h3>
                            Total Past Orders -{" "}
                            {this.state.customer_single_data.details.length
                              ? this.state.customer_single_data.details.length
                              : 0}
                          </h3>

                          <div className="table-responsive">
                            <table
                              id="datatables"
                              className="table table-striped table-no-bordered table-hover"
                              cellSpacing="0"
                              width="100%"
                            >
                              <thead>
                                <tr>
                                  <th scope="col">Order ID</th>
                                  <th scope="col">Order Amount</th>
                                  <th scope="col">Payment Status</th>
                                  <th scope="col">Payment Method</th>
                                  <th scope="col">Delivery Date</th>
                                  <th scope="col">Order Status</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              {this.state.customer_single_data.details &&
                              this.state.customer_single_data.details.length >
                                0 &&
                              this.state.customer_single_data ? (
                                this.state.customer_single_data.details &&
                                this.state.customer_single_data.details.length >
                                  0 &&
                                this.state.customer_single_data ? (
                                  this.state.customer_single_data.details.map(
                                    (item1, Index) => (
                                      <tbody key={Index}>
                                        <tr>
                                          <td
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {item1.booking_code}
                                          </td>
                                          <td>{item1.total_payment}</td>
                                          <td>{item1.payment}</td>
                                          <td>{item1.paymentmethod}</td>
                                          <td>
                                            {item1.DeliveryDate ? (
                                              <Moment format="DD/MM/YYYY">
                                                {item1.DeliveryDate}
                                              </Moment>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                          <td>{item1.BookingStatusByAdmin}</td>
                                          <td>
                                            <i
                                              onClick={this.vieworderdetails.bind(
                                                this,
                                                item1
                                              )}
                                              className="fa fa-eye"
                                              aria-hidden="true"
                                            ></i>
                                            <i
                                              onClick={this.downloadbill.bind(
                                                this,
                                                item1
                                              )}
                                              className="fa fa-print"
                                              aria-hidden="true"
                                            ></i>
                                          </td>
                                        </tr>
                                      </tbody>
                                    )
                                  )
                                ) : (
                                  <span style={{ color: "red" }}>
                                    No Order Yet
                                  </span>
                                )
                              ) : (
                                <span style={{ color: "red" }}>
                                  No Order Yet
                                </span>
                              )}
                            </table>
                          </div>
                          <h3>
                            Frequently Bought Products -{" "}
                            {this.state.top10products
                              ? this.state.top10products.length
                              : 0}
                          </h3>

                          <div className="table-responsive">
                            <table
                              id="datatables"
                              className="table table-striped table-no-bordered table-hover"
                              cellSpacing="0"
                              width="100%"
                            >
                              <thead>
                                <tr>
                                  <th scope="col">S. No.</th>
                                  <th scope="col">Product</th>
                                </tr>
                              </thead>
                              {this.state.top10products &&
                              this.state.top10products.length > 0 ? (
                                this.state.top10products.map((item1, Index) => (
                                  <tbody key={Index}>
                                    <tr>
                                      <td>{Index + 1}</td>
                                      <td
                                        style={{
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {item1.product_name ||
                                          item1.product.product_name}
                                      </td>
                                    </tr>
                                  </tbody>
                                ))
                              ) : (
                                <span style={{ color: "red" }}>
                                  No Order Yet
                                </span>
                              )}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 ml-auto mr-auto">
                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">person_add</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn">
                          <h4 className="card-title"> Customers</h4>

                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={this.openModal}
                          >
                            {" "}
                            <i className="fa fa-plus"></i> Add Customer{" "}
                          </button>
                        </div>
                        <div className="searching-every searching-5-col popup-arrow-select">
                          <span>
                            <SelectSearch
                              placeholder={
                                this.state.active_customers &&
                                this.state.active_customers.length > 0
                                  ? "Customer Name"
                                  : "Loading..."
                              }
                              name="user_name_search"
                              options={this.state.active_customers}
                              onChange={(e) => {
                                this.setState({
                                  user_name_search: e,
                                });
                              }}
                              value={this.state.user_name_search.value}
                              className="select-search"
                            />
                            {/* <input
                              type="text"
                              name="user_name_search"
                              value={this.state.user_name_search}
                              className="form-control"
                              autoComplete="off"
                              onChange={this.formHandler1}
                              placeholder="Customer Name"
                            ></input> */}
                          </span>
                          <span>
                            <input
                              type="text"
                              name="user_mobile_search"
                              value={this.state.user_mobile_search}
                              className="form-control"
                              autoComplete="off"
                              onChange={this.formHandler1}
                              placeholder="Mobile Number"
                            ></input>
                          </span>
                          <span>
                            <input
                              type="text"
                              name="user_email_search"
                              value={this.state.user_email_search}
                              className="form-control"
                              autoComplete="off"
                              onChange={this.formHandler1}
                              placeholder="Email"
                            ></input>
                          </span>
                          <span>
                            <SelectSearch
                              placeholder="User Type"
                              options={[
                                { name: "B2B", value: "b2b" },
                                { name: "USER", value: "user" },
                                { name: "RETAIL", value: "retail" },
                              ]}
                              onChange={(e) =>
                                this.setState({ status_search: e })
                              }
                              value={this.state.status_search.value}
                              className="select-search"
                              name="status_search"
                            />
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
                              onClick={() => this.resetFilters()}
                              className="btn btn-primary m-r-5 reset_button_new"
                            >
                              Reset
                            </button>
                          </span>
                        </div>

                        <div className="table-responsive">
                          <table
                            id="datatables"
                            className="table table-striped table-no-bordered table-hover"
                            cellSpacing="0"
                            width="100%"
                          >
                            <thead>
                              <tr>
                                <th scope="col">Customer Name</th>
                                <th scope="col">Mobile Number</th>
                                <th scope="col">Email</th>
                                <th scope="col">GST Number</th>
                                <th scope="col">User Type</th>
                                <th scope="col">Referral Code</th>
                                <th scope="col">Verified</th>
                                <th scope="col">OTP</th>
                                <th scope="col">Last order</th>
                                <th scope="col">Loyalty Point</th>
                                <th scope="col">Total Order</th>
                                <th scope="col">Total Amount</th>
                                {/* <th scope="col">Credit Limit</th> */}
                                <th scope="col">Joining Date</th>
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.customer &&
                              this.state.customer.length > 0 ? (
                                this.state.customer.map((data, Index) => (
                                  <tr key={Index}>
                                    <td style={{ textTransform: "capitalize" }}>
                                      {data.user.name ? data.user.name : ""}
                                    </td>
                                    <td>
                                      {data.user.contactNumber
                                        ? data.user.contactNumber
                                        : ""}
                                    </td>
                                    <td>
                                      {data.user.email ? data.user.email : ""}
                                    </td>
                                    <td>
                                      {data.user.gst_no ? data.user.gst_no : ""}
                                    </td>
                                    <td style={{ textTransform: "uppercase" }}>
                                      {data.user.user_type
                                        ? data.user.user_type
                                        : ""}
                                    </td>
                                    <td style={{ textTransform: "uppercase" }}>
                                      {data.user.myRefferalCode
                                        ? data.user.myRefferalCode
                                        : ""}
                                    </td>
                                    <td
                                      style={
                                        data.user.otp_verified
                                          ? { color: "green" }
                                          : { color: "red" }
                                      }
                                    >
                                      {data.user.otp_verified
                                        ? "Verified"
                                        : "Not-Verified"}
                                    </td>
                                    <td style={{ textTransform: "uppercase" }}>
                                      {data.user.otp ? data.user.otp : "--"}
                                    </td>
                                    <td>
                                      {data.user.LastOrderDate ? (
                                        <Moment format="DD/MM/YYYY hh:mm:ss A">
                                          {data.user.LastOrderDate}
                                        </Moment>
                                      ) : (
                                        "--"
                                      )}
                                    </td>
                                    <td>{data.user.TotalPoint || 0}</td>
                                    <td>
                                      {data.totalOrder ? data.totalOrder : "--"}
                                    </td>
                                    <td>
                                      {data.totalAmount
                                        ? data.totalAmount.toFixed(2)
                                        : "--"}
                                    </td>
                                    {/* <td>{data.user.creditLimit || 0}</td> */}
                                    <td>
                                      <Moment format="DD/MM/YYYY hh:mm:ss A">
                                        {data.user.created_at}
                                      </Moment>
                                    </td>
                                    <td>
                                      <i
                                        className="fa fa-eye hover-with-cursor m-r-5"
                                        title={
                                          "View Detail's - " + data.user.name
                                        }
                                        onClick={this.viewopenModal.bind(
                                          this,
                                          data,
                                          data._id
                                        )}
                                      ></i>
                                      {/* <Link
                                        to={"/useraddress/" + data.user._id}
                                      >
                                        <i
                                          title={
                                            "View Address's - " + data.user.name
                                          }
                                          className="fa fa-address-card m-r-5"
                                          aria-hidden="true"
                                        ></i>
                                      </Link> */}

                                      <i
                                        title={"Edit - " + data.user.name}
                                        className="fa fa-edit m-r-5"
                                        onClick={this.editopenModal.bind(
                                          this,
                                          data
                                        )}
                                      ></i>
                                      {/* <i
                                        className="fa fa-trash hover-with-cursor m-r-5"
                                        title={"Delete - " + data.user.name}
                                        onClick={this.deleteRecord.bind(
                                          this,
                                          data.user._id
                                        )}
                                      ></i> */}
                                    </td>
                                  </tr>
                                ))
                              ) : this.state.loading ? (
                                <tr>
                                  <td colSpan="9">
                                    <ReactLoading
                                      type={"cylon"}
                                      color={"#febc15"}
                                      height={"60px"}
                                      width={"60px"}
                                      className="m-auto"
                                    />
                                  </td>
                                </tr>
                              ) : (
                                <tr>
                                  <td
                                    colSpan="9"
                                    style={{ textAlign: "center" }}
                                  >
                                    No Data Found
                                  </td>
                                </tr>
                              )}
                            </tbody>
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
                  totalItemsCount={this.state.count}
                  onChange={this.handlePageChange}
                />
              </div>
            )}
            {/* Add model here */}
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles}
              ariaHideApp={false}
              contentLabel="Example Modal"
            >
              <div role="dialog">
                <div className="modal-dialog popup-arrow-select">
                  <div className="modal-content default_form_design">
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
                              Customer Name <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              placeholder="Enter Customer Name"
                              onChange={this.formHandler}
                            />
                            <span className="err err_name"></span>
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
                              type="number"
                              name="mobile"
                              className="form-control"
                              placeholder="Enter Mobile Number"
                              onChange={this.formHandler}
                            />
                            <span className="err err_mobile_number"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Email <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="email"
                              className="form-control"
                              placeholder="Enter Email"
                              onChange={this.formHandler}
                            />
                            <span className="err err_email"></span>
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
                            <span className="err err_edit_email err_user_type"></span>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>GST Number</label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="gst_number"
                              className="form-control"
                              placeholder="Enter GST Number"
                              onChange={this.formHandler}
                            />
                            <span className="err err_gst_number"></span>
                          </div>
                        </div>
                        {this.state.creditPaymentOnOff ? (
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Credit Limit</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="number"
                                name="creditLimit"
                                className="form-control"
                                placeholder="Enter Credit Limit"
                                onChange={this.formHandler}
                              />
                              <span className="err err_creditLimit"></span>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Status</label>
                          </div>
                          <div className="modal-right-bx">
                            <Switch
                              onChange={(e) =>
                                this.handleChangeStatus(e, "add")
                              }
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
            {/* Edit Modal */}
            <Modal
              isOpen={this.state.editmodalIsOpen}
              onRequestClose={this.editcloseModal}
              style={customStyles}
              ariaHideApp={false}
              contentLabel="Example Modal"
            >
              <div role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content default_form_design">
                    <button
                      type="button"
                      className="close"
                      onClick={this.editcloseModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Edit Customer Detail's</h4>
                    <div className="modal-form-bx">
                      <form>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Customer Name <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              value={this.state.edit_name}
                              name="edit_name"
                              className="form-control"
                              placeholder="Enter Customer Name"
                              onChange={this.formHandler}
                            />
                            <span className="err err_edit_name"></span>
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
                              type="number"
                              value={this.state.edit_mobile}
                              name="edit_mobile"
                              className="form-control"
                              placeholder="Enter Mobile Number"
                              onChange={this.formHandler}
                            />
                            <span className="err err_edit_mobile"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Email <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              value={this.state.edit_email}
                              name="edit_email"
                              className="form-control"
                              placeholder="Enter Email"
                              onChange={this.formHandler}
                            />
                            <span className="err err_edit_email"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>GST Number</label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="edit_gst_number"
                              value={this.state.edit_gst_number}
                              className="form-control"
                              placeholder="Enter GST Number"
                              onChange={this.formHandler}
                            />
                            <span className="err err_edit_gst_number"></span>
                          </div>
                        </div>
                        {/* <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              User Type <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <select
                              name="edit_user_type"
                              className="form-control"
                              onChange={this.formHandler}
                              value={this.state.edit_user_type}
                            >
                              <option value="">Select User Type</option>
                              <option value="user">User</option>
                              <option value="b2b">B2B</option>
                              <option value="retail">Retail</option>
                            </select>
                            <span className="err err_edit_email"></span>
                          </div>
                        </div>
                         */}
                        {this.state.creditPaymentOnOff ? (
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Credit limit</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="number"
                                name="edit_creditLimit"
                                value={this.state.edit_creditLimit}
                                className="form-control"
                                placeholder="Enter Credit limit"
                                onChange={this.formHandler}
                              />
                              <span className="err err_edit_creditLimit"></span>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Status</label>
                          </div>
                          <div className="modal-right-bx">
                            <Switch
                              onChange={(e) =>
                                this.handleChangeStatus(e, "edit")
                              }
                              checked={
                                this.state.edit_status === true ? true : false
                              }
                              name="edit_status"
                              id="normal-switch"
                            />
                          </div>
                        </div>
                        <div className="modal-bottom">
                          {/* <button
                            className="btn btn-primary feel-btn"
                            onClick={this.editcloseModal}
                          >
                            Cancel
                          </button> */}
                          <button
                            type="button"
                            className="btn btn-primary feel-btn"
                            onClick={this.edit}
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

            {/* // order modal start */}
            <Modal
              isOpen={this.state.vieworderdetails}
              onRequestClose={this.closeordermodel}
              className="adding-address"
              ariaHideApp={false}
              contentLabel="Add Address"
            >
              {this.state.order_detail ? (
                <div role="dialog">
                  <div className="modal-dialog our_order_new new_des_apr9">
                    <div className="modal-content default_form_design">
                      <div>
                        <h4 className="modal-title">
                          <span>{this.state.order_detail.booking_code}</span>
                          <span>
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
                      <div className="modal-form-bx">
                        <form>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Order items</label>
                            </div>
                            <div className="modal-right-bx">
                              <div className="all_items_new">
                                {
                                  (console.log(
                                    "testingtesting",
                                    this.state.order_detail.bookingdetail
                                  ),
                                  this.state.order_detail.bookingdetail
                                    ? this.state.order_detail.bookingdetail.map(
                                        (item, index) => (
                                          <div className="flex" key={index}>
                                            <div className="left_main_card_new">
                                              <img
                                                src={
                                                  imageUrl +
                                                  item.product_images[0]
                                                }
                                                alt="image"
                                              />
                                            </div>
                                            <div className="right_main_card_new">
                                              <div className="new_pro_custommer">
                                                <span>
                                                  {item.product_name}
                                                  <span>
                                                    {item.packetLabel
                                                      ? item.packetLabel
                                                      : item.unitQuantity +
                                                        " " +
                                                        item.unitMeasurement}
                                                  </span>
                                                </span>
                                                <span>
                                                  <span>
                                                    ₹{item.totalprice}
                                                  </span>{" "}
                                                </span>
                                              </div>
                                              Quantity <span>{item.qty}</span>
                                            </div>
                                          </div>
                                        )
                                      )
                                    : "No Order Available")
                                }
                              </div>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label style={{ fontWeight: "600" }}>
                                Shipping Details
                              </label>
                            </div>
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
                                    (this.state.order_detail.booking_address &&
                                    this.state.order_detail.booking_address
                                      .pincode
                                      ? " - " +
                                        this.state.order_detail.booking_address
                                          .pincode
                                      : "")}
                                </span>
                              )}
                            </div>
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
                                {this.state.order_detail.paymentmethod} -{" "}
                                <span>
                                  {this.state.order_detail.BookingStatusByAdmin}
                                </span>
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
                                  ₹ {this.state.order_detail.totalCartPrice}
                                </span>
                              </div>
                              <div className="flex_justify border_bottom">
                                <span style={{ fontWeight: "600" }}>Tax </span>
                                <span>
                                  ₹ {this.state.order_detail.gst} <br />
                                  {this.state.order_detail.allGstLists &&
                                    this.state.order_detail.allGstLists.map(
                                      (gst, ix) => {
                                        return (
                                          <div key={ix}>
                                            <span>
                                              {gst.tax_name} - ₹{" "}
                                              {gst.totalPrice}
                                            </span>{" "}
                                            <br />
                                          </div>
                                        );
                                      }
                                    )}
                                </span>
                              </div>

                              {this.state.order_detail.couponApplied ? (
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
                              )}
                              <div className="flex_justify border_bottom">
                                <span style={{ fontWeight: "600" }}>
                                  Delivery Charges
                                </span>
                                <span>
                                  ₹ {this.state.order_detail.deliveryCharges}
                                </span>
                              </div>
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
                                <span style={{ fontWeight: "600" }}>Total</span>
                                <span>
                                  ₹ {this.state.order_detail.total_payment}
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
