import { Context } from "..";

export const Query = {
  posts: (_: any, __: any, { prisma }: Context) => {
    return prisma.post.findMany({
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
    });
  },
  users: (_: any, __: any, { prisma }: Context) => {
    return prisma.user.findMany({
      orderBy: [
        {
          id: "asc",
        },
      ],
    });
  },
};
