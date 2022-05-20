import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import SelectSearch from "react-select-search";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
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

export default class driver extends Component {
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
      activ_supplier: [],
      currentPage: 1,
      driver_name_search: "",
      driver_mobile_search: "",
      status_search: "",
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
    this.driverdata = this.driverdata.bind(this);
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
    var name = this.state.name ? this.state.name : "";
    var email = this.state.email ? this.state.email : "";
    var mobile = this.state.mobile_number ? this.state.mobile_number : "";
    var address = this.state.address ? this.state.address : "";
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
    } else if (mobile.length !== 10) {
      add_status = false;
      valueErr = document.getElementsByClassName("err_mobile_number");
      valueErr[0].innerText = "Enter a valid number";
    }

    if (name && mobile && add_status === true) {
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
            this.driverdata();
            swal({
              title: "Driver Created Successfully",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.setState({
              loading: false,
              // modalIsOpen: false,
            });
            this.closeModal();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  edit() {
    var name = this.state.edit_name ? this.state.edit_name : "";
    var email = this.state.edit_email ? this.state.edit_email : "";
    var mobile = this.state.edit_mobile ? this.state.edit_mobile : "";
    var address = this.state.edit_address ? this.state.edit_address : "";
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
    console.log(String(mobile),String(mobile).length)
    if (!mobile) {
      valueErr = document.getElementsByClassName("err_edit_mobile");
      valueErr[0].innerText = "This Field is Required";
    } else if (isNaN(mobile)) {
      add_status = false;
      valueErr = document.getElementsByClassName("err_edit_mobile");
      valueErr[0].innerText = "Enter Numeric Value";
    } else if (String(mobile).length !== 10) {
      add_status = false;
      valueErr = document.getElementsByClassName("err_edit_mobile");
      valueErr[0].innerText = "Enter a valid number";
    }

    if (name && mobile && add_status === true) {
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
            this.driverdata();
            swal({
              title: "Driver Updated Successfully",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.setState({
              loading: false,
              // editmodalIsOpen: false,
            });
            this.editcloseModal();
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
              this.driverdata();
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
    this.setState({
      modalIsOpen: false,
      name: "",
      email: "",
      mobile_number: "",
      address: "",
      edit_name: "",
      edit_email: "",
      edit_mobile: "",
      edit_address: "",
    });
  }
  editcloseModal() {
    this.setState({
      editmodalIsOpen: false,
      name: "",
      email: "",
      mobile_number: "",
      address: "",
      edit_name: "",
      edit_email: "",
      edit_mobile: "",
      edit_address: "",
    });
  }
  viewcloseModal() {
    this.setState({ show: false });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }

  componentDidMount() {
    this.driverdata();
  }
  driverdata() {
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
    };

    AdminApiRequest(requestData, "/admin/getDriver", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          const driverOptions = res.data.data.filter(
            (item) => item.status == true
          );
          driverOptions.forEach((item) => {
            this.state.activ_supplier.push({
              value: item._id,
              name: item.name,
            });
          });
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
      driver_id: this.state.driver_name_search.value,
      // name: this.state.driver_name_search.value,
      mobile: this.state.driver_mobile_search,
      status:
        this.state.status_search === "active"
          ? true
          : this.state.status_search === ""
          ? null
          : this.state.status_search === "inactive" && false,
    };
    AdminApiRequest(requestData, "/admin/getDriver", "POST")
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
    this.driverdata();
    this.setState({
      driver_name_search: "",
      driver_mobile_search: "",
      status_search: "",
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
                        <h4 className="card-title">Drivers</h4>

                        <button
                          className="btn btn-primary m-r-5 float-right"
                          onClick={this.openModal}
                        >
                          {" "}
                          <i className="fa fa-plus"></i> Add Driver{" "}
                        </button>
                      </div>
                      <div className="searching-every searching-4-col popup-arrow-select">
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
                                driver_name_search: e,
                              });
                            }}
                            value={this.state.driver_name_search.value}
                            className="select-search"
                          />
                          {/* <input
                            type="text"
                            name="driver_name_search"
                            value={this.state.driver_name_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="Driver Name"
                          ></input> */}
                        </span>
                        <span>
                          <input
                            type="text"
                            name="driver_mobile_search"
                            value={this.state.driver_mobile_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="Driver Contact Number"
                          ></input>
                        </span>
                        <span>
                          <select
                            name="status_search"
                            value={this.state.status_search}
                            className="form-control"
                            onChange={this.formHandler1}
                          >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">InActive</option>
                          </select>
                        </span>
                        <span className="search-btn-every dd-left-btn-search">
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
                              <th scope="col">Driver Name</th>
                              <th scope="col"> Mobile Number</th>
                              <th scope="col"> Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.data.length > 0 ? (
                              this.state.data.map((data, Index) => (
                                <tr key={Index}>
                                  <td style={{ textTransform: "capitalize" }}>
                                    {data.name}
                                  </td>
                                  <td>{data.mobile}</td>
                                  <td
                                    className={
                                      data.status === true
                                        ? " processed"
                                        : " inprocessed"
                                    }
                                  >
                                    {data.status === true
                                      ? "Active"
                                      : "Inactive"}
                                  </td>
                                  <td>
                                    <i
                                      className="fa fa-eye hover-with-cursor m-r-5"
                                      title={"View - " + data.name}
                                      onClick={this.viewopenModal.bind(
                                        this,
                                        data
                                      )}
                                    ></i>
                                    <i
                                      className="fa fa-edit hover-with-cursor m-r-5"
                                      title={"Edit - " + data.name}
                                      onClick={this.editopenModal.bind(
                                        this,
                                        data
                                      )}
                                    ></i>
                                    <i
                                      className="fa fa-trash hover-with-cursor m-r-5"
                                      title={"Delete - " + data.name}
                                      onClick={this.deleteRecord.bind(
                                        this,
                                        data._id
                                      )}
                                    ></i>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>
                                  No Data Found
                                </td>
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
                {/* Add model here */}
                <Modal
                  isOpen={this.state.modalIsOpen}
                  ariaHideApp={false}
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
                        <h4 className="modal-title">Add Driver</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Driver Name{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Enter Driver Name"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_name"></span>
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
                                  Mobile Number{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="mobile_number"
                                  className="form-control"
                                  placeholder="Enter Mobile Number"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_mobile_number"></span>
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
                {/* edit_name:data.name,
            :data.email,
            :data.mobile,
            :data.address,
            edit_status:data.status, */}
                <Modal
                  isOpen={this.state.editmodalIsOpen}
                  onRequestClose={this.editcloseModal}
                  ariaHideApp={false}
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
                        <h4 className="modal-title">Edit Driver</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Driver Name{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  value={this.state.edit_name}
                                  name="edit_name"
                                  className="form-control"
                                  placeholder="Enter Driver Name"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_edit_name"></span>
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
                                <label>
                                  Mobile Number{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
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
                                <label>Address</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  value={this.state.edit_address}
                                  name="edit_address"
                                  className="form-control"
                                  placeholder="Enter Address"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_edit_address"></span>
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
                    this.state.show ? "view-section show" : "view-section hide"
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
                        <span className="view-title">Driver Name</span>
                        <span className="view-status">
                          {this.state.viewdata ? this.state.viewdata.name : ""}
                        </span>
                      </li>
                      <li>
                        <span className="view-title">Email</span>
                        <span className="view-status">
                          {this.state.viewdata ? this.state.viewdata.email : ""}
                        </span>
                      </li>
                      <li>
                        <span className="view-title">Mobile Number</span>
                        <span className="view-status">
                          {this.state.viewdata
                            ? this.state.viewdata.mobile
                            : ""}
                        </span>
                      </li>
                      <li>
                        <span className="view-title">Address</span>
                        <span className="view-status">
                          {this.state.viewdata
                            ? this.state.viewdata.address
                            : ""}
                        </span>
                      </li>
                      {this.state.viewdata ? (
                        <li>
                          <span className="view-title">Status</span>
                          <span
                            className={
                              this.state.viewdata.status === true
                                ? "view-status processed"
                                : "view-section inprocessed"
                            }
                          >
                            {this.state.viewdata.status === true
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </li>
                      ) : (
                        ""
                      )}
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
        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
