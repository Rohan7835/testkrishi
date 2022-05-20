import "moment-timezone";
import React, { Component } from "react";
import DatePicker from "react-date-picker";
import Modal from "react-modal";
import Moment from "react-moment";
import Select from "react-select";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
import { imageUrl } from "../../../components/imgUrl.js";
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
    overflow: "unset",
  },
};

var activeproduct = [];
var activepackage = [];
var activeregion = [];
var maincategory = [];
export default class Coupon extends Component {
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
      start_date: new Date(),
      end_date: new Date(),
      coupon_code: "",
      discount_percentage: "",
      type: "",
      data: [],
      status: true,
      user_type: "",
      limit: 20,
      discountLocation: "cart",
      catelogviewstatus: false,
    };

    this.openModal = this.openModal.bind(this);
    this.onchangingdata = this.onchangingdata.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editopenModal = this.editopenModal.bind(this);
    this.editcloseModal = this.editcloseModal.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangecatelogviewstatus =
      this.handleChangecatelogviewstatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
    this.formHandler12 = this.formHandler12.bind(this);
    this.formHandler11 = this.formHandler11.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.onchangingdata1 = this.onchangingdata1.bind(this);
  }

  formHandler1(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  search = (skipParam) => {
    const requestData = {
      skip: skipParam ? skipParam : 0,
      limit: this.state.limit,
      name: this.state.search_coupon_name,
      coupon_code: this.state.search_coupon_code,
      // discountType: this.state.search_discount_type,
      discountType: this.state.search_type,
      status: this.state.status_search === "" ? null : this.state.status_search,
    };

    AdminApiRequest(requestData, "/admin/getAll/coupon_master", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
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
  };

  reset = () => {
    this.setState({
      search_coupon_name: "",
      search_coupon_code: "",
      search_type: "",
      search_discount_type: "",
      status_search: "",
    });
    this.productcoupon();
  };

  onchangingdata(ev) {
    var arra = [];
    ev.forEach((item, index) => {
      arra.push({ _id: item.value });
    });
    this.setState({
      selectednewproducts: arra,
    });
  }

  onchangingdata1(ev) {
    var arrrra = [];
    ev.forEach((item, index) => {
      arrrra.push({ _id: item.value });
    });
    this.setState({
      related_category: arrrra,
    });
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
    this.setState({
      free_region_id: "",
      free_product_id: "",
      free_package_id: "",
      related_product: "",
      freeproduct: "",
    });
  }
  formHandler11(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
    let requestData = {};
    let data = {
      RegionId: ev.target.value,
      subscribe: false,
    };
    AdminApiRequest(data, "/admin/product/forHome/byregion", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item, index) => {
            activeproduct.push({ label: item.product_name, value: item._id });
          });
          this.setState({
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
    this.setState({
      loading: false,
    });
  }

  formHandler12(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
    let requestData = {};
    AdminApiRequest(requestData, "/admin/product/" + ev.target.value, "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.simpleData[0].package.forEach((item, index) => {
            activepackage.push({ label: item.packetLabel, value: item._id });
          });
          this.setState({
            loading: false,
          });
        }
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }
  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true });
    } else {
      this.setState({ status: false });
    }
  }
  handleChangecatelogviewstatus(checked) {
    if (checked) {
      this.setState({ catelogviewstatus: true });
    } else {
      this.setState({ catelogviewstatus: false });
    }
  }
  add() {
    if (
      this.state.selectednewproducts &&
      this.state.selectednewproducts.length > 0
    ) {
      var select_ids = [];
      for (let i = 0; i < this.state.selectednewproducts.length; i++) {
        select_ids.push(this.state.selectednewproducts[i]._id);
      }
    }

    var data = new FormData();
    // description Image terms coupon_code usage_limit user_type
    var couponValue = this.state.couponValue ? this.state.couponValue : "";
    var free_region_id = this.state.free_region_id
      ? this.state.free_region_id
      : null;
    var free_product_id = this.state.free_product_id
      ? this.state.free_product_id
      : null;
    var free_package_id = this.state.free_package_id
      ? this.state.free_package_id
      : null;
    var name = this.state.name ? this.state.name : "";
    var description = this.state.description ? this.state.description : "";
    var Image = document.querySelector('input[name="Image"]').files[0];
    var terms = this.state.terms ? this.state.terms : "";
    var coupon_code = this.state.coupon_code ? this.state.coupon_code : "";
    var usage_limit = this.state.usage_limit ? this.state.usage_limit : "";
    var related_category = this.state.related_category
      ? this.state.related_category
      : "";
    var user_type = this.state.user_type ? this.state.user_type : "";
    var discount = this.state.discount ? this.state.discount : "";
    var discount_amount = this.state.discount_amount
      ? this.state.discount_amount
      : "";
    var start_date = this.state.start_date ? this.state.start_date : "";
    var end_date = this.state.end_date ? this.state.end_date : "";
    var discount_percentage = this.state.discount_percentage
      ? this.state.discount_percentage
      : "";
    var discount_upto = this.state.discount_upto
      ? this.state.discount_upto
      : "";
    var status = this.state.status ? this.state.status : "";
    var selectednewproducts = select_ids ? select_ids : "";
    var catelogviewstatus = this.state.catelogviewstatus
      ? this.state.catelogviewstatus
      : "";
    var freeproduct = this.state.freeproduct ? this.state.freeproduct : "";

    data.append("region", free_region_id);
    data.append("discountProduct", free_product_id);
    data.append("discountProductPackageId", free_package_id);

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    var ststuss = false;
    if (this.state.couponValue && this.state.discount_amount) {
      if (+this.state.discount_amount >= +this.state.couponValue) {
        ststuss = true;
        valueErr = document.getElementsByClassName("err_discount_amount");
        valueErr[0].innerText = "Should be smaller than Minimum order value";
      }
    }
    if (this.state.discount_amount) {
      if (this.state.discount_amount <= 0) {
        ststuss = true;
        valueErr = document.getElementsByClassName("err_discount_amount");
        valueErr[0].innerText = "Should be greater than 0";
      } else if (isNaN(discount_amount)) {
        valueErr = document.getElementsByClassName("err_discount_amount");
        valueErr[0].innerText = "Amount Should be Numeric";
      }
    }

    if (this.state.couponValue <= 0) {
      ststuss = true;
      valueErr = document.getElementsByClassName("err_couponValue");
      valueErr[0].innerText = "Should be greater than 0";
    }

    if (!discount) {
      ststuss = true;
      valueErr = document.getElementsByClassName("err_discount");
      valueErr[0].innerText = "This Field is Required";
    }

    if (!start_date) {
      ststuss = true;
      valueErr = document.getElementsByClassName("err_start_date");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!end_date) {
      ststuss = true;
      valueErr = document.getElementsByClassName("err_end_date");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!coupon_code) {
      ststuss = true;
      valueErr = document.getElementsByClassName("err_coupon_code");
      valueErr[0].innerText = "This Field is Required";
    }

    if (this.state.cupon === "value") {
      if (!couponValue) {
        valueErr = document.getElementsByClassName("err_couponValue");
        valueErr[0].innerText = "This Field is Required";
      }
      data.append("couponValue", couponValue);
      data.append("name", name);
      data.append("description", description);
      data.append("image", Image);
      data.append("start_date", start_date);
      data.append("end_date", end_date);
      data.append("tc", terms);
      data.append("coupon_code", coupon_code);
      data.append("usageLimit", usage_limit);
      data.append("UserType", user_type);
      data.append("discountType", "couponValue");
      data.append("discountAmount", discount_amount);
      data.append("discountPercentage", discount_percentage);
      data.append("discount_upto", discount_upto);
      data.append("status", status);
      data.append("catelogviewstatus", catelogviewstatus);
      data.append("product_id", []);
      data.append("ProductCategoryType", []);
      data.append("category_id", []);
    } else if (this.state.cupon === "product") {
      if (!selectednewproducts) {
        valueErr = document.getElementsByClassName("err_selectednewproducts");
        valueErr[0].innerText = "This Field is Required";
      }
      data.append("couponValue", couponValue);
      data.append("discountLocation", "product");
      data.append("name", name);
      data.append("description", description);
      data.append("image", Image);
      data.append("start_date", start_date);
      data.append("end_date", end_date);
      data.append("tc", terms);
      data.append("coupon_code", coupon_code);
      data.append("usageLimit", usage_limit);
      data.append("UserType", user_type);
      data.append("discountType", "ProductCategory");
      data.append("discountAmount", discount_amount);
      data.append("discountPercentage", discount_percentage);
      data.append("discount_upto", discount_upto);
      data.append("status", status);
      data.append("product_id", JSON.stringify(selectednewproducts));
      data.append("ProductCategoryType", "product");
      data.append("category_id", []);
    } else {
      if (!related_category) {
        valueErr = document.getElementsByClassName("err_related_category");
        valueErr[0].innerText = "This Field is Required";
      }
      data.append("couponValue", couponValue);
      data.append("name", name);
      data.append("description", description);
      data.append("image", Image);
      data.append("start_date", start_date);
      data.append("end_date", end_date);
      data.append("tc", terms);
      data.append("coupon_code", coupon_code);
      data.append("usageLimit", usage_limit);
      data.append("UserType", user_type);
      data.append("discountType", "ProductCategory");
      data.append("discountAmount", discount_amount);
      data.append("discountPercentage", discount_percentage);
      data.append("discount_upto", discount_upto);
      data.append("status", status);
      data.append("product_id", []);
      data.append("ProductCategoryType", "category");
      data.append("category_id", JSON.stringify(related_category));
    }

    if (name && start_date && end_date && coupon_code && ststuss === false) {
      AdminApiRequest(data, "/admin/coupon_master", "POST", "apiWithImage")
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            this.setState({
              loading: false,
              modalIsOpen: false,

              cupon: "",
              name: "",
              coupon_code: "",
              usage_limit: "",
              user_type: "",
              discount: "",
              discount_amount: "",
              start_date: "",
              end_date: "",
              discount_percentage: "",
              discount_upto: "",
            });
            this.productcoupon();
            swal({
              title: "Success",
              text: "Coupon Added Successfully !",
              icon: "success",
              successMode: true,
            });
            // window.location.reload();
          } else {
            if (res.data.status == "error") {
              this.setState({ loading: false });
              valueErr = document.getElementsByClassName("err_name");
              valueErr[0].innerText = res.data.result[0].product_name;
            } else if (res.data.message == "error") {
              this.setState({ loading: false });
              alert("Coupon Code Already Exist");
            } else {
              swal({
                title: "Error",
                text: "Error",
                icon: "warning",
                successMode: false,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  edit() {
    var name = this.state.name;
    var start_date = this.state.start_date;
    var end_date = this.state.end_date;
    var coupon_code = this.state.coupon_code;
    var catelogviewstatus = this.state.catelogviewstatus;
    var status = this.state.status;
    var id = this.state.id;
    var description = this.state.description || "";
    var image1 = document.querySelector('input[name="edit_image"]').files[0];
    var image = image1 ? image1 : this.state.image ? this.state.image : null;
    var terms = this.state.terms || "";
    var usage_limit = this.state.usage_limit || "";
    var data = new FormData();
    data.append("name", name);
    data.append("start_date", start_date);
    data.append("end_date", end_date);
    data.append("coupon_code", coupon_code);
    data.append("catelogviewstatus", catelogviewstatus);
    data.append("status", status);
    data.append("description", description);
    data.append("image", image);
    data.append("tc", terms);
    data.append("usageLimit", usage_limit);
    data.append("_id", id);
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!start_date) {
      valueErr = document.getElementsByClassName("err_start_date");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!end_date) {
      valueErr = document.getElementsByClassName("err_end_date");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!coupon_code) {
      valueErr = document.getElementsByClassName("err_coupon_code");
      valueErr[0].innerText = "This Field is Required";
    }
    if (name && start_date && end_date && coupon_code) {
      AdminApiRequest(
        data,
        "/admin/update/coupon_master",
        "post",
        "apiWithImage"
      )
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              cupon: "",
              name: "",
              coupon_code: "",
              usage_limit: "",
              user_type: "",
              discount: "",
              discount_amount: "",
              start_date: "",
              end_date: "",
              discount_percentage: "",
              discount_upto: "",
            });
            this.productcoupon();
            swal({
              title: "Success",
              text: "Record Updated Successfully !",
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
    this.editcloseModal();
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
        var requestData = {
          _id: id,
        };
        AdminApiRequest(requestData, "/admin/coupon_master_delete", "POST", "")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              swal({
                title: "Success",
                text: "Record Added Successfully !",
                icon: "success",
                successMode: true,
              });
              this.productcoupon();
              this.setState({ modalIsOpen: false });
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
        // deletecoupon(id)
        //   .then((res) => {
        //     this.setState({
        //       data1: res.data,
        //     });
        //     this.productcoupon();
        //     swal({
        //       title: "Success",
        //       text: "Record Delete Successfully !",
        //       icon: "success",
        //       successMode: true,
        //     });
        //     this.productcoupon();
        //     console.log(res.data);
        //   })
        //   .catch((error) => {
        //     alert(error);
        //   });
      }
    });
    this.productcoupon();
  }

  editopenModal(data) {
    this.setState({
      id: data._id,
      coupon_code: data.coupon_code,
      discount: data.discount,
      discount_amount: data.discount_amount,
      discount_percentage: data.discount_percentage,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      name: data.name,
      type: data.type,
      status: data.status,
      catelogviewstatus: data.catelogviewstatus,
      description: data.description,
      image: data.image,
      terms: data.tc,
      usage_limit: data.usageLimit,
    });

    this.setState({ editmodalIsOpen: true });
  }

  viewopenModal(data) {
    this.setState({
      alldata: data,
      show: true,
      mdl_layout__obfuscator_hide: true,
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      cupon: "",
      name: "",
      coupon_code: "",
      usage_limit: "",
      user_type: "",
      discount: "",
      discount_amount: "",
      start_date: "",
      end_date: "",
      discount_percentage: "",
      discount_upto: "",
    });
  }

  editcloseModal() {
    this.setState({
      editmodalIsOpen: false,
      name: "",
      coupon_code: "",
      usage_limit: "",
      user_type: "",
      discount: "",
      discount_amount: "",
      start_date: "",
      end_date: "",
      discount_percentage: "",
      discount_upto: "",
    });
  }

  viewcloseModal() {
    this.setState({ show: false });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }

  componentDidMount() {
    this.productcoupon();
    const requestData = {};
    AdminApiRequest(requestData, "/admin/GetAllActiveRegion", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item, index) => {
            activeregion.push({ label: item.name, value: item._id });
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

    AdminApiRequest(requestData, "/admin/product/active", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.map((item, index) => {
            activeproduct.push({ label: item.product_name, value: item._id });
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

    // AdminApiRequest(requestData, "/admin/allproductCategory", "GET")
    AdminApiRequest(requestData, "/category/GetAllActive", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          maincategory = [];
          this.setState({ allactivedata: res.data.data });
          let actdata = res.data.data[0].filter((item) => item.status === true);
          actdata.forEach((item, index) => {
            maincategory.push({ label: item.category_name, value: item._id });
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

  productcoupon() {
    const requestData = {};
    AdminApiRequest(requestData, "/admin/getAll/coupon_master", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
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

  onChange = (start_date) => this.setState({ start_date });
  onChange1 = (end_date) => this.setState({ end_date });
  onChange3 = (start_date) => this.setState({ start_date });
  onChange4 = (end_date) => this.setState({ end_date });

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
                        <h4 className="card-title"> Coupon </h4>

                        <button
                          className="btn btn-primary m-r-5 float-right"
                          onClick={this.openModal}
                        >
                          {" "}
                          <i className="fa fa-plus"></i> Add Coupon{" "}
                        </button>
                      </div>
                    </div>
                    <div className="searching-every searching-4-col search-five-field popup-arrow-select">
                      <span>
                        <input
                          type="text"
                          value={this.state.search_coupon_name}
                          name="search_coupon_name"
                          className="form-control"
                          autoComplete="off"
                          onChange={this.formHandler}
                          placeholder="Coupon Name"
                        ></input>
                      </span>
                      <span>
                        <input
                          type="text"
                          value={this.state.search_coupon_code}
                          name="search_coupon_code"
                          className="form-control"
                          autoComplete="off"
                          onChange={this.formHandler}
                          placeholder="Coupon Code"
                        ></input>
                      </span>
                      <span>
                        <select
                          name="search_type"
                          value={this.state.search_type}
                          className="form-control"
                          onChange={this.formHandler1}
                        >
                          <option value="">Coupon Type</option>
                          <option value="couponValue">Value</option>
                          <option value="ProductCategory">Product</option>
                          <option value="ProductCategory">Category</option>
                        </select>
                      </span>
                      <span>
                        <select
                          name="status_search"
                          value={this.state.status_search}
                          className="form-control"
                          onChange={this.formHandler1}
                        >
                          <option value="">Select Status</option>
                          <option value="true">Active</option>
                          <option value="false">InActive</option>
                        </select>
                      </span>
                      <span className="search-btn-every">
                        <button
                          type="submit"
                          onClick={() => this.search()}
                          className="btn btn-primary m-r-5"
                        >
                          Search
                        </button>
                        <button
                          onClick={() => this.reset()}
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
                            <th scope="col"> Coupon Name </th>
                            <th scope="col"> Start Date </th>
                            <th scope="col"> End Date </th>
                            <th scope="col"> Coupon Code </th>
                            <th scope="col"> Coupon Type </th>
                            <th scope="col"> Discount </th>
                            <th scope="col"> Status </th>
                            <th scope="col"> Action </th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.data.length > 0 ? (
                            this.state.data.map((Data, Index) => (
                              <tr key={Index}>
                                <td style={{ textTransform: "capitalize" }}>
                                  {Data.name}
                                </td>
                                {/* <td>{Data.description && Data.description != "undefined"? Data.description : "--"}</td> */}
                                <td>
                                  {" "}
                                  <Moment format="DD/MM/YYYY hh:mm:ss A">
                                    {Data.start_date}
                                  </Moment>
                                </td>

                                <td>
                                  {" "}
                                  <Moment format="DD/MM/YYYY hh:mm:ss A">
                                    {Data.end_date}
                                  </Moment>
                                </td>
                                <td>{Data.coupon_code} </td>
                                {/* <td>
                                {Data.discountType === "couponValue"
                                  ? "Value Based"
                                  : "Product Based"}
                              </td> */}
                                <td>
                                  {Data.discountType === "couponValue"
                                    ? " Value Based"
                                    : "Product Based"}
                                </td>
                                <td>
                                  {Data.discountAmount
                                    ? Data.discountAmount
                                    : ""}
                                  {Data.discountPercentage
                                    ? Data.discountPercentage +
                                      "%" +
                                      " -  upto - " +
                                      Data.discount_upto
                                    : ""}
                                  {Data.discountProduct
                                    ? Data.discountProduct.product_name
                                    : ""}
                                </td>
                                <td
                                  className={
                                    Data.status === true
                                      ? "view-status processed"
                                      : "view-section inprocessed"
                                  }
                                >
                                  {Data.status === true ? "Active" : "Inactive"}
                                </td>

                                <td>
                                  <i
                                    className="fa fa-eye hover-with-cursor m-r-5"
                                    onClick={this.viewopenModal.bind(
                                      this,
                                      Data
                                    )}
                                  ></i>
                                  <i
                                    className="fa fa-edit hover-with-cursor m-r-5"
                                    onClick={this.editopenModal.bind(
                                      this,
                                      Data
                                    )}
                                  ></i>
                                  <i
                                    className="fa fa-trash hover-with-cursor m-r-5"
                                    onClick={this.deleteRecord.bind(
                                      this,
                                      Data._id
                                    )}
                                  ></i>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr style={{ textAlign: "center" }}>
                              <td
                                colSpan="8"
                                style={{
                                  textTransform: "uppercase",
                                  fontSize: "24",
                                }}
                              >
                                No Data
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Add model here */}
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    ariaHideApp={false}
                    style={customStyles}
                  >
                    <div role="dialog">
                      <div className="modal-dialog coupon_popup popup-arrow-select">
                        <div className="modal-content default_form_design">
                          <button
                            type="button"
                            className="close"
                            onClick={this.closeModal}
                          >
                            &times;
                          </button>
                          <h4 className="modal-title">Add Coupon</h4>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Coupon Type <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="radio"
                                name="cupon"
                                value="value"
                                onChange={this.formHandler}
                              />
                              <span className="">Value</span>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="radio"
                                name="cupon"
                                value="product"
                                onChange={this.formHandler}
                              />
                              <span className="">Product</span>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="radio"
                                name="cupon"
                                value="category"
                                onChange={this.formHandler}
                              />
                              <span className="">Category</span>
                            </div>
                          </div>
                          {this.state.cupon === "value" ? (
                            <div className="modal-form-bx btn_text">
                              <form className="add_coupon">
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Minimum order value{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="number"
                                      name="couponValue"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Minimum order value"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_couponValue"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Coupon Name{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="name"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Coupon Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Description</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="textarea"
                                      name="description"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Description"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_description"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Image</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="file"
                                      name="Image"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Description"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_Image"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Start date{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <DatePicker
                                      onChange={this.onChange}
                                      minDate={new Date()}
                                      value={this.state.start_date}
                                      dateFormat="DD-MM-YYYY"
                                      name="start_date"
                                    />
                                    <span className="err err_start_date"></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      End Date{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <DatePicker
                                    onChange={this.onChange1}
                                    minDate={this.state.start_date}
                                    value={this.state.end_date}
                                    dateFormat="DD-MM-YYYY"
                                    name="end_date"
                                  />
                                  <span className="err err_end_date"></span>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Terms & Condition</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="textarea"
                                      name="terms"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Terms & Condition"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_terms"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Coupon Code
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="coupon_code"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Coupon Code"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_coupon_code"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Usage Limit</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="number"
                                      name="usage_limit"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Usage Limit"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_usage_limit"></span>
                                  </div>
                                </div>

                                {/* <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>User type</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="user_type"
                                      value="All"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter User type"
                                      onChange={this.formHandler}
                                      readOnly
                                    />
                                    <span className="err err_user_type"></span>
                                  </div>
                                </div> */}

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Select Discount Type{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <select
                                      autoComplete="off"
                                      name="discount"
                                      className="form-control"
                                      onChange={this.formHandler}
                                    >
                                      <option value="">
                                        Select Discount Type
                                      </option>
                                      <option value="Percentage">
                                        Percentage
                                      </option>
                                      <option value="Fixed Amount">
                                        Fixed Amount
                                      </option>
                                      <option value="product">Product</option>
                                    </select>
                                    <span className="err err_discount"></span>
                                  </div>
                                </div>

                                {this.state.discount === "Percentage" ? (
                                  <>
                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>
                                          Discount Percentage{" "}
                                          <span className="asterisk">*</span>
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="number"
                                          autoComplete="off"
                                          name="discount_percentage"
                                          className="form-control"
                                          placeholder="Enter Discount Percentage"
                                          onChange={this.formHandler}
                                        />
                                        <span className="err err_discount_percentage"></span>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>Discount up-to </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="text"
                                          autoComplete="off"
                                          name="discount_upto"
                                          className="form-control"
                                          placeholder="Enter Discount up-to"
                                          onChange={this.formHandler}
                                        />
                                        <span className="err err_discount_upto"></span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  ""
                                )}
                                {this.state.discount === "Fixed Amount" ? (
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>
                                        Discount Amount{" "}
                                        <span className="asterisk">*</span>
                                      </label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <input
                                        type="number"
                                        autoComplete="off"
                                        name="discount_amount"
                                        className="form-control"
                                        placeholder="Enter Discount Amount"
                                        onChange={this.formHandler}
                                      />
                                      <span className="err err_discount_amount"></span>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}

                                {this.state.discount === "product" ? (
                                  <>
                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>
                                          Region{" "}
                                          <span className="asterisk">*</span>
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <select
                                          autoComplete="off"
                                          name="free_region_id"
                                          className="form-control"
                                          onChange={this.formHandler11}
                                        >
                                          <option value="">
                                            Select Region
                                          </option>
                                          {activeregion
                                            ? activeregion.map(
                                                (item, index) => (
                                                  <option
                                                    value={item.value}
                                                    key={index}
                                                  >
                                                    {item.label}
                                                  </option>
                                                )
                                              )
                                            : ""}
                                        </select>
                                        <span className="err err_discount_amount"></span>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>
                                          Product{" "}
                                          <span className="asterisk">*</span>
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <select
                                          autoComplete="off"
                                          name="free_product_id"
                                          className="form-control"
                                          onChange={this.formHandler12}
                                        >
                                          <option value="">
                                            Select Product
                                          </option>
                                          {activeproduct &&
                                          activeproduct.length > 0
                                            ? activeproduct.map(
                                                (item, index) => (
                                                  <option
                                                    value={item.value}
                                                    key={index}
                                                  >
                                                    {item.label}
                                                  </option>
                                                )
                                              )
                                            : ""}
                                        </select>
                                        <span className="err err_discount_amount"></span>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>
                                          Package{" "}
                                          <span className="asterisk">*</span>
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <select
                                          autoComplete="off"
                                          name="free_package_id"
                                          className="form-control"
                                          onChange={this.formHandler}
                                        >
                                          <option value="">
                                            Select Package
                                          </option>
                                          {activepackage &&
                                          activepackage.length > 0
                                            ? activepackage.map(
                                                (item, index) => (
                                                  <option value={item.value}>
                                                    {item.label}
                                                  </option>
                                                )
                                              )
                                            : ""}
                                        </select>
                                        <span className="err err_discount_amount"></span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  ""
                                )}

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

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Front-end View Status</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <Switch
                                      onChange={
                                        this.handleChangecatelogviewstatus
                                      }
                                      checked={this.state.catelogviewstatus}
                                      id="normal-switch"
                                    />
                                  </div>
                                </div>

                                <div className="modal-bottom">
                                  {/* <button
                                    className="btn btn-primary feel-btn"
                                    onClick={this.closeModal}
                                  >
                                    Cancel
                                  </button> */}
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
                          ) : (
                            ""
                          )}
                          {this.state.cupon === "product" ? (
                            <div className="modal-form-bx btn_text">
                              <form className="add_coupon">
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Products{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <Select
                                      defaultValue={[]}
                                      isMulti
                                      name="related_product"
                                      onChange={this.onchangingdata}
                                      options={activeproduct}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                    />
                                    <span className="err err_selectednewproducts"></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Coupon Name{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="name"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Coupon Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_name"></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Description</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="textarea"
                                      name="description"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Description"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_description"></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Image</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="file"
                                      name="Image"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Description"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_Image"></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Start date{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <DatePicker
                                      onChange={this.onChange}
                                      value={this.state.start_date}
                                      dateFormat="DD-MM-YYYY"
                                      name="start_date"
                                    />
                                    <span className="err err_start_date"></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      End Date{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <DatePicker
                                    onChange={this.onChange1}
                                    minDate={this.state.start_date}
                                    value={this.state.end_date}
                                    dateFormat="DD-MM-YYYY"
                                    name="end_date"
                                  />
                                  <span className="err err_end_date"></span>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Terms & Condition</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="textarea"
                                      name="terms"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Terms & Condition"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_terms"></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Coupon Code
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="coupon_code"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Coupon Code"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_coupon_code"></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Usage Limit</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="number"
                                      name="usage_limit"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Usage Limit"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_usage_limit"></span>
                                  </div>
                                </div>
                                {/* <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>User type</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="user_type"
                                      value="All"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter User type"
                                      onChange={this.formHandler}
                                      readOnly
                                    />
                                    <span className="err err_user_type"></span>
                                  </div>
                                </div> */}
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Select Discount Type{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <select
                                      autoComplete="off"
                                      name="discount"
                                      className="form-control"
                                      onChange={this.formHandler}
                                    >
                                      <option value="">
                                        Select Discount Type
                                      </option>
                                      <option value="Percentage">
                                        Percentage
                                      </option>
                                      <option value="Fixed Amount">
                                        Fixed Amount
                                      </option>
                                      <option value="product">Product</option>
                                    </select>
                                    <span className="err err_discount"></span>
                                  </div>
                                </div>
                                {this.state.discount === "Percentage" ? (
                                  <>
                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>
                                          Discount Percentage{" "}
                                          <span className="asterisk">*</span>
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="number"
                                          autoComplete="off"
                                          name="discount_percentage"
                                          className="form-control"
                                          placeholder="Enter Discount Percentage"
                                          onChange={this.formHandler}
                                        />
                                        <span className="err err_discount_percentage"></span>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>
                                          Discount up-to{" "}
                                          {/* <span className="asterisk">*</span> */}
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="text"
                                          autoComplete="off"
                                          name="discount_upto"
                                          className="form-control"
                                          placeholder="Enter Discount up-to"
                                          onChange={this.formHandler}
                                        />
                                        <span className="err err_discount_upto"></span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  ""
                                )}
                                {this.state.discount === "Fixed Amount" ? (
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>
                                        Discount Amount{" "}
                                        <span className="asterisk">*</span>
                                      </label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <input
                                        type="text"
                                        autoComplete="off"
                                        name="discount_amount"
                                        className="form-control"
                                        placeholder="Enter Discount Amount"
                                        onChange={this.formHandler}
                                      />
                                      <span className="err err_discount_amount"></span>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {/* <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Discount Location{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <select
                                      autoComplete="off"
                                      name="discountLocation"
                                      className="form-control"
                                      onChange={this.formHandler}
                                    >
                                      <option value="cart">Cart</option>
                                      <option value="product">Product</option>
                                    </select>
                                  </div>
                                </div> */}

                                {this.state.discount === "product" ? (
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>
                                        Product{" "}
                                        <span className="asterisk">*</span>
                                      </label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <select
                                        autoComplete="off"
                                        name="freeproduct"
                                        className="form-control"
                                        onChange={this.formHandler}
                                      >
                                        <option value="">Select Product</option>
                                        {activeproduct
                                          ? activeproduct.map((item, index) => (
                                              <option
                                                value={item.value}
                                                key={index}
                                              >
                                                {item.label}
                                              </option>
                                            ))
                                          : ""}
                                      </select>
                                      {/* <input
                                        type="text"
                                        autoComplete="off"
                                        name="discount_amount"
                                        className="form-control"
                                        placeholder="Enter Discount Amount"
                                        onChange={this.formHandler}
                                      /> */}
                                      <span className="err err_discount_amount"></span>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
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
                                  {/* <button
                                    className="btn btn-primary feel-btn"
                                    onClick={this.closeModal}
                                  >
                                    Cancel
                                  </button> */}
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
                          ) : (
                            ""
                          )}
                          {this.state.cupon === "category" ? (
                            <div className="modal-form-bx btn_text">
                              <form className="add_coupon">
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Category{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <Select
                                      defaultValue={[]}
                                      isMulti
                                      name="related_category"
                                      onChange={this.onchangingdata1}
                                      options={maincategory}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                    />
                                    <span className="err err_related_category"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Coupon Name{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="name"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Coupon Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Description</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="textarea"
                                      name="description"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Description"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_description"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Image</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="file"
                                      name="Image"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Description"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_Image"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Start date{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <DatePicker
                                      onChange={this.onChange}
                                      value={this.state.start_date}
                                      dateFormat="DD-MM-YYYY"
                                      name="start_date"
                                    />
                                    <span className="err err_start_date"></span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      End Date{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <DatePicker
                                    onChange={this.onChange1}
                                    minDate={this.state.start_date}
                                    value={this.state.end_date}
                                    dateFormat="DD-MM-YYYY"
                                    name="end_date"
                                  />
                                  <span className="err err_end_date"></span>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Terms & Condition</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="textarea"
                                      name="terms"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Terms & Condition"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_terms"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Coupon Code
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="coupon_code"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Coupon Code"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_coupon_code"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Usage Limit</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="number"
                                      name="usage_limit"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter Usage Limit"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_usage_limit"></span>
                                  </div>
                                </div>

                                {/* <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>User type</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="user_type"
                                      value="All"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter User type"
                                      onChange={this.formHandler}
                                      readOnly
                                    />
                                    <span className="err err_user_type"></span>
                                  </div>
                                </div> */}

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Select Discount Type{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <select
                                      autoComplete="off"
                                      name="discount"
                                      className="form-control"
                                      onChange={this.formHandler}
                                    >
                                      <option value="">
                                        Select Discount Type
                                      </option>
                                      <option value="Percentage">
                                        Percentage
                                      </option>
                                      <option value="Fixed Amount">
                                        Fixed Amount
                                      </option>
                                      <option value="product">Product</option>
                                    </select>
                                    <span className="err err_discount"></span>
                                  </div>
                                </div>

                                {this.state.discount === "Percentage" ? (
                                  <>
                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>
                                          Discount Percentage{" "}
                                          <span className="asterisk">*</span>
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="number"
                                          autoComplete="off"
                                          name="discount_percentage"
                                          className="form-control"
                                          placeholder="Enter Discount Percentage"
                                          onChange={this.formHandler}
                                        />
                                        <span className="err err_discount_percentage"></span>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <div className="modal-left-bx">
                                        <label>
                                          Discount up-to{" "}
                                          {/* <span className="asterisk">*</span> */}
                                        </label>
                                      </div>
                                      <div className="modal-right-bx">
                                        <input
                                          type="text"
                                          autoComplete="off"
                                          name="discount_upto"
                                          className="form-control"
                                          placeholder="Enter Discount up-to"
                                          onChange={this.formHandler}
                                        />
                                        <span className="err err_discount_upto"></span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  ""
                                )}
                                {this.state.discount === "Fixed Amount" ? (
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>
                                        Discount Amount{" "}
                                        <span className="asterisk">*</span>
                                      </label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <input
                                        type="text"
                                        autoComplete="off"
                                        name="discount_amount"
                                        className="form-control"
                                        placeholder="Enter Discount Amount"
                                        onChange={this.formHandler}
                                      />
                                      <span className="err err_discount_amount"></span>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}

                                {this.state.discount === "product" ? (
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>
                                        Product{" "}
                                        <span className="asterisk">*</span>
                                      </label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <select
                                        autoComplete="off"
                                        name="freeproduct"
                                        className="form-control"
                                        onChange={this.formHandler12}
                                      >
                                        <option value="">Select Product</option>
                                        {activeproduct
                                          ? activeproduct.map((item, index) => (
                                              <option
                                                value={item.value}
                                                key={index}
                                              >
                                                {item.label}
                                              </option>
                                            ))
                                          : ""}
                                      </select>
                                      {/* <input
                                        type="text"
                                        autoComplete="off"
                                        name="discount_amount"
                                        className="form-control"
                                        placeholder="Enter Discount Amount"
                                        onChange={this.formHandler}
                                      /> */}
                                      <span className="err err_discount_amount"></span>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}

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
                                  {/* <button
                                    className="btn btn-primary feel-btn"
                                    onClick={this.closeModal}
                                  >
                                    Cancel
                                  </button> */}
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
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </Modal>

                  {/* Edit Modal */}
                  <Modal
                    isOpen={this.state.editmodalIsOpen}
                    ariaHideApp={false}
                    onRequestClose={this.editcloseModal}
                    style={customStyles}
                  >
                    <div role="dialog">
                      <div className="modal-dialog coupon_popup">
                        <div className="modal-content default_form_design">
                          <button
                            type="button"
                            className="close"
                            onClick={this.editcloseModal}
                          >
                            &times;
                          </button>
                          <h4 className="modal-title">Edit Coupon</h4>
                          <div className="modal-form-bx">
                            <form>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Coupon Name{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    autoComplete="off"
                                    value={this.state.name}
                                    placeholder="Enter Coupon Name"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_name"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Description</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="textarea"
                                    name="description"
                                    value={this.state.description}
                                    className="form-control"
                                    autoComplete="off"
                                    placeholder="Enter Description"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_description"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Image</label>
                                </div>
                                <div className="modal-right-bx">
                                  {this.state.image ? (
                                    <img
                                      src={imageUrl + this.state.image}
                                      style={{ maxHeight: 100 }}
                                    />
                                  ) : (
                                    ""
                                  )}
                                  <input
                                    type="file"
                                    name="edit_image"
                                    className="form-control"
                                    autoComplete="off"
                                    placeholder="Enter Description"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_Image"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Start date{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <DatePicker
                                    onChange={this.onChange3}
                                    value={this.state.start_date}
                                    dateFormat="DD-MM-YYYY"
                                    name="start_date"
                                  />
                                  <span className="err err_start_date"></span>
                                </div>
                              </div>
                              {/* <input type="text" value={this.state.end_date}/> */}
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    End Date <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <DatePicker
                                  onChange={this.onChange4}
                                  value={this.state.end_date}
                                  dateFormat="DD-MM-YYYY"
                                  name="end_date"
                                />
                                <span className="err err_end_date"></span>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Coupon Code{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    name="coupon_code"
                                    className="form-control"
                                    value={this.state.coupon_code}
                                    placeholder="Enter Coupon Code"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_coupon_code"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Terms & Condition</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="textarea"
                                    name="terms"
                                    value={this.state.terms}
                                    className="form-control"
                                    autoComplete="off"
                                    placeholder="Enter Terms & Condition"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_terms"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Usage Limit</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="number"
                                    name="usage_limit"
                                    value={this.state.usage_limit}
                                    className="form-control"
                                    autoComplete="off"
                                    placeholder="Enter Usage Limit"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_usage_limit"></span>
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
                                      this.state.status === true ? true : false
                                    }
                                    name="status"
                                    id="normal-switch"
                                  />
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Front-end View Status</label>
                                </div>
                                <div className="modal-right-bx">
                                  <Switch
                                    onChange={
                                      this.handleChangecatelogviewstatus
                                    }
                                    checked={
                                      this.state.catelogviewstatus === true
                                        ? true
                                        : false
                                    }
                                    name="status"
                                    id="normal-switch"
                                  />
                                </div>
                              </div>
                              <div className="modal-bottom">
                                {/* <button
                                  className="btn btn-primary feel-btn"
                                  onClick={this.editcloseModal}
                                >
                                  Cancel
                                </button> */}
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
                      {this.state.alldata ? (
                        <ul>
                          <li>
                            <span className="view-title">Coupon Name</span>
                            <span className="view-status">
                              {this.state.alldata.name}
                            </span>
                          </li>
                          {this.state.alldata.couponValue ? (
                            <li>
                              <span className="view-title">
                                Minimum order value
                              </span>
                              <span className="view-status">
                                {this.state.alldata.couponValue}
                              </span>
                            </li>
                          ) : (
                            ""
                          )}
                          <li>
                            <span className="view-title">Description</span>
                            <span className="view-status">
                              {this.state.alldata.description &&
                              this.state.alldata.description !== "undefined"
                                ? this.state.alldata.description
                                : "--"}
                            </span>
                          </li>
                          {this.state.alldata.image ? (
                            <li>
                              <span className="view-title">Image</span>
                              <span className="view-status">
                                <img
                                  src={imageUrl + this.state.alldata.image}
                                  alt="coupon"
                                />
                              </span>
                            </li>
                          ) : (
                            <></>
                          )}

                          <li>
                            <span className="view-title">Start Date</span>
                            <span className="view-status">
                              {" "}
                              <Moment format="DD/MM/YYYY hh:mm:ss A">
                                {this.state.alldata.start_date}
                              </Moment>{" "}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">End Date</span>
                            <span className="view-status">
                              {" "}
                              <Moment format="DD/MM/YYYY hh:mm:ss A">
                                {this.state.alldata.end_date}
                              </Moment>{" "}
                            </span>
                          </li>
                          {this.state.alldata.tc &&
                          this.state.alldata.tc !== "undefined" ? (
                            <li>
                              <span className="view-title">
                                Term & Condition
                              </span>
                              <span className="view-status">
                                {this.state.alldata.tc}
                              </span>
                            </li>
                          ) : (
                            <></>
                          )}
                          <li>
                            <span className="view-title">Coupon code</span>
                            <span className="view-status">
                              {this.state.alldata.coupon_code}
                            </span>
                          </li>

                          {this.state.alldata.usageLimit !== "undefined" ? (
                            <li>
                              <span className="view-title">Usage Limit</span>
                              <span className="view-status">
                                {this.state.alldata.usageLimit || "0"}
                              </span>
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.alldata.UserType ? (
                            <li>
                              <span className="view-title">User Type</span>
                              <span className="view-status">
                                {this.state.alldata.UserType}
                              </span>
                            </li>
                          ) : (
                            <></>
                          )}
                          <li>
                            <span className="view-title">Discount Type</span>
                            <span className="view-status">
                              {this.state.alldata.discountType === "CouponValue"
                                ? "Value Based"
                                : "Product/Category Based"}
                            </span>
                          </li>

                          {this.state.alldata.discountAmount ? (
                            <li>
                              <span className="view-title">
                                Discount Amount
                              </span>
                              <span className="view-status">
                                {this.state.alldata.discountAmount}
                              </span>
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.alldata.discountPercentage ? (
                            <>
                              <li>
                                <span className="view-title">
                                  Discount Percentage
                                </span>
                                <span className="view-status">
                                  {this.state.alldata.discountPercentage}
                                </span>
                              </li>
                              <li>
                                <span className="view-title">
                                  Discount Upto
                                </span>
                                <span className="view-status">
                                  {this.state.alldata.discountPercentage}
                                </span>
                              </li>
                            </>
                          ) : (
                            ""
                          )}
                          {this.state.alldata.discountProduct ? (
                            <li>
                              <span className="view-title">Free Product</span>
                              <span className="view-status">
                                {
                                  this.state.alldata.discountProduct
                                    .product_name
                                }
                              </span>
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.alldata.productDetail.length > 0 ? (
                            <li>
                              <span className="view-title">
                                Discounted Products
                              </span>
                              <span className="view-status">
                                {this.state.alldata.productDetail.map(
                                  (p) => p.product_id?.product_name + ", "
                                )}
                              </span>
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.alldata.categoryDetail.length > 0 ? (
                            <li>
                              <span className="view-title">
                                Discounted Category
                              </span>
                              <span className="view-status">
                                {this.state.alldata.categoryDetail.map(
                                  (p) => p.category_id?.category_name + ", "
                                )}
                              </span>
                            </li>
                          ) : (
                            ""
                          )}

                          <li>
                            <span className="view-title">Type</span>
                            <span className="view-status">
                              {this.state.alldata.discountType === "couponValue"
                                ? "Value Based"
                                : "Product/Category Based"}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Status</span>
                            <span
                              className={
                                this.state.alldata.status === true
                                  ? "view-status processed"
                                  : "view-section inprocessed"
                              }
                            >
                              {this.state.alldata.status === true
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
              <div className="admin-header">
                <Adminfooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
