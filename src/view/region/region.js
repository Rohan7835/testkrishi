import React, { Component } from "react";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import RegionData from "../../components/data.json";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";
import AddRegion from "./addRegion";
import EditRegion from "./editRegion";

export default class Region extends Component {
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
      regionData: RegionData.states,
      districtData: [],
      data: [],
      addRegionStatus: false,
      editData: [],
      loading: true,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editopenModal = this.editopenModal.bind(this);
    this.editcloseModal = this.editcloseModal.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    // this.back = this.back.bind(this);
  }

  formHandler(ev) {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  }

  async formHandler1(val, type) {
    const value = await val.target.value;
    switch (type) {
      case "state":
        this.setState({
          state: value,
          districtData: this.state.regionData
            .find((i) => i.state === value)
            .districts.map((item, ind) => {
              return { name: item, id: ind + 1 };
            }),
        });
        break;
      default:
    }
  }

  handleChangeStatus(checked) {
    console.log("checked:- ", checked, "status:- ", this.state.status);
    if (checked) {
      this.setState({ status: "true" });
    } else {
      this.setState({ status: "false" });
    }
  }

  openModal() {
    this.setState({ addRegionStatus: true });
  }

  back() {
    this.setState({
      addRegionStatus: false,
      editRegionStatus: false,
    });
    this.getRegion();
  }

  async deleteRecord(id) {
    await swal({
      title: "Are you sure",
      text: "Delete this record ?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const requestData = {
          _id: id,
        };

        AdminApiRequest(requestData, "/admin/deleteRegion", "POST", "")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              this.getRegion();
              swal({
                title: "Success",
                text: "Record Deleted Successfully !",
                icon: "success",
                successMode: true,
              });
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

  editopenModal(data) {
    this.setState({
      editRegionStatus: true,
      editData: data,
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
    this.getRegion();
  }
  getRegion() {
    this.setState({ loading: true });
    let requestData = {
      // skip:
      // limit:
    };
    AdminApiRequest(requestData, "/admin/getRegion", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
            loading: false,
          });
        } else {
        }
      })
      .then(() => this.props.back())
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
                {this.state.addRegionStatus ? (
                  <AddRegion back={() => this.back()} />
                ) : this.state.editRegionStatus ? (
                  <EditRegion
                    back={() => this.back()}
                    editData={this.state.editData}
                  />
                ) : (
                  <div className="col-md-12 ml-auto mr-auto">
                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">map</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn">
                          <h4 className="card-title">Inventory Region</h4>
                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={this.openModal}
                          >
                            {" "}
                            <i className="fa fa-plus"></i> Add Region{" "}
                          </button>
                        </div>
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
                              <th scope="col">Region Name</th>
                              <th scope="col">Region ID</th>
                              <th scope="col">States Inc.</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <>
                              {this.state.data &&
                                this.state.data.map((data, Index) => (
                                  <tr>
                                    <td style={{ textTransform: "capitalize" }}>
                                      {data.name}
                                    </td>
                                    <td style={{ textTransform: "capitalize" }}>
                                      {data._id}
                                    </td>
                                    <td style={{ textTransform: "capitalize" }}>
                                      {data.stateData[0]
                                        ? data.stateData.map((i, index) => {
                                            return (
                                              <b>
                                                {i.stateName}
                                                {index ===
                                                data.stateData.length - 1
                                                  ? ""
                                                  : ", "}
                                              </b>
                                            );
                                          })
                                        : ""}
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
                            <span className="view-title">Currency Name</span>
                            <span className="view-status">
                              {this.state.currency_name}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Currency Sign</span>
                            <span className="view-status">
                              {this.state.currency_sign}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">
                              Currency Conversion
                            </span>
                            <span className="view-status">
                              {this.state.currency_conversion}
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
                )}
              </div>
              {/* <div className="admin-footer">
                                <Adminfooter />
                            </div> */}
            </div>
          </div>
          {this.state.editRegionStatus ? (
            ""
          ) : this.state.addRegionStatus ? (
            ""
          ) : (
            <Footer />
          )}
        </div>
      </div>
    );
  }
}
