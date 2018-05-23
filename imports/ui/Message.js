import React, { Component } from "react";
import { Messages } from "../api/messages.js";

export default class Message extends Component {
  // called when user upvotes a message
  upvoteThisMessage() {
    // add user to list of users who like this message
    Messages.update(this.props.message._id, {
      $push: { user_likes: this.props.user }
    });

    // update number of likes and update time
    Messages.update(this.props.message._id, {
      $set: {
        updatedAt: new Date(),
        num_likes: this.props.message.num_likes + 1
      }
    });
  }

  // called when user downvotes a message
  downvoteThisMessage() {
    Messages.update(this.props.message._id, {
      $pull: { user_likes: this.props.user }
    });
    Messages.update(this.props.message._id, {
      $set: {
        updatedAt: new Date(),
        num_likes: this.props.message.num_likes - 1
      }
    });
  }

  // used to check if a user already upvoted this message
  userVoted() {
    let users = Messages.find(
      { _id: this.props.message._id },
      { user_likes: 1 }
    ).fetch();

    if (!users || users[0].user_likes.indexOf(this.props.user) == -1)
      return false;

    return true;
  }

  render() {
    return (
      <li>
        {this.userVoted() ? (
          <button
            className="upvoted"
            onClick={this.downvoteThisMessage.bind(this)}
          >
            {this.props.message.num_likes > 0 ? "+" : ""}
            {this.props.message.num_likes} &#9660;
          </button>
        ) : (
          <button
            className="novote"
            onClick={this.upvoteThisMessage.bind(this)}
          >
            {this.props.message.num_likes > 0 ? "+" : ""}
            {this.props.message.num_likes} &#9650;
          </button>
        )}
        <span className="text">
          <strong>{this.props.message.owner}</strong>({this.props.message.phone}):&nbsp;
          {this.props.message.text}
        </span>
      </li>
    );
  }
}
