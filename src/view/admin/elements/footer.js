import React, { Component } from "react";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  render() {
    return (
      <footer className="footer admin_footer">
        <div className="copyright float-right">
          Made with <i className="material-icons">favorite</i> by
          <a href="http://tech9logy.com/" target="_blank">
            {" "}
            Tech9logy Creators
          </a>{" "}
          .
        </div>
      </footer>
    );
  }
}

export default Footer;
