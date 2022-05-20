import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel
} from "react-accessible-accordion";
import { ApiRequest } from "../../apiServices/ApiRequest";
class FAQ extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    var requestData = {};
    ApiRequest(requestData, "/getFAQ", "POST")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            data: res.data.data,
            PaginationCount: res.data.count,
            loading: false,
          });
        }
      })
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  }

  go_to_home = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <>
        <main className="page-content">
          <section className="page-banner">
            <div className="banner-figure" style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/img/FAQ.jpg"} />
              {/* <img src={imageUrl + localStorage.getItem("banner")} /> */}
            </div>
            <div className="banner-top-text">
              {/* <h1>FAQ</h1> */}
              {/* <h1>
                {product_data && product_data.product_subCat1_id
                  ? product_data.product_subCat1_id.category_name
                  : ""}
              </h1> */}
              {/* <p>
                <div
                  dangerouslySetInnerHTML={{ __html: product_data.longDesc }}
                ></div>
              </p> */}
            </div>
            <div className="banner-overlay"></div>
          </section>
          <div className="content-text-part">
            <div className="container-fluid">
              <div className="contnet-para-block">
                <div className="faq-content">
                  {/*<h3>Frequently asked questions</h3>*/}
                  <div>
                    <Accordion>
                      {this.state.data.length > 0
                        ? this.state.data.map((item, index) => (
                            <AccordionItem>
                              <AccordionItemHeading>
                                <AccordionItemButton>
                                  {item.question}
                                </AccordionItemButton>
                              </AccordionItemHeading>
                              <AccordionItemPanel>
                                <p>{item.answer}</p>
                              </AccordionItemPanel>
                            </AccordionItem>
                          ))
                        : ""}
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default FAQ;
