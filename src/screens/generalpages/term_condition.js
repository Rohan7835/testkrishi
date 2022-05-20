import React from "react";
import { ApiRequest } from "../../apiServices/ApiRequest";
class about_us extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({ loading: true });
    let user = {};
    ApiRequest(user, "/Setting/getTC", "GET")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            htmldata: res.data.data.desc,
          });
          this.setState({ loading: false });
        }
      })
      .catch((err) => console.log(err));
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
              <img src="img/Terrms and conditions-31.jpg" />
              {/* <img src={imageUrl + localStorage.getItem("banner")} /> */}
            </div>
            <div className="banner-top-text">
              {/* <h1>Terms & Conditions</h1> */}
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
                <div
                  dangerouslySetInnerHTML={{ __html: this.state.htmldata }}
                />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default about_us;
