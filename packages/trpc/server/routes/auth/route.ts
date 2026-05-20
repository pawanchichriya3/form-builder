import { userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import { createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordzOutputModel, getLoggedInUserInfoInputModel, getLoggedInUserInfoOutputModel, signInuserWithEmailAndPasswordInputModel, signInuserWithEmailAndPasswordOutputModel } from "./models";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure.meta({
    openapi: {
      method:'POST',
      path: getPath('/createUserWithEmailAndPassword'),
      tags: TAGS
    }
  }).input(createUserWithEmailAndPasswordInputModel).output(createUserWithEmailAndPasswordzOutputModel).mutation(async ({input, ctx}) => {
    const {fullName, email, password} = input;
    const {id, token} = await userService.createUserWithEmailAndPassword({
      fullName,email,password
    });
    setAuthenticationCookie(ctx, token)
    return {
      id
    }
  }),

  signInUserWithEmailAndPassword: publicProcedure.meta({
    openapi: {
      method:'POST',
      path: getPath('/signInUserWithEmailAndPassword'),
      tags: TAGS
    }
  }).input(signInuserWithEmailAndPasswordInputModel).output(signInuserWithEmailAndPasswordOutputModel)
  .mutation(async ({input, ctx}) => {
    const {email, password} = input;

    const {id, token} = await userService.signInUserWithEmailAndPassword({email,password});

    setAuthenticationCookie(ctx, token);

    return {
      id
    }
  }),
  getLoggedInUserInfo: authenticatedProcedure.meta({
    openapi: {
      method:'GET',
      path: getPath('/getLoggedInUserInfo'),
      tags: TAGS
    }
  }).input(getLoggedInUserInfoInputModel).output(getLoggedInUserInfoOutputModel)
  .query(async ({ctx}) => {

    const user = await userService.getUserInfoById(ctx.user.id);

    if (!user || !user.id) {
      throw new Error('Invalid or expired authentication token');
    }

    const result: { id: string; fullName: string; email: string; profileImageUrl: string | null } = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl ?? null,
    };

    return result;
  })
})
