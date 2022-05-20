import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import Switch from "react-switch";
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
var multiple_tax = [];

export default class Tax extends Component {
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
    this.handleChangenew = this.handleChangenew.bind(this);
    this.handleChangenewedit = this.handleChangenewedit.bind(this);
    this.addImage = this.addImage.bind(this);
    this.formHandler121 = this.formHandler121.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
    this.formHandler_edit = this.formHandler_edit.bind(this);
    this.editaddtaxes = this.editaddtaxes.bind(this);
  }
  formHandler1(e, index, type) {
    var a = 0;
    if (type === "tax_name") {
      multiple_tax[index].tax_name = e.target.value;
    }
    if (type === "tax_percent") {
      multiple_tax[index].tax_percent = e.target.value;
    }
    this.setState({
      loading: false,
    });
    if (type === "tax_percent") {
      multiple_tax.map((item) => {
        a = a + parseFloat(item.tax_percent);
        this.setState({
          total_tax: a,
        });
      });
    }
  }

  formHandler_edit(e, index, type) {
    var a = 0;
    if (type === "tax_name") {
      this.state.edit_taxData[index].tax_name = e.target.value;
    }
    if (type === "tax_percent") {
      this.state.edit_taxData[index].tax_percent = e.target.value;
    }
    this.setState({
      loading: false,
    });

    this.state.edit_taxData.map((item) => {
      a = a + +item.tax_percent;
      this.setState({
        edit_totalTax: a,
      });
    });
  }

  addImage(type = "AddMore", index) {
    if (type === "AddMore") {
      this.setState({ loading: true });
      multiple_tax.push({ tax_name: "", tax_percent: "" });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true });
      multiple_tax.splice(index, 1);
    }
  }

  editaddtaxes(type = "AddMore", index) {
    if (type === "AddMore") {
      this.setState({ loading: true });
      this.state.edit_taxData.push({ tax_name: "", tax_percent: "" });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true });
      this.state.edit_taxData.splice(index, 1);
    }
  }

  formHandler121(e, index, type) {}
  handleChangenew(tags) {
    this.setState({ tags });
  }
  handleChangenewedit(edit_tags) {
    this.setState({ edit_tags });
  }
  onChange6(valu) {
    this.setState({ parentCat_id: valu.value });
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

    AdminApiRequest(requestData, "/admin/getVariantCat", "POST")
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
    let noError = true;
    var name = this.state.name;
    var totalTax = this.state.total_tax;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
      noError = false;
    }
    if (multiple_tax.length == 0) {
      document.querySelector(".err_multiple_tax").innerHTML =
        "Add atleast one tax";

      noError = false;
    }

    multiple_tax.forEach((item, index) => {
      if (item.tax_name == "") {
        document.querySelector(`.err_tax${index}_name`).innerHTML =
          "This field is required";

        noError = false;
      }
      if (item.tax_percent == "") {
        document.querySelector(`.err_tax${index}_percent`).innerHTML =
          "This field is required";

        noError = false;
      }
    });
    if (totalTax && noError) {
      const requestData = {
        name: name,
        totalTax: totalTax,
        taxData: JSON.stringify(multiple_tax),
      };

      AdminApiRequest(requestData, "/admin/addTax", "POST")
        .then((res) => {
          if (res.data.status == "error") {
            valueErr = document.getElementsByClassName("err_name");
            valueErr[0].innerText = res.data.result[0].name;
          } else {
            swal({
              title: "Tax added Successfully",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.setState({
              loading: false,
              modalIsOpen: false,
              total_tax: "",
            });
            multiple_tax = [];
          }
        })
        .then(() => {
          this.gettaxdata();
          this.forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  edit() {
    var id = this.state.edit_id;
    var name = this.state.edit_name;
    var taxData = this.state.edit_taxData;
    var totalTax = this.state.edit_totalTax;
    var status = this.state.edit_status;

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_edit_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (name) {
      const requestData = {
        _id: id,
        name: name,
        taxData: JSON.stringify(taxData),
        totalTax: totalTax,
        status: status,
      };

      AdminApiRequest(requestData, "/admin/updateTax", "POST")
        .then((res) => {
          if (res.data.message === "error") {
            valueErr = document.getElementsByClassName("err_edit_name");
            valueErr[0].innerText = res.data.result[0].name;
          } else {
            this.gettaxdata();
            swal({
              title: "Tax Updated Successfully",
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
        .then(() => {
          this.gettaxdata();
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

        AdminApiRequest(requestData, "/admin/deleteTax", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              this.gettaxdata();
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
          .then(() => {
            this.gettaxdata();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  editopenModal(data) {
    console.log(data);
    this.setState({
      edit_id: data._id,
      editmodalIsOpen: true,
      edit_name: data.name,
      edit_status: data.status,
      edit_taxData: data.taxData,
      edit_totalTax: data.totalTax,
      mdl_layout__obfuscator_hide: false,
    });
  }

  viewopenModal(data) {
    console.log(data);
    this.setState({
      show: true,
      mdl_layout__obfuscator_hide: true,
      editing_data: data,
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

  componentDidMount() {
    this.gettaxdata();
  }

  gettaxdata() {
    const requestData = {};

    AdminApiRequest(requestData, "/admin/getTax", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            tax_data: res.data.data,
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
                        <i className="material-icons">emoji_symbols</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="manage_up_add_btn">
                        <h4 className="card-title">Tax</h4>

                        <button
                          className="btn btn-primary m-r-5 float-right"
                          onClick={this.openModal}
                        >
                          {" "}
                          <i className="fa fa-plus"></i> Add Tax
                        </button>
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
                              <th scope="col"> Name</th>
                              <th scope="col"> Total Tax</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          {this.state.tax_data ? (
                            <tbody>
                              {this.state.tax_data.map((data, Index) => (
                                <tr>
                                  <td>{data.name}</td>
                                  <td>
                                    {data.totalTax ? data.totalTax : null}
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
                          ) : (
                            "No Data Found"
                          )}
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
                {/* Add modal here */}
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
                        <h4 className="modal-title">Add Tax</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Tax Name <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Enter Tax Name"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>
                            {multiple_tax.map((item, index) => {
                              return (
                                <div
                                  className="simple_single"
                                  style={{
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                  }}
                                >
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>
                                        {" "}
                                        Tax Name
                                        <span className="asterisk">*</span>
                                      </label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <select
                                        name={"tax_name" + index}
                                        className="form-control"
                                        onChange={(e) =>
                                          this.formHandler1(
                                            e,
                                            index,
                                            "tax_name"
                                          )
                                        }
                                        value={item.tax_name}
                                      >
                                        <option value="">
                                          ---Select Tax---
                                        </option>
                                        <option value="GST">GST</option>
                                        <option value="SGST">SGST</option>
                                        <option value="CGST">CGST</option>
                                        <option value="IGST">IGST</option>
                                        {/* <option value="UTGST">UTGST</option> */}
                                      </select>

                                      {/* <input
                                        type="text"
                                        autoComplete="off"
                                        name={"tax_name" + index}
                                        className="form-control"
                                        value={item.tax_name}
                                        onChange={(e) =>
                                          this.formHandler1(
                                            e,
                                            index,
                                            "tax_name"
                                          )
                                        }
                                        placeholder="Enter Tax Name"
                                      /> */}
                                      <span
                                        className={`err err_tax${index}_name`}
                                      ></span>
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>
                                        Tax Percentage
                                        <span className="asterisk">*</span>
                                      </label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <select
                                        // type="number"
                                        autoComplete="off"
                                        name={"tax_percent" + index}
                                        className="form-control"
                                        value={item.tax_percent}
                                        onChange={(e) =>
                                          this.formHandler1(
                                            e,
                                            index,
                                            "tax_percent"
                                          )
                                        }
                                        // placeholder="Enter Tax Percentage"
                                      >
                                        <option value="">
                                          ---Tax Percentage---
                                        </option>
                                        <option value="2.5">2.5%</option>
                                        <option value="5">5%</option>
                                        <option value="6">6%</option>
                                        <option value="12">12%</option>
                                        <option value="9">9%</option>
                                        <option value="18">18%</option>
                                        <option value="14">14%</option>
                                        <option value="28">28%</option>
                                      </select>
                                      <span
                                        className={`err err_tax${index}_percent`}
                                      ></span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {
                              <div className="modal-bottom addandremove add_var_left">
                                <button
                                  className="Add_Variant"
                                  type="button"
                                  onClick={() => this.addImage("AddMore")}
                                >
                                  Add More Taxes
                                </button>
                                <div className="err err_multiple_tax"></div>
                                <input type="hidden" name="mydata[]" />
                              </div>
                            }

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Total Tax %<span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  value={this.state.total_tax}
                                  name="total_tax"
                                  className="form-control"
                                  placeholder="Total Tax"
                                  readOnly
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
                    <div className="modal-dialog supplierscrool add-loyality-block-pop">
                      <div className="modal-content default_form_design">
                        <button
                          type="button"
                          className="close"
                          onClick={this.closeModal}
                        >
                          &times;
                        </button>
                        <h4 className="modal-title">Edit Tax</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Tax Name <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  value={this.state.edit_name}
                                  name="edit_name"
                                  className="form-control"
                                  placeholder="Enter Tax Name"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_edit_name"></span>
                              </div>
                            </div>
                            {this.state.edit_taxData &&
                              this.state.edit_taxData.map((item, index) => {
                                return (
                                  <div
                                    className="simple_single"
                                    style={{
                                      gridTemplateColumns: "repeat(2, 1fr)",
                                    }}
                                  >
                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>
                                          {" "}
                                          Tax Name
                                          <span className="asterisk">*</span>
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <select
                                          name={"tax_name" + index}
                                          className="form-control"
                                          onChange={(e) =>
                                            this.formHandler_edit(
                                              e,
                                              index,
                                              "tax_name"
                                            )
                                          }
                                          value={item.tax_name}
                                        >
                                          <option value="">
                                            ---Select Tax---
                                          </option>
                                          <option value="GST">GST</option>
                                          <option value="SGST">SGST</option>
                                          <option value="CGST">CGST</option>
                                          <option value="IGST">IGST</option>
                                          {/* <option value="UTGST">UTGST</option> */}
                                        </select>

                                        {/* <input
                                        type="text"
                                        autoComplete="off"
                                        name={"tax_name" + index}
                                        className="form-control"
                                        value={item.tax_name}
                                        onChange={(e) =>
                                          this.formHandler_edit(
                                            e,
                                            index,
                                            "tax_name"
                                          )
                                        }
                                        placeholder="Enter Tax Name"
                                      /> */}
                                        <span
                                          className={`err err_tax${index}_name`}
                                        ></span>
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>
                                          Tax Percentage
                                          <span className="asterisk">*</span>
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <select
                                          // type="number"
                                          // autoComplete="off"
                                          name={"tax_percent" + index}
                                          className="form-control"
                                          value={item.tax_percent}
                                          onChange={(e) =>
                                            this.formHandler_edit(
                                              e,
                                              index,
                                              "tax_percent"
                                            )
                                          }
                                          // placeholder="Enter Tax Percentage"
                                        >
                                          <option value="">
                                            ---Tax Percentage---
                                          </option>
                                          <option value="2.5">2.5%</option>
                                          <option value="5">5%</option>
                                          <option value="6">6%</option>
                                          <option value="12">12%</option>
                                          <option value="9">9%</option>
                                          <option value="18">18%</option>
                                          <option value="14">14%</option>
                                          <option value="28">28%</option>
                                        </select>
                                        <span
                                          className={`err err_tax${index}_percent`}
                                        ></span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            {
                              <div className="modal-bottom addandremove add_var_left">
                                <button
                                  className="Add_Variant"
                                  type="button"
                                  onClick={() => this.editaddtaxes("AddMore")}
                                >
                                  Add More Taxes
                                </button>
                                <div className="err err_multiple_tax"></div>
                                <input type="hidden" name="mydata[]" />
                              </div>
                            }

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Total Tax %<span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  value={this.state.edit_totalTax}
                                  name="edit_totalTax"
                                  className="form-control"
                                  placeholder="Total Tax"
                                  readOnly
                                />
                                <span className="err err_edit_totalTax"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Status</label>
                              </div>
                              <div className="modal-right-bx">
                                <Switch
                                  onChange={this.handleChangeStatus}
                                  checked={this.state.edit_status}
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
                                Update
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
                          <span className="view-title">Tax Name</span>
                          <span className="view-status">
                            {this.state.editing_data.name}
                          </span>
                        </li>{" "}
                        <li>
                          <span className="view-title">Tax Total</span>
                          <span className="view-status">
                            {this.state.editing_data.totalTax}
                          </span>
                        </li>
                        <li>
                          <span className="view-title">Tax Item's</span>
                          {this.state.editing_data
                            ? this.state.editing_data.taxData.map(
                                (data, index) => {
                                  return (
                                    <div>
                                      <span className="view-title">
                                        Tax Name
                                      </span>
                                      <span className="view-status">
                                        {data.tax_name}
                                      </span>
                                      <br />
                                      <span className="view-title">
                                        Tax Percentage
                                      </span>
                                      <span className="view-status">
                                        {data.tax_percent}
                                      </span>
                                    </div>
                                  );
                                }
                              )
                            : ""}
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
