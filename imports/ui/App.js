import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

import { Responses } from "../api/responses.js";
import { Messages } from "../api/messages.js";

import Message from "./Message.js";

// App component represents the whole app
class App extends Component {
  constructor(props) {
    super(props); // must call super() on constructor

    // set state to not submitted
    this.state = { responseSubmitted: false, currentUser: "" };
  }

  // executes when user submit an idea
  handleSubmitMessage(event) {
    event.preventDefault();

    // find the text field via React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const phone = ReactDOM.findDOMNode(this.refs.phoneNumber).value.trim();
    const link = ReactDOM.findDOMNode(this.refs.imgLink).value.trim();


    if (text == "") return;

    // insert message to database
    Messages.insert({
      text,
      phone,
      link,
      num_likes: 0,
      user_likes: [],
      updatedAt: new Date(), // current time
      createdAt: new Date(), // current time
      owner: this.state.currentUser
    } );

    // clear field
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
    ReactDOM.findDOMNode(this.refs.phoneNumber).value = "";
    ReactDOM.findDOMNode(this.refs.imgLink).value = "";


    this.setState({
      answerSubmitted: true
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    // find the text field via React ref
    const username = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const error = ReactDOM.findDOMNode(this.refs.userExists);

    let userExists =
      Responses.find({
        username
      }).fetch().length > 0;

    if (userExists) {
      error.style = { visibility: "visible" };
      return;
    }
    error.style = { visibility: "hidden" };

    // insert response to database
    Responses.insert({ username, createdAt: new Date() });

    // update state
    this.setState({ responseSubmitted: true, currentUser: username });
  }

  renderMessages() {
    let filteredMessages = this.props.messages;
    // if (this.state.responseSubmitted) {
    //   filteredMessages = filteredMessages.filter(
    //     message => message.topic == this.state.currentTopic
    //   );
    // }
    return filteredMessages.map(message => (
      <Message
        key={message._id}
        message={message}
        user={this.state.currentUser}
      />
    ));
  }

  render() {
    let err_style = {
      visibility: "hidden"
    };

    return (
      <div className="app-root">
        <div className="container">
          <header>
            <h1>Welcome to Eggplant-Networker!</h1>
            <h3>
              Wow! {this.props.userCount}
              {this.props.userCount > 1 ? " users " : " user "}
              participated!
            </h3>
            {this.state.responseSubmitted ? (
              <div>
                Hi, {this.state.currentUser}!
                <br />
                <br />
                <strong>Step 1</strong>: Use the following form to create a profile!
                <form
                  className="new-message"
                  onSubmit={this.handleSubmitMessage.bind(this)}
                >
                  <input
                    type="text"
                    ref="textInput"
                    placeholder="Type to add a brief description"
                  />
                  <input
                    type="text"
                    ref="phoneNumber"
                    placeholder="Type your phone number"
                  />
                  <input
                    type="text"
                    ref="imgLink"
                    placeholder="Copy and paste a link to an image"
                  />
                  <input
                    className="submit-button"
                    type="submit"
                    value="Submit!!"
                  />
                </form>
              </div>
            ) : (
              <div>
                <form
                  className="new-response"
                  onSubmit={this.handleSubmit.bind(this)}
                >
                  <table>
                    <tbody>
                      <tr>
                        <th>Name:</th>
                        <td>
                          <input type="text" ref="name" />
                        </td>
                        <td
                          className="nameError"
                          ref="userExists"
                          style={err_style}
                        >
                          User already exists! :(
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <input
                    className="submit-button"
                    type="submit"
                    value="Submit!!"
                  />
                </form>
              </div>
            )}
          </header>
          {this.state.answerSubmitted ? <ul>{this.renderMessages()}</ul> : ""}
        </div>
      </div>
    );
  }
}

// load props for App component
export default withTracker(() => {
  return {
    responses: Responses.find({}, { sort: { createdAt: -1 } }).fetch(),
    messages: Messages.find(
      {},
      { sort: { num_likes: -1, updatedAt: -1 } }
    ).fetch(),
    userCount: Responses.find({}).count()
  };
})(App);
