import {z} from "zod";

export const submitFormInput = z.object({
    formId: z.string().uuid().describe("UUID of the form being submitted"),
    values: z.array(z.object({
        formFieldId: z.string().uuid().describe("UUID of the form field"),
        value: z.string().describe("Value of the field"),
    })).describe("Array of field values"),
})

export type SubmitFormInputType = z.infer<typeof submitFormInput>

export const getSubmissionsInput = z.object({
    formId: z.string().uuid().describe("UUID of the form whose submissions are to be retrieved"),
})

export type GetSubmissionsInputType = z.infer<typeof getSubmissionsInput>
