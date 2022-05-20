import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";

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

export default class Slides extends Component {
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
      finaldata: [],
      finaldata1: [],
      loading: true,
      feedback: [],
      count: "",
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
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true });
    } else {
      this.setState({ status: false });
    }
  }

  add() {
    var requestData = new FormData();
    var image = document.querySelector('input[name="image"]').files[0];
    var status = this.state.status;
    var rank = this.state.rank;

    requestData.append("image", image);
    requestData.append("status", status);
    requestData.append("rank", rank);

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!rank) {
      valueErr = document.getElementsByClassName("err_rank");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!image) {
      valueErr = document.getElementsByClassName("err_image");
      valueErr[0].innerText = "This Field is Required";
    }

    AdminApiRequest(requestData, "/admin/createSlide", "POST", "apiWithImage")
      .then((res) => {
        console.log(res.data);
        if (res.status === 201 || res.status === 2000) {
          swal({
            title: "Success",
            text: "Record Added Successfully !",
            icon: "success",
            successMode: true,
          });
          this.getAllSlide();
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
        var requestData = {
          _id: id,
        };
        AdminApiRequest(requestData, "/admin/deleteSlide", "POST", "")
          .then((res) => {
            console.log(res.data);
            if (res.status === 201 || res.status === 200) {
              swal({
                title: "Success",
                text: "Record Added Successfully !",
                icon: "success",
                successMode: true,
              });
              this.getAllSlide();
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
      }
    });
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

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;
    const requestData = {
      skip: skip,
      limit: this.state.limit,
    };

    console.log("requestData--===>>>", requestData);

    AdminApiRequest(requestData, "/admin/getAllNewsletter", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          console.log("feedback list --===>>>", res.data.data);
          this.setState({
            feedback: res.data.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    const requestData = {
      skip: 0,
      limit: this.state.limit,
    };

    console.log("requestData--===>>>", requestData);

    AdminApiRequest(requestData, "/admin/getAllNewsletter", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          console.log("feedback list --===>>>", res.data.data);
          this.setState({
            feedback: res.data.data,
            count: res.data.count,
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
                        <i className="material-icons">subscriptions</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title"> Subscription Management </h4>
                      <div className="table-responsive">
                        <table
                          id="datatables"
                          className="table table-striped table-no-bordered table-hover"
                          cellSpacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th>S.no</th>
                              <th>E-Mail</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.feedback && this.state.feedback[0]
                              ? this.state.feedback.map((data, Index) => (
                                  <tr>
                                    <td>{Index + 1}</td>
                                    <td>{data.email}</td>
                                  </tr>
                                ))
                              : this.state.loading
                              ? ""
                              : "No Data Found"}
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
              </div>
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
                  <div className="modal-content default_form_design">
                    <button
                      type="button"
                      className="close"
                      onClick={this.closeModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Add Slide</h4>
                    <div className="modal-form-bx">
                      <form>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Slide <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="file"
                              name="image"
                              className=""
                              placeholder=""
                              onChange={this.formHandler}
                            />
                            <span className="err err_image"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Rank <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="number"
                              name="rank"
                              className="form-control"
                              placeholder="Slide Rank"
                              onChange={this.formHandler}
                            />
                            <span className="err err_rank"></span>
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
                          {/* <button className="cancel" onClick={this.closeModal}>Cancel</button> */}
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

            {/* Edit Modal */}
            <Modal
              isOpen={this.state.editmodalIsOpen}
              onRequestClose={this.editcloseModal}
              style={customStyles}
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
                    <h4 className="modal-title">Edit Color</h4>
                    <div className="modal-form-bx">
                      <form>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Name <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              value={this.state.name}
                              name="name"
                              className="form-control"
                              placeholder="Enter Name"
                              onChange={this.formHandler}
                            />
                            <span className="err err_name"></span>
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
                                this.state.status === "true" ? true : false
                              }
                              name="status"
                              id="normal-switch"
                            />
                          </div>
                        </div>
                        <div className="modal-bottom">
                          <button
                            type="button"
                            className="submit"
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
                    <span className="view-title">Color Name</span>
                    <span className="view-status">{this.state.name}</span>
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
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
