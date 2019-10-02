import React, { Component } from "react";
import { Table, Button } from "reactstrap";
import axios from "axios";

import Contact from "./Contact";
import Modal from "./Modal";

class ContactList extends Component {
  state = {
    contacts: [],
    showModal: false,
    editMode: false,
    data: {
      _id: "",
      name: "",
      phone: "",
      company: ""
    }
  };

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
      editMode: false,
      data: {
        _id: "",
        name: "",
        phone: "",
        company: ""
      }
    });
  };

  toggleEdit = data => {
    this.setState({
      showModal: !this.state.showModal,
      editMode: true,
      data: data
    });
  };

  handleChanges = e => {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    });
  };

  fetchContacts = () => {
    axios
      .get("https://gunturcontact16.herokuapp.com/all")
      //.get("http://localhost:2999/all")
      .then(({ data }) =>
        this.setState({
          contacts: data.data
        })
      )
      .catch(err => {
        console.log(err);
      });
  };

  addContacts = () => {
    this.toggleModal();
    axios
      .post("https://gunturcontact16.herokuapp.com/add", {
        name: this.state.data.name,
        phone: this.state.data.phone,
        company: this.state.data.company
      })
      .then(({ data }) =>
        this.setState(
          {
            data: {
              _id: "",
              name: "",
              phone: "",
              company: ""
            }
          },
          () => {
            this.fetchContacts();
          }
        )
      )
      .catch(err => {
        console.log(err);
      });
  };

  deleteContacts = id => {
    axios
      .delete(`https://gunturcontact16.herokuapp.com/id/${id}`)
      .then(({ data }) => {
        alert("data has been deleted");
        this.fetchContacts();
      })
      .catch(err => {
        console.log(err);
      });
  };

  updateContacts = () => {
    this.toggleModal();
    axios
      .put(`https://gunturcontact16.herokuapp.com/id/${this.state.data._id}`, {
        name: this.state.data.name,
        phone: this.state.data.phone,
        company: this.state.data.company
      })
      .then(({ data }) =>
        this.setState(
          {
            data: {
              _id: "",
              name: "",
              phone: "",
              company: ""
            }
          },
          () => {
            this.fetchContacts();
          }
        )
      )
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount = () => {
    axios
      .get("https://gunturcontact16.herokuapp.com/all")
      .then(response => {
        console.log(response.data);
        this.setState({
          contacts: response.data.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { contacts, showModal } = this.state;
    console.log("contacts: ", this.state.contacts);
    return (
      <div style={{ marginTop: "3vh" }} className="container">
        <Button
          style={{ margin: "10px", padding: "20px" }}
          color="primary"
          onClick={() => this.toggleModal()}
        >
          {" "}
          Add New Contact
        </Button>
        <Table dark>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(each => (
              <Contact
                key={each._id}
                contact={each}
                delcon={this.deleteContacts}
                toggleEdit={this.toggleEdit}
              />
            ))}
          </tbody>
        </Table>
        <Modal
          showModal={showModal}
          toggle={this.toggleModal}
          data={this.state.data}
          handleChanges={this.handleChanges}
          add={this.addContacts}
          edit={this.state.editMode}
          update={this.updateContacts}
        />
      </div>
    );
  }
}

export default ContactList;
