import React, { PureComponent } from "react";

export default class FieldTable extends PureComponent {
  componentDidMount = () => {
    fetch("http://localhost:3000/api/conf-form-json")
      .then(response => response.json())
      .then(value => console.log(value));
  };

  render() {
    return <div>FieldTable</div>;
  }
}
