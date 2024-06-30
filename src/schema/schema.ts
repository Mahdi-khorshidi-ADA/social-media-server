import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    users: [User!]!
    posts: [Post!]!
  }
  type Mutation {
    postCreate(input: postCreateInput!): PostPayload!
    postUpdate(id: ID!, input: postCreateInput!): PostPayload!
    postDelete(id: ID!): PostPayload!
    signUp(input: signUpInputType!): SignUpPayload!
    signIn(input: signUpInputType!): SignUpPayload!
    postPublish(id: ID!): PostPayload!
    postUnPublish(id: ID!): PostPayload!
  }

  type SignUpPayload {
    userError: [Error!]!
    token: String
  }

  input signUpInputType {
    name: String
    email: String!
    password: String!
    bio: String
  }

  type PostPayload {
    userError: [Error!]!
    post: Post
  }
  type Error {
    message: String!
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
