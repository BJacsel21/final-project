const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware for JWT authentication
app.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); // Forbidden
      req.user = decoded; // Save user info to request
    });
  }
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Enable CORS
app.use(cors());

// Set up GraphQL
const root = require("./graphql/resolvers");
const schema = require("./graphql/schema");

app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
