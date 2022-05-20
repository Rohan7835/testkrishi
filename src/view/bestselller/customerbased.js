import React, { Component } from "react";
import Moment from "react-moment";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";

export default class fivebestseller extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
      var ad_data = JSON.parse(dt);
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_data: ad_data,
      modalIsOpen: false,
      editmodalIsOpen: false,
      show: false,
      mdl_layout__obfuscator_hide: false,
      status: true,
      customer_name: "",
      email: "",
      mobile_no: "",
      total_amount: "",
      created_date: new Date(),
      newdatetime: new Date(),
      order_status: "",
      order_status_show: "All",
      orderdata: [],
      allsingledata: "",
      category: [],
      product: [],
      customer_data: [],
      dropdownColor: [],
      dropdownSize: [],
      activ_supplier: [],
      options: [
        { name: "Swedish", value: "sv" },
        { name: "English", value: "en" },
      ],
      count: "",
      skip: 0,
      limit: 20,
      currentPage: 1,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: "true" });
    } else {
      this.setState({ status: "false" });
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  viewopenModal(dt) {
    this.setState({
      allsingledata: dt,
    });
    this.setState({ show: true });
    this.setState({ mdl_layout__obfuscator_hide: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  viewcloseModal() {
    this.setState({ show: false });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }

  onChangelist = (data) => {
    this.setState({
      order_status_show: data,
    });
  };

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;
  }

  componentDidMount() {
    const requestData = {};
    AdminApiRequest(requestData, "/admin/TopTenCustomer", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            customerbased: res.data.data,
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
                        <i className="material-icons">shopping_cart</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">
                        Top 10 customers based on no. of orders
                      </h4>
                      <div className="table-responsive">
                        <table
                          id="datatables"
                          className="table table-striped table-no-bordered table-hover"
                          cellSpacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th scope="col">Name</th>
                              <th scope="col">Contact Number</th>
                              <th scope="col">Total order</th>
                              <th scope="col">Total Amount</th>
                              <th scope="col">Last order</th>
                              {/* <th scope="col">Action</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {console.log(
                              "length of array",
                              this.state.customerbased
                            )}
                            {this.state.customerbased &&
                            this.state.customerbased.length > 0 ? (
                              this.state.customerbased.map((item, Index) => (
                                <tr>
                                  <td>
                                    {item.user && item.user.name
                                      ? item.user.name
                                      : ""}
                                  </td>
                                  <td>
                                    {item.user && item.user.contactNumber
                                      ? item.user.contactNumber
                                      : ""}
                                  </td>
                                  <td>{item.totalOrder}</td>
                                  <td>
                                    {item.totalAmount
                                      ? item.totalAmount.toFixed(2)
                                      : ""}
                                  </td>
                                  <td>
                                    {item.LOrderDate === null ? (
                                      ""
                                    ) : (
                                      <Moment format="DD/MM/YYYY">
                                        {item.LOrderDate}
                                      </Moment>
                                    )}
                                  </td>
                                  {/* <td>
                                      <i
                                        className="fa fa-eye hover-with-cursor m-r-5"
                                        onClick={this.viewopenModal.bind(
                                          this,
                                          item
                                        )}
                                      ></i>
                                    </td> */}
                                </tr>
                              ))
                            ) : (
                              <tr></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <Pagination
                hideNavigation
                activePage={this.state.currentPage}
                itemsCountPerPage={this.state.limit}
                totalItemsCount={this.state.count}
                onChange={this.handlePageChange}
              /> */}
            </div>
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
              {this.state.allsingledata ? (
                <div className="view-box">
                  <ul>
                    <li>
                      <span className="view-title">Booking ID</span>
                      <span className="view-status">
                        {this.state.allsingledata.booking_code}
                      </span>
                    </li>
                    <li>
                      <span className="view-title">Customer Name</span>
                      <span className="view-status">
                        {this.state.allsingledata.user_id.name}
                      </span>
                    </li>
                    <li>
                      <span className="view-title">Mobile Number</span>
                      <span className="view-status">
                        {this.state.allsingledata.user_id.contactNumber}
                      </span>
                    </li>
                    <li>
                      <span className="view-title">Email Id</span>
                      <span className="view-status">
                        {" "}
                        {this.state.allsingledata.user_id.email}
                      </span>
                    </li>
                    <li>
                      <span className="view-title">Payment</span>
                      <span className="view-status">
                        {this.state.allsingledata.payment}
                      </span>
                    </li>
                    <li>
                      <span className="view-title">Total Cart Price</span>
                      <span className="view-status">
                        {this.state.allsingledata.totalCartPrice}
                      </span>
                    </li>
                    <li>
                      <span className="view-title">Total Payment</span>
                      <span className="view-status">
                        {this.state.allsingledata.total_payment}
                      </span>
                    </li>
                    <li>
                      <span className="view-title">Date</span>
                      <span className="view-status">
                        <Moment format="DD/MM/YYYY">
                          {this.state.created_at}
                        </Moment>
                      </span>
                    </li>
                  </ul>
                  {this.state.allsingledata.bookingdetail.length > 0
                    ? this.state.allsingledata.bookingdetail.map((item) =>
                        item.simpleItem ? (
                          <>
                            <li>
                              <span className="view-title">Package</span>
                              <span className="view-status">
                                {item.simpleItem.packet_size}{" "}
                                {item.simpleItem.packetLabel}
                              </span>
                            </li>
                            <li>
                              <span className="view-title">Selling Price</span>
                              <span className="view-status">
                                {item.simpleItem.selling_price}
                              </span>
                            </li>
                          </>
                        ) : (
                          ""
                        )
                      )
                    : ""}
                </div>
              ) : (
                ""
              )}
            </div>
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
