import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
// Import Hamoni Sync
import Hamoni from "hamoni-sync";

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      firstName: "",
      lastName: ""
    };
  }

  componentDidMount() {
    let hamoni = new Hamoni("ACCOUNT_ID", "APP_ID");

    hamoni
      .connect()
      .then(() => {
        hamoni
          .get("datagrid")
          .then(listPrimitive => {
            this.listPrimitive = listPrimitive;

            this.setState({
              data: [...listPrimitive.getAll()]
            });

            listPrimitive.onItemAdded(item => {
              this.setState({ data: [...this.state.data, item.value] });
            });

            listPrimitive.onItemUpdated(item => {
              let data = [
                ...this.state.data.slice(0, item.index),
                item.value,
                ...this.state.data.slice(item.index + 1)
              ];

              this.setState({ data: data });
            });

            listPrimitive.onSync(data => {
              this.setState({ data: data });
            });
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }

  handleChange = event => {
    if (event.target.name === "firstName")
      this.setState({ firstName: event.target.value });
    if (event.target.name === "lastName")
      this.setState({ lastName: event.target.value });
  };

  handleSubmit = event => {
    this.listPrimitive.add({
      firstName: this.state.firstName,
      lastName: this.state.lastName
    });
    this.setState({ firstName: "", lastName: "" });
    event.preventDefault();
  };

  renderEditable = cellInfo => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          let row = this.state.data[cellInfo.index];
          row[cellInfo.column.id] = e.target.innerHTML;
          this.listPrimitive.update(cellInfo.index, row);
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  };

  render() {
    const { data } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Realtime React Datagrid</h1>
        </header>
        <p className="App-intro">
          <form onSubmit={this.handleSubmit}>
            <h3>Add new record</h3>
            <label>
              FirstName:
              <input
                type="text"
                name="firstName"
                value={this.state.firstName}
                onChange={this.handleChange}
              />
            </label>{" "}
            <label>
              LastName:
              <input
                type="text"
                name="lastName"
                value={this.state.lastName}
                onChange={this.handleChange}
              />
            </label>
            {"   "}
            <input type="submit" value="Add" />
          </form>
        </p>
        <div>
          <ReactTable
            data={data}
            columns={[
              {
                Header: "First Name",
                accessor: "firstName",
                Cell: this.renderEditable
              },
              {
                Header: "Last Name",
                accessor: "lastName",
                Cell: this.renderEditable
              },
              {
                Header: "Full Name",
                id: "full",
                accessor: d => (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: d.firstName + " " + d.lastName
                    }}
                  />
                )
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        </div>
      </div>
    );
  }
}

export default App;
