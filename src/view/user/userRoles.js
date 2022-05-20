import React, { Component } from "react";
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

var data = [];
export default class UserRole extends Component {
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
      roleModules: [],
      role_name: "",
      status: true,
      moduleSelected: [],
      rolesData: [],
      role_id: "",
      loading: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editopenModal = this.editopenModal.bind(this);
    this.editcloseModal = this.editcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
  }

  formHandler(ev) {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  }

  handleChangeStatus(checked) {
    this.setState({ status: checked });
  }

  add() {
    var role_name = this.state.role_name;
    var moduleSelected = [...new Set(this.state.moduleSelected)];
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!role_name) {
      valueErr = document.getElementsByClassName("err_role_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (moduleSelected.length <= 0) {
      valueErr = document.getElementsByClassName("err_moduleSelected");
      valueErr[0].innerText = "This Field is Required";
    }

    if (role_name && moduleSelected.length > 0) {
      const requestData = {
        role_name: this.state.role_name,
        modules: this.state.moduleSelected
          ? JSON.stringify(this.state.moduleSelected)
          : [],
        status: this.state.status,
      };
      AdminApiRequest(requestData, "/admin/addRole", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Record Add Successfully!",
              icon: "success",
              successMode: true,
            });
            this.getAllRole();
            this.setState({ modalIsOpen: false });
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
          valueErr = document.getElementsByClassName("err_role_name");
          valueErr[0].innerText = "Name already exist";
        });
    }
  }
  loginAgain() {
    const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
    const requestData = {
      email: userInfo.email,
      password: userInfo.password,
    };
    AdminApiRequest(requestData, "/adminLogin", "POST", "")
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("adminInfo", JSON.stringify(res.data));
        }
      })
      .catch((error) => {});
  }
  edit() {
    var role_name = this.state.role_name;
    var moduleSelected = this.state.moduleSelected;

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!role_name) {
      valueErr = document.getElementsByClassName("err_role_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!moduleSelected) {
      valueErr = document.getElementsByClassName("err_moduleSelected");
      valueErr[0].innerText = "This Field is Required";
    }

    if (role_name && moduleSelected) {
      const requestData = {
        _id: this.state.role_id,
        role_name: this.state.role_name,
        modules: this.state.moduleSelected
          ? JSON.stringify(this.state.moduleSelected)
          : [],
        status: this.state.status,
      };

      AdminApiRequest(requestData, "/admin/updateRole", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Your Record Updated Successfully!",
              icon: "success",
              successMode: true,
            });
            this.loginAgain();
            this.getAllRole();
            this.setState({ editmodalIsOpen: false });
          } else {
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

        AdminApiRequest(requestData, "/admin/deleteRole", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              this.setState({
                data1: res.data.data,
              });
              swal({
                title: "Success",
                text: "Record Deleted Successfully !",
                icon: "success",
                successMode: true,
              });
              this.getAllRole();
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  async editopenModal(val) {
    data = await val.modules;
    this.setState({
      editmodalIsOpen: true,
      role_id: await val._id,
      role_name: await val.role_name,
      moduleSelected: await val.modules,
      status: await val.status,
    });

    await this._fillCheckboxes();
  }

  async _fillCheckboxes() {
    var rolesData = this.state.rolesData;
    const rlength = rolesData.length;
    var mlength = this.state.moduleSelected.length;

    for (let i = 0; i < rlength; i++) {
      for (let j = 0; j < mlength; j++) {
        var a = await document.getElementById(this.state.moduleSelected[j]);
        if (a) {
          a.checked = true;
        }
      }
    }
  }

  async _handleCheckbox(val) {
    const id = await val.target.id;
    const checked = await val.target.checked;
    // this.setState({ moduleSelected: data })

    if (checked) {
      data.push(id);
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === id) {
          data.splice(i, 1);
        }
      }
    }
    this.setState({ moduleSelected: data });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.getAllRole();
  }
  editcloseModal() {
    this.setState({ editmodalIsOpen: false });
    this.getAllRole();
  }

  getRoleModules() {
    const requestData = {
      // skip: skip,
      // limit: this.state.limit,
    };
    AdminApiRequest(requestData, "/admin/getRoleModules", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            roleModules: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getAllRole() {
    this.setState({ loading: true });
    const requestData = {
      // skip: 0,
      // limit: this.state.limit,
    };
    AdminApiRequest(requestData, "/admin/getAllRole", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            rolesData: res.data.data,
            loading: false,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getAllRole();
    this.getRoleModules();
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
                        <i className="material-icons">assignment</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="manage_up_add_btn">
                        <h4 className="card-title"> User Roles</h4>

                        <button
                          className="btn btn-primary m-r-5 float-right"
                          onClick={this.openModal}
                        >
                          {" "}
                          <i className="fa fa-plus"></i> Add Role{" "}
                        </button>
                      </div>
                      <div className="table-responsive">
                        <table
                          id="datatables"
                          className="table table-striped table-no-bordered table-hover role-data-table"
                          cellSpacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th scope="col">Role</th>
                              <th scope="col" style={{ whiteSpace: "unset" }}>
                                Modules
                              </th>
                              <th scope="col">Status</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <>
                              {this.state.rolesData.map((data, Index) => (
                                <tr>
                                  <td>{data.role_name}</td>
                                  <td
                                    style={{ textTransform: "capitalize" }}
                                    style={{ whiteSpace: "unset" }}
                                  >
                                    {data.modules.map((i) => {
                                      return (
                                        <>
                                          {i} {", "}
                                        </>
                                      );
                                    })}
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
                                  <td className="role-icon-last">
                                    <i
                                      className="fa fa-edit  hover-with-cursor m-r-5 fa-2x"
                                      onClick={this.editopenModal.bind(
                                        this,
                                        data
                                      )}
                                    ></i>
                                    <i
                                      className="fa fa-trash hover-with-cursor m-r-5 fa-2x"
                                      onClick={this.deleteRecord.bind(
                                        this,
                                        data._id
                                      )}
                                    ></i>
                                  </td>
                                </tr>
                              ))}
                              {this.state.loading ? (
                                <tr>
                                  <td></td>Loading...
                                </tr>
                              ) : (
                                ""
                              )}
                            </>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Add model here */}
                    <Modal
                      isOpen={this.state.modalIsOpen}
                      onRequestClose={this.closeModal}
                      style={customStyles}
                    >
                      <div role="dialog">
                        <div className="modal-dialog admin_new_user_all us-role-pop">
                          <div className="modal-content default_form_design">
                            <button
                              type="button"
                              className="close"
                              onClick={this.closeModal}
                            >
                              &times;
                            </button>
                            <h4 className="modal-title">Add Role</h4>
                            <div className="modal-form-bx">
                              <form>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Role<span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="role_name"
                                      autoComplete="off"
                                      className="form-control"
                                      placeholder="Enter Role Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_role_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Modules<span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  {this.state.roleModules &&
                                  this.state.roleModules[0]
                                    ? this.state.roleModules.map(
                                        (item, index) => {
                                          return (
                                            <div className="form-control">
                                              <input
                                                type="checkbox"
                                                className="m-r-10"
                                                id={`${item.name}`}
                                                name={item.name}
                                                onChange={(ev) =>
                                                  this._handleCheckbox(ev)
                                                }
                                              />
                                              <label for={item.name}>
                                                <strong>{item.name}</strong>
                                              </label>
                                            </div>
                                          );
                                        }
                                      )
                                    : "No Modules Present"}
                                  <span className="err err_moduleSelected"></span>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Status</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <Switch
                                      name="status"
                                      onChange={(ev) =>
                                        this.handleChangeStatus(ev)
                                      }
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
                        <div className="modal-dialog admin_new_user_all us-role-pop">
                          <div className="modal-content default_form_design">
                            <button
                              type="button"
                              className="close"
                              onClick={this.editcloseModal}
                            >
                              &times;
                            </button>
                            <h4 className="modal-title">Edit Role</h4>
                            <div className="modal-form-bx">
                              <form>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Role<span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="role_name"
                                      autoComplete="off"
                                      value={this.state.role_name}
                                      className="form-control"
                                      placeholder="Enter Role Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_role_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Modules<span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  {this.state.roleModules &&
                                  this.state.roleModules[0]
                                    ? this.state.roleModules.map(
                                        (item, index) => {
                                          return (
                                            <div className="form-control">
                                              <input
                                                type="checkbox"
                                                className="m-r-10"
                                                id={`${item.name}`}
                                                name={item.name}
                                                onChange={(ev) =>
                                                  this._handleCheckbox(ev)
                                                }
                                              />
                                              <label for={item.name}>
                                                <strong>{item.name}</strong>
                                              </label>
                                            </div>
                                          );
                                        }
                                      )
                                    : "No Modules Present"}
                                  <span className="err err_moduleSelected"></span>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Status</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <Switch
                                      name="status"
                                      onChange={(ev) =>
                                        this.handleChangeStatus(ev)
                                      }
                                      checked={this.state.status}
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
                            <span className="view-title">Size Name</span>
                            <span className="view-status">
                              {this.state.name}
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
                              {this.state.status === "true"
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
                {/* <div className="admin-header">
                                </div> */}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
