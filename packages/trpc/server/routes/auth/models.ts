import {z} from 'zod';

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe('name of the user'),
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user')
});

export const createUserWithEmailAndPasswordzOutputModel = z.object({
    id: z.string().describe('id of the user created')
})

export const signInuserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user')
})

export const signInuserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe('uuid of the user')
})

export const getLoggedInUserInfoInputModel = z.undefined();
export const getLoggedInUserInfoOutputModel = z.object({
    id: z.string().describe('uuid of the user'),
    fullName: z.string().describe('full name of the user'),
    email: z.email().describe('email of the user'),
    profileImageUrl: z.string().nullable().describe('profile image url of the user')
})
