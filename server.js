const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Type Definitions
const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    dueDate: String
    user: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: String
    dueDate: String
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: CreateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }
`;

const { authenticateUser } = require('./middleware/authMiddleware');

// Resolvers
const resolvers = {
  Query: {
    tasks: async (_, __, context) => {
      const user = await authenticateUser(context);
      // Now implement task fetching logic for authenticated user
      return await Task.find({ user: user.id });
    },
    task: async (_, { id }, context) => {
      const user = await authenticateUser(context);
      const task = await Task.findOne({ _id: id, user: user.id });
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    },
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      // No auth needed for registration
      // Implement registration logic
    },
    login: async (_, { email, password }) => {
      // No auth needed for login
      // Implement login logic
    },
    createTask: async (_, { input }, context) => {
      const user = await authenticateUser(context);
      const task = new Task({
        ...input,
        user: user.id,
      });
      return await task.save();
    },
    updateTask: async (_, { id, input }, context) => {
      const user = await authenticateUser(context);
      const task = await Task.findOneAndUpdate(
        { _id: id, user: user.id },
        input,
        { new: true }
      );
      if (!task) {
        throw new Error('Task not found or unauthorized');
      }
      return task;
    },
    deleteTask: async (_, { id }, context) => {
      const user = await authenticateUser(context);
      const task = await Task.findOneAndDelete({ _id: id, user: user.id });
      if (!task) {
        throw new Error('Task not found or unauthorized');
      }
      return true;
    },
  },
};

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
async function startServer() {
  await server.start();
  
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      return { req }; // Pass the request object to the context
    },
  }));

  app.listen(process.env.PORT || 4000, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}/graphql`);
  });
}

startServer();
