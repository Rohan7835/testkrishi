import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
import { imageUrl } from "../../../imageUrl";
import Adminfooter from "../elements/admin_footer";
import Adminheader from "../elements/admin_header";
import Adminsiderbar from "../elements/admin_sidebar";

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

export default class Suppplier extends Component {
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
      data1: [],
      primary_id: "",
      id: "",
      edit_attachment: "",
      edit_company_name: "",
      edit_created_at: "",
      edit_email: "",
      edit_gst_no: "",
      edit_name: "",
      edit_paymentTerm: "",
      edit_phone: "",
      edit_returnPolicy: "",
      edit_status: true,
      edit__id: "",
      name_search: "",
      company_name_search: "",
      email_search: "",
      phone_search: "",
      status_search: "",
      count: 1,
      skip: 0,
      limit: 20,
      currentPage: 1,
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
    this.formHandler121 = this.formHandler121.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
      loading: true,
    });
    var skip = (pageNumber - 1) * this.state.limit;

    const requestData = {
      skip: skip,
      limit: this.state.limit,
      name: this.state.name_search,
      company_name: this.state.company_name_search,
      email: this.state.email_search,
      phone: this.state.phone_search,
      status:
        this.state.status_search === "active"
          ? true
          : this.state.status_search === ""
          ? null
          : this.state.status_search === "inactive" && false,
    };
    AdminApiRequest(requestData, "/admin/get/supplier_master", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
            count: res.data.count,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  formHandler121(e, index, type) {}
  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true, edit_status: true });
    } else {
      this.setState({ status: false, edit_status: false });
    }
  }

  add() {
    var data23 = new FormData();
    var name = this.state.name ? this.state.name : "";
    var email = this.state.email ? this.state.email : "";
    var phone = this.state.phone ? this.state.phone : "";
    var gst_no = this.state.gst_no ? this.state.gst_no : "";
    var company_name = this.state.company_name ? this.state.company_name : "";
    var paymentTerm = this.state.paymentTerm ? this.state.paymentTerm : "";
    var returnPolicy = this.state.returnPolicy ? this.state.returnPolicy : "";
    var address = this.state.address ? this.state.address : "";
    var images = [];
    var status = this.state.status;

    data23.append("name", name);
    data23.append("email", email);
    data23.append("phone", phone);
    data23.append("gst_no", gst_no);
    data23.append("company_name", company_name);
    data23.append("paymentTerm", paymentTerm);
    data23.append("returnPolicy", returnPolicy);
    data23.append("address", address);

    if (document.querySelector('input[name="image"]')) {
      var image = document.querySelector('input[name="image"]').files[0];
      data23.append("attachment", image);
    }
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!company_name) {
      valueErr = document.getElementsByClassName("err_company_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!paymentTerm) {
      valueErr = document.getElementsByClassName("err_paymentTerm");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!email) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "This Field is Required";
    }

    // eslint-disable-next-line
    var reEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var validEmail = "on";
    if (email && !email.match(reEmail)) {
      validEmail = "off";
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "Enter Valid E-Mail";
    }

    if (!phone) {
      valueErr = document.getElementsByClassName("err_phone");
      valueErr[0].innerText = "This Field is Required";
    } else if (isNaN(phone)) {
      valueErr = document.getElementsByClassName("err_phone");
      valueErr[0].innerText = "Phone No Should be Numeric";
    } else if (phone.length !== 10) {
      valueErr = document.getElementsByClassName("err_phone");
      valueErr[0].innerText = "Please Enter a Valid number";
    }
    // eslint-disable-next-line
    else if (phone.length != 10) {
      valueErr = document.getElementsByClassName("err_phone");
      valueErr[0].innerText = "Enter Valid Mobile Number";
    }
    if (
      name &&
      phone &&
      email &&
      phone.length === 10 &&
      validEmail === "on" &&
      company_name &&
      paymentTerm
    ) {
      AdminApiRequest(data23, "/admin/supplier_master", "POST", "apiWithImage")
        .then((res) => {
          if (res.data.status == "error" || res.data.message == "error") {
            if (res.data.data[0].email) {
              valueErr = document.getElementsByClassName("err_email");
              valueErr[0].innerText = res.data.data[0].email;
            }
            if (res.data.data[0].phone) {
              valueErr = document.getElementsByClassName("err_phone");
              valueErr[0].innerText = res.data.data[0].phone;
            }
          } else {
            swal({
              title: "Success",
              text: "Record Updated Successfully !",
              icon: "success",
              successMode: true,
            });
            const requestData = {};
            AdminApiRequest(requestData, "/admin/supplier_master", "GET")
              .then((res) => {
                if (res.status === 201 || res.status === 200) {
                  this.setState({
                    data: res.data.data,
                    count: res.data.count,
                  });
                } else {
                }
              })
              .catch((error) => {
                console.log(error);
              });
            this.setState({
              modalIsOpen: false,
              editstatus: false,
              addstatus: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  edit() {
    var data23 = new FormData();
    var edit_company_name = this.state.edit_company_name
      ? this.state.edit_company_name
      : "";
    var edit_email = this.state.edit_email ? this.state.edit_email : "";
    var edit_gst_no = this.state.edit_gst_no ? this.state.edit_gst_no : "";
    var edit_name = this.state.edit_name ? this.state.edit_name : "";
    var edit_paymentTerm = this.state.edit_paymentTerm
      ? this.state.edit_paymentTerm
      : "";
    var edit_phone = this.state.edit_phone
      ? typeof this.state.edit_phone === "number"
        ? this.state.edit_phone.toString()
        : this.state.edit_phone
      : "";
    var edit_returnPolicy = this.state.edit_returnPolicy
      ? this.state.edit_returnPolicy
      : "";
    var edit_status = this.state.edit_status ? this.state.edit_status : "";
    var edit_address = this.state.edit_address ? this.state.edit_address : "";
    var edit__id = this.state.edit__id ? this.state.edit__id : "";

    data23.append("id", edit__id);
    data23.append("name", edit_name);
    data23.append("email", edit_email);
    data23.append("phone", edit_phone);
    data23.append("gst_no", edit_gst_no);
    data23.append("company_name", edit_company_name);
    data23.append("paymentTerm", edit_paymentTerm);
    data23.append("returnPolicy", edit_returnPolicy);
    data23.append("address", edit_address);
    data23.append("status", edit_status);

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!edit_name) {
      valueErr = document.getElementsByClassName("err_edit_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!edit_email) {
      valueErr = document.getElementsByClassName("err_edit_email");
      valueErr[0].innerText = "This Field is Required";
    }
    // eslint-disable-next-line
    var reEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var validEmail = "on";
    if (edit_email && !edit_email.match(reEmail)) {
      validEmail = "off";
      valueErr = document.getElementsByClassName("err_edit_email");
      valueErr[0].innerText = "Enter Valid E-Mail";
    }
    if (!edit_phone) {
      valueErr = document.getElementsByClassName("err_edit_phone");
      valueErr[0].innerText = "This Field is Required";
    }
    if (edit_phone.length != 10) {
      valueErr = document.getElementsByClassName("err_edit_phone");
      valueErr[0].innerText = "Enter 10 Digit Number";
    }
    if (!edit_company_name) {
      valueErr = document.getElementsByClassName("err_edit_company_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (
      edit_name &&
      validEmail === "on" &&
      edit_phone &&
      edit_company_name &&
      edit_phone.length == 10
    ) {
      AdminApiRequest(
        data23,
        "/admin/update/supplier_master",
        "POST",
        "apiWithImage"
      )
        .then((res) => {
          if (res.data.message == "error") {
            var keys = Object.keys(res.result[0]);
            var values = Object.values(res.result[0]);
            for (var i = 0; i < keys.length; i++) {
              valueErr = document.getElementsByClassName("err_" + keys[i]);
              valueErr[0].innerText = values[i];
            }
          } else {
            this.getAllSupplier();
            swal({
              title: "Success",
              text: "Record Updated Successfully !",
              icon: "success",
              successMode: true,
            });
            this.setState({
              modalIsOpen: false,
              editstatus: false,
              addstatus: false,
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
          // listStatus: this.state.order_status_show,
          // skip: this.state.skip,
          // limit: this.state.limit,
          // keyword: "",
          _id: id,
        };
        AdminApiRequest(requestData, "/admin/supplier_master_delete", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              this.setState({
                data1: res.data,
              });
              const requestData = {};
              AdminApiRequest(requestData, "/admin/supplier_master", "GET")
                .then((res) => {
                  if (res.status === 201 || res.status === 200) {
                    this.setState({
                      data: res.data.data,
                      count: res.data.count,
                    });
                  } else {
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
              swal({
                title: "Success",
                text: "Record Deleted Successfully !",
                icon: "success",
                successMode: true,
              });
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  editopenModal(data) {
    this.setState({
      edit__id: data._id !== undefined ? data._id : "",
      edit_name: data.name !== undefined ? data.name : "",
      edit_email: data.email !== undefined ? data.email : "",
      edit_phone: data.phone !== undefined ? data.phone : "",
      edit_company_name:
        data.company_name !== undefined ? data.company_name : "",
      edit_gst_no: data.gst_no !== undefined ? data.gst_no : "",
      edit_address: data.address !== undefined ? data.address : "",
      edit_paymentTerm: data.paymentTerm !== undefined ? data.paymentTerm : "",
      edit_returnPolicy:
        data.returnPolicy !== undefined ? data.returnPolicy : "",
      edit_attachment: data.attachment !== undefined ? data.attachment : "",
      edit_status: data.status !== undefined ? data.status : "",
      edit_created_at: data.created_at !== undefined ? data.created_at : "",
    });
    this.setState({ editmodalIsOpen: true });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }

  viewopenModal(data) {
    this.setState({
      allviewdata: data,
      name: data.name,
      email: data.email,
      phone: data.phone,
      gst_no: data.gst_no,
      company_name: data.company_name,
      country: data.country,
      status: data.status,
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
  getAllSupplier = () => {
    const requestData = {
      skip: 0,
      limit: this.state.limit,
    };
    AdminApiRequest(requestData, "/admin/get/supplier_master", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
            count: res.data.count,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.getAllSupplier();
  }
  searchHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  getcustomerfilter = () => {
    const requestData = {
      skip: 0,
      limit: this.state.limit,
      name: this.state.name_search,
      company_name: this.state.company_name_search,
      email: this.state.email_search,
      phone: this.state.phone_search,
      status:
        this.state.status_search === "active"
          ? true
          : this.state.status_search === ""
          ? null
          : this.state.status_search === "inactive" && false,
    };
    AdminApiRequest(requestData, "/admin/get/supplier_master", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
            count: res.data.count,
            currentPage: 1,
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
      name_search: "",
      company_name_search: "",
      email_search: "",
      phone_search: "",
      status_search: "",
      skip: 0,
      limit: 20,
      currentPage: 1,
    });

    this.getAllSupplier();
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
                <div className="col-md-12 ml-auto mr-auto">
                  <div className="card">
                    <div className="card-header card-header-primary card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">assignment</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="manage_up_add_btn">
                        <h4 className="card-title"> Supplier </h4>

                        <button
                          className="btn btn-primary m-r-5 float-right"
                          onClick={this.openModal}
                        >
                          {" "}
                          <i className="fa fa-plus"></i> Add Supplier{" "}
                        </button>
                      </div>
                      <div className="searching-every searching-4-col search-five-field popup-arrow-select">
                        <span>
                          <input
                            type="text"
                            name="name_search"
                            value={this.state.name_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.searchHandler}
                            placeholder="Supplier Name"
                          ></input>
                        </span>
                        <span>
                          <input
                            type="text"
                            name="phone_search"
                            value={this.state.phone_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.searchHandler}
                            placeholder="Phone No"
                          ></input>
                        </span>
                        <span>
                          <input
                            type="text"
                            name="company_name_search"
                            value={this.state.company_name_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.searchHandler}
                            placeholder="Company Name"
                          ></input>
                        </span>
                        <span>
                          <select
                            name="status_search"
                            value={this.state.status_search}
                            className="form-control"
                            onChange={this.searchHandler}
                          >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">InActive</option>
                          </select>
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

                      <div className="table-responsive">
                        <table
                          id="datatables"
                          className="table table-striped table-no-bordered table-hover"
                          cellSpacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th scope="col"> Supplier Name</th>
                              <th scope="col"> Phone No</th>
                              <th scope="col"> Company Name</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.data && this.state.data.length > 0 ? (
                              this.state.data.map((data, Index) => (
                                <tr>
                                  <td>{data.name ? data.name : ""}</td>
                                  <td>{data.phone}</td>
                                  <td>{data.company_name}</td>
                                  <td
                                    className={
                                      data.status === true
                                        ? "view-status processed"
                                        : "view-section inprocessed"
                                    }
                                  >
                                    {data.status === true
                                      ? "Active"
                                      : "Inactive"}
                                  </td>
                                  <td>
                                    <i
                                      className="fa fa-eye hover-with-cursor m-r-5"
                                      onClick={this.viewopenModal.bind(
                                        this,
                                        data
                                      )}
                                    ></i>
                                    <i
                                      className="fa fa-edit hover-with-cursor m-r-5"
                                      onClick={this.editopenModal.bind(
                                        this,
                                        data
                                      )}
                                    ></i>
                                    <i
                                      className="fa fa-trash hover-with-cursor m-r-5"
                                      onClick={this.deleteRecord.bind(
                                        this,
                                        data._id
                                      )}
                                    ></i>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <>No Data Found</>
                            )}
                          </tbody>
                        </table>
                        <Pagination
                          hideNavigation
                          activePage={this.state.currentPage}
                          itemsCountPerPage={this.state.limit}
                          totalItemsCount={this.state.count}
                          onChange={this.handlePageChange}
                        />
                      </div>
                    </div>
                    {/* Add model here */}
                    <Modal
                      isOpen={this.state.modalIsOpen}
                      onRequestClose={this.closeModal}
                      style={customStyles}
                    >
                      <div role="dialog">
                        <div className="modal-dialog supplierscrool">
                          <div className="modal-content default_form_design">
                            <button
                              type="button"
                              className="close"
                              onClick={this.closeModal}
                            >
                              &times;
                            </button>
                            <h4 className="modal-title">Add Supplier</h4>
                            <div className="modal-form-bx">
                              <form>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Suppplier Name{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="name"
                                      className="form-control"
                                      placeholder="Enter Suppplier Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Company Name
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="company_name"
                                      className="form-control"
                                      placeholder="Enter Company Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_company_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Email<span className="asterisk">*</span>
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
                                      Contact Number
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="phone"
                                      className="form-control"
                                      placeholder="Enter Phone No"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_phone"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>GST no</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="gst_no"
                                      className="form-control"
                                      placeholder="Enter GST no"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_gst_no"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Payment Term
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="radio"
                                      id="15"
                                      name="paymentTerm"
                                      onChange={this.formHandler}
                                      value="15"
                                    />
                                    <label for="male">
                                      Every 15th & 30th of Month
                                    </label>
                                    <br />
                                    <input
                                      type="radio"
                                      id="30"
                                      onChange={this.formHandler}
                                      name="paymentTerm"
                                      value="30"
                                    />
                                    <label for="female">
                                      Every 30th of Month
                                    </label>
                                    <br />
                                    <input
                                      type="radio"
                                      id="cash"
                                      onChange={this.formHandler}
                                      name="paymentTerm"
                                      value="0"
                                    />
                                    <label for="cash">Cash</label>
                                    <br />
                                    <span className="err err_paymentTerm"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Shipping/Return Policy</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="returnPolicy"
                                      className="form-control"
                                      placeholder="Enter  Shipping/Return Policy"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_returnPolicy"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Address</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="address"
                                      className="form-control"
                                      placeholder="Enter Address"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_address"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Attachment</label>
                                  </div>
                                  <div className="container productvariant">
                                    <div className="form-group">
                                      <input
                                        type="file"
                                        onChange={this.formHandler}
                                        name="image"
                                      />
                                    </div>
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
                    >
                      <div role="dialog">
                        <div className="modal-dialog supplierscrool">
                          <div className="modal-content default_form_design">
                            <button
                              type="button"
                              className="close"
                              onClick={this.editcloseModal}
                            >
                              &times;
                            </button>
                            <h4 className="modal-title">Edit Supplier</h4>
                            <div className="modal-form-bx">
                              <form>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Suppplier Name
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="edit_name"
                                      value={this.state.edit_name}
                                      className="form-control"
                                      placeholder="Enter Suppplier Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_edit_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Company Name
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="edit_company_name"
                                      value={this.state.edit_company_name}
                                      className="form-control"
                                      placeholder="Enter Company Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_edit_company_name"></span>
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
                                      name="edit_email"
                                      value={this.state.edit_email}
                                      className="form-control"
                                      placeholder="Enter Email"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_edit_email"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Contact Number
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="edit_phone"
                                      value={this.state.edit_phone}
                                      className="form-control"
                                      placeholder="Enter Phone No"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_edit_phone"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>GST no</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="edit_gst_no"
                                      value={this.state.edit_gst_no}
                                      className="form-control"
                                      placeholder="Enter GST no"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_edit_gst_no"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Payment Term
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    {this.state.edit_paymentTerm == "15" ? (
                                      <div>
                                        <input
                                          type="radio"
                                          id="15"
                                          name="edit_paymentTerm"
                                          value="15"
                                          onChange={this.formHandler}
                                          checked
                                        />
                                        <label for="15">
                                          Every 15th & 30th of Month
                                        </label>
                                        <br />
                                        <input
                                          type="radio"
                                          id="30"
                                          onChange={this.formHandler}
                                          name="edit_paymentTerm"
                                          value="30"
                                        />
                                        <label for="30">
                                          Every 30th of Month
                                        </label>
                                        <br />
                                      </div>
                                    ) : (
                                      <div>
                                        <input
                                          type="radio"
                                          id="15"
                                          name="edit_paymentTerm"
                                          onChange={this.formHandler}
                                          value="15"
                                        />
                                        <label for="15">
                                          Every 15th & 30th of Month
                                        </label>
                                        <br />
                                        <input
                                          type="radio"
                                          id="30"
                                          name="edit_paymentTerm"
                                          onChange={this.formHandler}
                                          value="30"
                                          checked
                                        />
                                        <label for="30">
                                          Every 30th of Month
                                        </label>
                                        <br />
                                      </div>
                                    )}
                                    <span className="err err_edit_paymentTerm"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Shipping/Return Policy</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="edit_returnPolicy"
                                      value={this.state.edit_returnPolicy}
                                      className="form-control"
                                      placeholder="Enter  Shipping/Return Policy"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_edit_returnPolicy"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Address</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="edit_address"
                                      value={this.state.edit_address}
                                      className="form-control"
                                      placeholder="Enter Address"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_edit_address"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Attachment</label>
                                  </div>
                                  <div className="container productvariant">
                                    <div className="form-group">
                                      <input
                                        type="file"
                                        onChange={this.formHandler}
                                        name="edit_attachment"
                                      />
                                    </div>
                                    {this.state.edit_attachment ? (
                                      <a
                                        href={
                                          imageUrl + this.state.edit_attachment
                                        }
                                        target="_blank"
                                      >
                                        View Attachment
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Status</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <Switch
                                      onChange={this.handleChangeStatus}
                                      checked={
                                        this.state.edit_status === true
                                          ? true
                                          : false
                                      }
                                      name="status"
                                      id="normal-switch"
                                    />
                                  </div>
                                </div>
                                <div className="modal-bottom">
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
                    {/* View Model */}

                    <div
                      className={
                        this.state.show
                          ? "view-section show"
                          : "view-section hide"
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
                      <div className="view-box">
                        <ul>
                          <li>
                            <span className="view-title">Supplier Name</span>
                            <span className="view-status">
                              {this.state.name}
                            </span>
                          </li>

                          <li>
                            <span className="view-title">Company Name</span>
                            <span className="view-status">
                              {this.state.company_name}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Email</span>
                            <span className="view-status">
                              {this.state.email}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Phone Number</span>
                            <span className="view-status">
                              {this.state.phone}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">GST Number</span>
                            <span className="view-status">
                              {this.state.gst_no &&
                              this.state.gst_no !== undefined &&
                              this.state.gst_no !== "undefined"
                                ? this.state.gst_no
                                : ""}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Payment Term</span>
                            <span className="view-status">
                              {this.state.allviewdata === 0 ? "Cash" : ""}
                              {this.state.allviewdata &&
                              this.state.allviewdata !== 0
                                ? this.state.allviewdata.paymentTerm
                                : ""}{" "}
                              {" of every Month"}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Return Policy</span>
                            <span className="view-status">
                              {this.state.allviewdata &&
                              this.state.allviewdata !== undefined &&
                              this.state.allviewdata !== "undefined"
                                ? this.state.allviewdata.returnPolicy
                                : ""}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Address</span>
                            <span className="view-status">
                              {this.state.allviewdata
                                ? this.state.allviewdata.address
                                : ""}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Status</span>
                            <span
                              className={
                                this.state.status === true
                                  ? "view-status processed"
                                  : "view-section inprocessed"
                              }
                            >
                              {this.state.status === true
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* End View modal */}

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
          </div>
        </div>
        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
