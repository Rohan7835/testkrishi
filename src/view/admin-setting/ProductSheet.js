import React, { Component } from "react";
import Modal from "react-modal";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%,-50%)",
    overflow: "unset",
  },
};
export default class ProductSheet extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      loading: true,
      modalIsOpen: false,
      modalIsOpen2: false,
      show: false,
      mdl_layout__obfuscator_hide: false,
      viewOpen: false,
      loading: true,
    };
  }

  async formHandler(val, type) {
    this.setState({ [val.target.name]: val.target.value });
  }

  importSheet() {
    var requestData = {};
    AdminApiRequest(requestData, "/admin/products/exportXls ", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          //
          const newWindow = window.open(
            res.data.data,
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
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  }

  _handleSubmit() {
    if (this.state.csv_add) {
      this.exportSheet();
      this.setState({ error: false });
    } else {
      this.setState({
        error: true,
      });
    }
  }

  async exportSheet() {
    this.setState({ loading: true });
    var data = new FormData();
    var sheet = document.querySelector('input[name="csv_add"]').files[0];
    data.append("sheet", sheet);

    await AdminApiRequest(
      data,
      "/admin/products/importXls ",
      "POST",
      "apiWithImage"
    )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          swal({
            title: "Success",
            text: "Record Saved Successfully !",
            icon: "success",
            successMode: true,
          });
          this.closeModal();
        }
      })
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  }
  openModal(openFor, val) {
    if (openFor === "add") {
      this.setState({
        modalIsOpen: true,
        faqId: "",
        faqCategory: "",
        question: "",
        answer: "",
        priority: "",
      });
    } else if (openFor === "view") {
      this.setState({
        show: true,
        viewData: val,
      });
    }
  }
  closeModal() {
    this.setState({
      modalIsOpen: false,
      modalIsOpen2: false,
      show: false,
      editFAQ: false,
    });
    this.setState({
      selectedUser: "",
    });
  }

  //search
  formHandler1(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem("storeheyLoggedIn"))) {
      this.props.history.push("/storehey");
    }
  }
  render() {
    return (
      <div>
        {this.state.show ? (
          <></>
        ) : (
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
                            <i className="material-icons">slideshow</i>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="manage_up_add_btn">
                            <h4 className="card-title">
                              {" "}
                              Product Import / Export
                            </h4>
                          </div>
                          <button
                            className="btn btn-primary m-r-5"
                            title="Import"
                            onClick={() => this.importSheet()}
                          >
                            Export
                          </button>
                          <a onClick={() => this.openModal("add")}>
                            <button
                              className="btn btn-primary m-r-5"
                              title="Add Inventory"
                            >
                              Import
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Filter popup */}

                {/* Add model here */}
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={() => this.closeModal()}
                  style={customStyles}
                >
                  <div role="dialog">
                    <div className="modal-dialog add-loyality-block-pop">
                      <div className="modal-content">
                        <button
                          type="button"
                          className="close"
                          onClick={() => this.closeModal()}
                        >
                          &times;
                        </button>
                        <h4 className="modal-title">Import</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Add File
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="file"
                                  name="csv_add"
                                  value={this.state.csv_add}
                                  className="form-control"
                                  placeholder="Point"
                                  onChange={(val) => this.formHandler(val)}
                                />
                              </div>
                            </div>
                            {this.state.error ? (
                              <div style={{ alignItems: "center" }}>
                                <span className="err err_csv_add">
                                  Please attach a file to continue.
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            <div
                              className="modal-bottom"
                              style={{ marginTop: 30 }}
                            >
                              <button
                                type="button"
                                className="btn btn-primary feel-btn"
                                onClick={() => this._handleSubmit()}
                              >
                                Add
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="admin-header">
              <Adminfooter />
            </div>
          </div>
        )}
      </div>
    );
  }
}
