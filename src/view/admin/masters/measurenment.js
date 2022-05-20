import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
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

export default class Unit extends Component {
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
      limit: 20,
      currentPage: 1,
      availablity: "",
      unit: "",
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
    this.getvariantdata = this.getvariantdata.bind(this);
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;

    const requestData = {
      skip: skip,
      limit: this.state.limit,
    };
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
    var unit = this.state.unit;
    var availablity = this.state.availablity;

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!unit) {
      valueErr = document.getElementsByClassName("err_unit");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!availablity) {
      valueErr = document.getElementsByClassName("err_availablity");
      valueErr[0].innerText = "This Field is Required";
    }

    if (unit && availablity) {
      const requestData = {
        name: unit,
        availability: availablity,
        status: this.state.status,
      };

      AdminApiRequest(requestData, "/admin/addUnitMeasurement", "POST")
        .then((res) => {
          if (res.data.status === "error") {
            valueErr = document.getElementsByClassName("err_unit");
            valueErr[0].innerText = res.data.result[0].name;
          } else {
            this.getvariantdata();
            swal({
              title: "Unit Created Successfully",
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
    var name = this.state.edit_unit;
    var availability = this.state.edit_availablity;

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!availability) {
      valueErr = document.getElementsByClassName("err_availability");
      valueErr[0].innerText = "This Field is Required";
    }

    if (name && availability) {
      const requestData = {
        _id: this.state.edit_data._id,
        name: name,
        availability: availability,
        status: this.state.edit_status,
      };

      AdminApiRequest(requestData, "/admin/updateUnitMeasurement", "POST")
        .then((res) => {
          if (res.data.status === "error") {
            valueErr = document.getElementsByClassName("err_unit");
            valueErr[0].innerText = res.data.result[0].name;
          } else {
            this.getvariantdata();
            swal({
              title: "Unit Updated Successfully",
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

        AdminApiRequest(requestData, "/admin/deleteUnitMeasurement", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              this.getvariantdata();
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
      edit_data: data,
      edit_availablity: data.availability,
      edit_status: data.status,
      edit_unit: data.name,
      mdl_layout__obfuscator_hide: false,
    });
  }

  viewopenModal(data) {
    this.setState({
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

  componentDidMount() {
    this.getvariantdata();
    if (!JSON.parse(localStorage.getItem("storeheyLoggedIn"))) {
      this.props.history.push("/storehey");
    }
  }
  getvariantdata() {
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
    };

    AdminApiRequest(requestData, "/admin/getUnitMeasurement", "POST")
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
                        <i className="material-icons">open_with</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">Measurenment</h4>

                      <button
                        className="btn btn-primary m-r-5 float-right"
                        onClick={this.openModal}
                      >
                        {" "}
                        <i className="fa fa-plus"></i> Add Unit{" "}
                      </button>

                      <div className="listing-table-bx suppliertable">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th scope="col">Unit</th>
                              <th scope="col">Availability</th>
                              <th scope="col"> Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.data.map((data, Index) => (
                              <tr>
                                <td>{data.name}</td>
                                <td
                                  className={
                                    data.availability === "yes"
                                      ? "view-status processed"
                                      : "view-section inprocessed"
                                  }
                                >
                                  {data.availability === "yes" ? "Yes" : "No"}
                                </td>
                                <td
                                  className={
                                    data.status === true
                                      ? "view-status processed"
                                      : "view-section inprocessed"
                                  }
                                >
                                  {data.status === true ? "Active" : "Inactive"}
                                </td>
                                <td>
                                  {/* <i className="fa fa-eye hover-with-cursor m-r-5" onClick={this.viewopenModal.bind(this, data)}></i> */}
                                  <i
                                    title="Edit"
                                    className="fa fa-edit hover-with-cursor m-r-5"
                                    onClick={this.editopenModal.bind(
                                      this,
                                      data
                                    )}
                                  ></i>
                                  <i
                                    title="Delete"
                                    className="fa fa-trash hover-with-cursor m-r-5"
                                    onClick={this.deleteRecord.bind(
                                      this,
                                      data._id
                                    )}
                                  ></i>
                                </td>
                              </tr>
                            ))}
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
                  onRequestClose={this.closeModal}
                  style={customStyles}
                >
                  <div role="dialog">
                    <div className="modal-dialog supplierscrool">
                      <div className="modal-content">
                        <button
                          type="button"
                          className="close"
                          onClick={this.closeModal}
                        >
                          &times;
                        </button>
                        <h4 className="modal-title">Add Unit</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Unit<span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="unit"
                                  className="form-control"
                                  placeholder="Enter Unit Name"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_unit"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Availability
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <select
                                  name="availablity"
                                  className="form-control"
                                  onChange={this.formHandler}
                                >
                                  <option value="">Select Availablity</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                                <span className="err err_availablity"></span>
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
                              {/* <button className="btn btn-primary feel-btn" onClick={this.closeModal}>Cancel</button> */}
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
                      <div className="modal-content">
                        <button
                          type="button"
                          className="close"
                          onClick={this.editcloseModal}
                        >
                          &times;
                        </button>
                        <h4 className="modal-title">Edit Unit</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Unit<span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  value={this.state.edit_unit}
                                  name="edit_unit"
                                  className="form-control"
                                  placeholder="Enter Unit"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_unit"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Availability
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                {this.state.edit_data.availability === "yes" ? (
                                  <select
                                    name="edit_availablity"
                                    className="form-control"
                                    onChange={this.formHandler}
                                  >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </select>
                                ) : (
                                  <select
                                    name="edit_availablity"
                                    className="form-control"
                                    onChange={this.formHandler}
                                  >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                  </select>
                                )}
                                <span className="err err_availablity"></span>
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
                                  name="edit_status"
                                  id="normal-switch"
                                />
                              </div>
                            </div>
                            <div className="modal-bottom">
                              {/* <button className="btn btn-primary feel-btn" onClick={this.editcloseModal}>Cancel</button> */}
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
                        <span className="view-title">Supplier Name</span>
                        <span className="view-status">{this.state.name}</span>
                      </li>
                      <li>
                        <span className="view-title">Email</span>
                        <span className="view-status">{this.state.email}</span>
                      </li>
                      <li>
                        <span className="view-title">Phone Number</span>
                        <span className="view-status">{this.state.phone}</span>
                      </li>
                      <li>
                        <span className="view-title">GST Number</span>
                        <span className="view-status">{this.state.gst_no}</span>
                      </li>
                      <li>
                        <span className="view-title">Country</span>
                        <span className="view-status">
                          {this.state.country}
                        </span>
                      </li>
                      <li>
                        <span className="view-title">Company Name</span>
                        <span className="view-status">
                          {this.state.company_name}
                        </span>
                      </li>
                      <li>
                        <span className="view-title">Status</span>
                        <span
                          className={
                            this.state.status === "true"
                              ? "view-status processed"
                              : "view-section inprocessed"
                          }
                        >
                          {this.state.status === "true" ? "Active" : "Inactive"}
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
