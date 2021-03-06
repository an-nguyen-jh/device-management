import React, { Component } from "react";
import classNames from "classnames";
import "../styles/alert.css";

class Alert extends Component {
  render() {
    const { type, children, className, icon } = this.props;
    return (
      <div className={classNames({ [`alert--${type}`]: true }, className)}>
        <div className="alert__icon">{icon}</div>
        <span>{children}</span>
      </div>
    );
  }
}

export default Alert;
