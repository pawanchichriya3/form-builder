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

const formFieldObject = z.object({
    id: z.string().uuid().describe('ID of the form field'),

    formId: z.string().uuid()
        .nullable()
        .describe('ID of the form to which the field belongs'),

    label: z.string()
        .max(255)
        .describe('Label of the form field'),

    labelKey: z.string()
        .max(255)
        .nullable()
        .optional()
        .describe('Key for the label of the form field'),

    description: z.string()
        .nullable()
        .optional()
        .describe('Description of the form field'),

    placeholder: z.string()
        .max(255)
        .nullable()
        .optional()
        .describe('Placeholder text for the form field'),

    isRequired: z.boolean()
        .default(false)
        .describe('Whether the form field is required or not'),

    index: z.number()
        .describe('Index of the form field in the form'),

    type: z.enum([
        "TEXT",
        "NUMBER",
        "EMAIL",
        "PASSWORD",
        "YES_NO"
    ]).describe('Type of the form field'),

    createdAt: z.date()
        .nullable()
        .describe('Creation date of the form field'),

    updatedAt: z.date()
        .nullable()
        .describe('Last update date of the form field'),
});

export const createFieldInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form to which the field belongs"),
    label: z.string().max(200).describe("Label of the field"),
    type: z.enum(["TEXT", "EMAIL", "NUMBER","YES_NO", "PASSWORD"]).describe("Type of the field"),
    isRequired: z.boolean().describe("Whether the field is required or not").optional().default(false),
    description: z.string().max(400).optional().describe('Description of the field'),
    placeholder: z.string().max(200).optional().describe('Placeholder text for the field')
})

export const createFieldOutputModel = z.object({
    id: z.string().uuid().describe("UUID of the created field"),
    labelKey: z.string().describe("Label key of the created field"),
    index: z.number().describe("Index of the created field in the form")
})

export const updateFieldInputModel = z.object({
    fieldId: z.string().uuid().describe("UUID of the field to be updated"),
    label: z.string().max(200).optional().describe("Label of the field"),
    type: z.enum(["TEXT", "EMAIL", "NUMBER","YES_NO", "PASSWORD"]).optional().describe("Type of the field"),
    isRequired: z.boolean().optional().describe("Whether the field is required or not"),
    description: z.string().max(400).optional().describe('Description of the field'),
    placeholder: z.string().max(200).optional().describe('Placeholder text for the field')
})

export const updateFieldOutputModel = z.object({
    id: z.string().uuid().describe("UUID of the updated field"),
    formId: z.string().uuid().nullable().describe("UUID of the form to which the field belongs"),
    label: z.string().max(255).describe("Label of the field"),
    labelKey: z.string().max(255).nullable().optional().describe("Label key of the field"),
    description: z.string().nullable().optional().describe("Description of the field"),
    placeholder: z.string().max(255).nullable().optional().describe("Placeholder text for the field"),
    isRequired: z.boolean().describe("Whether the field is required or not"),
    index: z.number().describe("Index of the field in the form"),
    type: z.enum([
        "TEXT",
        "NUMBER",
        "EMAIL",
        "PASSWORD",
        "YES_NO"
    ]).describe("Type of the field"),
    createdAt: z.date().nullable().describe("Creation date of the field"),
    updatedAt: z.date().nullable().describe("Last update date of the field")
})

export const deleteFieldInputModel = z.object({
    fieldId: z.string().uuid().describe("UUID of the field to be deleted")
})

export const deleteFieldOutputModel = z.object({
    id: z.string().uuid().describe("UUID of the deleted field")
})

export const getFieldsInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form whose fields are to be retrieved")
})

export const getFieldsOutputModel = z.array(formFieldObject)

export const getFormByIdInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form to retrieve")
})

export const getFormByIdOutputModel = z.object({
    id: z.string().describe('ID of the form'),
    title: z.string().describe('Title of the form'),
    description: z.string().nullable().describe('Description of the form'),
    fields: z.array(formFieldObject).describe('Fields of the form'),
    createdAt: z.date().nullable().describe('Creation date of the form'),
    updatedAt: z.date().nullable().describe('Last update date of the form')
})

export const submitFormInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form being submitted"),
    values: z.array(z.object({
        formFieldId: z.string().uuid().describe("UUID of the form field"),
        value: z.string().describe("Value of the field"),
    })).describe("Array of field values"),
})

export const submitFormOutputModel = z.object({
    id: z.string().uuid().describe("UUID of the created submission"),
})

export const getSubmissionsInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form whose submissions are to be retrieved"),
})

export const getSubmissionsOutputModel = z.array(z.object({
    id: z.string().uuid().describe("UUID of the submission"),
    formId: z.string().uuid().describe("UUID of the form"),
    value: z.array(z.object({
        formFieldId: z.string().uuid().describe("UUID of the form field"),
        value: z.string().describe("Value of the field"),
    })).describe("Submitted field values"),
    createdAt: z.date().describe("Submission date"),
}))

export const reorderFieldsInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form whose fields are being reordered"),
    fieldIds: z.array(z.string().uuid()).min(1).describe("Ordered array of field IDs representing the new order")
})

export const reorderFieldsOutputModel = z.object({
    success: z.boolean().describe("Whether the reorder was successful")
})


