import { Post } from "@prisma/client";
import { Context } from "..";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { canUserMutatePost } from "../utils/canUserMutatePost";
import { JWT_SIGNATURE } from "../key";
JWT_SIGNATURE;
type PostCreateArgs = {
  input: {
    title: string;
    content: string;
  };
};
type PostPayLoadType = {
  userError: {
    message: string;
  }[];
  post: Post | null;
};

type PostUpdateArgs = {
  id: string;
  input: {
    title: string;
    content: string;
  };
};

type signUpArgs = {
  input: {
    email: string;
    name: string;
    password: string;
    bio: string;
  };
};

type signUpPayload = {
  userError: {
    message: string;
  }[];
  token: string | null;
};

export const Mutation = {
  postCreate: async (
    _: any,
    { input: { title, content } }: PostCreateArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userError: [
          {
            message: "YOU MUST Be Logged in to create a post",
          },
        ],
        post: null,
      };
    }
    if (!title || !content) {
      return {
        userError: [
          {
            message: "YOU MUST provide a title and a content to create a post",
          },
        ],
        post: null,
      };
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userInfo.userId,
      },
    });
    return {
      userError: [],
      post,
    };
  },
  postUpdate: async (
    _: any,
    { id, input }: PostUpdateArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    const { title, content } = input;
    if (!userInfo) {
      return {
        userError: [
          {
            message: "YOU MUST Be Logged in to create a post",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: Number(userInfo?.userId),
      postId: Number(id),
      prisma,
    });
    if (error) {
      return error;
    }
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!existingPost) {
      return {
        userError: [{ message: "Post does not exist" }],
        post: null,
      };
    }
    if (!title && !content) {
      return {
        userError: [
          {
            message:
              "at least we need either title or content to update the post ",
          },
        ],
        post: null,
      };
    }
    const updatedPost = await prisma.post.update({
      data: {
        ...input,
      },
      where: {
        id: Number(id),
      },
    });
    return {
      userError: [],
      post: updatedPost,
    };
  },
  postDelete: async (
    _: any,
    { id }: { id: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userError: [
          {
            message: "YOU MUST Be Logged in to create a post",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: Number(userInfo?.userId),
      postId: Number(id),
      prisma,
    });
    if (error) {
      return error;
    }
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!existingPost) {
      return {
        userError: [{ message: "Post does not exist" }],
        post: null,
      };
    }
    const post = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    return {
      userError: [],
      post: post,
    };
  },
  signUp: async (
    _: any,
    { input }: signUpArgs,
    { prisma }: Context
  ): Promise<signUpPayload> => {
    const { name, email, bio, password } = input;
    if (!name && !email && !password && !bio) {
      return {
        userError: [
          {
            message: "felids are empty can't signup",
          },
        ],
        token: null,
      };
    }
    if (!name) {
      return {
        userError: [
          {
            message: "invalid name try again",
          },
        ],
        token: null,
      };
    }
    if (!validator.isEmail(email)) {
      return {
        userError: [
          {
            message: "invalid Email try again",
          },
        ],
        token: null,
      };
    }
    if (!validator.isLength(password, { min: 5 })) {
      return {
        userError: [
          {
            message: "invalid Password try again",
          },
        ],
        token: null,
      };
    }
    if (!bio) {
      return {
        userError: [
          {
            message: "invalid bio try again",
          },
        ],
        token: null,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    await prisma.profile.create({
      data: {
        bio,
        userId: newUser.id,
      },
    });
    const token = await JWT.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      JWT_SIGNATURE,
      { expiresIn: 3600000 }
    );
    return {
      userError: [],
      token,
    };
  },
  signIn: async (
    _: any,
    { input }: signUpArgs,
    { prisma }: Context
  ): Promise<signUpPayload> => {
    const { email, password } = input;
    if (!email && !password) {
      return {
        userError: [
          {
            message: "felids are empty can't sign in",
          },
        ],
        token: null,
      };
    }
     if (!email) {
       return {
         userError: [
           {
             message: "email field is empty",
           },
         ],
         token: null,
       };
     }
      if (!password) {
        return {
          userError: [
            {
              message: "password field is empty",
            },
          ],
          token: null,
        };
      }
    if (!validator.isEmail(email)) {
      return {
        userError: [
          {
            message: "invalid Email try again",
          },
        ],
        token: null,
      };
    }
    if (!validator.isLength(password, { min: 5 })) {
      return {
        userError: [
          {
            message: "invalid Password try again",
          },
        ],
        token: null,
      };
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!foundUser) {
      return {
        userError: [
          {
            message: "this user does not exist !!!",
          },
        ],
        token: null,
      };
    }
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return {
        userError: [
          {
            message: "the password is not correct try again later !!!",
          },
        ],
        token: null,
      };
    }
    const token = await JWT.sign(
      {
        userId: foundUser.id,
      },
      JWT_SIGNATURE,
      { expiresIn: 3600000 }
    );
    return {
      userError: [],
      token,
    };
  },
  postPublish: async (
    _: any,
    { id }: { id: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userError: [
          {
            message: "YOU MUST Be Logged in to create a post",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: Number(userInfo?.userId),
      postId: Number(id),
      prisma,
    });
    if (error) {
      return error;
    }
    const post = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        published: true,
      },
    });
    return {
      userError: [],
      post,
    };
  },
  postUnPublish: async (
    _: any,
    { id }: { id: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userError: [
          {
            message: "YOU MUST Be Logged in to create a post",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: Number(userInfo?.userId),
      postId: Number(id),
      prisma,
    });
    if (error) {
      return error;
    }
    const post = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        published: false,
      },
    });
    return {
      userError: [],
      post,
    };
  },
};
