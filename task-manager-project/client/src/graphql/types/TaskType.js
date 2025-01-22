const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require("graphql");

const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
  }),
});

module.exports = TaskType;
