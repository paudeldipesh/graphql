import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
const port = 3000;

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

(async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
    type User {
      id: ID!
      name: String!
      username: String!
      email: String!
      phone: String!
    }

    type Task {
        userId: ID!
        id: ID!
        title: String!
        completed: Boolean!
        user: User
    }

    type Query {
        getTasks: [Task]
        getUsers: [User]
        getUser(id: ID!): User
    }
    `,
    resolvers: {
      Task: {
        user: async (user: User) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${user.id}`
            )
          ).data,
      },
      Query: {
        getTasks: async () =>
          (
            await axios.get("https://jsonplaceholder.typicode.com/todos")
          ).data.slice(0, 10),
        getUsers: async () =>
          (
            await axios.get("https://jsonplaceholder.typicode.com/users")
          ).data.slice(0, 10),
        getUser: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}.`);
  });
})();
