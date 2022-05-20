import moment from "moment";
import "moment-timezone";
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import "../../css/margins-min.css";
// import '../../css/admin/sb-admin.css';
import "../../css/material-dashboard.css?v=2.1.1";
import "../../css/style.css";
import Adminheader from "./elements/admin_header";
import Adminsiderbar from "./elements/admin_sidebar";
import Footer from "./elements/footer";
const options = {
  color: "rgb(145 145 145)",
  transitions: {
    show: {
      animations: {
        x: {
          from: 0,
        },
        y: {
          from: 0,
        },
      },
    },
    hide: {
      animations: {
        x: {
          to: 0,
        },
        y: {
          to: 0,
        },
      },
    },
  },
  scales: {
    xAxes: {
      display: true,
      gridLines: {
        zeroLineColor: "#ffcc33",
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 4,
      },
    },

    yAxes: {
      display: true,
      ticks: {
        beginAtZero: true,
        fontColor: "white",
      },
    },
  },
};

const dummyData = [
  { label: "1 Jan", sales: 10 },
  { label: "15 Jan", sales: 12 },
  { label: "1 Feb", sales: 10 },
  { label: "15 Feb", sales: 12 },
  { label: "1 March", sales: 20 },
  { label: "15 March", sales: 20 },
  { label: "1 April", sales: 15 },
  { label: "15 April", sales: 15 },
  { label: "1 May", sales: 35 },
  { label: "15 May", sales: 35 },
  { label: "1 June", sales: 75 },
  { label: "15 June", sales: 75 },
  { label: "1 July", sales: 62 },
  { label: "15 July", sales: 62 },
  { label: "1 August", sales: 48 },
  { label: "15 August", sales: 48 },
  { label: "1 September", sales: 85 },
  { label: "15 September", sales: 85 },
  { label: "1 October", sales: 80 },
  { label: "15 October", sales: 80 },
  { label: "1 November", sales: 75 },
  { label: "15 November", sales: 75 },
  { label: "1 December", sales: 70 },
  { label: "15 December", sales: 70 },
];

