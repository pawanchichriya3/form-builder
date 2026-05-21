import {z} from "zod";

export const createFormInput = z.object({
    title: z.string().max(200).describe("Title of the form"),
    description: z.string().max(400).optional().describe('Description of the form'),
    createdBy: z.string().uuid().describe("UUID of the user creating the form")
})

export const listFormsByUserIdInput = z.object({
    userId: z.string().uuid().describe("UUID of the user whose forms are to be listed")
})
export const getFormByIdInput = z.object({
    formId: z.string().uuid().describe("UUID of the form to retrieve")
})

export type CreateFormInputType = z.infer<typeof createFormInput>
export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>
export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>