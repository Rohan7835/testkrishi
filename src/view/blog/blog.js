import CKEditor from "ckeditor4-react";
import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Moment from "react-moment";
import Select from "react-select";
import SelectSearch from "react-select-search";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { imageUrl } from "../../imageUrl";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";
const noImage = require("../../images/noImage.png");

var addarraymultiple = [{ image: "" }];
var multipleimages = [];
var newmultipleimages = [];
var activeproduct = [{ label: "", value: "" }];

export default class blogmaster extends Component {
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
      status: true,
      id: "",
      image: "",
      banner_image: "",
      related_product: [],
      title: "",
      description1: "",
      description2: "",
      description3: "",
      addstatus: false,
      noOfServe: "",
      prepTime: "",
      chefName: "",
      recipeIcon: "",
      count: "",
      skip: 0,
      limit: 20,
      currentPage: 1,
      editstatus: false,
      edit_description1: "",
      edit_image: "",
      edit_banner: "",
      edit_title: "",
      edit_parentCat_id: "",
      edit_id: "",
      select_category: "",
      mediaLink: "",
      mediaDate: "",
      edit_mediaLink: "",
      edit_mediaDate: "",
      blog_title_search: "",
      blog_cat_search: "",
      options: [],
      options_outside: [],
      editBlogLoading: false,
      edit_related_product: [],
      selectednewproducts: [],
      allSelectedCategories: [],
      allSelectedCategoriesEdit: [],
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editopenModal = this.editopenModal.bind(this);
    this.editcloseModal = this.editcloseModal.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.add = this.add.bind(this);
    this.back = this.back.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.onEditorChange2 = this.onEditorChange2.bind(this);
    this.onEditorChange3 = this.onEditorChange3.bind(this);
    this.onEditorChange4 = this.onEditorChange4.bind(this);
    this.edit_onEditorChange = this.edit_onEditorChange.bind(this);
    this.edit_onEditorChange2 = this.edit_onEditorChange2.bind(this);
    this.edit_onEditorChange3 = this.edit_onEditorChange3.bind(this);
    this.edit_onEditorChange4 = this.edit_onEditorChange4.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.backtohome = this.backtohome.bind(this);
    this.update = this.update.bind(this);
    this.onchangingdata = this.onchangingdata.bind(this);
    this.oncategoryChange = this.oncategoryChange.bind(this);
    this.onEditCategoryChange = this.onEditCategoryChange.bind(this);
    this.onEditRegionChange = this.onEditRegionChange.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }
  onChange2(valu) {
    this.setState({ related_products: valu.value });
  }

  onChange6(valu) {
    this.setState({ parentCat_id: valu.value });
  }

  formHandler(ev) {
    console.log(ev.target.name);
    console.log(ev.target.value);
    this.setState({ [ev.target.name]: ev.target.value });
  }

  back() {
    this.setState({
      addstatus: false,
      parentCat_id: "",
      description1: "",
      description2: "",
      description3: "",
      description4: "",
    });
  }

  handleChangeStatus(checked) {
    console.log("checked:- ", checked, "status:- ", this.state.status);
    if (checked) {
      this.setState({ status: true });
    } else {
      this.setState({ status: false });
    }
  }
  onEditRegionChange(ev) {
    console.log(ev);
    let arraa = [];
    ev.map((item, index) => {
      arraa.push({ value: item.value, label: item.label });
    });
    this.setState({
      selectednewproducts: arraa,
    });
  }
  onEditorChange(evt) {
    console.log(evt.editor.getData());
    this.setState({
      description1: evt.editor.getData(),
    });
  }

  onEditorChange2(evt) {
    console.log(evt.editor.getData());
    this.setState({
      description2: evt.editor.getData(),
    });
  }

  onEditorChange3(evt) {
    console.log(evt.editor.getData());
    this.setState({
      description3: evt.editor.getData(),
    });
  }

  onEditorChange4(evt) {
    console.log(evt.editor.getData());
    this.setState({
      description4: evt.editor.getData(),
    });
  }

  edit_onEditorChange(evt) {
    console.log(evt.editor.getData());
    this.setState({
      edit_description1: evt.editor.getData(),
    });
  }

  edit_onEditorChange2(evt) {
    console.log(evt.editor.getData());
    this.setState({
      edit_description2: evt.editor.getData(),
    });
  }

  edit_onEditorChange3(evt) {
    console.log(evt.editor.getData());
    this.setState({
      edit_description3: evt.editor.getData(),
    });
  }

  edit_onEditorChange4(evt) {
    console.log(evt.editor.getData());
    this.setState({
      edit_description4: evt.editor.getData(),
    });
  }

  handleChange(changeEvent) {
    this.setState({
      description1: changeEvent.target.value,
    });
  }

  onchangingdata(ev) {
    var arra = [];
    ev.map((item, index) => {
      arra.push({ product_id: item.value });
    });
    this.setState({
      selectednewproducts: arra,
    });
  }
  oncategoryChange(ev) {
    var arra = [];
    ev.map((item, index) => {
      arra.push(item.value);
    });
    this.setState({
      allSelectedCategories: arra,
    });
  }
  onEditCategoryChange(ev) {
    var arra = [];
    ev.map((item, index) => {
      arra.push({ value: item.value, label: item.label });
    });
    this.setState({
      allSelectedCategoriesEdit: arra,
    });
  }

  add() {
    this.setState({ editBlogLoading: true });
    var data = new FormData();
    // var image = document.querySelector('input[name="image"]').files[0];
    var banner_image = document.querySelector('input[name="banner_image"]')
      .files[0];
    var attachment = document.querySelector('input[name="attachment"]')
      .files[0];
    var recipeIcon = document.querySelector('input[name="recipeIcon"]')
      .files[0];
    // var parentCat_id = this.state.parentCat_id ? this.state.parentCat_id : "";
    var parentCat_id = this.state.allSelectedCategories
      ? JSON.stringify(this.state.allSelectedCategories)
      : "";
    var title = this.state.title ? this.state.title : "";
    var date = this.state.mediaDate ? this.state.mediaDate : "";
    var mediaLink = this.state.mediaLink ? this.state.mediaLink : "";
    var videoUrl = this.state.videoUrl ? this.state.videoUrl : "";
    var description1 = this.state.description1 ? this.state.description1 : "";
    var noOfServe = this.state.noOfServe ? this.state.noOfServe : "";
    var prepTime = this.state.prepTime ? this.state.prepTime : "";
    var chefName = this.state.chefName ? this.state.chefName : "";
    var description2 = this.state.description2 ? this.state.description2 : "";
    var description3 = this.state.description3 ? this.state.description3 : "";
    var description4 = this.state.description4 ? this.state.description4 : "";
    var meta_title = this.state.meta_title ? this.state.meta_title : "";
    var meta_keyword = this.state.meta_keyword ? this.state.meta_keyword : "";
    var meta_desc = this.state.meta_desc ? this.state.meta_desc : "";
    var related_products = this.state.selectednewproducts
      ? this.state.selectednewproducts
      : "";
    console.log(
      "related_productsrelated_productsrelated_products",
      related_products
    );
    // data.append("image", image ? image : null);
    data.append("attachment", attachment ? attachment : "");
    data.append("parentCat_id", parentCat_id);
    data.append("date", date);
    data.append("mediaLink", mediaLink);
    data.append("videoUrl", videoUrl ? videoUrl : "");
    data.append("meta_title", meta_title ? meta_title : "");
    data.append("meta_keyword", meta_keyword ? meta_keyword : "");
    data.append("meta_desc", meta_desc ? meta_desc : "");
    data.append("noOfServe", noOfServe ? noOfServe : "");
    data.append("prepTime", prepTime ? prepTime : "");
    data.append("chefName", chefName ? chefName : "");
    data.append("recipeIcon", recipeIcon ? recipeIcon : "");
    data.append("title", title);
    data.append("banner", banner_image ? banner_image : "");
    data.append("description1", description1);
    data.append("description2", description2 ? description2 : "");
    data.append("description3", description3 ? description3 : "");
    data.append("description4", description4 ? description4 : "");
    data.append(
      "relatedProduct",
      related_products ? JSON.stringify(related_products) : ""
    );
    addarraymultiple.map((it, ind) => {
      var images = [];
      if (document.querySelector('input[name="image' + ind + '"]')) {
        images = document.querySelector('input[name="image' + ind + '"]')
          .files[0];
        data.append("image", images);
      }
    });
    addarraymultiple.map((item, index) => {
      if (!item.image) {
        valueErr = document.getElementsByClassName("err_multi_img" + index);
        valueErr[0].innerText = "Image Required";
      }
    });

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!JSON.parse(parentCat_id) || JSON.parse(parentCat_id).length === 0) {
      valueErr = document.getElementsByClassName("err_parentCat_id");
      valueErr[0].innerText = "This Field is Required";
      this.setState({ editBlogLoading: false });
    }
    if (!title) {
      valueErr = document.getElementsByClassName("err_title");
      valueErr[0].innerText = "This Field is Required";
      this.setState({ editBlogLoading: false });
    }
    if (!description1) {
      valueErr = document.getElementsByClassName("err_description1");
      valueErr[0].innerText = "This Field is Required";
      this.setState({ editBlogLoading: false });
    }
    if (!banner_image) {
      valueErr = document.getElementsByClassName("err_banner");
      valueErr[0].innerText = "This Field is Required";
      this.setState({ editBlogLoading: false });
    }

    if (parentCat_id && title && description1 && banner_image) {
      AdminApiRequest(data, "/admin/addBlog", "POST", "apiWithImage")
        .then((res) => {
          console.log(res.data);
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Record Added Successfully !",
              icon: "success",
              successMode: true,
            });
            // .then(willDelete => {
            // window.location.reload()
            // });
            this.setState({
              modalIsOpen: false,
              editstatus: false,
              addstatus: false,
              date: "",
              mediaLink: "",
            });
            this.getAllBanner();
          }
        })
        .then(() => this.setState({ editBlogLoading: false }))
        .catch((error) => {
          alert(error);
        });
    }
    this.setState({ editBlogLoading: false });
  }
  update() {
    this.setState({ editBlogLoading: true });
    var relatedProductDataToBeSent = [];
    this.state.selectednewproducts.map((prd) => {
      relatedProductDataToBeSent.push({ product_id: prd.value });
    });
    var selectedCatToBeSent = [];
    this.state.allSelectedCategoriesEdit.forEach((cat) => {
      selectedCatToBeSent.push(cat.value);
    });
    // console.log("vthis.state.parentCat_id._id", this.state.parentCat_id._id);
    var data = new FormData();
    // var image = document.querySelector('input[name="edit_image"]').files[0];
    var attachment = document.querySelector('input[name="edit_attachment"]')
      .files[0];
    var banner_image = document.querySelector('input[name="edit_banner"]')
      .files[0];
    var rcicon = document.querySelector('input[name="edit_recipeIcon"]')
      .files[0];
    var edit_recipeIcon = rcicon ? rcicon : this.state.edit_recipeIcon;
    var parentCat_id = selectedCatToBeSent
      ? JSON.stringify(selectedCatToBeSent)
      : null;
    var title = this.state.edit_title ? this.state.edit_title : "";
    var videoUrl = this.state.edit_videoUrl ? this.state.edit_videoUrl : "";
    var date = this.state.edit_mediaDate ? this.state.edit_mediaDate : "";

    var mediaLink = this.state.edit_mediaLink ? this.state.edit_mediaLink : "";
    var noOfServe = this.state.edit_noOfServe ? this.state.edit_noOfServe : "";
    var prepTime = this.state.edit_prepTime ? this.state.edit_prepTime : "";
    var chefName = this.state.edit_chefName ? this.state.edit_chefName : "";
    var description1 = this.state.edit_description1
      ? this.state.edit_description1
      : "";
    var description2 = this.state.edit_description2
      ? this.state.edit_description2
      : "";
    var description3 = this.state.edit_description3
      ? this.state.edit_description3
      : "";
    var description4 = this.state.edit_description4
      ? this.state.edit_description4
      : "";
    var meta_title = this.state.edit_meta_title
      ? this.state.edit_meta_title
      : "";
    var meta_keyword = this.state.edit_meta_keyword
      ? this.state.edit_meta_keyword
      : "";
    var meta_desc = this.state.edit_meta_desc ? this.state.edit_meta_desc : "";
    data.append("_id", this.state.edit_id);
    data.append("parentCat_id", parentCat_id);
    newmultipleimages.map((it, ind) => {
      var images = [];
      if (document.querySelector('input[name="image' + ind + '"]')) {
        images = document.querySelector('input[name="image' + ind + '"]')
          .files[0];
        data.append("image", images);
      }
    });
    var prevImages = [];
    multipleimages.map((i) => {
      prevImages.push(i.image);
    });
    data.append("images", JSON.stringify(prevImages));
    // data.append("image", image);
    data.append("attachment", attachment ? attachment : "");
    data.append("videoUrl", videoUrl ? videoUrl : "");
    data.append("meta_title", meta_title ? meta_title : "");
    data.append("meta_keyword", meta_keyword ? meta_keyword : "");
    data.append("date", date);
    data.append("mediaLink", mediaLink);
    data.append("meta_desc", meta_desc ? meta_desc : "");
    data.append("title", title ? title : "");
    data.append("banner", banner_image ? banner_image : this.state.edit_banner);
    data.append("noOfServe", noOfServe ? noOfServe : "");
    data.append("prepTime", prepTime ? prepTime : "");
    data.append("chefName", chefName ? chefName : "");
    data.append("recipeIcon", edit_recipeIcon ? edit_recipeIcon : "");
    data.append("description1", description1 ? description1 : "");
    data.append("description2", description2 ? description2 : "");
    data.append("description3", description3 ? description3 : "");
    data.append("description4", description4 ? description4 : "");
    data.append(
      "relatedProduct",
      relatedProductDataToBeSent
        ? JSON.stringify(relatedProductDataToBeSent)
        : ""
    );

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!JSON.parse(parentCat_id) || JSON.parse(parentCat_id).length === 0) {
      valueErr = document.getElementsByClassName("err_parentCat_id");
      valueErr[0].innerText = "This Field is Required";
      this.setState({ editBlogLoading: false });
    }
    if (!this.state.edit_title) {
      valueErr = document.getElementsByClassName("err_title");
      valueErr[0].innerText = "This Field is Required";
      this.setState({ editBlogLoading: false });
    }
    if (!this.state.edit_description1) {
      valueErr = document.getElementsByClassName("err_description1");
      valueErr[0].innerText = "This Field is Required";
      this.setState({ editBlogLoading: false });
    }

    if (this.state.edit_title && this.state.edit_description1) {
      AdminApiRequest(data, "/admin/updateBlog", "POST", "apiWithImage")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Record Updated Successfully !",
              icon: "success",
              successMode: true,
            });
            // .then(willDelete => {
            // window.location.reload()
            // });
            multipleimages = [];
            newmultipleimages = [];
            this.setState({
              modalIsOpen: false,
              editstatus: false,
              addstatus: false,
              edit_mediaDate: "",
              edit_mediaLink: "",
            });
            this.getAllBanner();
          }
        })
        .then(() => this.setState({ editBlogLoading: false }))
        .catch((error) => {
          alert(error);
        });
    }
  }
  // edit() {
  //     var name = this.state.name;
  //     var id = this.state.id;
  //     var status = this.state.status;

  //     var valueErr = document.getElementsByClassName("err");
  //     for(var i = 0; i < valueErr.length; i++){
  //         valueErr[i].innerText="";
  //     }
  //     if(!name) {
  //         valueErr = document.getElementsByClassName("name");
  //         valueErr[0].innerText = "This Field is Required";
  //     }
  //     var requestData = {

  //     }
  //     // if (name) {
  //         AdminApiRequest(requestData, '/admin/updateBanner', 'POST','apiWithImage')
  //             .then((res) => {
  //                 console.log('Akash malik', res.data);
  //                 swal({
  //                     title: "Success",
  //                     text: "Record updated Successfully !",
  //                     icon: "success",
  //                     successMode: true,
  //                 })
  //             // .then(willDelete => {
  //             // window.location.reload()
  //             // });
  //            this.setState({modalIsOpen: false});
  //         })
  //         .catch((error) => {
  //            alert(error)
  //         })
  //     //  }
  // }

  openModal() {
    this.setState({ addstatus: true });
  }

  async deleteRecord(_id) {
    await swal({
      title: "Are you sure",
      text: "Delete this record ?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        var requestData = {
          _id: _id,
        };
        AdminApiRequest(requestData, "/admin/deleteBlog", "POST", "")
          .then((res) => {
            if (res.status === 200) {
              // this.setState({
              //     data: res.data.data
              // })
              swal({
                title: "Success",
                text: "Record Deleted Successfully !",
                icon: "success",
                successMode: true,
              });
              this.getAllBanner();
            }
            //    console.log(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  editopenModal(data) {
    console.log("editable data", data);
    data.images.map((ittm) => {
      multipleimages.push({ image: ittm.image });
    });
    var relatedProductData = [];
    data.relatedProduct.map((prd) => {
      relatedProductData.push({
        value: prd.product_id?._id,
        label: prd.product_id?.product_name,
      });
    });
    var allcats = [];
    data.parentCat_id.forEach((prd) => {
      allcats.push({
        value: prd._id,
        label: prd.name,
      });
    });
    this.setState({
      edit_description1: data.description1,
      edit_description2: data.description2,
      edit_description3: data.description3,
      edit_description4: data.description4,
      edit_noOfServe: data.noOfServe,
      edit_prepTime: data.prepTime,
      edit_chefName: data.chefName,
      // edit_image: data.images,
      edit_banner: data.banner ? data.banner : "",
      edit_parentCat_id: {
        name: data.parentCat_id.name,
        value: data.parentCat_id._id,
      },
      allSelectedCategoriesEdit: allcats,
      edit_recipeIcon: data.recipeIcon,
      edit_attachment: data.attachment,
      edit_videoUrl: data.videoUrl,
      edit_mediaDate: data.date,
      edit_mediaLink: data.mediaLink,
      edit_meta_title: data.meta_title,
      edit_meta_keyword: data.meta_keyword,
      edit_meta_desc: data.meta_desc,
      edit_title: data.title,
      edit_id: data._id,
      editstatus: true,
      selectednewproducts: relatedProductData,
    });
    setTimeout(() => {
      this.forceUpdate();
    }, 100);
  }
  backtohome() {
    this.setState({
      edit_description1: "",
      edit_image: "",
      edit_title: "",
      edit_id: "",
      editstatus: false,
      allSelectedCategories: [],
      edit_attachment: "",
      edit_parentCat_id: "",
      addstatus: false,
      parentCat_id: "",
      description1: "",
      description2: "",
      description3: "",
      description4: "",
    });
    multipleimages = [];
    newmultipleimages = [];
  }
  formHandlerNewMultiple(e, index, type) {
    if (type === "image") {
      newmultipleimages[index].image = e.target.value;
    }
  }
  formHandler1(e, index, type) {
    if (type === "image") {
      addarraymultiple[index].image = e.target.value;
    }
  }

  //add new blog images managed
  addmoremultipleimage() {
    this.setState({ loading: true });
    addarraymultiple.push({ image: "" });
    this.setState({ loading: false });
  }
  removeimagemultiple(type = "remove", index) {
    this.setState({
      loading: true,
    });
    addarraymultiple.splice(index, 1);
    this.setState({
      loading: false,
    });
  }
  //

  //edit blog multiple images managed
  newaddmoremultipleimage() {
    this.setState({ loading: true });
    newmultipleimages.push({ image: "" });
    this.setState({ loading: false });
  }
  newremoveimagemultiple(type = "remove", index) {
    this.setState({
      loading: true,
    });
    newmultipleimages.splice(index, 1);
    this.setState({
      loading: false,
    });
    console.log(newmultipleimages);
  }
  removeStoredImages(type = "remove", index) {
    this.setState({
      loading: true,
    });
    multipleimages.splice(index, 1);
    this.setState({
      loading: false,
    });
    console.log(multipleimages);
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
    this.getAllBanner();
    const requestData = {};
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

    AdminApiRequest(
      {
        skip: "0",
        limit: "10",
        status: true,
      },
      "/admin/getBlogCat",
      "POST"
    )
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          console.log("select_category", res.data.data);
          res.data.data.map((item, index) => {
            this.state.options.push({ label: item.name, value: item._id });
            this.state.options_outside.push({
              name: item.name,
              value: item._id,
            });
          });
          console.log("select_category", this.state.options_outside);
          this.setState({ loading: false });
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

  getAllBanner() {
    const requestData = {
      skip: 0,
      limit: this.state.limit,
    };
    AdminApiRequest(requestData, "/admin/getAllBlog", "POST", "")
      .then((res) => {
        this.setState({
          data: res.data.data,
          count: res.data.count,
        });
        //    console.log(res.data);
      })
      .then(() => console.log(this.state.data))
      .catch((error) => {
        console.log(error);
      });
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
    AdminApiRequest(requestData, "/admin/getAllBlog", "POST", "")
      .then((res) => {
        this.setState({
          data: res.data.data,
        });
        //    console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  convertHTML = (e) => {
    var temp = document.createElement("p");
    temp.innerHTML = e;
    return temp.textContent;
  };

  searchHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  getcustomerfilter = () => {
    const requestData = {
      skip: 0,
      limit: this.state.limit,
      title: this.state.blog_title_search,
      parentCat_id: this.state.blog_cat_search.value,
    };
    AdminApiRequest(requestData, "/admin/getAllBlog", "POST")
      .then((res) => {
        console.log(res);
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
            currentPage: 1,
            count: res.data.count,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    console.log(this.state.edit_related_product);
    console.log(this.state.allSelectedCategories);
    return (
      <div className="wrapper ">
        <Adminsiderbar />
        <div className="main-panel">
          <Adminheader />
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                {this.state.editstatus == true ? (
                  <div className="col-md-12 ml-auto mr-auto">
                    <div className="card admin_blog_new">
                      <div
                        className="card-body"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className="manage_up_add_btn"
                          style={{ width: "100%" }}
                        >
                          <h4 className="card-title">Recipes</h4>
                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={() => this.backtohome()}
                          >
                            {" "}
                            {/* <i className="fa fa-plus"></i> */}
                            Back{" "}
                          </button>
                        </div>
                      </div>
                      <div className="modal-form-bx">
                        <form>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Recipes Category
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              {this.state.options.length > 0 ? (
                                <Select
                                  defaultValue={[]}
                                  isMulti
                                  name="editparentCat_id"
                                  onChange={this.onEditCategoryChange}
                                  options={this.state.options}
                                  value={this.state.allSelectedCategoriesEdit}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                />
                              ) : (
                                <p>No Categories available to select</p>
                              )}
                              <span className="err err_parentCat_id"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Title<span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="edit_title"
                                className="form-control"
                                value={this.state.edit_title}
                                placeholder="Enter Title"
                                onChange={this.formHandler}
                              />
                              <span className="err err_title"></span>
                            </div>
                          </div>

                          {multipleimages.map((item1, index) => {
                            return (
                              <>
                                <div className="form-group">
                                  <div className="modal-right-bx">
                                    {item1.image ? (
                                      <img
                                        style={{ height: "50px" }}
                                        src={imageUrl + item1.image}
                                        alt="images"
                                      />
                                    ) : (
                                      ""
                                    )}
                                    <span
                                      className={"err err_multi_img" + index}
                                    ></span>
                                    <i
                                      className="fa fa-times"
                                      onClick={() =>
                                        this.removeStoredImages("Remove", index)
                                      }
                                      aria-hidden="true"
                                    ></i>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                          {newmultipleimages.map((ittm, ind) => (
                            <div className="modal-right-bx">
                              <input
                                type="file"
                                name={"image" + ind}
                                className="form-control"
                                onChange={(e) =>
                                  this.formHandlerNewMultiple(e, ind, "image")
                                }
                              />
                              <i
                                className="fa fa-times"
                                onClick={() =>
                                  this.newremoveimagemultiple("Remove", ind)
                                }
                                aria-hidden="true"
                              ></i>
                            </div>
                          ))}

                          <div className="form-group add_multli">
                            <button
                              className="btn btn-primary feel-btnv2"
                              type="button"
                              onClick={() => this.newaddmoremultipleimage()}
                            >
                              Add Multiple Images{"  "}
                            </button>
                            <span className="asterisk">*</span>
                            <span className="err err_mainaddimage"></span>
                          </div>
                          {/* <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Image<span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="file"
                                style={{
                                  zIndex: "1 !important",
                                  opacity: "1 !important",
                                }}
                                name="edit_image"
                                className=""
                                onChange={this.formHandler}
                              />
                              <span>
                                <a
                                  href={
                                    this.state.edit_image
                                      ? imageUrl + this.state.edit_image
                                      : noImage
                                  }
                                  target="_blank"
                                >
                                  <img
                                    style={{ height: 70, width: 100 }}
                                    src={
                                      this.state.edit_image
                                        ? imageUrl + this.state.edit_image
                                        : noImage
                                    }
                                  />
                                </a>
                              </span>
                              <span className="err err_image"></span>
                            </div>
                          </div> */}

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Banner - 1920px * 400px
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="file"
                                style={{
                                  zIndex: "1 !important",
                                  opacity: "1 !important",
                                }}
                                name="edit_banner"
                                className=""
                                onChange={this.formHandler}
                              />
                              <span>
                                {this.state.edit_banner ? (
                                  <a
                                    href={
                                      this.state.edit_banner
                                        ? imageUrl + this.state.edit_banner
                                        : noImage
                                    }
                                    target="_blank"
                                  >
                                    <img
                                      style={{ height: 70, width: 100 }}
                                      src={
                                        this.state.edit_banner
                                          ? imageUrl + this.state.edit_banner
                                          : noImage
                                      }
                                    />
                                  </a>
                                ) : (
                                  ""
                                )}
                              </span>
                              <span className="err err_edit_banner"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Video URL</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="edit_videoUrl"
                                className="form-control"
                                value={this.state.edit_videoUrl}
                                placeholder="Enter Video URL"
                                onChange={this.formHandler}
                              />
                              <span className="err err_title"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Media / Recipes Description</label>
                            </div>
                            <div className="modal-right-bx">
                              <CKEditor
                                config={{
                                  allowedContent: true,
                                }}
                                data={this.state.edit_description1}
                                onChange={this.edit_onEditorChange}
                              />
                              <span className="err err_description1"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Ingredients</label>
                            </div>
                            <div className="modal-right-bx">
                              <CKEditor
                                config={{
                                  allowedContent: true,
                                }}
                                data={this.state.edit_description2}
                                onChange={this.edit_onEditorChange2}
                              />
                              <span className="err err_title"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Directions</label>
                            </div>
                            <div className="modal-right-bx">
                              <CKEditor
                                config={{
                                  allowedContent: true,
                                }}
                                data={this.state.edit_description3}
                                onChange={this.edit_onEditorChange3}
                              />
                              <span className="err err_title"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Description 2</label>
                            </div>
                            <div className="modal-right-bx">
                              <CKEditor
                                config={{
                                  allowedContent: true,
                                }}
                                data={this.state.edit_description4}
                                onChange={this.edit_onEditorChange4}
                              />
                              <span className="err err_title"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Meta Title</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="edit_meta_title"
                                className="form-control"
                                value={this.state.edit_meta_title}
                                placeholder="Enter Meta Title"
                                onChange={this.formHandler}
                              />
                              <span className="err err_edit_meta_title"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Meta Keyword</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="edit_meta_keyword"
                                className="form-control"
                                value={this.state.edit_meta_keyword}
                                placeholder="Enter Meta Keyword"
                                onChange={this.formHandler}
                              />
                              <span className="err err_edit_meta_keyword"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Meta Description</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="edit_meta_desc"
                                className="form-control"
                                value={this.state.edit_meta_desc}
                                placeholder="Enter Meta Description"
                                onChange={this.formHandler}
                              />
                              <span className="err err_edit_meta_desc"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Attachment</label>
                            </div>
                            <div
                              className="modal-right-bx"
                              style={{
                                display: "flex",
                                justifyContent: "start",
                              }}
                            >
                              <input
                                type="file"
                                style={{
                                  zIndex: "1 !important",
                                  opacity: "1 !important",
                                  maxWidth: "300px",
                                }}
                                name="edit_attachment"
                                className=""
                                onChange={this.formHandler}
                              />
                              {this.state.edit_attachment && (
                                <a
                                  href={imageUrl + this.state.edit_attachment}
                                  target="_blank"
                                >
                                  View File
                                </a>
                              )}

                              {/* {
                                <PDFViewer
                                  document={{
                                    url: imageUrl + this.state.edit_attachment,
                                  }}
                                />
                              } */}
                            </div>
                            <span className="err err_edit_meta_desc"></span>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Number Of Serve</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="number"
                                name="edit_noOfServe"
                                value={this.state.edit_noOfServe}
                                className="form-control"
                                placeholder="Enter No. of Serve"
                                onChange={this.formHandler}
                              />
                              <span className="err err_meta_desc"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Preparation Time</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="edit_prepTime"
                                value={this.state.edit_prepTime}
                                className="form-control"
                                placeholder="Enter Preparation Time"
                                onChange={this.formHandler}
                              />
                              <span className="err err_meta_desc"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Chef Name</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="edit_chefName"
                                value={this.state.edit_chefName}
                                className="form-control"
                                placeholder="Enter Chef Name"
                                onChange={this.formHandler}
                              />
                              <span className="err err_meta_desc"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Recipe Icon</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="file"
                                name="edit_recipeIcon"
                                className="form-control"
                                onChange={this.formHandler}
                              />
                              <span>
                                {this.state.edit_recipeIcon ? (
                                  <a
                                    href={
                                      this.state.edit_recipeIcon
                                        ? imageUrl + this.state.edit_recipeIcon
                                        : noImage
                                    }
                                    target="_blank"
                                  >
                                    <img
                                      style={{ height: 70, width: 100 }}
                                      src={
                                        this.state.edit_recipeIcon
                                          ? imageUrl +
                                            this.state.edit_recipeIcon
                                          : noImage
                                      }
                                    />
                                  </a>
                                ) : (
                                  ""
                                )}
                              </span>
                              <span className="err err_meta_desc"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Related Ingredients</label>
                            </div>
                            <div className="modal-right-bx">
                              <Select
                                defaultValue={[]}
                                isMulti
                                value={this.state.selectednewproducts}
                                name="edit_related_product"
                                onChange={this.onEditRegionChange}
                                options={activeproduct}
                                className="basic-multi-select"
                                classNamePrefix="select"
                              />
                              <span className="err err_parentCat_id"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Media Link</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="edit_mediaLink"
                                className="form-control"
                                placeholder="Enter Media Link"
                                onChange={this.formHandler}
                                value={this.state.edit_mediaLink}
                              />
                              <span className="err err_media_link"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Media Date</label>
                              {this.state.edit_mediaDate ? (
                                <p
                                  style={{
                                    display: "inline",
                                    marginLeft: "6px",
                                  }}
                                >
                                  <Moment format="DD/MM/YYYY">
                                    {this.state.edit_mediaDate}
                                  </Moment>
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="date"
                                name="edit_mediaDate"
                                className="form-control"
                                placeholder="Select Date"
                                onChange={this.formHandler}
                                value={this.state.edit_mediaDate}
                              />
                              <span className="err err_media_date"></span>
                            </div>
                          </div>

                          <div className="modal-bottom">
                            <button
                              type="button"
                              className="btn btn-primary m-r-5 float-right"
                              onClick={this.update}
                            >
                              {this.state.editBlogLoading ? (
                                <i
                                  className="fa fa-spinner searchLoading"
                                  aria-hidden="true"
                                  style={{ position: "static" }}
                                ></i>
                              ) : (
                                "Update"
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : this.state.addstatus == true ? (
                  <div className="col-md-12 ml-auto mr-auto">
                    <div className="card admin_blog_new">
                      <div className="card-body">
                        <h4 className="card-title"> Recipes</h4>
                        <button
                          className="btn btn-primary m-r-5 float-right"
                          onClick={() => this.backtohome()}
                        >
                          Back
                        </button>
                      </div>
                      <div className="modal-form-bx">
                        <form>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Recipes Category
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div
                              className="modal-right-bx"
                              style={{ zIndex: "9999" }}
                            >
                              <Select
                                defaultValue={[]}
                                isMulti
                                name="parentCat_id"
                                onChange={this.oncategoryChange}
                                options={this.state.options}
                                className="basic-multi-select"
                                classNamePrefix="select"
                              />
                              <span className="err err_parentCat_id"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Title
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="Enter Title"
                                onChange={this.formHandler}
                              />
                              <span className="err err_title"></span>
                            </div>
                          </div>

                          {addarraymultiple.map((item, index) => {
                            return (
                              <>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Image<span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="file"
                                      name={"image" + index}
                                      className="form-control"
                                      onChange={(e) =>
                                        this.formHandler1(e, index, "image")
                                      }
                                    />
                                    <span
                                      className={"err err_multi_img" + index}
                                    ></span>
                                    <i
                                      className="fa fa-trash"
                                      onClick={() =>
                                        this.removeimagemultiple(
                                          "Remove",
                                          index
                                        )
                                      }
                                      aria-hidden="true"
                                    ></i>
                                  </div>
                                </div>
                              </>
                            );
                          })}

                          <div className="form-group add_multli">
                            <button
                              className="btn btn-primary feel-btnv2"
                              type="button"
                              onClick={() => this.addmoremultipleimage()}
                            >
                              Add Multiple Images{"  "}
                            </button>
                            <span className="asterisk">*</span>
                            <span className="err err_mainaddimage"></span>
                          </div>

                          {/* <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Image<span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="file"
                                style={{
                                  zIndex: "1 !important",
                                  opacity: "1 important",
                                }}
                                name="image"
                                className=""
                                onChange={this.formHandler}
                              />
                              <span className="err err_image"></span>
                            </div>
                          </div> */}

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Banner - 1920px * 400px
                                <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="file"
                                style={{
                                  zIndex: "1 !important",
                                  opacity: "1 important",
                                }}
                                name="banner_image"
                                className=""
                                onChange={this.formHandler}
                              />
                              <span className="err err_banner"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Video URL</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="videoUrl"
                                className="form-control"
                                placeholder="Enter Video URL"
                                onChange={this.formHandler}
                              />
                              <span className="err err_video_url"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Media / Recipes Description</label>
                            </div>
                            <div className="modal-right-bx">
                              <CKEditor
                                config={{
                                  allowedContent: true,
                                }}
                                data={this.state.description1}
                                onChange={this.onEditorChange}
                              />
                              <span className="err err_description1"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Ingredients</label>
                            </div>
                            <div className="modal-right-bx">
                              <CKEditor
                                config={{
                                  allowedContent: true,
                                }}
                                data={this.state.description2}
                                onChange={this.onEditorChange2}
                              />
                              <span className="err err_description2"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Directions</label>
                            </div>
                            <div className="modal-right-bx">
                              <CKEditor
                                config={{
                                  allowedContent: true,
                                }}
                                data={this.state.description3}
                                onChange={this.onEditorChange3}
                              />
                              <span className="err err_description3"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Description 2</label>
                            </div>
                            <div className="modal-right-bx">
                              <CKEditor
                                config={{
                                  allowedContent: true,
                                }}
                                data={this.state.description4}
                                onChange={this.onEditorChange4}
                              />
                              <span className="err err_description4"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Add Attachnment</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="file"
                                style={{
                                  zIndex: "1 !important",
                                  opacity: "1 important",
                                }}
                                name="attachment"
                                className=""
                                onChange={this.formHandler}
                              />
                              <span className="err err_attachment"></span>
                            </div>
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

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Meta Keyword</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="meta_keyword"
                                className="form-control"
                                placeholder="Enter Meta Keyword"
                                onChange={this.formHandler}
                              />
                              <span className="err err_meta_keyword"></span>
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

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Number Of Serve</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="number"
                                name="noOfServe"
                                className="form-control"
                                placeholder="Enter No. of Serve"
                                onChange={this.formHandler}
                              />
                              <span className="err err_meta_desc"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Preparation Time</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="prepTime"
                                className="form-control"
                                placeholder="Enter Preparation Time"
                                onChange={this.formHandler}
                              />
                              <span className="err err_meta_desc"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Chef Name</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="chefName"
                                className="form-control"
                                placeholder="Enter Chef Name"
                                onChange={this.formHandler}
                              />
                              <span className="err err_meta_desc"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Recipe Icon</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="file"
                                name="recipeIcon"
                                className="form-control"
                                onChange={this.formHandler}
                              />
                              <span className="err err_meta_desc"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Related Ingredients</label>
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
                              <span className="err err_parentCat_id"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Media Link</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="mediaLink"
                                className="form-control"
                                placeholder="Enter Media Link"
                                onChange={this.formHandler}
                              />
                              <span className="err err_media_link"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Media Date</label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="date"
                                name="mediaDate"
                                className="form-control"
                                placeholder="Select Date"
                                onChange={this.formHandler}
                              />
                              <span className="err err_media_date"></span>
                            </div>
                          </div>

                          <div className="modal-bottom">
                            <button
                              type="button"
                              className="btn btn-primary m-r-5 float-right"
                              onClick={this.add}
                            >
                              {this.state.editBlogLoading ? (
                                <i
                                  className="fa fa-spinner searchLoading"
                                  aria-hidden="true"
                                  style={{ position: "static" }}
                                ></i>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-md-12 ml-auto mr-auto">
                    <div className="card admin_new_blo">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">design_services</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn">
                          <h4 className="card-title"> Recipes</h4>

                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={this.openModal}
                          >
                            {" "}
                            <i className="fa fa-plus"></i> Add Recipes{" "}
                          </button>
                        </div>
                        <div className="searching-every">
                          <span>
                            <input
                              type="text"
                              name="blog_title_search"
                              value={this.state.blog_title_search}
                              className="form-control"
                              autoComplete="off"
                              onChange={this.searchHandler}
                              placeholder="Title"
                            />
                          </span>
                          <span>
                            <SelectSearch
                              placeholder={
                                this.state.options_outside.length > 0
                                  ? "Category"
                                  : "Loading"
                              }
                              options={this.state.options_outside}
                              onChange={(e) => {
                                this.setState({ blog_cat_search: e });
                              }}
                              value={this.state.blog_cat_search.value}
                              className="select-search"
                              name="blog_cat_search"
                            />
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
                              onClick={() => {
                                this.setState({
                                  blog_title_search: "",
                                  blog_cat_search: "",
                                  currentPage: 1,
                                });
                                this.getAllBanner();
                              }}
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
                                <th scope="col">Banner</th>
                                <th scope="col">Title</th>
                                <th scope="col">Category</th>
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.data && this.state.data[0]
                                ? this.state.data.map((data, Index) => (
                                    <tr>
                                      <td>
                                        {" "}
                                        <a
                                          href={
                                            data.images && data.images[0]
                                              ? imageUrl + data.images[0].image
                                              : noImage
                                          }
                                          target="_blank"
                                        >
                                          <img
                                            style={{ height: 70, width: 100 }}
                                            src={
                                              data.images && data.images[0]
                                                ? imageUrl +
                                                  data.images[0].image
                                                : noImage
                                            }
                                          />
                                        </a>
                                      </td>
                                      <td
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {data.title}
                                      </td>
                                      <td
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {data.parentCat_id &&
                                          data.parentCat_id.map((cat, ix) => {
                                            return (
                                              <span>
                                                {cat.name}
                                                {ix ===
                                                data.parentCat_id.length - 1
                                                  ? "."
                                                  : ", "}
                                              </span>
                                            );
                                          })}
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
                                          className="fa fa-trash hover-with-cursor"
                                          onClick={this.deleteRecord.bind(
                                            this,
                                            data._id
                                          )}
                                        ></i>
                                      </td>
                                    </tr>
                                  ))
                                : "No Data Found"}
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
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
