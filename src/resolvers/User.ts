import { Post, Prisma } from "@prisma/client";
import { Context } from "..";
import { NewLineKind } from "typescript";

type UserParentType = {
  id: number;
};
type PostPayload = {
  userError: {
    message: string;
  }[];
  posts: Post[] | null;
};
export const User = {
  userPosts: async (
    { id }: UserParentType,
    _: any,
    { prisma, userInfo }: Context
  ): Promise<PostPayload> => {
    const isOwnProfile = id === userInfo?.userId;
    const allPosts = await prisma.post.findMany({
      where: {
        authorId: id,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
    const publishedPosts = await prisma.post.findMany({
      where: {
        authorId: id,
        published: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
    if (isOwnProfile) {
      return {
        userError: [],
        posts: allPosts,
      };
    } else {
      return {
        userError: [],
        posts: publishedPosts,
      };
    }
  },
};