import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import SelectSearch from "react-select-search";
import Switch from "react-switch";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
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

export default class variantmaster extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "#/admin-login";
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
      edit_name: "",
      skip: 0,
      count: 1,
      limit: 20,
      currentPage: 1,
      tags: [],
      options: [],
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
    this.handleChangenew = this.handleChangenew.bind(this);
    this.handleChangenewedit = this.handleChangenewedit.bind(this);
  }

  handleChangenew(tags) {
    this.setState({ tags });
  }
  handleChangenewedit(edit_tags) {
    this.setState({ edit_tags });
  }
  onChange6(valu) {
    this.setState({ group_id: valu.value });
  }
  onChange67(valu) {
    this.setState({ edit_parentCat_id: valu.value });
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

    AdminApiRequest(requestData, "/admin/attributes/getAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
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
    var group_id = this.state.group_id;
    var name = this.state.name;
    var items = this.state.tags;

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!group_id) {
      valueErr = document.getElementsByClassName("err_parentCat_id");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!items || items.length === 0) {
      valueErr = document.getElementsByClassName("err_item_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (name && group_id && items) {
      const requestData = {
        group_id: group_id,
        name: name,
        items: items,
      };

      AdminApiRequest(requestData, "/admin/attributes/add", "POST")
        .then((res) => {
          if (res.data.status === "error") {
            valueErr = document.getElementsByClassName("err_name");
            valueErr[0].innerText = res.data.result[0].name;
          } else {
            this.getvariantdata();
            swal({
              title: "Variant Created Successfully",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.setState({
              loading: false,
              tags: [],
              group_id: "",
              name: "",
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
    var id = this.state.edit_id;
    var edit_name = this.state.edit_name;
    var edit_parentCat_id = this.state.edit_parentCat_id;
    var edit_tags = this.state.edit_tags;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!edit_name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!edit_tags || edit_tags.length === 0) {
      valueErr = document.getElementsByClassName("err_item_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (edit_name && edit_parentCat_id && edit_tags.length > 0) {
      const requestData = {
        id: id,
        name: edit_name,
        group_id: edit_parentCat_id,
        items: edit_tags,
        status: this.state.status,
      };

      AdminApiRequest(requestData, "/admin/attributes/update", "POST")
        .then((res) => {
          if (res.data.status === "error") {
            valueErr = document.getElementsByClassName("err_name");
            valueErr[0].innerText = res.data.result[0].name;
          } else {
            this.getvariantdata();
            swal({
              title: "Variant Updated Successfully",
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
          Id: id,
        };

        AdminApiRequest(requestData, "/admin/attributes/delete", "POST")
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
      }
    });
  }

  editopenModal(data) {
    var a = [];
    data.item.map((item, index) => {
      a.push(item.item_name);
    });
    this.setState({
      edit_id: data._id,
      editmodalIsOpen: true,
      edit_parentCat_id: data.group?._id,
      edit_name: data.name,
      edit_tags: a,
      edit_status: data.status,
      mdl_layout__obfuscator_hide: false,
    });
  }

  viewopenModal(data) {
    this.setState({
      show: true,
      mdl_layout__obfuscator_hide: true,
      editing_data: data,
    });
  }

  closeModal() {
    this.setState({ modalIsOpen: false, tags: [], group_id: "", name: "" });
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

    const requestData = {};

    AdminApiRequest(requestData, "/admin/attributeGroups/getAllActive", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.map((item, index) => {
            this.state.options.push({ name: item.name, value: item._id });
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

  getvariantdata() {
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
    };
    AdminApiRequest(requestData, "/admin/attributes/getAll", "POST")
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
                        <i className="material-icons">filter_alt</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">Variant</h4>

                      <button
                        className="btn btn-primary m-r-5 float-right"
                        onClick={this.openModal}
                      >
                        {" "}
                        <i className="fa fa-plus"></i> Add Variant{" "}
                      </button>

                      <div className="listing-table-bx suppliertable">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th scope="col"> Variant Name</th>
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
                                    data.status === true
                                      ? "view-status processed"
                                      : "view-section inprocessed"
                                  }
                                >
                                  {data.status === true ? "Active" : "Inactive"}
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
                        <h4 className="modal-title">Add Variant</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Variant Category{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <SelectSearch
                                  placeholder="Choose Category"
                                  options={this.state.options}
                                  onChange={(e) => this.onChange6(e)}
                                  value={this.state.group_id}
                                  className="select-search"
                                  name="group_id"
                                />
                                <span className="err err_parentCat_id"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Variant <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Enter Variant"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Variant Items{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <TagsInput
                                  value={this.state.tags}
                                  onChange={this.handleChangenew}
                                />
                                <span className="err err_item_name"></span>
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
                        <h4 className="modal-title">Edit Variant</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Variant Category{" "}
                                  {/* {this.state.edit_parentCat_id} */}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <SelectSearch
                                  placeholder="Choose Category"
                                  options={this.state.options}
                                  onChange={(e) => this.onChange67(e)}
                                  value={this.state.edit_parentCat_id}
                                  className="select-search"
                                  name="edit_parentCat_id"
                                />
                                <span className="err err_parentCat_id"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Variant <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="edit_name"
                                  className="form-control"
                                  value={this.state.edit_name}
                                  placeholder="Enter Variant"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Variant Items{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <TagsInput
                                  value={this.state.edit_tags}
                                  onChange={this.handleChangenewedit}
                                />
                                <span className="err err_item_name"></span>
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
                    {this.state.editing_data ? (
                      <ul>
                        <li>
                          <span className="view-title">Variant Category</span>
                          <span className="view-status">
                            {this.state.editing_data.group.name}
                          </span>
                        </li>
                        <li>
                          <span className="view-title">Variant Name</span>
                          <span className="view-status">
                            {this.state.editing_data.name}
                          </span>
                        </li>
                        <li>
                          <span className="view-title">Variant Item's</span>
                          {this.state.editing_data.item.map((item, index) => (
                            <span className="view-status">
                              {item.item_name}
                            </span>
                          ))}
                        </li>

                        <li>
                          <span className="view-title">Status</span>
                          <span
                            className={
                              this.state.editing_data.status === true
                                ? "view-status processed"
                                : "view-section inprocessed"
                            }
                          >
                            {this.state.editing_data.status === true
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </li>
                      </ul>
                    ) : (
                      ""
                    )}
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
