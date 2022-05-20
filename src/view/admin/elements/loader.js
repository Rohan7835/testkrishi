import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default class Globalloader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <Loader type="ThreeDots" color="#d7181f" height={80} width={80} />
        );
    }

}