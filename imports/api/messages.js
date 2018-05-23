import { Mongo } from "meteor/mongo";

// create messages database
export const Messages = new Mongo.Collection("messages");