class DashboardAnalytics extends Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    var date = new Date();
    this.state = {
      admin_data: dt,
      selected_date: new Date(),
      current_date: new Date(),
      userData: JSON.parse(localStorage.getItem("adminInfo")),
      permits: [],
      total_sales: 0,
      daily_sales: 0,
      date_range: [
        {
          startDate: new Date(date.getFullYear(), date.getMonth(), 1),
          endDate: new Date(),
          key: "selection",
        },
      ],
      final_data: {
        labels: [],
        datasets: [
          {
            label: "Total Amount",
            backgroundColor: "rgb(254, 188, 21)",
            data: [],
          },
        ],
      },
    };
  }

  async componentDidMount() {
    if (!JSON.parse(localStorage.getItem("storeheyLoggedIn"))) {
      this.props.history.push("/storehey");
    }
    var date = new Date();
    const requestData = {
      startDateTime: moment(
        new Date(date.getFullYear(), date.getMonth(), 1)
      ).format("YYYY-MM-DD 00:00"),
      endDateTime: moment(new Date()).format("YYYY-MM-DD 00:00"),
    };
    AdminApiRequest(requestData, "/admin/analytics-dashboard", "POST")
      .then((res) => {
        var chartData;
        if (res.status === 201 || res.status === 200) {
          this.setState({
            total_sales:
              res.data.Total_sale.length > 0
                ? res.data.Total_sale[0].total_payment
                : 0,
            totalOrders: res.data.Total_order || 0,
          });
          chartData =
            res.data.data.length > 0
              ? res.data.data.map((s) => {
                  return {
                    label: moment(s.label).format("MMM DD, YYYY"),
                    sales: s.sales.length > 0 ? s.sales[0].total_payment : 0,
                  };
                })
              : [];

          setTimeout(() => {
            var data = {
              labels: chartData.map((d) => d.label),
              datasets: [
                {
                  label: "Total Amount",
                  backgroundColor: "rgb(254, 188, 21)",
                  data: chartData.map((d) => d.sales),
                },
              ],
            };
            this.setState({
              final_data: data,
            });
            if (chartData.length > 20) {
              options.scales.xAxes.ticks.maxTicksLimit = 10;
            } else {
              options.scales.xAxes.ticks.maxTicksLimit = chartData.length;
            }
          }, 0);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.setState({ permits: await this.state.userData.user_role.modules });
  }

  checkPermit(element) {
    return this.state.permits.find((i) => {
      return i.toLowerCase() === element.toLowerCase();
    });
  }

  changeDateRange = (item) => {
    this.setState({
      date_range: [item.selection],
    });
    const data = {
      startDateTime: moment(item.selection.startDate).format(
        "YYYY-MM-DD 00:00"
      ),
      endDateTime: moment(item.selection.endDate).format("YYYY-MM-DD 00:00"),
    };
    AdminApiRequest(data, "/admin/analytics-dashboard", "POST")
      .then((res) => {
        var chartData;
        if (res.status === 201 || res.status === 200) {
          this.setState({
            total_sales:
              res.data.Total_sale.length > 0
                ? res.data.Total_sale[0].total_payment
                : 0,
            totalOrders: res.data.Total_order || 0,
          });
          chartData = res.data.data.map((s) => {
            return {
              label: moment(s.label).format("MMM DD, YYYY"),
              sales: s.sales.length > 0 ? s.sales[0].total_payment : 0,
            };
          });
        } else {
        }
        setTimeout(() => {
          var data = {
            labels: chartData.map((d) => d.label),
            datasets: [
              {
                label: "Total Amount",
                backgroundColor: "rgb(254, 188, 21)",
                data: chartData.map((d) => d.sales),
              },
            ],
          };
          this.setState({
            final_data: data,
          });
          if (chartData.length > 20) {
            options.scales.xAxes.ticks.maxTicksLimit = 10;
          } else {
            options.scales.xAxes.ticks.maxTicksLimit = chartData.length;
          }
        }, 0);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  showDropdown = () => {
    document.querySelector(".dropdown-menu-custom").classList.remove("show");
  };
  openDropdown = () => {
    setTimeout(() => {
      document.querySelector(".dropdown-menu-custom").classList.add("show");
    }, 10);
  };

  render() {
    const totalOrders = this.state.totalOrders;
    const totalSales = this.state.total_sales;
    return (
      <div className="wrapper ">
        {this.state.admin_data ? <Adminsiderbar /> : ""}
        <div className="main-panel" onClick={() => this.showDropdown()}>
          {this.state.admin_data ? <Adminheader /> : ""}
          <div className="content px-4 py-3 analytic-container-dashboard">
            <div
              className="analytic-heading  d-flex justify-content-between align-items-center"
              style={{
                padding: "",
              }}
            >
              <div className="left">
                <h3>Sales</h3>
                <p>Welcome to Analytic Dashboard</p>
              </div>
              <div className="dropdown-custom">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Select Time Range
                </button>
                <div
                  className="dropdown-menu dropdown-menu-custom"
                  onClick={() => this.openDropdown()}
                >
                  <div onClick={() => this.openDropdown()}>
                    <DateRange
                      onClick={() => this.openDropdown()}
                      editableDateInputs={true}
                      onChange={(item) => this.changeDateRange(item)}
                      moveRangeOnFirstSelection={false}
                      ranges={this.state.date_range}
                      rangeColors={["#FEBC15"]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div className="row dashboard-home-h analytic-cards">
                <div className="col-lg-8 col-md-8 col-sm-12">
                  <div className="card card-big">
                    <div className="card-heading">
                      <p>Sales</p>
                    </div>
                    <div className="card-body">
                      <div className="chart-container">
                        <Bar
                          data={this.state.final_data}
                          options={options || []}
                          height={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="row sales-numbers">
                    <div className="col-md-12">
                      <div className="card card-small">
                        <div className="row align-items-center">
                          <div className="col-md-8">
                            <div className="card-heading">Total Sales</div>
                            <div className="card-body">
                              ₹{totalSales.toFixed(2)}
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="analytic-icon">
                              <i className="fas fa-chart-line"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="card card-small">
                        <div className="row align-items-center">
                          <div className="col-md-8">
                            <div className="card-heading">
                              {/* Daily Sales */}
                              Total Orders
                            </div>
                            <div className="card-body">{totalOrders || 0}</div>
                          </div>
                          <div className="col-md-4">
                            <div className="analytic-icon">
                              <i className="fas fa-receipt"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="card card-big">
                    <div className="card-heading">Customers</div>
                    <div className="card-body">
                      <div
                        className="chart-container"
                        style={{ position: "relative", maxHeight: 280 }}
                      >
                        <Doughnut
                          data={customerData}
                          style={{ maxHeight: 260 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 col-md-8 col-sm-12">
                  <div className="card card-big">
                    <div className="card-heading d-flex justify-content-between">
                      <p>Customer</p>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Select Time Range
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="javascript:void(0);">
                            This month
                          </a>
                          <a className="dropdown-item" href="javascript:void(0);">
                            This Quarter
                          </a>
                          <a className="dropdown-item" href="javascript:void(0);">
                            This Year
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="chart-container">
                        <Line
                          data={this.state.final_data_customer}
                          options={options}
                          height={100}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* <div className="col-lg-6 col-md-6 col-sm-6">
                  <div className="row" style={{ height: "100%" }}>
                    <div className="col-md-12 text-center">
                      <div
                        className="card card-stats"
                        style={{ maxWidth: 600 }}
                      >
                        <div className="card-header card-header-warning card-header-icon">
                          <div className="card-icon">
                            <i className="material-icons">attach_money</i>
                          </div>
                          <p className="card-category">Total Sales</p>
                          <h3 className="card-title">
                            {totalSales.toFixed(2)}
                          </h3>
                        </div>
                        <div className="card-footer"></div>
                      </div>
                    </div>
                    <div className="col-md-12 text-center">
                      <div
                        className="card card-stats"
                        style={{ maxWidth: 600 }}
                      >
                        <div className="card-header card-header-warning card-header-icon">
                          <div className="card-icon">
                            <i className="material-icons">
                              account_balance_wallet
                            </i>
                          </div>
                          <p className="card-category">Daily Sales</p>
                          <h3 className="card-title">
                            {totalOrders.toFixed(2)}
                          </h3>
                        </div>
                        <div className="card-footer">
                          <div
                            className="stats"
                            style={{ marginLeft: "115px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                */}
                {/* <div className="col-lg-6 col-md-6 col-sm-6 text-center">
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => this.changeDateRange(item)}
                    moveRangeOnFirstSelection={false}
                    ranges={this.state.date_range}
                    rangeColors={["#FEBC15"]}
                  />
                </div> */}
              </div>
              {/* <Line data={this.state.final_data} options={options} /> */}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default DashboardAnalytics;
