import moment from "moment";
import React, { Component } from "react";
import "react-accessible-accordion/dist/fancy-example.css";
import Pagination from "react-js-pagination";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import SelectSearch from "react-select-search";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { imageUrl } from "../../imageUrl";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";

const displayBlock = {
  display: "block",
};
export default class viewproduct extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
      var admin = JSON.parse(dt);
      console.log(admin);
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_id: admin._id,
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
      order_status: "",
      order_status_show: "pending",
      orderdata: [],
      allsingledata: "",
      category: [],
      product: [],
      customer_data: [],
      dropdownColor: [],
      dropdownSize: [],
      // all_product: [],
      options: [
        { name: "Swedish", value: "sv" },
        { name: "English", value: "en" },
      ],
      count: 1,
      skip: 0,
      limit: 20,
      currentPage: 1,
      viewing: false,
      inventory_view: false,
      inventory_data: [],
      product_name_search: "",
      product_cat_search: "",
      status_search: "",
      searchCategoryOptions: [],
      selectedSearchCat_id: "",
    };

    this.openModal = this.openModal.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.viewinventory = this.viewinventory.bind(this);
    this._handleStatus = this._handleStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
      loading: true,
    });
    var skip = (pageNumber - 1) * this.state.limit;
    this.setState({
      skip: skip,
    });
    this.getcustomerfilter(skip);
  }

  backtoproducts = () => {
    this.setState({
      viewing: false,
    });
  };

  backtoproduct = () => {
    this.setState({
      viewing: false,
      inventory_view: false,
    });
  };

  _handleProduct(item) {
    // var productSelected = {
    //   data: item,
    //   quantity: this.state[item._id] ? this.state[item._id] : 1,
    // };
    // localStorage.setItem('data', JSON.stringify(productSelected))
    // window.location = '/product'
  }

  handlecolor() {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!this.state.color) {
      valueErr = document.getElementsByClassName("err_color");
      valueErr[0].innerText = "Please Select Color";
    } else {
      valueErr = document.getElementsByClassName("err_color");
      valueErr[0].innerText = "";
    }
    if (!this.state.size) {
      valueErr = document.getElementsByClassName("err_size");
      valueErr[0].innerText = "Please Select Size";
    } else {
      valueErr = document.getElementsByClassName("err_size");
      valueErr[0].innerText = "";
    }
  }

  getProductColor = (data) => {
    const requestData = {
      our_product_code: this.state.our_product_code,
      color: this.state.color,
    };
    // AdminApiRequest(requestData, '/get_product_size_by_code', 'POST', '', '')
    AdminApiRequest(requestData, "/size_master/active", "GET", "", "")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({ dropdownSize: res.data.data, size: "" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  minus = (quantity, ide) => {
    if (quantity <= 1) {
    } else {
      this.setState({ [ide]: quantity - 1 });
    }
  };

  plus = (quantity, ide) => {
    this.setState({ [ide]: quantity + 1 });
  };

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  _handleStatus(data, status) {
    // var admin_id = this.state.admin_id;
    const requestData = {
      // admin_id: admin_id,
      _id: data._id,
      status: JSON.stringify(status),
    };
    // AdminApiRequest(requestData, "/update/product", "POST")
    AdminApiRequest(requestData, "/updateProductStatus", "POST")
      .then((res) => {
        if (res.data.status === "error") {
          this.setState({ loading: false });
        } else {
          this.setState({ loading: false });
          swal({
            title: "Success",
            text: "Product Status Updated Successfully !",
            icon: "success",
            successMode: true,
          });
          const data1 = {
            skip: this.state.skip,
            limit: this.state.limit,
            product_name: this.state.product_name_search,
            product_categories: this.state.selectedSearchCat_id.value,
            status:
              this.state.status_search === "active"
                ? true
                : this.state.status_search === ""
                ? ""
                : this.state.status_search === "inactive" && false,
          };
          AdminApiRequest(data1, "/admin/getAll/product", "POST")
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                this.setState({
                  viewproduct: res.data.data,
                  count: res.data.count,
                });
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _handleSameDayDeliveryStatus(data, status) {
    const requestData = {
      _id: data._id,
      sameDayDelivery: JSON.stringify(status),
    };
    AdminApiRequest(requestData, "/admin/updateSameDayDlvryStatus", "POST")
      .then((res) => {
        if (
          res.data.status === "error" ||
          (res.status !== 200 && res.status !== 201)
        ) {
          this.setState({ loading: false });
          swal({
            title: "Error",
            text: "Network Error",
            icon: "warning",
            successMode: true,
          });
        } else {
          this.setState({ loading: false });
          swal({
            title: "Success",
            text: "Product Status Updated Successfully !",
            icon: "success",
            successMode: true,
          });
          const data1 = {
            skip: this.state.skip,
            limit: this.state.limit,
            product_name: this.state.product_name_search,
            product_categories: this.state.selectedSearchCat_id.value,
            status:
              this.state.status_search === "active"
                ? true
                : this.state.status_search === ""
                ? ""
                : this.state.status_search === "inactive" && false,
          };
          AdminApiRequest(data1, "/admin/getAll/product", "POST")
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                this.setState({
                  viewproduct: res.data.data,
                  count: res.data.count,
                });
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _handleFarmPickupStatus(data, status) {
    const requestData = {
      _id: data._id,
      farmPickup: JSON.stringify(status),
    };
    AdminApiRequest(requestData, "/admin/updateFarmPickUpStatus", "POST")
      .then((res) => {
        if (
          res.data.status === "error" ||
          (res.status !== 200 && res.status !== 201)
        ) {
          this.setState({ loading: false });
          swal({
            title: "Error",
            text: "Network Error",
            icon: "warning",
            successMode: true,
          });
        } else {
          this.setState({ loading: false });
          swal({
            title: "Success",
            text: "Product Status Updated Successfully !",
            icon: "success",
            successMode: true,
          });
          const data1 = {
            skip: this.state.skip,
            limit: this.state.limit,
            product_name: this.state.product_name_search,
            product_categories: this.state.selectedSearchCat_id.value,
            status:
              this.state.status_search === "active"
                ? true
                : this.state.status_search === ""
                ? ""
                : this.state.status_search === "inactive" && false,
          };
          AdminApiRequest(data1, "/admin/getAll/product", "POST")
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                this.setState({
                  viewproduct: res.data.data,
                  count: res.data.count,
                });
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _handleCatelogStatus(data, status) {
    const requestData = {
      _id: data._id,
      showstatus: JSON.stringify(status),
    };
    AdminApiRequest(requestData, "/updateProductShowStatus", "POST")
      .then((res) => {
        if (
          res.data.status === "error" ||
          (res.status !== 200 && res.status !== 201)
        ) {
          this.setState({ loading: false });
          swal({
            title: "Error",
            text: "Network Error",
            icon: "warning",
            successMode: true,
          });
        } else {
          this.setState({ loading: false });
          swal({
            title: "Success",
            text: "Product Status Updated Successfully !",
            icon: "success",
            successMode: true,
          });
          const data1 = {
            skip: this.state.skip,
            limit: this.state.limit,
            product_name: this.state.product_name_search,
            product_categories: this.state.selectedSearchCat_id.value,
            status:
              this.state.status_search === "active"
                ? true
                : this.state.status_search === ""
                ? ""
                : this.state.status_search === "inactive" && false,
          };
          AdminApiRequest(data1, "/admin/getAll/product", "POST")
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                this.setState({
                  viewproduct: res.data.data,
                  count: res.data.count,
                });
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  selectonchnhe = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  updatestatus = () => {
    var id = this.state.edit_id;
    var status = this.state.order_status;

    if ((id, status)) {
      const requestData = {
        id: id,
        status: status,
      };
      AdminApiRequest(requestData, "/admin/updateOrderStatus", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Order updated Successfully !",
              icon: "success",
              successMode: true,
            }).then((willDelete) => {
              window.location.reload();
            });
            this.setState({
              mdl_layout__obfuscator_hide: false,
              editmodalIsOpen: false,
            });
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  viewopenModal(dt) {
    console.log(dt);
    this.setState({
      allsingledata: dt,
      viewing: true,
    });
  }

  viewinventory(dt) {
    const data1 = {
      product_id: dt,
    };
    AdminApiRequest(data1, "/GetAllInventoryByProduct", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            inventory_data: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.setState({
      inventory_view: true,
    });

    this.setState({ editmodalIsOpen: true });
    this.setState({ mdl_layout__obfuscator_hide: true });
  }

  componentDidMount() {
    this.setState({ loading: true });
    const requestData = {};
    // AdminApiRequest(requestData, "/admin/product/allActiveProducts", "GET")
    //   .then((res) => {
    //     if (res.status === 201 || res.status === 200) {
    //       res.data.data.forEach((item) => {
    //         this.state.all_product.push({
    //           value: item._id,
    //           name: item.product_name,
    //         });
    //       });
    //       this.setState({
    //         loading: false,
    //       });
    //     } else {
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    const data1 = {
      skip: this.state.skip,
      limit: this.state.limit,
    };
    AdminApiRequest(data1, "/admin/getAll/product", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            viewproduct: res.data.data,
            count: res.data.count,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    AdminApiRequest(requestData, "/admin/product_category", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let catOptions = [];
          res.data.data[0].forEach((cat) => {
            catOptions.push({
              name: cat.category_name,
              value: cat._id,
            });
          });
          this.setState({
            category: res.data.data,
            searchCategoryOptions: catOptions,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    AdminApiRequest(requestData, "/admin/usersGetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            customer_data: res.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  searchInputFunction = (e) => {};

  formHandler1(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  getcustomerfilter = (skipParam) => {
    this.setState({ loading: true });
    const requestData = {
      skip: skipParam ? skipParam : 0,
      limit: this.state.limit,
      product_name: this.state.product_name_search,
      product_categories: this.state.selectedSearchCat_id.value,
      status:
        this.state.status_search === "active"
          ? true
          : this.state.status_search === ""
          ? ""
          : this.state.status_search === "inactive" && false,
    };
    AdminApiRequest(requestData, "/admin/getAll/product", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            viewproduct: res.data.data,
            count: res.data.count,
            // currentPage: 1,
          });
        } else {
        }
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  resetFilters() {
    this.setState({
      status_search: "",
      product_name_search: "",
      loading: true,
    });
    const data1 = {
      skip: this.state.skip,
      limit: this.state.limit,
    };
    AdminApiRequest(data1, "/admin/getAll/product", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            viewproduct: res.data.data,
            count: res.data.count,
            currentPage: 1,
          });
        } else {
        }
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({
      driver_name_search: "",
      driver_mobile_search: "",
      selectedSearchCat_id: "",
    });
  }

  render() {
    return (
      <div className="wrapper ">
        <Adminsiderbar />
        <div className="main-panel">
          <Adminheader />
          {this.state.inventory_view === false ? (
            <div className="content">
              {this.state.viewing === false ? (
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12 ml-auto mr-auto">
                      <div className="card">
                        <div className="card-header card-header-primary card-header-icon">
                          <div className="card-icon">
                            <i className="material-icons">inventory_2</i>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="manage_up_add_btn">
                            <h4 className="card-title">Product Inventory</h4>
                            <Link to="/add-product">
                              <button
                                className="btn btn-primary m-r-5 float-right"
                                title="Add Product"
                              >
                                <i className="fa fa-plus"></i> Add Product
                              </button>
                            </Link>
                          </div>
                          <div className="searching-every searching-4-col popup-arrow-select">
                            <span>
                              <input
                                type="text"
                                name="product_name_search"
                                value={this.state.product_name_search}
                                className="form-control"
                                autoComplete="off"
                                onChange={this.formHandler1}
                                placeholder="Product Name"
                              ></input>
                            </span>
                            <span>
                              <SelectSearch
                                options={this.state.searchCategoryOptions}
                                name="product_cat_search"
                                closeOnSelect={false}
                                value={this.state.selectedSearchCat_id.value}
                                placeholder="category"
                                onChange={(e) => {
                                  this.setState({
                                    selectedSearchCat_id: e,
                                  });
                                }}
                                className="select-search"
                              />
                            </span>
                            <span>
                              <select
                                name="status_search"
                                value={this.state.status_search}
                                className="form-control"
                                onChange={this.formHandler1}
                              >
                                <option value="">Select Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">InActive</option>
                              </select>
                            </span>
                            <span className="search-btn-every">
                              <button
                                type="submit"
                                onClick={() => this.getcustomerfilter()}
                                className="btn btn-primary m-r-5"
                              >
                                Search
                              </button>
                              <button
                                onClick={() => this.resetFilters()}
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
                                  <th scope="col">Product Name</th>
                                  <th scope="col">Category Name</th>
                                  <th scope="col">Quantity</th>
                                  <th scope="col">Available Quantity</th>
                                  <th scope="col">Sold Quantity</th>
                                  <th scope="col">Lost Quantity</th>
                                  <th scope="col">Return Quantity</th>
                                  <th scope="col">InHouse Quantity</th>
                                  {/* <th scope="col">Booked Quantity</th>
                                  <th scope="col">Remaining Quantity</th> */}
                                  <th scope="col">Status</th>
                                  <th scope="col">Catelog Status</th>
                                  <th scope="col">Same Day Delivery</th>
                                  <th scope="col">Farm Pickup</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.viewproduct &&
                                this.state.viewproduct.length > 0 ? (
                                  this.state.viewproduct.map((item, Index) => (
                                    <tr key={Index}>
                                      <td>{item.product_name}</td>
                                      <td
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {item.product_categories.length > 0 &&
                                          item.product_categories.map(
                                            (cat, i) => {
                                              if (i <= 2) {
                                                return (
                                                  <>
                                                    {i === 0 ? "" : " ,"}
                                                    {cat.category_name}
                                                  </>
                                                );
                                              } else {
                                                if (i === 3) {
                                                  return (
                                                    <>
                                                      {" ,etc..."}
                                                      {/* {cat.category_name} */}
                                                    </>
                                                  );
                                                } else {
                                                }
                                              }
                                            }
                                          )}
                                      </td>
                                      <td>
                                        {(+item.productQuantity).toFixed(2)}
                                      </td>
                                      <td>
                                        {" "}
                                        {(+item.availableQuantity).toFixed(
                                          2
                                        )}{" "}
                                      </td>
                                      <td>
                                        {(+item.bookingQuantity).toFixed(2)}
                                      </td>
                                      <td>{(+item.lostQuantity).toFixed(2)}</td>
                                      <td>
                                        {(+item.returnQuantity).toFixed(2)}
                                      </td>
                                      <td>
                                        {(+item.inhouseQuantity).toFixed(2)}
                                      </td>
                                      <td>
                                        <Switch
                                          onChange={() =>
                                            this._handleStatus(
                                              item,
                                              !item.status
                                            )
                                          }
                                          checked={item.status}
                                          height={13}
                                          width={25}
                                          id="normal-switch"
                                        />
                                      </td>
                                      <td>
                                        <Switch
                                          onChange={() =>
                                            this._handleCatelogStatus(
                                              item,
                                              !item.showstatus
                                            )
                                          }
                                          checked={item.showstatus}
                                          height={13}
                                          width={25}
                                          id="normal-switch"
                                        />
                                      </td>
                                      <td>
                                        <Switch
                                          onChange={() =>
                                            this._handleSameDayDeliveryStatus(
                                              item,
                                              !item.sameDayDelivery
                                            )
                                          }
                                          checked={item.sameDayDelivery}
                                          height={13}
                                          width={25}
                                          id="normal-switch"
                                        />
                                      </td>
                                      <td>
                                        <Switch
                                          onChange={() =>
                                            this._handleFarmPickupStatus(
                                              item,
                                              !item.farmPickup
                                            )
                                          }
                                          checked={item.farmPickup}
                                          height={13}
                                          width={25}
                                          id="normal-switch"
                                        />
                                      </td>

                                      <td>
                                        <i
                                          className="fa fa-eye hover-with-cursor m-r-5"
                                          title={
                                            "View Detail's - " +
                                            item.product_name
                                          }
                                          onClick={this.viewopenModal.bind(
                                            this,
                                            item
                                          )}
                                        ></i>
                                        <a
                                          onClick={() => {
                                            this.props.history.push(
                                              "/edit-product/" + item._id
                                            );
                                            window.location.reload();
                                          }}
                                        >
                                          <i
                                            className="fa fa-pencil-square-o  hover-with-cursor m-r-5"
                                            title={
                                              "Edit - " + item.product_name
                                            }
                                          ></i>
                                        </a>
                                        {item.TypeOfProduct !== "group" ? (
                                          <i
                                            className="fa fa-paper-plane hover-with-curso m-r-5"
                                            title={
                                              "View Inventory - " +
                                              item.product_name
                                            }
                                            aria-hidden="true"
                                            onClick={this.viewinventory.bind(
                                              this,
                                              item._id
                                            )}
                                          ></i>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                    </tr>
                                  ))
                                ) : this.state.loading ? (
                                  <tr>
                                    <td colSpan="9">
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
                                    <td colSpan="9" className="text-center">
                                      No Data Found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
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
              ) : (
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12 ml-auto mr-auto">
                      <div className="card">
                        <div className="card-header card-header-primary card-header-icon">
                          <div className="card-icon">
                            <i className="material-icons">inventory_2</i>
                          </div>
                        </div>
                        <div className="card-body final_add_prod_admin">
                          <h4 className="card-title">View product</h4>
                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={() => this.backtoproducts()}
                          >
                            <i
                              style={{ color: "white" }}
                              className="material-icons"
                            >
                              arrow_back_ios
                            </i>{" "}
                            View Product's
                          </button>
                          <form className="add_product_new">
                            <div className="pakaging_pricing">
                              <h3>Product Details</h3>
                              <div className="inner_details_admin">
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Categories</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span
                                      className="view-prod-same-des"
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {this.state.allsingledata
                                        .product_categories
                                        ? this.state.allsingledata.product_categories.map(
                                            (cat, i) => {
                                              return (
                                                <>
                                                  {i === 0 ? "" : " ,"}
                                                  {cat.category_name}
                                                </>
                                              );
                                            }
                                          )
                                        : ""}
                                    </span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Product Name </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span
                                      className="view-prod-same-des"
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {this.state.allsingledata.product_name
                                        ? this.state.allsingledata.product_name
                                        : ""}
                                    </span>
                                    <span className="err err_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Long Description</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.longDesc ? (
                                        <div
                                          className="long_des_new"
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              this.state.allsingledata.longDesc,
                                          }}
                                        ></div>
                                      ) : (
                                        <div>--</div>
                                      )}
                                    </span>
                                    <span className="err err_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Short Description</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.longDesc ? (
                                        <div
                                          className="short_des_new"
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              this.state.allsingledata
                                                .shortDesc,
                                          }}
                                        ></div>
                                      ) : (
                                        <div>--</div>
                                      )}
                                    </span>
                                    <span className="err err_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Product Threshold</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.productThreshold
                                        ? this.state.allsingledata
                                            .productThreshold
                                        : "--"}
                                    </span>
                                    <span className="err err_product_threshold"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Product Subscription</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata
                                        .productSubscription
                                        ? this.state.allsingledata
                                            .productSubscription
                                        : "--"}
                                    </span>
                                    <br />
                                    <span className="err err_product_subscription"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Unit of Measurement</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.unitMeasurement
                                        ? this.state.allsingledata
                                            .unitMeasurement.name
                                        : "--"}
                                    </span>
                                    <span className="err err_selectedunit"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Quantity / Unit Measurement</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.unitQuantity
                                        ? this.state.allsingledata.unitQuantity
                                        : ""}
                                    </span>
                                    <span className="err err_quantity_unit"></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Pre Order</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.preOrder
                                        ? "Yes"
                                        : "No"}
                                    </span>
                                    <span className="err err_quantity_unit"></span>
                                  </div>
                                </div>
                                {this.state.allsingledata.preOrder ? (
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>Pre Order End Date</label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <span className="view-prod-same-des">
                                        {this.state.allsingledata
                                          .preOrderEndDate
                                          ? moment(
                                              this.state.allsingledata
                                                .preOrderEndDate
                                            ).format("LLL")
                                          : ""}
                                      </span>
                                      <span className="err err_quantity_unit"></span>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Barcode</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.barcode
                                        ? this.state.allsingledata.barcode.join(
                                            ", "
                                          )
                                        : ""}
                                    </span>
                                    <span className="err err_quantity_unit"></span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="images_bann_admin">
                              <h3> Product Image & Banner</h3>
                              <div className="inner_details_admin">
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Attachment</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.attachment ? (
                                        <a
                                          href={
                                            imageUrl +
                                            this.state.allsingledata.attachment
                                          }
                                          target="_blank"
                                        >
                                          View Attachment
                                        </a>
                                      ) : (
                                        ""
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Banner - 1920px * 400px</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.banner ? (
                                        <a
                                          href={
                                            imageUrl +
                                            this.state.allsingledata.banner
                                          }
                                          rel="noreferrer"
                                          target="_blank"
                                        >
                                          <img
                                            style={{ height: "50px" }}
                                            src={
                                              imageUrl +
                                              this.state.allsingledata.banner
                                            }
                                          />
                                        </a>
                                      ) : (
                                        "--"
                                      )}
                                    </span>
                                    <span className="err err_banner"></span>
                                  </div>
                                </div>

                                {this.state.allsingledata.images &&
                                  this.state.allsingledata.images.map(
                                    (item, index) => {
                                      return (
                                        <div key={index}>
                                          <div className="form-group">
                                            <div className="modal-left-bx">
                                              <label>
                                                Image - 800px * 800px
                                              </label>
                                            </div>
                                            <div className="modal-right-bx">
                                              <span className="view-prod-same-des">
                                                <a
                                                  href={imageUrl + item.image}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                >
                                                  <img
                                                    style={{ height: "50px" }}
                                                    src={imageUrl + item.image}
                                                    alt="img"
                                                  />
                                                </a>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>

                            <div className="prod_widget_admin">
                              <h3>Product Widgets</h3>
                              <div className="inner_details_admin">
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Related Product</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      <p>
                                        {this.state.allsingledata
                                          .relatedProduct[0]
                                          ? this.state.allsingledata.relatedProduct.map(
                                              (prd, idx) => {
                                                return (
                                                  <span
                                                    style={{
                                                      textTransform:
                                                        "capitalize",
                                                    }}
                                                    key={idx}
                                                  >
                                                    {
                                                      prd.product_id
                                                        .product_name
                                                    }
                                                    {this.state.allsingledata
                                                      .relatedProduct.length ===
                                                    idx + 1
                                                      ? ""
                                                      : ", "}
                                                  </span>
                                                );
                                              }
                                            )
                                          : "--"}
                                      </p>
                                    </span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Related recipes</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      <p>
                                        {this.state.allsingledata
                                          .relatedRecipes?.[0]
                                          ? this.state.allsingledata.relatedRecipes.map(
                                              (prd, idx) => {
                                                return (
                                                  <span
                                                    style={{
                                                      textTransform:
                                                        "capitalize",
                                                    }}
                                                    key={idx}
                                                  >
                                                    {!prd.blog_id
                                                      ? ""
                                                      : prd.blog_id.title}
                                                    {this.state.allsingledata
                                                      .relatedRecipes.length ===
                                                    idx + 1
                                                      ? ""
                                                      : ", "}
                                                  </span>
                                                );
                                              }
                                            )
                                          : "--"}
                                      </p>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="tax_n_admin">
                              <h3>Tax</h3>
                              <div className="inner_details_admin">
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>HSN Code</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.hsnCode
                                        ? this.state.allsingledata.hsnCode
                                        : "--"}
                                    </span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>SKU Code</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.SKUCode
                                        ? this.state.allsingledata.SKUCode
                                        : "--"}
                                    </span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label> Sales Tax Outside Haryana</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.salesTaxOutSide
                                        ? this.state.allsingledata
                                            .salesTaxOutSide.name
                                        : "--"}
                                    </span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label> Sales Tax Within Haryana</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.salesTaxWithIn
                                        ? this.state.allsingledata
                                            .salesTaxWithIn.name
                                        : "--"}
                                    </span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Purchase Tax</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.purchaseTax
                                        ? this.state.allsingledata.purchaseTax
                                            .name
                                        : "--"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Type of Product</label>
                              </div>
                              <div className="modal-right-bx">
                                <span className="view-prod-same-des">
                                  {this.state.allsingledata.TypeOfProduct
                                    ? this.state.allsingledata.TypeOfProduct
                                    : "--"}
                                </span>
                              </div>
                            </div>

                            <div className="pakaging_pricing">
                              <h3>Pricing & Packaging</h3>

                              {/* <div className="region_singllle">
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Region</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <span className="view-prod-same-des">
                                      {this.state.allsingledata.simpleData[0]
                                        ? this.state.allsingledata.purchaseTax.name
                                        : ""}
                                    </span>
                                  </div>
                                </div>
                              </div> */}
                              <div className="inner_details_admin">
                                {this.state.allsingledata.TypeOfProduct ===
                                "simple" ? (
                                  <>
                                    {this.state.allsingledata.simpleData[0] &&
                                      this.state.allsingledata.simpleData.map(
                                        (item, index) => {
                                          return (
                                            <div
                                              className="new_lining_cla"
                                              key={index}
                                            >
                                              <div className="simple_package">
                                                <div className="form-group">
                                                  <div
                                                    className="modal-left-bx"
                                                    style={displayBlock}
                                                  >
                                                    <label>Region Name </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <span className="view-prod-same-des">
                                                      {item.region &&
                                                        item.region.name}
                                                    </span>
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div
                                                    className="modal-left-bx"
                                                    style={displayBlock}
                                                  >
                                                    <label> 
                                                      Available Quantity
                                                    </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <span className="view-prod-same-des">
                                                      {item.availableQuantity}
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="form-group">
                                                  <div
                                                    className="modal-left-bx"
                                                    style={displayBlock}
                                                  >
                                                    <label>
                                                      Inhouse Quantity
                                                    </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <span className="view-prod-same-des">
                                                      {item.inhouseQuantity}
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="form-group">
                                                  <div
                                                    className="modal-left-bx"
                                                    style={displayBlock}
                                                  >
                                                    <label>Lost Quantity</label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <span className="view-prod-same-des">
                                                      {item.lostQuantity}
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="form-group">
                                                  <div
                                                    className="modal-left-bx"
                                                    style={displayBlock}
                                                  >
                                                    <label>
                                                      Return Quantity
                                                    </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <span className="view-prod-same-des">
                                                      {item.returnQuantity}
                                                    </span>
                                                  </div>
                                                </div>
                                                {/* <div className="form-group">
                                                  <div
                                                    className="modal-left-bx"
                                                    style={displayBlock}
                                                  >
                                                    <label>Selling Price</label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <span className="view-prod-same-des">
                                                      {item.RegionSellingPrice}
                                                    </span>
                                                  </div>
                                                </div> */}

                                                {/* <div className="form-group">
                                                  <div
                                                    className="modal-left-bx"
                                                    style={displayBlock}
                                                  >
                                                    <label>B2B Price</label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <span className="view-prod-same-des">
                                                      {item.RegionB2BPrice}
                                                    </span>
                                                  </div>
                                                </div> */}

                                                {/* <div className="form-group">
                                                  <div
                                                    className="modal-left-bx"
                                                    style={displayBlock}
                                                  >
                                                    <label>Retail Price</label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <span className="view-prod-same-des">
                                                      {item.RegionRetailPrice}
                                                    </span>
                                                  </div>
                                                </div> */}

                                                {/* <div className="form-group">
                                                  <div
                                                    className="modal-left-bx"
                                                    style={displayBlock}
                                                  >
                                                    <label>MRP</label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <span className="view-prod-same-des">
                                                      {item.mrp}
                                                    </span>
                                                  </div>
                                                </div> */}
                                              </div>
                                              {item.package.length > 0 ? (
                                                <>
                                                  <h4>Packaging</h4>
                                                  {item.package.map(
                                                    (pck, ix) => {
                                                      return (
                                                        <div
                                                          className="simple_package new_6_rowing"
                                                          key={ix}
                                                          style={{
                                                            gridTemplateColumns:
                                                              "repeat(7, minmax(0, 1fr))",
                                                          }}
                                                        >
                                                          <div className="form-group">
                                                            <div
                                                              className="modal-left-bx"
                                                              style={
                                                                displayBlock
                                                              }
                                                            >
                                                              <label>
                                                                Package Label
                                                              </label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <span className="view-prod-same-des">
                                                                {
                                                                  pck.packetLabel
                                                                }
                                                              </span>
                                                            </div>
                                                          </div>

                                                          <div className="form-group">
                                                            <div
                                                              className="modal-left-bx"
                                                              style={
                                                                displayBlock
                                                              }
                                                            >
                                                              <label>
                                                                Packet Size
                                                              </label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <span className="view-prod-same-des">
                                                                {
                                                                  pck.packet_size
                                                                }
                                                              </span>
                                                            </div>
                                                          </div>

                                                          <div className="form-group">
                                                            <div
                                                              className="modal-left-bx"
                                                              style={
                                                                displayBlock
                                                              }
                                                            >
                                                              <label>
                                                                Packet Selling
                                                                Price
                                                              </label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <span className="view-prod-same-des">
                                                                {
                                                                  pck.selling_price
                                                                }
                                                              </span>
                                                            </div>
                                                          </div>

                                                          <div className="form-group">
                                                            <div
                                                              className="modal-left-bx"
                                                              style={
                                                                displayBlock
                                                              }
                                                            >
                                                              <label>
                                                                B2B Price
                                                              </label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <span className="view-prod-same-des">
                                                                {pck.B2B_price}
                                                              </span>
                                                            </div>
                                                          </div>

                                                          <div className="form-group">
                                                            <div
                                                              className="modal-left-bx"
                                                              style={
                                                                displayBlock
                                                              }
                                                            >
                                                              <label>
                                                                Retail Price
                                                              </label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <span className="view-prod-same-des">
                                                                {
                                                                  pck.Retail_price
                                                                }
                                                              </span>
                                                            </div>
                                                          </div>

                                                          <div className="form-group">
                                                            <div
                                                              className="modal-left-bx"
                                                              style={
                                                                displayBlock
                                                              }
                                                            >
                                                              <label>
                                                                Packet MRP
                                                              </label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <span className="view-prod-same-des">
                                                                {pck.packetmrp}
                                                              </span>
                                                            </div>
                                                          </div>

                                                          <div className="form-group">
                                                            <div
                                                              className="modal-left-bx"
                                                              style={
                                                                displayBlock
                                                              }
                                                            >
                                                              <label>
                                                                Status
                                                              </label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <span className="view-prod-same-des">
                                                                {pck.status
                                                                  ? "Active"
                                                                  : "Inactive"}
                                                              </span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                              {this.state.addpackage &&
                                                this.state.addpackage.map(
                                                  (item, indexing) => {
                                                    if (item.index === index) {
                                                      return (
                                                        <div
                                                          className="simple_sub_package"
                                                          key={indexing}
                                                        >
                                                          <div className="form-group">
                                                            <div className="modal-left-bx">
                                                              <label>
                                                                Packet Label
                                                              </label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <input
                                                                type="text"
                                                                name={
                                                                  "label" +
                                                                  index +
                                                                  indexing
                                                                }
                                                                className="form-control"
                                                                placeholder="Enter Label"
                                                                onChange={(
                                                                  ev
                                                                ) =>
                                                                  this.formHandler(
                                                                    ev
                                                                  )
                                                                }
                                                              />
                                                              <span
                                                                className={
                                                                  "err err_label" +
                                                                  index +
                                                                  indexing
                                                                }
                                                              ></span>
                                                            </div>
                                                          </div>

                                                          <div className="form-group">
                                                            <div className="modal-left-bx">
                                                              <label>
                                                                Packet Size
                                                              </label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <input
                                                                type="number"
                                                                name={
                                                                  "packet_size" +
                                                                  index +
                                                                  indexing
                                                                }
                                                                className="form-control"
                                                                placeholder="Enter Packet Size"
                                                                onChange={(
                                                                  ev
                                                                ) =>
                                                                  this.formHandler(
                                                                    ev
                                                                  )
                                                                }
                                                              />
                                                              <span
                                                                className={
                                                                  "err err_packetsize" +
                                                                  index +
                                                                  indexing
                                                                }
                                                              ></span>
                                                            </div>
                                                          </div>

                                                          <div className="form-group">
                                                            <div className="modal-left-bx">
                                                              <label>
                                                                Selling Price
                                                              </label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <input
                                                                type="number"
                                                                name={
                                                                  "selling_price" +
                                                                  index +
                                                                  indexing
                                                                }
                                                                className="form-control"
                                                                placeholder="Enter Selling Price"
                                                                onChange={(
                                                                  ev
                                                                ) =>
                                                                  this.formHandler(
                                                                    ev
                                                                  )
                                                                }
                                                              />
                                                              <span
                                                                className={
                                                                  "err err_subselling" +
                                                                  index +
                                                                  indexing
                                                                }
                                                              ></span>
                                                            </div>
                                                          </div>

                                                          <div className="form-group">
                                                            <div className="modal-left-bx">
                                                              <label>MRP</label>
                                                            </div>
                                                            <div className="modal-right-bx">
                                                              <input
                                                                type="number"
                                                                name={
                                                                  "packetmrp" +
                                                                  index +
                                                                  indexing
                                                                }
                                                                className="form-control"
                                                                placeholder="Enter MRP"
                                                                onChange={(
                                                                  ev
                                                                ) =>
                                                                  this.formHandler(
                                                                    ev
                                                                  )
                                                                }
                                                              />
                                                              <span
                                                                className={
                                                                  "err err_packetmrp" +
                                                                  index +
                                                                  indexing
                                                                }
                                                              ></span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      );
                                                    } else {
                                                      return <></>;
                                                    }
                                                  }
                                                )}
                                            </div>
                                          );
                                        }
                                      )}

                                    {/* {this.state.sub_region.length ==
                                    this.state.addregion.length ? (
                                      <div>
                                        Add Region to add Product/Packaging
                                        <span className="err err_simple_region"></span>
                                      </div>
                                    ) : (
                                      <div>
                                        <button
                                          type="button"
                                          className="btn btn-primary feel-btnv2"
                                          onClick={() => this.addmoregion()}
                                        >
                                          <i
                                            className="fa fa-plus"
                                            aria-hidden="true"
                                          ></i>
                                          Add Region
                                        </button>
                                        <span className="err err_simple_region"></span>
                                      </div>
                                    )} */}
                                  </>
                                ) : (
                                  ""
                                )}
                                {this.state.allsingledata.TypeOfProduct ===
                                "configurable" ? (
                                  <>
                                    <div className="form-group">
                                      <h3>Configure Product</h3>
                                    </div>
                                    {this.state.allsingledata.configurableData.map(
                                      (item, index) => {
                                        return (
                                          <>
                                            <div key={index}>
                                              <div className="configured_product">
                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>Region </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <span>
                                                      {item.region.name}
                                                    </span>
                                                  </div>
                                                </div>
                                                {item.attributes &&
                                                  item.attributes.map(
                                                    (itm, ind) => (
                                                      <div className="form-group">
                                                        <div className="modal-left-bx">
                                                          <label>
                                                            {itm.attributeName}
                                                          </label>
                                                        </div>
                                                        <div className="modal-right-bx">
                                                          <span>
                                                            {itm.attributeValue}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>
                                                      Selling Price (incl. gst)
                                                    </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    {item.selling_price
                                                      ? item.selling_price
                                                      : ""}
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>
                                                      B2B price (incl. gst)
                                                    </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    {item.B2B_price
                                                      ? item.B2B_price
                                                      : ""}
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>
                                                      Retail Price (incl. gst)
                                                    </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    {item.Retail_price
                                                      ? item.Retail_price
                                                      : ""}
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>
                                                      MRP (incl. gst)
                                                    </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    {item.mrp ? item.mrp : ""}
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>SKU Code</label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    {item.variantSKUcode
                                                      ? item.variantSKUcode
                                                      : ""}
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>Image</label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    {/* {
                                                    item.image ? item.image : ""
                                                  } */}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        );
                                      }
                                    )}
                                  </>
                                ) : (
                                  ""
                                )}
                                {this.state.allsingledata.TypeOfProduct ===
                                "group" ? (
                                  <>
                                    {this.state.allsingledata.groupData &&
                                      this.state.allsingledata.groupData.map(
                                        (item2, index2) => (
                                          <div className="group_sets view-product-group-set">
                                            <div className="form-group">
                                              <div className="modal-left-bx">
                                                <label>Name</label>
                                              </div>
                                              <div className="modal-right-bx">
                                                {/* <input
                                                  type="text"
                                                  value={item2.name}
                                                  className="form-control"
                                                  placeholder="Enter Name"
                                                /> */}
                                                <span>{item2.name}</span>
                                              </div>
                                            </div>
                                            <div className="form-group">
                                              <div className="modal-left-bx">
                                                <label>Min QTY Limit</label>
                                              </div>
                                              <div className="modal-right-bx">
                                                {/* <input
                                                  type="number"
                                                  value={item2.minqty}
                                                  className="form-control"
                                                /> */}
                                                <span>{item2.minqty}</span>
                                              </div>
                                            </div>
                                            <div className="form-group">
                                              <div className="modal-left-bx">
                                                <label>Max QTY Limit</label>
                                              </div>
                                              <div className="modal-right-bx">
                                                {/* <input
                                                  type="number"
                                                  value={item2.maxqty}
                                                  className="form-control"
                                                /> */}
                                                <span>{item2.maxqty}</span>
                                              </div>
                                            </div>
                                            {item2.sets &&
                                              item2.sets.map((itm21, ind21) => (
                                                <div className="group_product">
                                                  <div className="form-group">
                                                    <div className="modal-left-bx">
                                                      <label>
                                                        Product Name
                                                      </label>
                                                      <span className="asterisk">
                                                        *
                                                      </span>
                                                    </div>
                                                    <div className="modal-right-bx">
                                                      {/* {console.log(
                                                        "allllproduct",
                                                        this.state.all_product
                                                      )} */}
                                                      {/* <SelectSearch
                                                      placeholder="Search Product"
                                                      options={
                                                        this.state.all_product
                                                      }
                                                      className="select-search"
                                                      value={itm21.product}
                                                    /> */}
                                                      <span>
                                                        {
                                                          itm21.product
                                                            .product_name
                                                        }
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="form-group">
                                                    <div className="modal-left-bx">
                                                      <label>Package</label>
                                                    </div>
                                                    <div className="modal-right-bx">
                                                      <span>
                                                        {
                                                          itm21.package
                                                            .packetLabel
                                                        }
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="form-group">
                                                    <div className="modal-left-bx">
                                                      <label>Min Qty</label>
                                                    </div>
                                                    <div className="modal-right-bx">
                                                      <span>
                                                        {itm21.setminqty}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="form-group">
                                                    <div className="modal-left-bx">
                                                      <label>Max Qty</label>
                                                      <span className="asterisk">
                                                        *
                                                      </span>
                                                    </div>
                                                    <div className="modal-right-bx">
                                                      <span>
                                                        {itm21.setmaxqty}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="form-group">
                                                    <div className="modal-left-bx">
                                                      <label>Pre-Set Qty</label>
                                                      <span className="asterisk">
                                                        *
                                                      </span>
                                                    </div>
                                                    <div className="modal-right-bx">
                                                      <span>
                                                        {itm21.preset}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="form-group">
                                                    <div className="modal-left-bx">
                                                      <label>Priority</label>
                                                      <span className="asterisk">
                                                        *
                                                      </span>
                                                    </div>
                                                    <div className="modal-right-bx">
                                                      <span>
                                                        {itm21.priority ||
                                                          "unset"}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        )
                                      )}
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div className="d-flex justify-content-between w-100">
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Priority</label>
                                </div>
                                <div className="modal-right-bx">
                                  {this.state.allsingledata.priority || "unset"}
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Status</label>
                                </div>
                                <div className="modal-right-bx">
                                  <span className="view-prod-same-des">
                                    {this.state.allsingledata.status
                                      ? "Active"
                                      : "InActive"}
                                  </span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Catalogue List Status Status</label>
                                </div>
                                <div className="modal-right-bx">
                                  {this.state.allsingledata.showstatus
                                    ? "Active"
                                    : "InActive"}
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Same Day Delivery</label>
                                </div>
                                <div className="modal-right-bx">
                                  {this.state.allsingledata.sameDayDelivery
                                    ? "Active"
                                    : "InActive"}
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Farm Pickup</label>
                                </div>
                                <div className="modal-right-bx">
                                  {this.state.allsingledata.farmPickup
                                    ? "Active"
                                    : "InActive"}
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 ml-auto mr-auto">
                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">inventory_2</i>
                        </div>
                      </div>

                      <div className="card-body">
                        <div>
                          <h4 className="card-title"> View Product </h4>
                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={() => this.backtoproduct()}
                          >
                            <i className="material-icons">arrow_back_ios</i>View
                            Product
                          </button>
                        </div>
                        <div className="view-inven-product-card-section">
                          {this.state.inventory_data.map((item, index) => {
                            return (
                              <div>
                                <div>
                                  <div className="view-inven-product-card">
                                    <div className="inven-heading">
                                      {moment(item.created_at).format(
                                        "MMMM Do YYYY, h:mm:ss A"
                                      )}
                                      {}
                                      {item.supplier
                                        ? " - " + item.supplier
                                        : ""}
                                    </div>
                                    <ul>
                                      <li>
                                        <span className="view-title">
                                          {" "}
                                          Region{" "}
                                        </span>
                                        <span className="view-status">
                                          {" "}
                                          {item.region}{" "}
                                        </span>
                                      </li>
                                      {item.variant_name && (
                                        <li>
                                          <span className="view-title">
                                            {" "}
                                            Variant{" "}
                                          </span>
                                          <span className="view-status">
                                            {" "}
                                            {item.variant_name}{" "}
                                          </span>
                                        </li>
                                      )}
                                      <li>
                                        <span className="view-title">
                                          {" "}
                                          product quantity{" "}
                                        </span>
                                        <span className="view-status">
                                          {" "}
                                          {item.productQuantity || 0}{" "}
                                        </span>
                                      </li>

                                      <li>
                                        <span className="view-title">
                                          {" "}
                                          available Quantity{" "}
                                        </span>
                                        <span className="view-status">
                                          {" "}
                                          {item.availableQuantity || 0}{" "}
                                        </span>
                                      </li>
                                      <li>
                                        <span className="view-title">
                                          {" "}
                                          booking Quantity{" "}
                                        </span>
                                        <span className="view-status">
                                          {" "}
                                          {item.bookingQuantity || 0}{" "}
                                        </span>
                                      </li>
                                      <li>
                                        <span className="view-title">
                                          {" "}
                                          return Quantity{" "}
                                        </span>
                                        <span className="view-status">
                                          {" "}
                                          {item.returnQuantity || 0}{" "}
                                        </span>
                                      </li>
                                      <li>
                                        <span className="view-title">
                                          {" "}
                                          lost Quantity{" "}
                                        </span>
                                        <span className="view-status">
                                          {" "}
                                          {item.lostQuantity || 0}{" "}
                                        </span>
                                      </li>
                                      <li>
                                        <span className="view-title">
                                          {" "}
                                          inhouse Quantity{" "}
                                        </span>
                                        <span className="view-status">
                                          {" "}
                                          {item.inhouseQuantity || 0}{" "}
                                        </span>
                                      </li>

                                      {/* filds to be shown on developnment environment */}
                                    </ul>
                                  </div>
                                </div>

                                {/* <AccordionItemPanel>
                                  {item.simpleData.map(
                                    (data, index) => {
                                      return (
                                        <div className="view-box" key={index}>
                                          <ul>
                                            <li>
                                              <span className="view-title">
                                                {" "}
                                                Region{" "}
                                              </span>
                                              <span className="view-status">
                                                {" "}
                                                {data.region.name}{" "}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="view-title">
                                                {" "}
                                                Quantity{" "}
                                              </span>
                                              <span className="view-status">
                                                {" "}
                                                {
                                                  data.quantity
                                                }{" "}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="view-title">
                                                {" "}
                                                Booked Quantity{" "}
                                              </span>
                                              <span className="view-status">
                                                {" "}
                                                {
                                                  data.bookingQuantity
                                                    
                                                }{" "}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="view-title">
                                                {" "}
                                                Available Quantity{" "}
                                              </span>
                                              <span className="view-status">
                                                {" "}
                                                {
                                                  data.availableQuantity
                                                    
                                                }{" "}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="view-title">
                                                {" "}
                                                In HOuse Quantity{" "}
                                              </span>
                                              <span className="view-status">
                                                {" "}
                                                {
                                                  data.inhouseQuantity
                                                    
                                                }{" "}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="view-title">
                                                {" "}
                                                Lost Quantity{" "}
                                              </span>
                                              <span className="view-status">
                                                {" "}
                                                {
                                                  data.lostQuantity
                                                    
                                                }{" "}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="view-title">
                                                {" "}
                                                Return Quantity{" "}
                                              </span>
                                              <span className="view-status">
                                                {" "}
                                                {
                                                  data.returnQuantity
                                                    
                                                }{" "}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="view-title">
                                                {" "}
                                                Cost Price{" "}
                                              </span>
                                              <span className="view-status">
                                                {" "}
                                                {data.costPrice}{" "}
                                              </span>
                                            </li>

                                            <li>
                                              <span className="view-title">
                                                {" "}
                                                Exp. Date{" "}
                                              </span>
                                              <span className="view-status">
                                                {" "}
                                                {data.ExpirationDate
                                                  ? moment(
                                                      data.ExpirationDate
                                                    ).format("MMMM Do YYYY")
                                                  : ""}
                                              </span>
                                            </li>

                                          </ul>
                                        </div>
                                      );
                                    }
                                  )}
                                </AccordionItemPanel> */}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* <Adminfooter /> */}
        </div>
        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
