import {z} from "zod";

export const createFormInputModel = z.object({
    title: z.string().max(200).describe("Title of the form"),
    description: z.string().max(400).optional().describe('Description of the form'),
})

export const createFormOutputModel = z.object({
    id: z.string().describe('ID of the created form')
})

export const listFormOutputModel = z.array(z.object({
    id: z.string().describe('ID of the form'),
    title: z.string().describe('Title of the form'),
    description: z.string().describe('Description of the form'),
    createdBy: z.string().describe('UUID of the user who created the form'),
    createdAt: z.date().describe('Creation date of the form'),
    updatedAt: z.date().describe('Last update date of the form')
}))