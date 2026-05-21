import { formFieldService, formService, formSubmissionService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFieldInputModel, createFieldOutputModel, createFormInputModel, createFormOutputModel, deleteFieldInputModel, deleteFieldOutputModel, getFieldsInputModel, getFieldsOutputModel, getFormByIdInputModel, getFormByIdOutputModel, getSubmissionsInputModel, getSubmissionsOutputModel, listFormOutputModel, reorderFieldsInputModel, reorderFieldsOutputModel, submitFormInputModel, submitFormOutputModel, updateFieldInputModel, updateFieldOutputModel } from "./model";
import { z } from "zod";
const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
    createForm: authenticatedProcedure.meta({
        openapi:{
            method:"POST",
            path: getPath("/createForm"),
            tags:TAGS,
            protect:true
        }
    }).input(createFormInputModel).output(createFormOutputModel).mutation(async ({input,ctx}) => {
        const {title, description} = input;

        const {id} = await formService.createForm({title, description, createdBy: ctx.user.id});
        return {id}
    }),

    listForms: authenticatedProcedure.meta({
        openapi:{
            method:"GET",
            path: getPath("/listForms"),
            tags:TAGS,
            protect:true
        }
    }).input(z.undefined()).output(listFormOutputModel).query(async ({ctx}) => {
        const forms = await formService.listFormsByUserId({userId: ctx.user.id});
        return forms.map(form => ({
            id: form.id,
            title: form.title,
            description: form.description ?? "",
            createdBy: form.createdBy ?? "",
            createdAt: form.createdAt ?? new Date(),
            updatedAt: form.updatedAt ?? new Date()
        }));
    }),

    createField: authenticatedProcedure.meta({
        openapi:{
            method:"POST",
            path: getPath("/createField"),
            tags:TAGS,
            protect:true
        }
    }).input(createFieldInputModel).output(createFieldOutputModel).mutation(async ({input}) => {

        const {id, labelKey, index} = await formFieldService.createField(input);
        return {id, labelKey, index}
    }),

    updateField: authenticatedProcedure.meta({
        openapi:{
            method:"PUT",
            path: getPath("/updateField"),
            tags:TAGS,
            protect:true
        }
    }).input(updateFieldInputModel).output(updateFieldOutputModel).mutation(async ({input}) => {
        const result = await formFieldService.updateField(input);
        return result;
    }),

    deleteField: authenticatedProcedure.meta({
        openapi:{
            method:"DELETE",
            path: getPath("/deleteField"),
            tags:TAGS,
            protect:true
        }
    }).input(deleteFieldInputModel).output(deleteFieldOutputModel).mutation(async ({input}) => {
        const {id} = await formFieldService.deleteField(input);
        return {id};
    }),

    getFields: authenticatedProcedure.meta({
        openapi:{
            method:"GET",
            path: getPath("/getFields"),
            tags:TAGS,
            protect:true
        }
    }).input(getFieldsInputModel).output(getFieldsOutputModel).query(async ({input}) => {
        const fields = await formFieldService.getFieldsByFormId(input);
        return fields;
    }),

    getFormById: publicProcedure.meta({
        openapi:{
            method:"GET",
            path: getPath("/getFormById"),
            tags:TAGS,
            protect:false
        }
    }).input(getFormByIdInputModel).output(getFormByIdOutputModel).query(async ({input}) => {
        const form = await formService.getFormById(input);
        return {
            id: form.id,
            title: form.title,
            description: form.description ?? null,
            fields: form.fields,
            createdAt: form.createdAt ?? null,
            updatedAt: form.updatedAt ?? null
        };
    }),

    submitForm: publicProcedure.meta({
        openapi:{
            method:"POST",
            path: getPath("/submitForm"),
            tags:TAGS,
            protect:false
        }
    }).input(submitFormInputModel).output(submitFormOutputModel).mutation(async ({input}) => {
        const {id} = await formSubmissionService.submitForm(input);
        return {id};
    }),

    getSubmissions: authenticatedProcedure.meta({
        openapi:{
            method:"GET",
            path: getPath("/getSubmissions"),
            tags:TAGS,
            protect:true
        }
    }).input(getSubmissionsInputModel).output(getSubmissionsOutputModel).query(async ({input}) => {
        const submissions = await formSubmissionService.getSubmissionsByFormId(input);
        return submissions;
    }),

    reorderFields: authenticatedProcedure.meta({
        openapi:{
            method:"PUT",
            path: getPath("/reorderFields"),
            tags:TAGS,
            protect:true
        }
    }).input(reorderFieldsInputModel).output(reorderFieldsOutputModel).mutation(async ({input}) => {
        return await formFieldService.reorderFields(input);
    }),
})
