import moment from "moment";
import "moment-timezone";
import React, { Component } from "react";
import DateTimePicker from "react-datetime-picker";
import Pagination from "react-js-pagination";
import ReactLoading from "react-loading";
import Moment from "react-moment";
import SelectSearch from "react-select-search";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
import { DynamicUrl } from "../../../common";
import Adminfooter from "../elements/admin_footer";
import Adminheader from "../elements/admin_header";
import Adminsiderbar from "../elements/admin_sidebar";
import Globalloader from "../elements/loader";

const options = [
  { name: "Available Quantity Report", value: "RemainQuantityReport" },
  { name: "Customer Data Report", value: "CustomerDataReport" },
  { name: "Inventory list", value: "Inventorylist" },
  { name: "Inhouse", value: "inhouse" },
  { name: "Lost", value: "lost" },
  { name: "Return", value: "return" },
  { name: "Item Sales Consolidated list", value: "ItemSalesConsolidatedlist" },
  { name: "Lost Business Report", value: "LostBusinessReport" },
  { name: "Orderwise Item sales Data", value: "OrderWiseItemSalesData" },
  { name: "Sales Report with Taxation", value: "SalesReportWithTaxation" },
  { name: "First Time Customer Data", value: "FirstTimeCustomerDataReport" },
  { name: "Orderwise sales summmary", value: "OrderWiseSalesSummmary" },
  { name: "Bill Supplier", value: "BillSupplier" },
  { name: "Wallet Ledger", value: "Wallet" },
  { name: "Cash Ledger", value: "COD" },
  { name: "Online Payment Ledger", value: "Paytm" },
  { name: "Credit Ledger", value: "Credit" },
  { name: "Return", value: "return" },
  {
    name: "Item Sales Data With Revenue Report",
    value: "ItemSalesDataWithRevenueReport",
  },
  // ,
];

