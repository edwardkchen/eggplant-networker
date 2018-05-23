import { Mongo } from "meteor/mongo";

// create responses database
export const Responses = new Mongo.Collection("responses");
