import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

type CanUserMutatePostParams = {
  userId: number;
  postId: number;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};
export const canUserMutatePost = async ({
  userId,
  postId,
  prisma,
}: CanUserMutatePostParams) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return {
      userError: [
        {
          message: "user not found ",
        },
      ],
      post: null,
    };
  }
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (post?.authorId !== user.id) {
    return {
      userError: [
        {
          message: "post not for this user",
        },
      ],
      post: null,
    };
  }
};
