import {z} from "zod";

const fieldTypeEnum = z.enum(["TEXT", "EMAIL", "NUMBER","YES_NO", "PASSWORD"]);

export const createFieldInput = z.object({
    formId: z.string().uuid().describe("UUID of the form to which the field belongs"),
    label: z.string().max(200).describe("Label of the field"),
    type: fieldTypeEnum.describe("Type of the field"),
    isRequired: z.boolean().describe("Whether the field is required or not"),
    description: z.string().max(400).optional().describe('Description of the field'),
    placeholder: z.string().max(200).optional().describe('Placeholder text for the field')
})

export type CreateFieldInputType = z.infer<typeof createFieldInput>

export const updateFieldInput = z.object({
    fieldId: z.string().uuid().describe("UUID of the field to be updated"),
    label: z.string().max(200).optional().describe("Label of the field"),
    type: fieldTypeEnum.optional().describe("Type of the field"),
    isRequired: z.boolean().optional().describe("Whether the field is required or not"),
    description: z.string().max(400).optional().describe('Description of the field'),
    placeholder: z.string().max(200).optional().describe('Placeholder text for the field')
})

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>     

export const deleteFieldInput = z.object({
    fieldId: z.string().uuid().describe("UUID of the field to be deleted")
})

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>

export const getFieldsInput = z.object({
    formId: z.string().uuid().describe("UUID of the form whose fields are to be retrieved")
})

export type GetFieldsInputType = z.infer<typeof getFieldsInput>

export const reorderFieldsInput = z.object({
    formId: z.string().uuid().describe("UUID of the form whose fields are being reordered"),
    fieldIds: z.array(z.string().uuid()).min(1).describe("Ordered array of field IDs representing the new order")
})

export type ReorderFieldsInputType = z.infer<typeof reorderFieldsInput>