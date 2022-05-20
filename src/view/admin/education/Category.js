import React, { Component } from "react";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import MultipleValueTextInput from "react-multivalue-text-input";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
import { imageUrl } from "../../../imageUrl";
import Adminfooter from "../elements/admin_footer";
import Adminheader from "../elements/admin_header";
import Adminsiderbar from "../elements/admin_sidebar";

const noImage = require("../../../images/noImage.png");

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

export default class Category extends Component {
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
      category_name: "",
      category_code: "",
      status: true,
      data: [],
      primary_id: "",
      id: "",
      subCat1: [],
      level: 1,
      parentStatus: false,
      subCat1Data: [],
      viewModalData: {},
      allData: [],
      meta_keyword: [],
      meta_title: "",
      meta_desc: "",
      category_name_search: "",
      status_search: "",
      parent: "",
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editopenModal = this.editopenModal.bind(this);
    this.editcloseModal = this.editcloseModal.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);

    // this.add = this.add.bind(this);
    // this.edit = this.edit.bind(this);
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  _handleMetaKeywords(allItems) {
    this.setState({ meta_keyword: allItems });
  }

  async formHandler1(val, type) {
    const value = await val.target.value;
    switch (type) {
      case "parent":
        if (value === "None") {
          this.setState({
            level: 1,
            parent: "None",
            parentCat_id: "",
            parentStatus: false,
            // open_listStatus: false,
            // parentErr: parentCheck.errMsg
          });
        } else {
          this.setState({
            // level: parseInt(value.split(",")[1]) + 1,
            parent: value.split(",")[2],
            // parentCat_id: value.split(",")[2],
            // parentStatus: true,
            // subCat1Data: this.state.subCat1.filter(
            //   (item) => item.parentCat_id === value.split(",")[2]
            // ),
          });
        }
        break;
      case "subCat":
        if (value === "None") {
          this.setState({ level: 2 });
        } else {
          this.setState({
            level: parseInt(value.split(",")[1]) + 1,
            parent: value.split(",")[0],
            parentCat_id: value.split(",")[2],
          });
        }
        break;
    }
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true });
    } else {
      this.setState({ status: false });
    }
  }

  _handleStatus(data, status) {
    const reqData = {
      // level: data.level,
      _id: data._id,
      status: JSON.stringify(!data.status),
    };
    AdminApiRequest(reqData, "/admin/updateCategoryStatus", "POST")
      .then((res) => {
        this.allproductCategory();
        // this.setState({
        //     allData: await [].concat.apply([], res.data),
        //     data: res.data[0],
        //     subCat1: res.data[1]
        // })
      })
      .catch((error) => {
        alert(error);
      });
  }

  _handleEdit() {
    if (this.state.level === 0 || this.state.level === "0") {
      this.editCat();
    } else if (this.state.level === 1 || this.state.level === "1") {
      // this.editSubCat();
      this.editCat();
    } else if (this.state.level === 2 || this.state.level === "2") {
      // this.editSubSubCat();
      this.editCat();
    }
    // this.setState({ editmodalIsOpen: false });
  }

  _handleAdd() {
    if (this.state.level === 1 || this.state.level === "1") {
      this.addCat();
    } else if (this.state.level === 2 || this.state.level === "2") {
      this.addSubCat();
    } else if (this.state.level === 3 || this.state.level === "3") {
      this.addSubCat2();
    }
  }

  addCat() {
    var category_name = this.state.category_name
      ? this.state.category_name
      : "";
    var status = this.state.status ? this.state.status : false;
    var id = this.state.id ? this.state.id : "";
    var category_code = this.state.category_code
      ? this.state.category_code
      : "";
    var level = this.state.level ? this.state.level : "";
    var priority = this.state.priority ? this.state.priority : "";
    var parent = this.state.parent === "None" ? "" : this.state.parent;
    var parentCat_id = this.state.parentCat_id ? this.state.parentCat_id : "";
    var meta_title = this.state.meta_title ? this.state.meta_title : "";
    var meta_desc = this.state.meta_desc ? this.state.meta_desc : "";
    var meta_keyword = this.state.meta_keyword ? this.state.meta_keyword : "";
    var icon = document.querySelector('input[name="icon"]').files[0];
    var banner = document.querySelector('input[name="banner"]').files[0];

    var newewquestdata = new FormData();

    newewquestdata.append("icon", icon || "");
    newewquestdata.append("banner", banner || "");
    newewquestdata.append("category_name", category_name);
    newewquestdata.append("priority", priority);
    newewquestdata.append("status", status);
    newewquestdata.append("id", id);
    newewquestdata.append("category_code", category_code);
    newewquestdata.append("level", level);
    newewquestdata.append("parent", parent);
    newewquestdata.append("parentCat_id", parentCat_id);
    newewquestdata.append("meta_title", meta_title);
    newewquestdata.append("meta_keyword", meta_keyword);
    newewquestdata.append("meta_desc", meta_desc);

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!category_name) {
      valueErr = document.getElementsByClassName("err_category_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (!this.state.parent) {
      valueErr = document.getElementsByClassName("err_parent_cat");
      valueErr[0].innerText = "This Field is Required";
    }

    if (category_name && this.state.parent) {
      AdminApiRequest(
        newewquestdata,
        "/admin/product_category",
        "POST",
        "apiWithImage"
      )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            this.allproductCategory();
            swal({
              title: "Success",
              text: "Record Added Successfully !",
              icon: "success",
              successMode: true,
            });
            this.setState({ modalIsOpen: false, category_name: "" });
          } else {
            if (res.data.data[0].category_name) {
              valueErr = document.getElementsByClassName("err_category_name");
              valueErr[0].innerText = res.data.data[0].category_name;
              swal({
                title: "Error",
                text: res.data.data[0].category_name,
                icon: "warning",
              });
            }
            if (res.data.data[0].priority) {
              valueErr = document.querySelector(".err_priority");
              valueErr.innerHTML = res.data.data[0].priority;
              swal({
                title: "Error",
                text: res.data.data[0].priority,
                icon: "warning",
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  addSubCat() {
    var data = new FormData();
    var category_name = this.state.category_name;
    var edit_priority = this.state.edit_priority;
    var status = this.state.status ? this.state.status : false;
    var id = this.state.id;
    var category_code = this.state.category_code;
    var level = this.state.level;
    var parent = this.state.parent === "None" ? "" : this.state.parent;
    var priority = this.state.priority ? this.state.priority : "";
    var parentCat_id = this.state.parentCat_id;
    var meta_title = this.state.meta_title;
    var meta_desc = this.state.meta_desc;
    var meta_keyword = this.state.meta_keyword;
    var icon = document.querySelector('input[name="icon"]').files[0];
    var banner = document.querySelector('input[name="banner"]').files[0];

    data.append("icon", icon);
    data.append("banner", banner);
    data.append("priority", priority);
    data.append("category_name", category_name);
    // data.append("priority", edit_priority);
    data.append("status", status);
    data.append("id", id);
    data.append("category_code", category_code);
    data.append("level", level);
    data.append("parent", parent);
    data.append("parentCat_id", parentCat_id);
    data.append("meta_title", meta_title);
    data.append("meta_keyword", meta_keyword);
    data.append("meta_desc", meta_desc);
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!category_name) {
      valueErr = document.getElementsByClassName("err_category_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (!this.state.parent) {
      valueErr = document.getElementsByClassName("err_parent_cat");
      valueErr[0].innerText = "This Field is Required";
    }

    if (category_name && this.state.parent) {
      AdminApiRequest(data, "/admin/addSubCat1", "POST")
        .then((res) => {
          if (res.status !== 200 || res.status !== 201) {
            if (res.data.data[0].category_name) {
              valueErr = document.getElementsByClassName("err_category_name");
              valueErr[0].innerText = res.data.data[0].category_name;
              swal({
                title: "Error",
                text: res.data.data[0].category_name,
                icon: "warning",
              });
            }
            if (res.data.data[0].priority) {
              valueErr = document.querySelector(".err_priority");
              valueErr.innerHTML = res.data.data[0].priority;
              swal({
                title: "Error",
                text: res.data.data[0].priority,
                icon: "warning",
              });
            }
          } else {
            this.allproductCategory();
            swal({
              title: "Success",
              text: "Record Added Successfully !",
              icon: "success",
              successMode: true,
            });
            // .then(willDelete => {
            //     window.location.reload()
            // });
            this.setState({ modalIsOpen: false, category_name: "" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  addSubCat2() {
    var data = new FormData();
    var category_name = this.state.category_name;
    var edit_priority = this.state.edit_priority;
    var status = this.state.status ? this.state.status : false;
    var id = this.state.id;
    var category_code = this.state.category_code;
    var level = this.state.level;
    var parent = this.state.parent;
    var priority = this.state.priority ? this.state.priority : "";
    var parentCat_id = this.state.parentCat_id;
    var meta_title = this.state.meta_title;
    var meta_desc = this.state.meta_desc;
    var meta_keyword = this.state.meta_keyword;
    var icon = document.querySelector('input[name="icon"]').files[0];
    var banner = document.querySelector('input[name="banner"]').files[0];

    data.append("icon", icon);
    data.append("banner", banner);
    data.append("category_name", category_name);
    // data.append("priority", edit_priority);
    data.append("status", status);
    data.append("id", id);
    data.append("category_code", category_code);
    data.append("priority", priority);
    data.append("level", level);
    data.append("parent", parent);
    data.append("parentCat_id", parentCat_id);
    data.append("meta_title", meta_title);
    data.append("meta_keyword", meta_keyword);
    data.append("meta_desc", meta_desc);
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!category_name) {
      valueErr = document.getElementsByClassName("err_category_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (!this.state.parent) {
      valueErr = document.getElementsByClassName("err_parent_cat");
      valueErr[0].innerText = "This Field is Required";
    }

    if (category_name && this.state.parent) {
      AdminApiRequest(data, "/admin/addSubCat2", "POST")
        .then((res) => {
          if (res.data.status == "error") {
            if (res.result[0].category_name) {
              valueErr = document.getElementsByClassName("err_category_name");
              valueErr[0].innerText = res.result[0].category_name;
            }
            if (res.result[0].priority) {
              valueErr = document.querySelector(".err_priority");
              valueErr.innerHTML = res.result[0].priority;
            }
          } else {
            this.allproductCategory();
            swal({
              title: "Success",
              text: "Record Added Successfully !",
              icon: "success",
              successMode: true,
            });
            // .then(willDelete => {
            //     window.location.reload()
            // });
            this.setState({ modalIsOpen: false, category_name: "" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  editCat() {
    var data = new FormData();
    var category_name = this.state.category_name
      ? this.state.category_name
      : "";
    var status = this.state.status ? this.state.status : false;
    var id = this.state.id ? this.state.id : "";
    var category_code = this.state.category_code
      ? this.state.category_code
      : "";
    var edit_priority = this.state.edit_priority
      ? this.state.edit_priority
      : "";
    var level = this.state.level ? this.state.level : "";
    var parent =
      this.state.editParentCategory && this.state.editParentCategory !== "None"
        ? this.state.editParentCategory
        : "";
    var parentCat_id = this.state.parentCat_id ? this.state.parentCat_id : "";
    var meta_title = this.state.meta_title ? this.state.meta_title : "";
    var meta_desc = this.state.meta_desc ? this.state.meta_desc : "";
    var meta_keyword = this.state.meta_keyword ? this.state.meta_keyword : "";
    var icon = document.querySelector('input[name="icon"]').files[0]
      ? document.querySelector('input[name="icon"]').files[0]
      : this.state.icon;
    var banner = document.querySelector('input[name="banner"]').files[0]
      ? document.querySelector('input[name="banner"]').files[0]
      : this.state.banner;

    data.append("icon", icon);
    data.append("banner", banner);
    data.append("category_name", category_name);
    data.append("status", status);
    data.append("id", id);
    data.append("category_code", category_code);
    data.append("priority", edit_priority);
    data.append("level", level);
    data.append("parent", parent);
    data.append("parentCat_id", parentCat_id);
    data.append("meta_title", meta_title);
    data.append("meta_keyword", meta_keyword);
    data.append("meta_desc", meta_desc);
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!category_name) {
      valueErr = document.getElementsByClassName("err_category_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (category_name) {
      AdminApiRequest(
        data,
        "/admin/product_category/update",
        "POST",
        "apiWithImage"
      )
        .then((res) => {
          if (res.data.status === "error") {
            if (res.data.result[0].category_name) {
              valueErr = document.getElementsByClassName("err_category_name");
              valueErr[0].innerText = res.data.result[0].category_name;
              swal({
                title: "Error",
                text: res.data.result[0].category_name,
                icon: "warning",
              });
            }
            if (res.data.result[0].priority) {
              valueErr = document.querySelector(".err_priority");
              valueErr.innerHTML = res.data.result[0].priority;
              swal({
                title: "Error",
                text: res.data.result[0].priority,
                icon: "warning",
              });
            }
          } else {
            this.allproductCategory();
            swal({
              title: "Success",
              text: "Record updated Successfully !",
              icon: "success",
              successMode: true,
            });
            // .then(willDelete => {
            //     window.location.reload()
            // });
            this.setState({ modalIsOpen: false, editmodalIsOpen: false });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  editSubCat() {
    var data = new FormData();
    var category_name = this.state.category_name;
    var status = this.state.status ? this.state.status : false;
    var id = this.state.id;
    var category_code = this.state.category_code;
    var edit_priority = this.state.edit_priority
      ? this.state.edit_priority
      : "";
    var level = this.state.level;
    var parent = this.state.parent ? this.state.parent : "";
    var parentCat_id = this.state.parentCat_id;
    var meta_title = this.state.meta_title;
    var meta_desc = this.state.meta_desc;
    var meta_keyword = this.state.meta_keyword;
    var icon = document.querySelector('input[name="icon"]').files[0]
      ? document.querySelector('input[name="icon"]').files[0]
      : this.state.icon;
    var banner = document.querySelector('input[name="banner"]').files[0]
      ? document.querySelector('input[name="banner"]').files[0]
      : this.state.banner;

    data.append("icon", icon);
    data.append("banner", banner);
    data.append("category_name", category_name);
    data.append("status", status);
    data.append("id", id);
    data.append("category_code", category_code);
    data.append("priority", edit_priority);
    data.append("level", level);
    data.append("parent", parent);
    data.append("parentCat_id", parentCat_id);
    data.append("meta_title", meta_title);
    data.append("meta_keyword", meta_keyword);
    data.append("meta_desc", meta_desc);

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!category_name) {
      valueErr = document.getElementsByClassName("err_category_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (category_name) {
      AdminApiRequest(data, "/admin/updateSubCat1", "POST")
        .then((res) => {
          if (res.status === "error") {
            valueErr = document.querySelector(".err_priority");
            valueErr.innerHTML = res.result[0].priority;
          } else {
            this.allproductCategory();
            swal({
              title: "Success",
              text: "Record updated Successfully !",
              icon: "success",
              successMode: true,
            });
            // .then(willDelete => {
            //     window.location.reload()
            // });
            this.setState({ modalIsOpen: false, editmodalIsOpen: false });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  editSubSubCat() {
    var data = new FormData();
    var category_name = this.state.category_name;
    var status = this.state.status ? this.state.status : false;
    var id = this.state.id;
    var category_code = this.state.category_code;
    var edit_priority = this.state.edit_priority
      ? this.state.edit_priority
      : "";
    var level = this.state.level;
    var parent = this.state.parent;
    var parentCat_id = this.state.parentCat_id;
    var meta_title = this.state.meta_title;
    var meta_desc = this.state.meta_desc;
    var meta_keyword = this.state.meta_keyword;
    var icon = document.querySelector('input[name="icon"]').files[0]
      ? document.querySelector('input[name="icon"]').files[0]
      : this.state.icon;
    var banner = document.querySelector('input[name="banner"]').files[0]
      ? document.querySelector('input[name="banner"]').files[0]
      : this.state.banner;

    data.append("icon", icon);
    data.append("banner", banner);
    data.append("category_name", category_name);
    data.append("status", status);
    data.append("id", id);
    data.append("category_code", category_code);
    data.append("priority", edit_priority);
    data.append("level", level);
    data.append("parent", parent);
    data.append("parentCat_id", parentCat_id);
    data.append("meta_title", meta_title);
    data.append("meta_keyword", meta_keyword);
    data.append("meta_desc", meta_desc);

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!category_name) {
      valueErr = document.getElementsByClassName("err_category_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (category_name) {
      AdminApiRequest(data, "/admin/updateSubCat2", "POST")
        .then((res) => {
          this.allproductCategory();
          swal({
            title: "Success",
            text: "Record updated Successfully !",
            icon: "success",
            successMode: true,
          });
          // .then(willDelete => {
          //     window.location.reload()
          // });
          this.setState({ modalIsOpen: false, editmodalIsOpen: false });
        })
        .catch((error) => {
          console.log(error);
        });
      // updateproductSubSubcategory(data)
      //   .then((res) => {

      //   })
      //   .catch((error) => {
      //     alert(error);
      //   });
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  deleteRecord(id) {
    var requestData = {
      categoryId: id,
    };

    swal({
      title: "Are you sure you want to",
      text: "Delete this record?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        AdminApiRequest(requestData, "/admin/deleteAllCategory", "POST")
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              swal({
                title: "Success",
                text: "Record Deleted Successfully !",
                icon: "success",
                successMode: true,
              });
            } else {
              swal({
                title: "Error",
                text: res.data.data,
                icon: "warning",
                successMode: true,
              });
            }
            this.allproductCategory();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  editopenModal(data) {
    this.setState({
      category_name: data.category_name,
      status: Boolean(data.status),
      category_code: data.category_code,
      id: data._id,
      editmodalIsOpen: true,
      edit_priority: data.priority,
      banner: data.banner,
      icon: data.icon,
      level: data.level,
      parentCat_id: data.parentCat_id,
      parent: data.parent,
      editParentCategory: data.parent,
      meta_title:
        data.meta_title === null || data.meta_title === "undefined"
          ? ""
          : data.meta_title,
      meta_keyword:
        data.meta_keyword === "" ? [] : data.meta_keyword.split(","),
      meta_desc:
        data.meta_desc === null || data.meta_desc === "undefined"
          ? ""
          : data.meta_desc,
    });
    if (data.level === "2" || data.level === 2) {
      this.setState({
        parent: data.parent,
      });
    } else if (data.level === "3" || data.level === 3) {
      this.setState({
        parent: this.state.allData.filter(
          (item) => item._id === data.parentCat_id
        )[0].parent,
        subCatName: data.parent,
      });
    }
  }

  async viewopenModal(data) {
    const data1 = await data;
    this.setState({
      category_name: data1.category_name,
      viewModalData: data1,
      priority: data1.priority,
      category_code: data1.category_code,
      status: data1.status,
      banner: data1.banner,
      icon: data1.icon,
      level: data1.level,
      parent: data1.parent,
      parentCat_id: data1.parentCat_id,
      meta_title: data1.meta_title,
      meta_keyword: data1.meta_keyword,
      meta_desc: data1.meta_desc,
    });
    this.setState({ show: true, mdl_layout__obfuscator_hide: true });
    // this.setState({  });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }
  editcloseModal() {
    this.setState({
      editmodalIsOpen: false,
      viewModalData: {},
      parent: "",
      editParentCategory: "",
      subCatName: "",
      category_name: "",
      level: "",
      status: true,
      category_code: "",
      banner: "",
      icon: "",
      meta_desc: "",
      meta_keyword: [],
      meta_title: "",
    });
  }

  viewcloseModal() {
    this.setState({
      show: false,
      mdl_layout__obfuscator_hide: false,
      parent: "",
      subCatName: "",
      parent: "",
      category_name: "",
      level: "",
      status: true,
      category_code: "",
      banner: "",
      icon: "",
      meta_desc: "",
      meta_keyword: [],
      meta_title: "",
    });
  }

  componentDidMount() {
    this.allproductCategory();
  }

  getSubCat1() {
    const requestData = {};
    AdminApiRequest(requestData, "/admin/getSubCat1", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            subCat1: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  allproductCategory() {
    const requestData = {};
    AdminApiRequest(requestData, "/admin/product_category/GetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            allData: res.data.data[0],
            data: res.data.data[0],
            subCat1: res.data.data[1],
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // allproductCategory()
    //   .then(async (res) => {
    //     this.setState({
    //       allData: await [].concat.apply([], res.data),
    //       data: res.data[0],
    //       subCat1: res.data[1],
    //     });
    //     console.log("sub cat -===>>>>>", res.data);
    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });
  }
  searchHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  getcustomerfilter = () => {
    const requestData = {
      category_name: this.state.category_name_search,
      status:
        this.state.status_search === "active"
          ? true
          : this.state.status_search === ""
          ? null
          : this.state.status_search === "inactive" && false,
    };
    AdminApiRequest(requestData, "/admin/product_category/GetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            allData: res.data.data[0],
            data: res.data.data[0],
            subCat1: res.data.data[1],
            currentPage: 1,
          });
        } else {
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
                        <i className="material-icons">category</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="manage_up_add_btn">
                        <h4 className="card-title"> Category </h4>

                        <button
                          className="btn btn-primary m-r-5 float-right  feel-btn"
                          onClick={this.openModal}
                        >
                          <i className="fa fa-plus"></i> Add Category
                        </button>
                      </div>
                      <div className="searching-every searching-3-col popup-arrow-select span select">
                        <span>
                          <input
                            type="text"
                            name="category_name_search"
                            value={this.state.category_name_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.searchHandler}
                            placeholder="Category Name"
                          ></input>
                        </span>
                        <span>
                          <select
                            name="status_search"
                            value={this.state.status_search}
                            className="form-control"
                            onChange={this.searchHandler}
                          >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">InActive</option>
                          </select>
                        </span>

                        <span className="search-btn-every three-filed-button">
                          <button
                            type="submit"
                            onClick={() => this.getcustomerfilter()}
                            className="btn btn-primary m-r-5"
                          >
                            Search
                          </button>
                          <button
                            className="btn btn-primary m-r-5"
                            onClick={() => {
                              this.allproductCategory();
                              this.setState({
                                category_name_search: "",
                                status_search: "",
                                skip: 0,
                                limit: 20,
                                currentPage: 1,
                              });
                            }}
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
                              <th scope="col">Category Name</th>
                              <th scope="col">Priority</th>
                              <th scope="col">Parent</th>
                              <th scope="col">Icon</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.allData !== undefined &&
                            this.state.allData.length !== 0 ? (
                              this.state.allData.map((data, Index) => (
                                <tr key={Index}>
                                  {" "}
                                  <td
                                    style={{
                                      textTransform: "capitalize",
                                      width: "25%",
                                    }}
                                  >
                                    {data.category_name}
                                  </td>
                                  <td
                                    style={{
                                      textTransform: "capitalize",
                                      width: "10%",
                                    }}
                                  >
                                    {data.priority}
                                  </td>
                                  <td
                                    style={{
                                      textTransform: "capitalize",
                                      width: "20%",
                                    }}
                                  >
                                    {/* for level one and two */}
                                    {data.ancestors[0]
                                      ? data.ancestors[0].category_name
                                      : "None"}
                                  </td>
                                  {data.icon ? (
                                    <td
                                      style={{
                                        textTransform: "capitalize",
                                        width: "15%",
                                      }}
                                    >
                                      <a
                                        href={
                                          data.icon && data.icon[0]
                                            ? imageUrl + data.icon
                                            : imageUrl + noImage
                                        }
                                        target="_blank"
                                      >
                                        <img
                                          style={{ height: 70, width: 100 }}
                                          alt="img"
                                          src={
                                            data.icon && data.icon[0]
                                              ? imageUrl + data.icon
                                              : imageUrl + noImage
                                          }
                                        />
                                      </a>
                                    </td>
                                  ) : (
                                    <td
                                      style={{
                                        textTransform: "capitalize",
                                        width: "15%",
                                      }}
                                    >
                                      No Image
                                    </td>
                                  )}
                                  <td
                                    style={{
                                      textTransform: "capitalize",
                                      width: "15%",
                                    }}
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
                                  <td
                                    style={{
                                      textTransform: "capitalize",
                                      width: "25%",
                                    }}
                                  >
                                    <i
                                      className="fa fa-eye hover-with-cursor m-r-5"
                                      onClick={this.viewopenModal.bind(
                                        this,
                                        data
                                      )}
                                    ></i>
                                    <i
                                      className="fa fa-edit hover-with-cursor m-r-5 "
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
                                    <Switch
                                      onChange={() =>
                                        this._handleStatus(data, !data.status)
                                      }
                                      checked={data.status}
                                      height={13}
                                      width={25}
                                      id="normal-switch"
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6">
                                  <ReactLoading
                                    type={"cylon"}
                                    color={"#febc15"}
                                    height={"60px"}
                                    width={"60px"}
                                    className="m-auto"
                                  />
                                </td>
                              </tr>
                            )}
                            {this.state.allData !== undefined &&
                            this.state.allData.length !== 0
                              ? this.state.allData.map((data, Index) => (
                                  <tr key={Index} style={{ display: "none" }}>
                                    {" "}
                                    <td>{data.category_name}</td>
                                    <td>
                                      {/* for level one and two */}
                                      {data.level === "1"
                                        ? data.category_name
                                        : data.level === "2"
                                        ? data.parent
                                        : null}
                                      {/* Level one two __ end */}
                                      {/* level three start */}
                                      <h5 style={{ color: "#1B6DF1" }}>
                                        {data.level === "2"
                                          ? "— " + data.category_name
                                          : null}
                                      </h5>
                                      {data.level === "3"
                                        ? this.state.allData
                                            .map((j) =>
                                              j._id === data.parentCat_id
                                                ? j.parent
                                                : null
                                            )
                                            .join("")
                                        : null}
                                      <br />
                                      {data.level === "3"
                                        ? "— " + data.parent
                                        : null}
                                      <h5 style={{ color: "#1B6DF1" }}>
                                        {data.level === "3"
                                          ? "—— " + data.category_name
                                          : null}
                                      </h5>
                                      {/* level three end */}
                                    </td>
                                    {data.icon ? (
                                      <td>
                                        <a
                                          href={
                                            data.icon && data.icon[0]
                                              ? imageUrl + data.icon
                                              : imageUrl + noImage
                                          }
                                          target="_blank"
                                        >
                                          <img
                                            style={{ height: 70, width: 100 }}
                                            alt="img"
                                            src={
                                              data.icon && data.icon[0]
                                                ? imageUrl + data.icon
                                                : imageUrl + noImage
                                            }
                                          />
                                        </a>
                                      </td>
                                    ) : (
                                      <td>No Image</td>
                                    )}
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
                                    {/* <td>{data.description2}</td> 
                                                                    <td>{data.description3}</td> */}
                                    <td>
                                      <i
                                        className="fa fa-eye hover-with-cursor m-r-5"
                                        onClick={this.viewopenModal.bind(
                                          this,
                                          data
                                        )}
                                      ></i>
                                      <i
                                        className="fa fa-edit hover-with-cursor m-r-5 "
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
                                      <Switch
                                        onChange={() =>
                                          this._handleStatus(data, !data.status)
                                        }
                                        checked={data.status}
                                        height={13}
                                        width={25}
                                        id="normal-switch"
                                      />
                                    </td>
                                  </tr>
                                ))
                              : ""}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* add category model */}
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    ariaHideApp={false}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <div role="dialog">
                      <div className="modal-dialog add-loyality-block-pop">
                        <div className="modal-content default_form_design">
                          <button
                            type="button"
                            className="close"
                            onClick={this.closeModal}
                          >
                            &times;
                          </button>
                          <h4 className="modal-title">Add Category</h4>
                          <div className="modal-form-bx">
                            <form>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    {" "}
                                    Category Name{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    name="category_name"
                                    className="form-control"
                                    placeholder="Enter Category Name"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_category_name"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Parent Category
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <select
                                    className="form-control"
                                    name="parentCat"
                                    onChange={(val) =>
                                      this.formHandler1(val, "parent")
                                    }
                                  >
                                    <option selected disabled>
                                      Select Category
                                    </option>
                                    <option> None</option>
                                    {this.state.data && this.state.data[0]
                                      ? this.state.data.map((item, Index) => {
                                          return (
                                            <>
                                              {item.level === 0 ? (
                                                <option
                                                  key={Index}
                                                  value={
                                                    item.category_name +
                                                    "," +
                                                    item.level +
                                                    "," +
                                                    item._id
                                                  }
                                                >
                                                  {item.category_name}
                                                </option>
                                              ) : (
                                                ""
                                              )}
                                            </>
                                          );
                                        })
                                      : ""}
                                  </select>{" "}
                                  <span className="err err_parent_cat"></span>
                                </div>
                              </div>

                              {this.state.parentStatus ? (
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Sub Category
                                      {/* <span className="asterisk">*</span> */}
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <select
                                      className="form-control"
                                      name="subCat"
                                      onChange={(val) =>
                                        this.formHandler1(val, "subCat")
                                      }
                                    >
                                      <option selected disabled>
                                        Select Sub Category
                                      </option>
                                      <option> None</option>
                                      {this.state.subCat1Data &&
                                      this.state.subCat1Data[0]
                                        ? this.state.subCat1Data.map(
                                            (item, Index) => {
                                              return (
                                                <option
                                                  key={Index}
                                                  value={
                                                    item.category_name +
                                                    "," +
                                                    item.level +
                                                    "," +
                                                    item._id
                                                  }
                                                >
                                                  {item.category_name}
                                                </option>
                                              );
                                            }
                                          )
                                        : ""}
                                    </select>{" "}
                                    <span className="err err_category_name"></span>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label> Priority</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    name="priority"
                                    className="form-control"
                                    placeholder="Enter Priority"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_priority"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Icon - (50px * 50px)</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input type="file" name="icon" className="" />
                                  <span className="err err_image"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Banner - (1920px * 400px)</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="file"
                                    name="banner"
                                    className=""
                                  />
                                  <span className="err err_banner"></span>
                                </div>
                              </div>

                              {/* <div className="form-group">
                                    <div className="modal-left-bx"><label>Category Code</label></div>
                                    <div className="modal-right-bx"><input type="text" name="category_code" className="form-control" placeholder="Enter Category Code" onChange={this.formHandler} />
                                        <span className="err err_category_code"></span>
                                    </div>
                                </div> */}

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

                              {/* <h4>Meta Data</h4> */}
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Meta Keywords</label>
                                </div>
                                <MultipleValueTextInput
                                  onItemAdded={(item, allItems) =>
                                    this._handleMetaKeywords(allItems)
                                  }
                                  onItemDeleted={(item, allItems) =>
                                    this._handleMetaKeywords(allItems)
                                  }
                                  // label="Keywords"
                                  name="meta_keyword"
                                  placeholder="Enter Meta Keyword"
                                />
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Meta Title</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="meta_title"
                                    className="form-control"
                                    placeholder="Enter Meta Title"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_meta_title"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Meta Description</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="meta_desc"
                                    className="form-control"
                                    placeholder="Enter Meta Description"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_meta_desc"></span>
                                </div>
                              </div>

                              <div className="modal-bottom">
                                {/* <button className="btn btn-primary feel-btn" onClick={this.closeModal}>Cancel</button> */}
                                <button
                                  type="button"
                                  className="btn btn-primary feel-btn"
                                  onClick={() => this._handleAdd()}
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
                    ariaHideApp={false}
                    style={customStyles}
                  >
                    <div role="dialog">
                      <div className="modal-dialog add-loyality-block-pop">
                        <div className="modal-content default_form_design">
                          <button
                            type="button"
                            className="close"
                            onClick={this.editcloseModal}
                          >
                            &times;
                          </button>
                          <h4 className="modal-title">Edit Category</h4>
                          <div className="modal-form-bx">
                            <form>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Category Name{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    value={this.state.category_name}
                                    name="category_name"
                                    className="form-control"
                                    placeholder="Enter Name"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_edit__category_name"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Parent Category</label>
                                </div>
                                <div className="modal-right-bx">
                                  <select
                                    className="form-control"
                                    name="editParentCategory"
                                    value={this.state.editParentCategory}
                                    onChange={(val) => {
                                      this.setState({
                                        editParentCategory: val.target.value,
                                      });
                                    }}
                                  >
                                    <option selected disabled>
                                      Select Category
                                    </option>
                                    <option> None</option>
                                    {this.state.data && this.state.data[0]
                                      ? this.state.data.map((item, Index) => {
                                          return (
                                            <>
                                              {item.level === 0
                                                ? item._id !==
                                                    this.state.id && (
                                                    <option
                                                      key={Index}
                                                      value={item._id}
                                                    >
                                                      {item.category_name}
                                                    </option>
                                                  )
                                                : ""}
                                            </>
                                          );
                                        })
                                      : ""}
                                  </select>
                                </div>
                              </div>

                              {this.state.subCatName ? (
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Sub Category
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <p>{this.state.subCatName}</p>
                                    {/* <select className="form-control" name='subCat' onChange={(val) => this.formHandler1(val, 'subCat')}>
                                                                            <option selected disabled>Select Sub Category</option>
                                                                            <option> None</option>
                                                                            {this.state.subCat1 && this.state.subCat1[0] ?
                                                                                this.state.subCat1.map((item, Index) => {
                                                                                    return (
                                                                                        <option value={item.category_name + ',' + item.level + "," + item._id}>
                                                                                            {item.category_name}</option>
                                                                                    )
                                                                                }
                                                                                ) : ''
                                                                            }
                                                                        </select> <span className="err err_category_name"></span> */}
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label> Priority</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    value={this.state.edit_priority}
                                    name="edit_priority"
                                    className="form-control"
                                    placeholder="Enter Priority"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_priority"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    <span className="iocn-row-wp">Icon</span>
                                    <br />
                                    {this.state.icon && this.state.icon[0] ? (
                                      <a
                                        href={
                                          this.state.icon && this.state.icon[0]
                                            ? imageUrl + this.state.icon
                                            : ""
                                        }
                                        target="_blank"
                                      >
                                        <img
                                          style={{ height: 70, width: 100 }}
                                          alt=""
                                          src={
                                            this.state.icon &&
                                            this.state.icon[0]
                                              ? imageUrl + this.state.icon
                                              : ""
                                          }
                                        />
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input type="file" name="icon" className="" />
                                  <span className="err err_icon"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Banner
                                    {this.state.banner &&
                                    this.state.banner[0] ? (
                                      <a
                                        href={
                                          this.state.banner &&
                                          this.state.banner[0]
                                            ? imageUrl + this.state.banner
                                            : imageUrl + noImage
                                        }
                                        target="_blank"
                                      >
                                        <img
                                          style={{ height: 70, width: 100 }}
                                          alt="img"
                                          src={
                                            this.state.banner &&
                                            this.state.banner[0]
                                              ? imageUrl + this.state.banner
                                              : imageUrl + noImage
                                          }
                                        />
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="file"
                                    name="banner"
                                    className=""
                                  />
                                  <span className="err err_banner"></span>
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
                                    name="status"
                                    id="normal-switch"
                                  />
                                </div>
                              </div>

                              {/* <h4>Meta Data</h4> */}
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Meta Keywords</label>
                                </div>
                                <MultipleValueTextInput
                                  onItemAdded={(item, allItems) =>
                                    this._handleMetaKeywords(allItems)
                                  }
                                  onItemDeleted={(item, allItems) =>
                                    this._handleMetaKeywords(allItems)
                                  }
                                  // label="Keywords"
                                  values={this.state.meta_keyword}
                                  name="meta_keyword"
                                  placeholder="Enter Meta Keyword"
                                />
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Meta Title</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="meta_title"
                                    value={this.state.meta_title}
                                    className="form-control"
                                    placeholder="Enter Meta Title"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_meta_title"></span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Meta Description</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="meta_desc"
                                    value={this.state.meta_desc}
                                    className="form-control"
                                    placeholder="Enter Meta Description"
                                    onChange={this.formHandler}
                                  />
                                  <span className="err err_meta_desc"></span>
                                </div>
                              </div>

                              <div className="modal-bottom">
                                {/* <button className="btn btn-primary feel-btn" onClick={this.editcloseModal}>Cancel</button> */}
                                <button
                                  type="button"
                                  className="btn btn-primary feel-btn"
                                  onClick={() => this._handleEdit()}
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
                    // style={{display: this.state.show ? 'block' : 'none'}}
                  >
                    <button
                      type="button"
                      className="close"
                      onClick={this.viewcloseModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">View Details : </h4>
                    <div className="view-box">
                      <ul>
                        <li>
                          <span className="view-title"> Category Name</span>
                          <span className="view-status">
                            {this.state.category_name}
                          </span>
                        </li>
                        <li>
                          <span className="view-title"> Priority</span>
                          <span className="view-status">
                            {this.state.priority}
                          </span>
                        </li>

                        {/* <li>
                                                    <span className="view-title">Category Code</span>
                                                    <span className="view-status">{this.state.category_code}</span>
                                                </li> */}
                        {this.state.parent ? (
                          <li>
                            <span className="view-title">Parent</span>
                            <span className="view-status">
                              {this.state.parent ? this.state.parent : "None"}
                            </span>
                          </li>
                        ) : (
                          ""
                        )}
                        <li>
                          <span className="view-title">Status</span>
                          <span
                            className={
                              this.state.status === true
                                ? "view-status processed"
                                : "view-status inprocessed"
                            }
                          >
                            {/* {this.state.status === true || this.state.status === 'true' ? 'Active' : 'Inactive'} */}
                            <Switch
                              checked={this.state.status}
                              disabled={true}
                              height={20}
                              width={40}
                              id="normal-switch"
                            />
                          </span>
                        </li>

                        <li>
                          <span className="view-title">Icon</span>
                          {this.state.icon == "" ? (
                            "No Image"
                          ) : (
                            <span className="">
                              <a
                                href={
                                  this.state.icon && this.state.icon[0]
                                    ? imageUrl + this.state.icon
                                    : imageUrl + noImage
                                }
                                target="_blank"
                              >
                                <img
                                  style={{ height: 70, width: 100 }}
                                  alt="img"
                                  src={
                                    this.state.icon && this.state.icon[0]
                                      ? imageUrl + this.state.icon
                                      : imageUrl + noImage
                                  }
                                />
                              </a>
                            </span>
                          )}
                        </li>

                        <li>
                          <span className="view-title">Banner</span>
                          {this.state.banner == "" ? (
                            "No Image"
                          ) : (
                            <span className="">
                              <a
                                href={
                                  this.state.banner
                                    ? imageUrl + this.state.banner
                                    : noImage
                                }
                                target="_blank"
                              >
                                <img
                                  style={{ height: 70, width: 100 }}
                                  alt="img"
                                  src={
                                    this.state.banner
                                      ? imageUrl + this.state.banner
                                      : noImage
                                  }
                                />
                              </a>
                            </span>
                          )}
                        </li>

                        <h5>Meta Data</h5>
                        <li>
                          <span className="view-title">Title</span>
                          <span className="view-status">
                            {this.state.meta_title}
                          </span>
                        </li>
                        <li>
                          <span className="view-title">Keyword</span>
                          <span className="view-status">
                            {this.state.meta_keyword}
                          </span>
                        </li>
                        <li>
                          <span className="view-title">Description</span>
                          <span className="view-status">
                            {this.state.meta_desc}
                          </span>
                        </li>
                        <li>
                          <span className="view-title">Parent Categories</span>
                          <span className="view-status">
                            {this.state.viewModalData.ancestors
                              ? this.state.viewModalData.ancestors.map(
                                  (data, ix) => {
                                    return ix !== 0
                                      ? " ," + data.category_name
                                      : data.category_name;
                                  }
                                )
                              : ""}
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
