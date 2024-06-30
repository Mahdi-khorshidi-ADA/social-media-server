import { Context } from "..";
import { userLoader } from "../loaders/userLoader";

type PostParent = {
  id: string;
  authorId: string;
};

export const Post = {
  user: ({ id, authorId }: PostParent, _: any, { prisma }: Context) => {
    //old way
    // return prisma.user.findUnique({
    //   where: {
    //     id: Number(authorId),
    //   },
    // });
    return userLoader.load(Number(authorId));
  },
};
