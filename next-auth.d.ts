import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: string;
  isOAuth: boolean;
  image: string;
  isTwoFactorEnabled: boolean;
};
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
