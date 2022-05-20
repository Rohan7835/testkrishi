import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
// import { validateField, validatePriority } from '../../components/validations';
import Adminfooter from "../../view/admin/elements/admin_footer";
import Adminheader from "../../view/admin/elements/admin_header";
import Adminsiderbar from "../../view/admin/elements/admin_sidebar";
import ViewFAQ from "./viewFAQ";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%,-50%)",
  },
};
export default class FAQmanagement extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      loading: true,
      modalIsOpen: false,
      modalIsOpen2: false,
      show: false,
      priority: "",
      priorityStatus: true,
      image: "",
      FAQId: "",
      question: "",
      answer: "",
      categoryName: "",
      category_id: "",
      FAQcategoryData: [],
      filterCat_name: "",
      filter_id: "",
      activePage: 1,
      skip: 0,
    };
  }
  async handlePageChange(pageNumber) {
    // console.log(`active page is ${pageNumber}`);
    this.setState({
      activePage: await pageNumber,
      skip: (await (pageNumber - 1)) * 20,
    });
    this._getFAQAPI(pageNumber);
  }

  async formHandler(val, type) {
    this.setState({ [val.target.name]: val.target.value });
    this.setState({ filter_id: "", filterCat_name: "" });
    // switch (type) {
    //     case ('faqCategory'):
    //         let FAQCheck = validateField(val.target.value)
    //         this.setState({
    //             faqCategory: val.target.value,
    //             FAQStatus: FAQCheck.status,
    //             FAQErr: FAQCheck.errMsg
    //         })
    //         break
    //     case ('question'):
    //         let questionCheck = validateField(val.target.value)
    //         this.setState({
    //             question: val.target.value,
    //             questionStatus: questionCheck.status,
    //             questionErr: questionCheck.errMsg
    //         })
    //         break
    //     case ('answer'):
    //         let answerCheck = validateField(val.target.value)
    //         this.setState({
    //             answer: val.target.value,
    //             answerStatus: answerCheck.status,
    //             answerErr: answerCheck.errMsg
    //         })
    //         break
    //     case ('priority'):
    //         let priorityCheck = validatePriority(val.target.value)
    //         this.setState({
    //             priority: val.target.value,
    //             priorityStatus: priorityCheck.status,
    //             priorityErr: priorityCheck.errMsg
    //         })
    //         break
    //     case ('filter_id'):
    //         this.setState({
    //             filter_id: await val.target.value.split(',')[0]
    //         })
    //         this._getFAQAPI()
    //         break
    // }
  }
  _handleSubmit() {
    if (this.state.question && this.state.answer) {
      this._createFAQAPI();
      this.setState({ submitErr: "", submitStatus: true });
    } else {
      this.setState({
        submitErr: "* Complete required fields",
        submitStatus: false,
      });
    }
  }

  openModal(openFor, val) {
    // console.log('data clicked --===>>>', val)
    if (openFor === "add") {
      this.setState({
        modalIsOpen: true,
        faqId: "",
        faqCategory: "",
        question: "",
        answer: "",
        priority: "",
      });
      // this._getFAQcategoryAPI();
    } else if (openFor === "delete") {
      this.setState({ modalIsOpen2: true, FAQId: val });
    } else if (openFor === "view") {
      this.setState({
        show: true,
        viewData: val,
      });
    } else if ("editFAQ") {
      // this._getFAQcategoryAPI();
      this.setState({
        editFAQ: true,
        editFAQData: val,
        faqId: val._id,
        // faqCategory: val.category_id._id,
        // categoryName: val.category_id.name,
        question: val.question,
        answer: val.answer,
        // priority: val.priority,
      });
    }
  }
  closeModal() {
    this.setState({
      modalIsOpen: false,
      modalIsOpen2: false,
      show: false,
      editFAQ: false,
    });
  }
  _onBack() {
    // console.log('onback clicked')
    this.setState({ show: false });
  }

  _editFAQ() {
    this.setState({ loading: true });
    // console.log('faqCategory -===>>>>>', this.state.faqCategory)
    if (this.state.question && this.state.answer) {
      var data = {
        _id: this.state.faqId,
        question: this.state.question,
        answer: this.state.answer,
        // priority: this.state.priority,
      };
      ApiRequest(data, "/updateFAQ", "POST", "")
        .then((res) => {
          if (res.status === 200) {
            this._getFAQAPI();
            swal({
              title: "Success",
              text: "Record Saved Successfully !",
              icon: "success",
              successMode: true,
            });
            this.setState({ loading: false });
            // console.log('Response -=>', res)
          }
        })
        .catch((err) => (console.log(err), this.setState({ loading: false })));
      this.closeModal();
    } else {
      this.setState({
        submitErr: "* Complete required fields",
        submitStatus: false,
      });
    }
  }

  _createFAQAPI() {
    this.setState({ loading: true });
    var data = {
      question: this.state.question,
      answer: this.state.answer,
      // priority: this.state.priority,
    };
    ApiRequest(data, "/addFAQ", "POST", "")
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          this._getFAQAPI();
          swal({
            title: "Success",
            text: "Record Saved Successfully !",
            icon: "success",
            successMode: true,
          });
          this.setState({ loading: false });
          console.log("Response -=>", res);
        }
      })
      .catch((err) => (console.log(err), this.setState({ loading: false })));
    this.closeModal();
  }

  _getFAQAPI() {
    this.setState({ loading: true });
    // console.log('filterId -===>', this.state.filter_id, 'filterCat_name --===>>', this.state.filterCat_name)
    var requestData = {
      // category_id: this.state.filter_id,
      skip: this.state.activePage === 1 ? 0 : this.state.skip,
      limit: 20,
      keyword: "",
    };
    ApiRequest(requestData, "/getFAQ", "POST")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            data: res.data.data,
            PaginationCount: res.data.count,
            loading: false,
          });
          // console.log(' filtered faq Response -=>', this.state.data)
          if (res.data.length > 0) {
            this._closeFilter();
            this.setState({ noDataStatus: false });
          } else {
            this._openFilter();
            this.setState({ noDataStatus: true });
          }
        }
      })
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  }
  // _getFAQcategoryAPI() {
  //   this.setState({ loading: true });
  //   ApiRequest("", "/getAllFAQcategory", "GET")
  //     .then((res) => {
  //       if (res.status === 200) {
  //         this.setState({ loading: false, FAQcategoryData: res.data.data });
  //         // console.log('Response -=>', this.state.data)
  //       }
  //     })
  //     .catch((err) => (console.log(err), this.setState({ loading: false })));
  // }

  _deleteFAQ(FAQId) {
    this.setState({ loading: true });
    var requestData = {
      _id: FAQId,
    };
    swal({
      title: "Delete",
      text: "Delete this record?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        ApiRequest(requestData, "/deleteFAQ", "POST")
          .then((res) => {
            if (res.status === 200) {
              this.setState({ delData: res.data });
              this._getFAQAPI();
              swal({
                title: "Success",
                text: "Record Deleted Successfully !",
                icon: "success",
                successMode: true,
              });
              this.setState({ loading: false });
              // console.log('Delete Response -=>', res.data)
            }
          })
          .catch(
            (err) => (console.log(err), this.setState({ loading: false }))
          );
      }
    });
    this.closeModal();
  }

  componentDidMount() {
    this._getFAQAPI();
    // this._getFAQcategoryAPI();
  }

  _openFilter() {
    this.setState({ filterModal: true, noDataStatus: false });
    this._getFAQcategoryAPI();
  }

  _closeFilter() {
    this.setState({ filterModal: false });
  }
  getcustomerfilter() {
    this.setState({ loading: true });
    // console.log('filterId -===>', this.state.filter_id, 'filterCat_name --===>>', this.state.filterCat_name)
    var requestData = {
      // category_id: this.state.filter_id,
      skip: this.state.activePage === 1 ? 0 : this.state.skip,
      limit: 20,
      keyword: this.state.keyword_search,
    };
    ApiRequest(requestData, "/getFAQ", "POST")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            data: res.data.data,
            PaginationCount: res.data.count,
            loading: false,
            currentPage: 1,
          });
          // console.log(' filtered faq Response -=>', this.state.data)
          if (res.data.length > 0) {
            this._closeFilter();
            this.setState({ noDataStatus: false });
          } else {
            this._openFilter();
            this.setState({ noDataStatus: true });
          }
        }
      })
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  }

  resetFilters() {
    this._getFAQAPI();
    this.setState({
      keyword_search: "",
      currentPage: 1,
    });
  }
  render() {
    return (
      <div>
        {this.state.show ? (
          <ViewFAQ data={this.state.viewData} back={() => this._onBack()} />
        ) : (
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
                            <i className="material-icons">slideshow</i>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="manage_up_add_btn">
                            <h4 className="card-title"> FAQ</h4>
                            <a onClick={() => this.openModal("add")}>
                              <button
                                className="btn btn-primary m-r-5 float-right"
                                title="Add FAQ"
                              >
                                <i className="fa fa-plus"></i> Add FAQ
                              </button>
                            </a>
                          </div>
                          <div className="searching-every searching-2-col">
                            <span>
                              <input
                                type="text"
                                name="keyword_search"
                                value={this.state.keyword_search}
                                className="form-control"
                                autoComplete="off"
                                onChange={(e) =>
                                  this.setState({
                                    keyword_search: e.target.value,
                                  })
                                }
                                placeholder="Search (E.g. Question, Answer...)"
                              ></input>
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
                              className="table table-striped table-no-bordered table-hover line_break_new"
                              cellSpacing="0"
                              width="100%"
                            >
                              <thead>
                                <tr>
                                  <th scope="col">S.No.</th>
                                  <th scope="col">Question</th>
                                  <th scope="col">Answer</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.data && this.state.data[0] ? (
                                  this.state.data.map((data, Index) => {
                                    return (
                                      <tr>
                                        <td>{Index + 1}</td>
                                        {/* <td className="">
                                            {data.category_id
                                              ? data.category_id.name
                                              : ""}
                                          </td> */}
                                        <td>
                                          {" "}
                                          <div className="lineWrap">
                                            {data.question}
                                          </div>
                                        </td>
                                        <td>
                                          {" "}
                                          <div className="lineWrap">
                                            {data.answer}
                                          </div>
                                        </td>
                                        {/* <td>{data.priority}</td> */}
                                        <td>
                                          <i
                                            className="fa fa-eye hover-with-cursor m-r-5"
                                            title="View"
                                            onClick={() =>
                                              this.openModal("view", data)
                                            }
                                          ></i>
                                          <i
                                            className="fa fa-edit hover-with-cursor m-r-5"
                                            onClick={() =>
                                              this.openModal("editFAQ", data)
                                            }
                                          ></i>
                                          <i
                                            className="fa fa-trash hover-with-cursor"
                                            onClick={() =>
                                              this._deleteFAQ(data._id)
                                            }
                                          ></i>
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr className="text-center">
                                    <td colSpan="4">No data found</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {/* <button className="btn btn-info btn-lg" onClick={() => this._getFAQAPI()}><i className="fa fa-search"></i> <span className="button_text" >Search</span></button> */}
                      </div>
                    </div>
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={20}
                      totalItemsCount={this.state.PaginationCount}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange.bind(this)}
                    />
                  </div>
                </div>
                {/* Filter popup */}

                {/* <Modal
                                    isOpen={this.state.filterModal}
                                    onRequestClose={() => this.closeModal()}
                                    style={customStyles}
                                    contentLabel="Example Modal">
                                    <div role="dialog">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <h4 className="modal-title">Search FAQ</h4>

                                                <div className="modal-right-bx">
                                                    <select className="form-control" onChange={(val) => this.formHandler(val, 'filter_id')}>
                                                        <option selected disabled>{this.state.filterCat_name.length > 0 ? this.state.filterCat_name : 'Search by Category'}</option>
                                                        {this.state.FAQcategoryData && this.state.FAQcategoryData[0] ?
                                                            this.state.FAQcategoryData.map((item, Index) => {
                                                                return (
                                                                    <option value={item._id + ',' + item.name}>
                                                                        {item.name}
                                                                    </option>
                                                                )
                                                            }
                                                            ) : ''
                                                        }
                                                    </select>
                                                </div>

                                                {this.state.noDataStatus ? <span className="err">* No Data Found</span> : ''}
                                                <div className="modal-form-bx">
                                                    <form>
                                                        <div className="modal-bottom" style={{ marginTop: 0 }}>
                                                            <button type="button" className="submit" onClick={() => this._getFAQAPI()}>Search</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Modal> */}

                {/* Add model here */}
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={() => this.closeModal()}
                  style={customStyles}
                >
                  <div role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <button
                          type="button"
                          className="close"
                          onClick={() => this.closeModal()}
                        >
                          &times;
                        </button>
                        <h4 className="modal-title">Add FAQ</h4>
                        <div className="modal-form-bx">
                          <form>
                            {/* <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  FAQ Category
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <select
                                  className="form-control"
                                  onChange={(val) =>
                                    this.formHandler(val, "faqCategory")
                                  }
                                >
                                  <option selected disabled>
                                    Select Category
                                  </option>
                                  {this.state.FAQcategoryData &&
                                  this.state.FAQcategoryData[0]
                                    ? this.state.FAQcategoryData.map(
                                        (item, Index) => {
                                          return (
                                            <option value={item._id}>
                                              {item.name}
                                            </option>
                                          );
                                        }
                                      )
                                    : ""}
                                </select>
                                <span className="err err_name">
                                  {this.state.FAQStatus
                                    ? ""
                                    : this.state.FAQErr}
                                </span>
                              </div>
                            </div> */}

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Question
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <textarea
                                  type="textarea"
                                  name="question"
                                  value={this.state.question}
                                  className="form-control"
                                  placeholder="Question"
                                  onChange={(val) =>
                                    this.formHandler(val, "question")
                                  }
                                />
                                <span className="err err_name">
                                  {this.state.questionStatus
                                    ? ""
                                    : this.state.questionErr}
                                </span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Answer
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <textarea
                                  type="textarea"
                                  name="answer"
                                  value={this.state.answer}
                                  className="form-control"
                                  placeholder="Answer"
                                  onChange={(val) =>
                                    this.formHandler(val, "answer")
                                  }
                                />
                                <span className="err err_name">
                                  {this.state.answerStatus
                                    ? ""
                                    : this.state.answerErr}
                                </span>
                              </div>
                            </div>

                            {/* <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Priority<span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="number"
                                  name="priority"
                                  value={this.state.priority}
                                  className="form-control"
                                  placeholder="Priority"
                                  onChange={(val) =>
                                    this.formHandler(val, "priority")
                                  }
                                />
                                <span className="err err_name">
                                  {this.state.priorityStatus
                                    ? ""
                                    : this.state.priorityErr}
                                </span>
                              </div>
                            </div> */}

                            <div style={{ alignItems: "center" }}>
                              <span className="err err_name">
                                {this.state.submitStatus
                                  ? ""
                                  : this.state.submitErr}
                              </span>
                            </div>
                            <div
                              className="modal-bottom"
                              style={{ marginTop: 30 }}
                            >
                              {/* <button
                                className="cancel"
                                onClick={() => this.closeModal()}
                              >
                                Cancel
                              </button> */}
                              <button
                                type="button"
                                className="btn btn-primary feel-btn"
                                onClick={() => this._handleSubmit()}
                              >
                                Add
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>

                {/* Edit model here */}
                <Modal
                  isOpen={this.state.editFAQ}
                  onRequestClose={() => this.closeModal()}
                  style={customStyles}
                >
                  <div role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <button
                          type="button"
                          className="close"
                          onClick={() => this.closeModal()}
                        >
                          &times;
                        </button>
                        <h4 className="modal-title">Edit FAQ</h4>
                        <div className="modal-form-bx">
                          <form>
                            {/* <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  FAQ Category
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <select
                                  className="form-control"
                                  onChange={(val) =>
                                    this.formHandler(val, "faqCategory")
                                  }
                                >
                                  <option
                                    style={{ fontWeight: "600" }}
                                    value={this.state.faqCategory}
                                  >
                                    {" "}
                                    {this.state.categoryName}{" "}
                                  </option>
                                  <option disabled></option>
                                  {this.state.FAQcategoryData &&
                                  this.state.FAQcategoryData[0]
                                    ? this.state.FAQcategoryData.map(
                                        (item, Index) => {
                                          return (
                                            <option value={item._id}>
                                              {item.name}
                                            </option>
                                          );
                                        }
                                      )
                                    : ""}
                                </select>
                                <span className="err err_name">
                                  {this.state.FAQStatus
                                    ? ""
                                    : this.state.FAQErr}
                                </span>
                              </div>
                            </div> */}

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Question<span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <textarea
                                  type="textarea"
                                  name="question"
                                  value={this.state.question}
                                  className="form-control"
                                  placeholder="Your Question Here"
                                  onChange={(val) =>
                                    this.formHandler(val, "question")
                                  }
                                />
                                <span className="err err_name">
                                  {this.state.questionStatus
                                    ? ""
                                    : this.state.questionErr}
                                </span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Answer<span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <textarea
                                  type="textarea"
                                  name="answer"
                                  value={this.state.answer}
                                  className="form-control"
                                  placeholder="Your Answer Here"
                                  onChange={(val) =>
                                    this.formHandler(val, "answer")
                                  }
                                />
                                <span className="err err_name">
                                  {this.state.answerStatus
                                    ? ""
                                    : this.state.answerErr}
                                </span>
                              </div>
                            </div>

                            {/* <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Priority<span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="number"
                                  name="priority"
                                  value={this.state.priority}
                                  className="form-control"
                                  placeholder="Priority"
                                  onChange={(val) =>
                                    this.formHandler(val, "priority")
                                  }
                                />
                                <span className="err err_name">
                                  {this.state.priorityStatus
                                    ? ""
                                    : this.state.priorityErr}
                                </span>
                              </div>
                            </div> */}

                            <div style={{ alignItems: "center" }}>
                              <span className="err err_name">
                                {this.state.submitStatus
                                  ? ""
                                  : this.state.submitErr}
                              </span>
                            </div>
                            <div
                              className="modal-bottom"
                              style={{ marginTop: 30 }}
                            >
                              {/* <button
                                className="cancel"
                                onClick={() => this.closeModal()}
                              >
                                Cancel
                              </button> */}
                              <button
                                type="button"
                                className="btn btn-primary feel-btn"
                                onClick={() => this._editFAQ()}
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

                {/* Delete Modal */}
                <Modal
                  isOpen={this.state.modalIsOpen2}
                  onRequestClose={() => this.closeModal()}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <div role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <button
                          type="button"
                          className="close"
                          onClick={() => this.closeModal()}
                        >
                          &times;
                        </button>
                        <h2
                          className="modal-title"
                          style={{ marginRight: 20, fontSize: 20 }}
                        >
                          Are you sure to Delete FAQ ?
                        </h2>
                        <div className="modal-form-bx">
                          <form>
                            <div
                              className="modal-bottom"
                              style={{ marginTop: 20 }}
                            >
                              <button
                                className="cancel"
                                onClick={() => this.closeModal()}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="submit"
                                onClick={() => this._deleteFAQ()}
                              >
                                Delete
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="admin-header">
              <Adminfooter />
            </div>
          </div>
        )}
      </div>
    );
  }
}
