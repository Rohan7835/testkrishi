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
    ApiRequest(user, "/Setting/getPrivacyPolicy", "GET")
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
              <img src="img/PP-32.jpg" />
            </div>
            <div className="banner-top-text"></div>
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