export default class reportgeneration extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      loader: false,
      loading: true,
      current_date: new Date(),
      modalIsOpen: false,
      editmodalIsOpen: false,
      show: false,
      mdl_layout__obfuscator_hide: false,
      admin_id: "",
      name: "",
      status: true,
      data: [],
      searchLoading: false,
      data1: [],
      primary_id: "",
      recentevent: [],
      searchdata: [],
      report_type: "",
      from_date: "",
      to_date: "",
      productvariant: [],
      total_amount: 0,
      userdata: [],
      count: 1,
      skip: 0,
      limit: 20,
      currentPage: 1,
      supplierData: [],
      supplierId: "",
    };

    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.downloadfile = this.downloadfile.bind(this);
    this.search = this.search.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;

    const data = {
      skip: skip,
      limit: this.state.limit,
    };

    AdminApiRequest(data, "/admin/CSVReportListing", "POST", "")
      .then((res) => {
        if (res.data.status == "error") {
          swal({
            title: "warning",
            text: "Network error !",
            icon: "danger",
            successMode: true,
          });
        } else {
          this.setState({
            alldate: res.data.data,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  search() {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!this.state.to_date && !this.state.disableTimeInputs) {
      valueErr = document.getElementsByClassName("err_todate");
      valueErr[0].innerText = "Required";
    }
    if (!this.state.from_date && !this.state.disableTimeInputs) {
      valueErr = document.getElementsByClassName("err_fromdate");
      valueErr[0].innerText = "Required";
    }
    if (!this.state.report_type) {
      valueErr = document.getElementsByClassName("err_report_type");
      valueErr[0].innerText = "Required";
    }
    if (
      ((this.state.to_date && this.state.from_date) ||
        this.state.disableTimeInputs) &&
      this.state.report_type
    ) {
      this.setState({ searchLoading: true });
      const data = {
        startDateTime: this.state.to_date
          ? moment(this.state.to_date).format("YYYY-MM-DD HH:mm")
          : "",
        endDateTime: this.state.from_date
          ? moment(this.state.from_date).format("YYYY-MM-DD HH:mm")
          : "",
        reportType: this.state.report_type,
        user_id: this.state.user,
        supplier_id: this.state.supplierId,
      };
      AdminApiRequest(data, "/admin/CSVReportGenrate", "POST", "")
        .then((res) => {
          if (res.data.status == "error") {
            swal({
              title: "Error",
              text: "Network error!",
              icon: "warning",
              successMode: true,
            });
          } else {
            window.location.assign(
              DynamicUrl + "reports/" + res.data.data.fileName
            );
            this.getalldatacsv();
            swal({
              title: "Success",
              text: "Report Generated successfully !",
              icon: "success",
              successMode: true,
            });
            this.setState({
              loading: false,
              user: "",
              to_date: "",
              from_date: "",
              report_type: "",
              user: "",
              supplierId: "",
            });
          }
        })
        .then(() => {
          this.setState({ searchLoading: false });
        })
        .catch((error) => {
          console.log(error);
        });
      this.getalldatacsv();
    }
    this.setState({
      loading: false,
    });
  }
  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
    console.clear();
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: "true" });
    } else {
      this.setState({ status: "false" });
    }
  }
  onChange3 = (to_date) => {
    this.setState({
      to_date: to_date,
    });
  };
  onChange4 = (from_date) => {
    this.setState({
      from_date: from_date,
    });
  };
  onChange8(e) {
    this.setState({ report_type: e.value });
    if (e.value === "RemainQuantityReport") {
      this.setState({ disableTimeInputs: true });
    } else {
      this.setState({ disableTimeInputs: false });
    }
  }
  onChange81(e) {
    this.setState({ user: e.value });
  }

  downloadfile = (dta) => {
    window.location.assign(DynamicUrl + "reports/" + dta);
  };

  componentDidMount() {
    this.getalldatacsv();
    AdminApiRequest(null, "/admin/usersGetAllActive", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item) =>
            this.state.userdata.push({ name: item.name, value: item._id })
          );
          this.setState({
            loading: false,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    AdminApiRequest(null, "/admin/supplier_master", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let suppliers = [];
          res.data.data.forEach((item) =>
            suppliers.push({ name: item.name, value: item._id })
          );
          this.setState({
            loading: false,
            supplierData: suppliers,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getalldatacsv = () => {
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
    };

    AdminApiRequest(data, "/admin/CSVReportListing", "POST", "")
      .then((res) => {
        if (res.data.status == "error") {
          swal({
            title: "warning",
            text: "Network error !",
            icon: "danger",
            successMode: true,
          });
        } else {
          this.setState({
            alldate: res.data.data,
            count: res.data.count,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
                    <div className="card-body report_new_adminn report-block-wrap">
                      <h4 className="card-title report-title pb-5 d-block margin-bottom-4">
                        {" "}
                        Report{" "}
                      </h4>
                      <div className="rport-row-wrp">
                        <SelectSearch
                          name="report_type"
                          onChange={(e) => this.onChange8(e)}
                          options={options}
                          className="select-search"
                          value={this.state.report_type}
                          placeholder="REPORT TYPE"
                        ></SelectSearch>
                        <span
                          className="err err_report_type"
                          style={{ display: "block" }}
                        ></span>
                      </div>
                      {this.state.report_type === "cod" ||
                      this.state.report_type === "paytm" ? (
                        <SelectSearch
                          name="user"
                          onChange={(e) => this.onChange81(e)}
                          options={this.state.userdata}
                          className="select-search"
                          value={this.state.user}
                          placeholder="Choose User"
                        ></SelectSearch>
                      ) : (
                        <></>
                      )}
                      {this.state.report_type === "BillSupplier" ? (
                        <SelectSearch
                          name="Supplier"
                          onChange={(e) => {
                            this.setState({ supplierId: e.value });
                          }}
                          options={this.state.supplierData}
                          className="select-search"
                          value={this.state.supplierId}
                          placeholder="Choose Supplier"
                        ></SelectSearch>
                      ) : (
                        <></>
                      )}
                      {this.state.disableTimeInputs ? (
                        ""
                      ) : (
                        <div className="rport-row-wrp">
                          <DateTimePicker
                            dayPlaceholder="DD"
                            monthPlaceholder="MM"
                            yearPlaceholder="YYYY"
                            hourPlaceholder="00"
                            minutePlaceholder="00"
                            secondPlaceholder="00"
                            format="dd/MM/y HH:mm"
                            // format="dd/MM/y"
                            onChange={this.onChange3}
                            maxDate={this.state.current_date}
                            value={this.state.to_date}
                            disableClock={false}
                          />
                          <span
                            className="err err_todate"
                            style={{ display: "block" }}
                          ></span>
                        </div>
                      )}
                      {this.state.disableTimeInputs ? (
                        ""
                      ) : (
                        <div className="rport-row-wrp">
                          <DateTimePicker
                            dayPlaceholder="DD"
                            monthPlaceholder="MM"
                            yearPlaceholder="YYYY"
                            // format="dd/MM/y"
                            format="dd/MM/y HH:mm"
                            hourPlaceholder="00"
                            minutePlaceholder="00"
                            secondPlaceholder="00"
                            onChange={this.onChange4}
                            minDate={this.state.to_date}
                            maxDate={this.state.current_date}
                            value={this.state.from_date}
                            disableClock={false}
                          />
                          {/* <DatePicker
                          onChange={this.onChange4}
                          minDate={this.state.to_date}
                          maxDate={this.state.current_date}
                          value={this.state.from_date}
                          dateFormat="DD-MM-YYYY"
                        /> */}
                          <span
                            className="err err_fromdate"
                            style={{ display: "block" }}
                          ></span>
                        </div>
                      )}

                      <div>
                        {this.state.searchLoading ? (
                          <button className="btn btn-info btn-lg">
                            <i
                              className="fa fa-spinner searchLoading"
                              aria-hidden="true"
                              style={{ position: "unset" }}
                            ></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-info"
                            onClick={this.search}
                            style={{ fontSize: 14 }}
                          >
                            <i className="fa fa-search"></i>{" "}
                            <span style={{ fontSize: 12 }}>
                              Generate Report
                            </span>{" "}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="form-box"></div>
                    <div className="listing-table-bx pixelmgmt-view-coupon report-table">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Date</th>
                            <th scope="col"> Report Type </th>
                            <th scope="col">Date Range </th>
                            <th scope="col">Download </th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.alldate ? (
                            this.state.alldate.map((Data, Index) => (
                              <tr key={Index}>
                                <td>
                                  {" "}
                                  <Moment format="DD/MM/YYYY hh:mm:ss A">
                                    {Data.created_at}
                                  </Moment>
                                </td>
                                <td style={{ textTransform: "capitalize" }}>
                                  {Data.name}
                                </td>
                                <td>
                                  {Data.startDate ? (
                                    <Moment format="DD/MM/YYYY hh:mm:ss A">
                                      {Data.startDate}
                                    </Moment>
                                  ) : (
                                    ""
                                  )}{" "}
                                  -{" "}
                                  {Data.endDate ? (
                                    <Moment format="DD/MM/YYYY hh:mm:ss A">
                                      {Data.endDate}
                                    </Moment>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td>
                                  <button
                                    onClick={this.downloadfile.bind(
                                      this,
                                      Data.fileName
                                    )}
                                  >
                                    <i
                                      className="fa fa-download"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : this.state.loading ? (
                            <tr>
                              <td colSpan="4">
                                <ReactLoading
                                  type={"cylon"}
                                  color={"#febc15"}
                                  height={"60px"}
                                  width={"60px"}
                                  className="m-auto"
                                />
                              </td>
                            </tr>
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
        <div className={this.state.loader === true ? "loader" : "noloader"}>
          <Globalloader />
        </div>

        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
