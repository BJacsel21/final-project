import { gql } from "@apollo/client";

// Query to get tasks
export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      _id
      name
      completed
    }
  }
`;

// Mutation to add a task
export const ADD_TASK = gql`
  mutation AddTask($name: String!) {
    addTask(name: $name) {
      _id
      name
      completed
    }
  }
`;
