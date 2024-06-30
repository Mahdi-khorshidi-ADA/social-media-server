import { Profile, User } from "@prisma/client";
import { Context } from "..";

type UserPayload = {
  userError: {
    message: string;
  }[];
  user: User | null;
};
type ProfilePayload = {
  userError: {
    message: string;
  }[];
  profile: Profile | null;
};

export const Query = {
  posts: (_: any, __: any, { prisma }: Context) => {
    return prisma.post.findMany({
      where:{
        published:true
      },
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
  currentUser: async (
    _: any,
    __: any,
    { prisma, userInfo }: Context
  ): Promise<UserPayload> => {
    if (!userInfo) {
      return {
        userError: [
          {
            message:
              "YOU MUST Be Logged in to show the information of the current user",
          },
        ],
        user: null,
      };
    }
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userInfo.userId),
      },
    });
    return {
      userError: [],
      user: user,
    };
  },
  profile: async (
    _: any,
    { id }: { id: string },
    { prisma }: Context
  ): Promise<ProfilePayload> => {
    const profile = await prisma.profile.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!profile) {
      return {
        userError: [
          {
            message: "the profile does not exist",
          },
        ],
        profile: null,
      };
    }
    return {
      userError: [],
      profile,
    };
  },
  
};
