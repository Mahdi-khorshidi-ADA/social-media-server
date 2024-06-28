import { Post, User } from "@prisma/client";
import { Context } from "..";
type PostCreateArgs = {
  input: {
    title: string;
    content: string;
  };
};
type PostPayLoadType = {
  postErrors: {
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

export const Mutation = {
  postCreate: async (
    _: any,
    { input: { title, content } }: PostCreateArgs,
    { prisma }: Context
  ): Promise<PostPayLoadType> => {
    if (!title || !content) {
      return {
        postErrors: [
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
        authorId: 1,
      },
    });
    console.log(post);
    return {
      postErrors: [
        { message: "everything's fine the post got added perfectly" },
      ],
      post,
    };
  },
  postUpdate: async (
    _: any,
    { id, input }: PostUpdateArgs,
    { prisma }: Context
  ): Promise<PostPayLoadType> => {
    const { title, content } = input;
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!existingPost) {
      return {
        postErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }
    if (!title && !content) {
      return {
        postErrors: [
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
      postErrors: [{ message: "" }],
      post: updatedPost,
    };
  },
  postDelete: async (
    _: any,
    { id }: { id: string },
    { prisma }: Context
  ): Promise<PostPayLoadType> => {
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!existingPost) {
      return {
        postErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }
    const post = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    return {
      postErrors: [{ message: "" }],
      post: post,
    };
  },
};
