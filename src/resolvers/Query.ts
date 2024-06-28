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
  user: (_: any, { id }: { id: string }, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
  },
  post: (_: any, { id }: { id: string }, { prisma }: Context) => {
    return prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
  },
};
