import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { imageUrl } from "../../imageUrl";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
const noImage = require("../../images/noImage.png");
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

export default class blogcategory extends Component {
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
      category_banner: "",
      category_banner_edit: "",
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
    this.formHandler1 = this.formHandler1.bind(this);
    this.getvariantdata = this.getvariantdata.bind(this);
  }

  formHandler1(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  search = () => {
    const requestData = {
      skip: 0,
      limit: this.state.limit,
      name: this.state.search_blog_category,
      status: this.state.status_search || null,
    };

    AdminApiRequest(requestData, "/admin/getBlogCat", "POST")
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
  };

  reset = () => {
    this.setState({
      search_coupon_name: "",
      search_coupon_code: "",
      search_type: "",
      search_discount_type: "",
      status_search: "",
      search_blog_category: "",
    });
    this.getvariantdata();
  };

  formHandler(ev) {
    console.log(ev.target.name, ev.target.value);
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
    var category_name = this.state.category_name;
    var category_banner = document.querySelector(
      'input[name="category_banner"]'
    ).files[0]
      ? document.querySelector('input[name="category_banner"]').files[0]
      : "";

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!category_name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    var requestData = new FormData();
    requestData.append("name", category_name);
    requestData.append("status", this.state.status);
    requestData.append("banner", category_banner);
    if (category_name) {
      AdminApiRequest(requestData, "/admin/addBlogCat", "POST", "apiWithImage")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.getvariantdata();
            swal({
              title: "Category Created Successfully",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.setState({
              loading: false,
              modalIsOpen: false,
            });
          }
          else if(res.data.message == "error"){
            // var keys = Object.keys(res.result[0]);
            // var values = Object.values(res.result[0]);
            // for (var i = 0; i < keys.length; i++) {
                valueErr = document.getElementsByClassName("err_name");
                valueErr[0].innerText = "name already exist";
            // }
          }
          else {
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
  }

  edit() {
    var name = this.state.edit_category_name;
    var category_banner_edit = document.querySelector(
      'input[name="category_banner_edit"]'
    ).files[0]
      ? document.querySelector('input[name="category_banner_edit"]').files[0]
      : this.state.category_banner_edit;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    var requestData = new FormData();
    requestData.append("name", name);
    requestData.append("_id", this.state.edit_data._id);
    requestData.append("status", this.state.edit_status);
    requestData.append("banner", category_banner_edit);
    if (name) {
      AdminApiRequest(
        requestData,
        "/admin/updateBlogCat",
        "POST",
        "apiWithImage"
      )
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.getvariantdata();
            swal({
              title: "Category Updated Successfully",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.setState({
              loading: false,
              editmodalIsOpen: false,
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

        AdminApiRequest(requestData, "/admin/deleteBlogCat", "POST")
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
      edit_category_name: data.name,
      category_banner_edit: data.banner,
      edit_status: data.status,
      mdl_layout__obfuscator_hide: false,
    });
  }

  viewopenModal(id) {
    this.setState({ show: true });
    this.setState({ mdl_layout__obfuscator_hide: true });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      category_banner_edit: "",
      category_banner: "",
    });
  }
  editcloseModal() {
    this.setState({
      editmodalIsOpen: false,
      category_banner_edit: "",
      category_banner: "",
      edit_data: "",
      edit_category_name: "",
    });
  }
  viewcloseModal() {
    this.setState({ show: false });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }

  componentDidMount() {
    this.getvariantdata();
  }
  getvariantdata() {
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
    };

    AdminApiRequest(requestData, "/admin/getBlogCat", "POST")
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
                  <div className="card new_blog_new_master">
                    <div className="card-header card-header-primary card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">category</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="manage_up_add_btn">
                        <h4 className="card-title">Recipes Category</h4>

                        <button
                          className="btn btn-primary m-r-5 float-right"
                          onClick={this.openModal}
                        >
                          {" "}
                          <i className="fa fa-plus"></i> Add Recipes Category{" "}
                        </button>
                      </div>
                      <div className="searching-every popup-arrow-select">
                        <span scope="col">
                          <input
                            type="text"
                            value={this.state.search_blog_category}
                            name="search_blog_category"
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler}
                            placeholder="Recipes Category"
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
                            <option value="true">Active</option>
                            <option value="false">InActive</option>
                          </select>
                        </span>
                        <span className="search-btn-every two-filed-btn">
                          <button
                            type="submit"
                            onClick={() => this.search()}
                            className="btn btn-primary m-r-5"
                          >
                            Search
                          </button>
                          <button
                            onClick={() => this.reset()}
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
                              <th scope="col">Recipes Category</th>
                              <th scope="col">Banner</th>
                              <th scope="col"> Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.data.length > 0 ? (
                              this.state.data.map((data, Index) => (
                                <tr>
                                  <td>{data.name}</td>
                                  <td className="">
                                    <a
                                      href={
                                        data.banner && data.banner[0]
                                          ? imageUrl + data.banner
                                          : noImage
                                      }
                                      rel="noreferrer"
                                      target="_blank"
                                    >
                                      <img
                                        style={{ height: 70, width: 100 }}
                                        src={
                                          data.banner && data.banner[0]
                                            ? imageUrl + data.banner
                                            : noImage
                                        }
                                        alt="slide"
                                      />
                                    </a>
                                  </td>
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
                                    {/* <i className="fa fa-eye hover-with-cursor m-r-5" onClick={this.viewopenModal.bind(this, data._id)}></i> */}
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
                              <tr style={{ textAlign: "center" }}>
                                <td colSpan="3">No data found</td>
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
                        <h4 className="modal-title">Add Category</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Category Name{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="category_name"
                                  className="form-control"
                                  placeholder="Enter Category Name"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Banner</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="file"
                                  name="category_banner"
                                  className="form-control"
                                  onChange={this.formHandler}
                                />
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
                      <div className="modal-content default_form_design">
                        <button
                          type="button"
                          className="close"
                          onClick={this.editcloseModal}
                        >
                          &times;
                        </button>
                        <h4 className="modal-title">Edit Recipes Category</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Category Name{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  value={this.state.edit_category_name}
                                  name="edit_category_name"
                                  className="form-control"
                                  placeholder="Enter Category Name"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Banner</label>
                              </div>
                              <div className="modal-right-bx">
                                {this.state.category_banner_edit ? (
                                  <img
                                    src={
                                      imageUrl + this.state.category_banner_edit
                                    }
                                    style={{ maxWidth: 200 }}
                                  />
                                ) : (
                                  ""
                                )}
                                <input
                                  type="file"
                                  name="category_banner_edit"
                                  className="form-control"
                                  onChange={this.formHandler}
                                />
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
                                    this.state.edit_status == true
                                      ? true
                                      : false
                                  }
                                  name="status"
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
