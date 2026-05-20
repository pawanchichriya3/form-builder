import { formService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFormInputModel, createFormOutputModel, listFormOutputModel } from "./model";
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
    })
})
