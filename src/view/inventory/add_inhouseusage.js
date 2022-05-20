import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import SelectSearch from "react-select-search";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Loader from "../../components/loader/loader";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";

var MultipleArray = [];
var final_ddda = [];

export default class inhouseinventory extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    MultipleArray = [];
    this.state = {
      status: true,
      options: [],
      region: [],
      unit: [],
      checkvariant: [],
      addlast: 0,
      all_product: [],
      regiondata: [],
      finalvar_data: [],
      account_head: "6017bcbd6a0475eb30a643b6",
      invoice_amount: 0,
      activ_supplier: [],
      newproductlength: 0,
      newproduct: [],
      loading: true,
    };

    this.formHandler = this.formHandler.bind(this);
    this.add = this.add.bind(this);
    this.onChange1 = this.onChange1.bind(this);
    this.addnewproduct = this.addnewproduct.bind(this);
    this.onChange11 = this.onChange11.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
    this.removeproduct = this.removeproduct.bind(this);
  }

  removeproduct = (index) => {
    this.setState({
      loading: true,
    });
    MultipleArray.splice(index, 1);
    this.setState({
      loading: false,
    });
  };

  formHandler1(e, index, ind = 0, type) {
    if (type === "variant") {
      MultipleArray[index].package[ind].variant = e.target.value;
    }
    if (type === "quantity") {
      if (e.target.value == "" || e.target.value == null) {
        MultipleArray[index].package[ind].quantity = 0;
      } else {
        MultipleArray[index].package[ind].quantity = e.target.value;
      }
      var a = 0;
      MultipleArray[index].package.map((item, indee) => {
        a = a + +item.quantity;
      });
      MultipleArray[index].total_qty = a;
    }

    this.setState({
      loading: false,
    });
    this.forceUpdate();
    console.log(MultipleArray);
  }

  addnewproduct(type = "AddMore", index) {
    if (type === "AddMore") {
      this.setState({ loading: true });
      MultipleArray.push({
        product: "",
        product_details: "",
        total_qty: 0,
        TypeOfProduct: "",
        package: [],
      });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true });
      MultipleArray.splice(index, 1);
    }
  }

  addmoregion = (ind) => {
    let data = MultipleArray;
    if (data[ind].TypeOfProduct === "simple") {
      data[ind].package.push({
        region: "",
        regionID: "",
        quantity: "",
        availableQuantity: "",
      });
    } else {
      data[ind].package.push({
        region: "",
        regionID: "",
        quantity: "",
        variant: "",
        availableQuantity: "",
      });
    }
    MultipleArray = data;
    this.setState({});
  };

  removeregion = (type = "remove", index, ind) => {
    this.setState({
      loading: true,
    });
    MultipleArray[index].package.splice(ind, 1);
    this.setState({
      loading: false,
    });
  };

  onChange1 = (valu) => {
    this.setState({ account_head: valu.value });
  };

  onChangeregion = (valu, index, ind) => {
    this.setState({
      loading: true,
    });
    let data = MultipleArray;
    data[index].package[ind].region = valu.value;
    var reData = {
      product_id: MultipleArray[index].product,
      region_id: valu.value,
    };
    AdminApiRequest(reData, "/admin/getConProductByRegion", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          final_ddda = [];
          res.data.data.configurableData.map((item, index) => {
            var daat = [];
            item.variant_id.map((data, indexing) => {
              daat.push(
                data.variantId.item.filter(
                  (item1) => item1._id == data.variantItem
                )[0]
              );
            });
            var new_fiu_data = "";
            daat.map((itemqw, indexqw) => {
              new_fiu_data =
                indexqw == 0
                  ? new_fiu_data + itemqw.item_name
                  : new_fiu_data + " " + itemqw.item_name;
            });
            final_ddda.push({ _id: item._id, item: new_fiu_data });
            MultipleArray[index].package[ind].variant_data = final_ddda;
          });
        } else {
          swal({
            title: "Network Issue",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({
      loading: false,
    });
  };

  setStartDate = (date) => {
    this.setState({
      startDate: date,
    });
  };

  setexpdate = (date, index, ind) => {
    MultipleArray[index].package[ind].expiration = date;
    this.setState({
      loading: false,
    });
  };

  setexpdatecon = (date, l1, length) => {
    var b = "expdatecon" + l1 + length;
    this.setState({
      [b]: date,
    });
  };

  setinvoiceDate = (date) => {
    this.setState({
      invoice_date: date,
    });
  };

  setdueDate = (date) => {
    this.setState({
      due_date: date,
    });
  };

  timepick = (time) => {
    this.setState({
      time: time,
    });
  };
  changeRegionOfProduct(valu, index) {
    MultipleArray[index].AllPackages.forEach((pck) => {
      if (pck.regionID === valu) {
        if (MultipleArray[index].TypeOfProduct === "simple") {
          MultipleArray[index].package = [
            {
              region: pck.region,
              regionID: pck.regionID,
              packageID: pck.packageID,
              quantity: 0,
              availableQuantity: pck.availableQuantity,
            },
          ];
        } else {
          MultipleArray[index].package = [
            {
              region: pck.region,
              regionID: pck.regionID,
              quantity: 0,
              variant: pck.variant,
              availableQuantity: pck.availableQuantity,
            },
          ];
        }
      }
    });
    setTimeout(() => {
      this.forceUpdate();
    }, 0);
  }

  onChange112(valu, index) {
    const requestData = {};
    AdminApiRequest(requestData, "/admin/product/" + valu.value, "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          MultipleArray[index].product_details = res.data.data;
          MultipleArray[index].product = res.data.data._id;
          MultipleArray[index].TypeOfProduct = res.data.data.TypeOfProduct;
          var new_data = [];
          MultipleArray[index].package = [];
          MultipleArray[index].AllPackages = [];

          res.data.data.TypeOfProduct === "simple"
            ? res.data.data.simpleData.map((item, ind) => {
                MultipleArray[index].AllPackages.push({
                  region: item.region.name,
                  regionID: item.region._id,
                  packageID: item._id,
                  quantity: 0,
                  availableQuantity: item.availableQuantity,
                });
                new_data.push({
                  value: item.region._id,
                  name: item.region.name,
                });
              })
            : res.data.data.configurableData.map((item, ind) => {
                MultipleArray[index].AllPackages.push({
                  region: item.region.name,
                  regionID: item.region._id,
                  quantity: 0,
                  variant: item.variant_name,
                  availableQuantity: item.availableQuantity,
                });
                new_data.push({
                  value: item.region._id,
                  name: item.region.name,
                });
              });
          let a = "single_product" + index;
          let abab = "regiondata" + index;
          this.setState({
            [abab]: new_data,
            [a]: res.data.data,
            loading: false,
          });
        } else {
          swal({
            title: "Network Issue",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({ ["selected_product" + index]: valu.value });
  }

  onChange11(valu) {
    this.setState({
      supplier: valu.value,
    });
    const data = {
      _id: valu.value,
    };
    AdminApiRequest(data, "/admin/GetInvoiceDueDate", "POST", "")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            due_date: res.data.data,
          });
        } else {
          swal({
            title: "Network Issue",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.setState({
      loading: false,
    });
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
    this.setState({ loading: false });
  }

  add() {
    var valueErr = document.getElementsByClassName("err");
    for (let i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    var status = false;
    if (MultipleArray.length == 0) {
      status = true;
      valueErr = document.getElementsByClassName("err_producter");
      valueErr[0].innerText = "Add Product";
    }
    MultipleArray.map((item, index) => {
      if (!item.product) {
        status = true;
        valueErr = document.getElementsByClassName("err_productsearch" + index);
        valueErr[0].innerText = "Search / Select Product";
      }
      if (item.package.length === 0) {
        status = true;
        valueErr = document.getElementsByClassName("err_regionSelect" + index);
        valueErr[0].innerText = "Search region";
      }
      item.package.map((daat, indes) => {
        if (+daat.quantity > +daat.availableQuantity) {
          status = true;
          valueErr = document.getElementsByClassName("err_available" + index);
          valueErr[0].innerText =
            "Reduction Qty can not be greater than Available qty";
        }
        // if (daat.quantity > 0) {
        //   status = false;
        //   valueErr = document.getElementsByClassName(
        //     "err_quantity" + index + indes
        //   );
        //   valueErr[0].innerText = "";
        // }
        else if (isNaN(daat.quantity)) {
          status = true;
          valueErr = document.getElementsByClassName("err_available" + index);
          valueErr[0].innerText = "Enter Numeric Digit";
        } else if (+daat.quantity > +daat.availableQuantity) {
          status = true;
          valueErr = document.getElementsByClassName("err_available" + index);
          valueErr[0].innerText = "Should be less than Available Quantity";
        } else if (!daat.quantity) {
          status = true;
          valueErr = document.getElementsByClassName("err_available" + index);
          valueErr[0].innerText = "This field is required";
        }
      });
    });
    this.setState({
      loading: false,
    });
    if (status === false) {
      const adminId = localStorage.getItem("adminInfo")
        ? JSON.parse(localStorage.getItem("adminInfo"))
        : "";
      this.setState({
        loading: true,
      });
      var product_data = [];
      MultipleArray.forEach((ma) => {
        product_data.push({
          product_id: ma.product,
          regionID: ma.package[0].regionID,
          TotalQuantity: ma.total_qty,
          unitMeasurement: ma.product_details.unitMeasurement.name,
          TypeOfProduct: ma.TypeOfProduct,
        });
      });
      const data = {
        admin_id: adminId._id,
        voucherType: "inhouse",
        product_data: JSON.stringify(product_data),
        note: this.state.note,
      };
      AdminApiRequest(data, "/admin/add/voucherInventory", "POST", "")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              loading: false,
            });
            swal({
              title: "Success",
              text: "Inhouse Inventory Added Successfully !",
              icon: "success",
              successMode: true,
            });
            this.props.history.push("/admin-inhouse-inventory");
          } else if (res.status === 400) {
            this.setState({
              loading: false,
            });
            swal({
              title: "Please select Different region",
              icon: "warning",
              dangerMode: true,
            });
          } else if (res.status === 401) {
            this.setState({
              loading: false,
            });
            swal({
              title: "Please select Different Product",
              icon: "warning",
              dangerMode: true,
            });
          } else {
            swal({
              title: "Network Issue",
              icon: "warning",
              dangerMode: true,
            });
            this.setState({
              loading: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async componentDidMount() {
    const requestData = {};
    var activesupplier = [];
    await AdminApiRequest(requestData, "/admin/product/inInventory", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.map((item) => {
            this.state.all_product.push({
              value: item._id,
              name: item.product_name,
            });
          });
          this.setState({
            loading: false,
          });
        } else {
          swal({
            title: "Network Issue",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    await AdminApiRequest(requestData, "/admin/supplier_master", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          activesupplier = res.data.data.filter(
            (item) => item.status == "true"
          );
          activesupplier.map((item, index) => {
            this.state.activ_supplier.push({
              value: item._id,
              name: item.name,
            });
          });
        } else {
          swal({
            title: "Network Issue",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({
      loading: false,
    });
  }
  removeproduct = (index) => {
    this.setState({
      loading: true,
    });
    let dt = [];
    dt = MultipleArray.filter((m, i) => i !== index);
    MultipleArray = dt;
    this.setState({
      loading: false,
    });
  };
  render() {
    console.log("MultipleArrayMultipleArray", MultipleArray);
    return (
      <div className="wrapper ">
        <Adminsiderbar />
        <div className="main-panel">
          <Adminheader />
          <div className="content">
            {this.state.loading === true ? <Loader></Loader> : ""}
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
                      <h4 className="card-title"> In-House Usage</h4>
                      <form className="add_product_new">
                        <div className="inventory_fields"></div>
                        {MultipleArray.map((item, index) => {
                          return (
                            <div className="productvariant d-flex" key={index}>
                              <div
                                className="form-group mr-2"
                                style={{ flex: 1 }}
                              >
                                <div className="modal-left-bx">
                                  <label>
                                    {" "}
                                    Product<span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <SelectSearch
                                    placeholder="Search Product"
                                    options={this.state.all_product}
                                    onChange={(e) => this.onChange112(e, index)}
                                    className="select-search"
                                    // value={
                                    //   this.state["selected_product" + index]
                                    // }
                                    value={item.product}
                                    name={"selected_product" + index}
                                  />
                                  <span
                                    className={"err err_productsearch" + index}
                                  ></span>
                                </div>
                              </div>
                              <div style={{ flex: 3 }}>
                                {/* {item.package.map((it, ind) => {
                                  return ( */}
                                <div
                                  className="simple_single"
                                  style={{
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                  }}
                                >
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>Region</label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <select
                                        onChange={(e) =>
                                          this.changeRegionOfProduct(
                                            e.target.value,
                                            index
                                          )
                                        }
                                        value={item.package[0]?.regionID}
                                      >
                                        <option value="">Select Region</option>
                                        {item.AllPackages?.map((pck) => {
                                          return (
                                            <option value={pck.regionID}>
                                              {pck.region}
                                            </option>
                                          );
                                        })}
                                      </select>
                                      {/* <input
                                            type="text"
                                            className="form-control"
                                            value={it.region}
                                            readOnly
                                            placeholder="Region"
                                          /> */}
                                    </div>
                                    <span
                                      className={"err err_regionSelect" + index}
                                    ></span>
                                  </div>
                                  {item.TypeOfProduct == "configurable" ? (
                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>Variant</label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="text"
                                          className="form-control"
                                          value={item.package[0]?.variant}
                                          readOnly
                                          placeholder="Region"
                                        />
                                      </div>
                                    </div>
                                  ) : null}
                                  <div className="form-group">
                                    <label>
                                      Available Quantity (
                                      {item.product_details.unitMeasurement
                                        ? item.product_details.unitMeasurement
                                            .name
                                        : ""}
                                      )
                                    </label>
                                    <div className="modal-right-bx">
                                      <input
                                        type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        value={
                                          item.package[0]?.availableQuantity
                                        }
                                        readOnly
                                        placeholder="Available Quantity"
                                      />
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label> Quantity to Reduce</label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <input
                                        type="number"
                                        autoComplete="off"
                                        name={"quantity" + index}
                                        className="form-control"
                                        value={item.package[0]?.quantity || ""}
                                        onChange={(e) => {
                                          if (+e.target.value >= 0) {
                                            this.formHandler1(
                                              e,
                                              index,
                                              0,
                                              "quantity"
                                            );
                                          }
                                        }}
                                        placeholder="Enter Quantity"
                                      />
                                      <span
                                        className={"err err_available" + index}
                                      ></span>
                                    </div>
                                  </div>
                                  {/* <i
                                        className="fa fa-times"
                                        onClick={() =>
                                          this.removeproduct(index)
                                        }
                                        aria-hidden="true"
                                      ></i> */}
                                </div>
                                {/* );
                                })} */}
                              </div>
                              <i
                                className="fas fa-times"
                                style={{ cursor: "pointer" }}
                                onClick={() => this.removeproduct(index)}
                                aria-hidden="true"
                              ></i>
                            </div>
                          );
                        })}
                        <div className="form-group single-col">
                          <div className="modal-bottom">
                            <button
                              type="button"
                              className="btn btn-primary feel-btn"
                              onClick={() => this.addnewproduct("AddMore")}
                            >
                              Add Product
                            </button>
                            <span className="err err_producter"></span>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label> Notes</label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              autoComplete="off"
                              name="note"
                              className="form-control"
                              onChange={(e) => this.formHandler(e)}
                              placeholder="Enter Note"
                            />
                            <span className={"err err_note"}></span>
                          </div>
                        </div>

                        <div className="form-group single-col">
                          <div className="modal-bottom">
                            <button
                              type="button"
                              className="btn btn-primary feel-btn"
                              onClick={this.add}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

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
