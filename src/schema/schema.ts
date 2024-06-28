import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    users: [User!]!
    posts: [Post!]!
    post(id: ID!): Post!
    user(id: ID!): User!
  }
  type Mutation {
    postCreate(input: postCreateInput!): PostPayload!
    postUpdate(id: ID!, input: postCreateInput!): PostPayload!
    postDelete(id: ID!): PostPayload!
  }

  type PostPayload {
    postError: [Error!]!
    post: Post
  }
  type Error {
    message: String!
  }
  type UserPayload {
    userError: [Error!]!
    user: User
  }

  input userCreateInput {
    email: String!
    name: String!
    password: String
  }

  input postCreateInput {
    title: String
    content: String
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    updatedAt: String!
    user: User!
  }
  type User {
    id: ID!
    email: String!
    name: String!
    password: String
    createdAt: String!
    updatedAt: String!
    post: [Post!]!
    profile: Profile!
  }
  type Profile {
    id: ID!
    bio: String
    createdAt: String!
    updatedAt: String!
    user: User!
  }
`;
