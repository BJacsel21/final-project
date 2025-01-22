const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLBoolean, GraphQLList } = require("graphql");
const TaskType = require("./types/TaskType");
const Task = require("../models/Task");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: async () => await Task.find(),
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTask: {
      type: TaskType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const task = new Task({ name: args.name });
        return await task.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
