import { userService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordzOutputModel } from "./models";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure.meta({
    openapi: {
      method:'POST',
      path: getPath('/createUserWithEmailAndPassword'),
      tags: TAGS
    }
  }).input(createUserWithEmailAndPasswordInputModel).output(createUserWithEmailAndPasswordzOutputModel).mutation(async ({input}) => {
    const {fullName, email, password} = input;
    const {id} = await userService.createUserWithEmailAndPassword({
      fullName,email,password
    });

    return {
      id
    }
  })
})
