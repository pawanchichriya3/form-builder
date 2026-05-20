import { createFormInput, CreateFormInputType, listFormsByUserIdInput, ListFormsByUserIdInputType } from "./model";
import {db, eq} from "@repo/database"
import {formsTable} from "@repo/database/models/form"

class FormService {
    public async createForm(payload: CreateFormInputType) {
        const {title, description, createdBy} = await createFormInput.parseAsync(payload);

        const result = await db.insert(formsTable).values({title, description, createdBy}).returning({
            id: formsTable.id
        });

        if(!result || result.length ===0 || !result[0]?.id) throw new Error('Something went wrong while creating the form');
        
        return {id: result[0].id}
    }

    public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
        const {userId} = await listFormsByUserIdInput.parseAsync(payload);

        const forms = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            createdBy: formsTable.createdBy,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt
        }).from(formsTable).where(eq(formsTable.createdBy, userId));

        return forms;
}
}

export default FormService