import moment from "moment";
import React, { Component } from "react";
import Pagination from "react-js-pagination";
import SelectSearch from "react-select-search";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
import Adminfooter from "../elements/admin_footer";
import Adminheader from "../elements/admin_header";
import Adminsiderbar from "../elements/admin_sidebar";

export default class wallet extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      modalIsOpen: false,
      editmodalIsOpen: false,
      show: false,
      mdl_layout__obfuscator_hide: false,
      admin_id: "",
      name: "",
      status: true,
      data: [],
      edit_data: [],
      data1: [],
      primary_id: "",
      id: "",
      edit_category_name: "",
      count: 1,
      skip: 0,
      limit: 20,
      currentPage: 1,
      date_search: "",
      payment_status: "",
      status_search: "",
      username_search: "",
      usercontact_search: "",
      useremail_search: "",
      useramount_search: "",
      active_customers: [],
    };

    this.openModal = this.openModal.bind(this);
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
    this.alluserbrief = this.alluserbrief.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;
    this.getcustomerfilter(skip);
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true, edit_status: true });
    } else {
      this.setState({ status: false, edit_status: false });
    }
  }

  add() {
    var name = this.state.name;
    var email = this.state.email;
    var mobile = this.state.mobile_number;
    var address = this.state.address;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    var add_status = true;
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
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
    } else if (isNaN(mobile)) {
      add_status = false;
      valueErr = document.getElementsByClassName("err_mobile_number");
      valueErr[0].innerText = "Enter Numeric Value";
    }

    if (name && email && mobile && add_status === true) {
      const requestData = {
        name: name,
        email: email,
        mobile: mobile,
        address: address,
      };

      AdminApiRequest(requestData, "/admin/addDriver", "POST")
        .then((res) => {
          if (res.data.message === "error") {
            if (res.data.result[0].name) {
              valueErr = document.getElementsByClassName("err_name");
              valueErr[0].innerText = res.data.result[0].name;
            }
            if (res.data.result[0].email) {
              valueErr = document.getElementsByClassName("err_email");
              valueErr[0].innerText = res.data.result[0].name;
            }
            if (res.data.result[0].mobile) {
              valueErr = document.getElementsByClassName("err_mobile_number");
              valueErr[0].innerText = res.data.result[0].name;
            }
          } else {
            this.alluserbrief();
            swal({
              title: "Driver Created Successfully",
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
    var name = this.state.edit_name;
    var email = this.state.edit_email;
    var mobile = this.state.edit_mobile;
    var address = this.state.edit_address;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    var add_status = true;
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!name) {
      valueErr = document.getElementsByClassName("err_edit_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!email) {
      valueErr = document.getElementsByClassName("err_edit_email");
      valueErr[0].innerText = "This Field is Required";
    } else if (!email.match(mailformat)) {
      add_status = false;
      valueErr = document.getElementsByClassName("err_edit_email");
      valueErr[0].innerText = "Enter valid email address";
    }
    if (!mobile) {
      valueErr = document.getElementsByClassName("err_edit_mobile");
      valueErr[0].innerText = "This Field is Required";
    } else if (isNaN(mobile)) {
      add_status = false;
      valueErr = document.getElementsByClassName("err_mobile_number");
      valueErr[0].innerText = "Enter Numeric Value";
    }

    if (name && email && mobile && add_status === true) {
      const requestData = {
        _id: this.state.edit_id,
        name: name,
        email: email,
        mobile: mobile,
        address: address,
        status: this.state.edit_status,
      };

      AdminApiRequest(requestData, "/admin/UpdateDriver", "POST")
        .then((res) => {
          if (res.data.status === "error") {
            valueErr = document.getElementsByClassName("err_edit_email");
            valueErr[0].innerText = res.data.result[0].name;
          } else {
            this.alluserbrief();
            swal({
              title: "Driver Updated Successfully",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.setState({
              loading: false,
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
        const requestData = {
          _id: id,
        };

        AdminApiRequest(requestData, "/admin/deleteDriver", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              this.alluserbrief();
              this.setState({
                loading: false,
              });
              swal({
                title: "Success",
                text: "Record Deleted Successfully !",
                icon: "success",
                successMode: true,
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
        // deletesupplier(id)
        // .then((res) => {
        //     this.setState({
        //         data1: res.data,
        //     })
        //     viewsupplier()
        // .then((res) => {
        //     this.setState({
        //         data: res.data
        //     })
        //     console.log(res.data[0].name);

        // })
        // .catch((error) => {
        //     alert(error)
        // })
        //     swal({
        //          title: "Success",
        //          text: "Record Deleted Successfully !",
        //          icon: "success",
        //          successMode: true,
        //         })
        //    console.log(res.data);
        // })
        // .catch((error) => {
        //     alert(error)
        // })
      }
    });
  }

  editopenModal(data) {
    this.setState({
      editmodalIsOpen: true,
      edit_id: data._id,
      edit_name: data.name,
      edit_email: data.email,
      edit_mobile: data.mobile,
      edit_address: data.address,
      edit_status: data.status,
      mdl_layout__obfuscator_hide: false,
    });
  }

  viewopenModal(data) {
    this.setState({
      viewdata: data,
    });
    this.setState({ show: true });
    this.setState({ mdl_layout__obfuscator_hide: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  editcloseModal() {
    this.setState({ editmodalIsOpen: false });
  }
  viewcloseModal() {
    this.setState({ show: false });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }

  componentDidMount() {
    this.alluserbrief();
    AdminApiRequest({}, "/admin/getAllUsersBrief ", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          const active = res.data.data.map((item) => {
            return {
              value: item._id,
              name: item.name,
            };
          });
          setTimeout(() => {
            this.setState({
              active_customers: active,
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
    this.setState({
      status: false,
    });
  }
  alluserbrief() {
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
    };

    AdminApiRequest(requestData, "/admin/wallet/getAllTransactions", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
            count: res.data.count,
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
  }

  searchInputFunction = (e) => {};
  //search
  formHandler1(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  getcustomerfilter = (skipParam) => {
    const requestData = {
      skip: skipParam ? skipParam : 0,
      limit: this.state.limit,
      date: this.state.date_search,
      // mobile: this.state.payment_status,
      customer_id: this.state.username_search.value,
      // userName: this.state.username_search.value,
      userMobile: this.state.usercontact_search,
      userEmail: this.state.useremail_search,
      amount: this.state.useramount_search,
      paymentStatus: this.state.payment_status,
    };
    AdminApiRequest(requestData, "/admin/wallet/getAllTransactions", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
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
    this.alluserbrief();
    this.setState({
      date_search: "",
      username_search: "",
      usercontact_search: "",
      useremail_search: "",
      useramount_search: "",
      // status_search: "",
      // date_search: "",
      payment_status: "",
      // status_search: "",
      skip: 0,
      limit: 20,
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
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 ml-auto mr-auto">
                  <div className="card">
                    <div className="card-header card-header-primary card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">category</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="manage_up_add_btn">
                        <h4 className="card-title">Wallet</h4>

                        {/* <button
                          className="btn btn-primary m-r-5 float-right"
                          onClick={this.openModal}
                        >
                          {" "}
                          <i className="fa fa-plus"></i> Add Driver{" "}
                        </button> */}
                      </div>
                      <div className="searching-every searching-7-col popup-arrow-select span select">
                        <span>
                          <input
                            type="date"
                            name="date_search"
                            value={this.state.date_search}
                            className="form-control"
                            onChange={this.formHandler1}
                          ></input>
                        </span>
                        <span>
                          <select
                            name="payment_status"
                            value={this.state.payment_status}
                            className="form-control"
                            onChange={this.formHandler1}
                          >
                            <option value="">Payment Status</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                          </select>
                        </span>
                        <span>
                          <SelectSearch
                            placeholder={
                              this.state.active_customers &&
                              this.state.active_customers.length > 0
                                ? "Name"
                                : "Loading..."
                            }
                            name="username_search"
                            options={this.state.active_customers}
                            onChange={(e) => {
                              this.setState({
                                username_search: e,
                              });
                            }}
                            value={this.state.username_search.value}
                            className="select-search"
                          />
                        </span>
                        <span>
                          <input
                            type="number"
                            name="usercontact_search"
                            value={this.state.usercontact_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="Contact Number"
                          ></input>
                        </span>
                        <span>
                          <input
                            type="email"
                            name="useremail_search"
                            value={this.state.useremail_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="Email"
                          ></input>
                        </span>
                        <span>
                          <input
                            type="number"
                            name="useramount_search"
                            value={this.state.useramount_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="Amount"
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
                            onClick={() => this.resetFilters()}
                            className="btn btn-primary m-r-5"
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
                              <th scope="col">Date</th>
                              <th scope="col">Payment Status</th>
                              <th scope="col">Name</th>
                              <th scope="col">Contact Number</th>
                              <th scope="col">Email</th>
                              <th scope="col">Amount</th>
                              <th scope="col"> Bank</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.data.length > 0 ? (
                              this.state.data.map((data, Index) => (
                                <tr key={Index}>
                                  <td>
                                    {moment(data.created_at).format("LLL")}
                                  </td>
                                  <td style={{ textTransform: "capitalize" }}>
                                    {data.paymentStatus}
                                  </td>
                                  <td>
                                    {data.user_id ? data.user_id.name : ""}
                                  </td>
                                  <td>
                                    {data.user_id
                                      ? data.user_id.contactNumber
                                      : ""}
                                  </td>
                                  <td>
                                    {data.user_id ? data.user_id.email : ""}
                                  </td>
                                  <td
                                    style={{
                                      color:
                                        data.type === "debit" ? "red" : "green",
                                    }}
                                  >
                                    {data.type === "debit"
                                      ? -data.amount
                                      : +data.amount}
                                  </td>
                                  <td>{data.BANKNAME}</td>
                                </tr>
                              ))
                            ) : (
                              <tr className="text-center">
                                <td colSpan="7">No Data Found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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
          </div>
        </div>
        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
