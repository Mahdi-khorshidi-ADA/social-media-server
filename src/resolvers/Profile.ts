import { User } from "@prisma/client";
import { Context } from "..";

type ProfileParentType = {
  id: number;
  bio: string;
  userId: number;
};
type UserPayload = {
  userError: {
    message: string;
  }[];
  user: User | null;
};
export const Profile = {
  user: async (
    { id,bio,userId }: ProfileParentType,
    _: any,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (!user) {
      return {
        userError: [{ message: "user does not exist" }],
        user: null,
      };
    }
    return {
      userError: [],
      user,
    };
  },
};
