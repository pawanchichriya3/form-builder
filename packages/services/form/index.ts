import { createFormInput, CreateFormInputType, getFormByIdInput, GetFormByIdInputType, listFormsByUserIdInput, ListFormsByUserIdInputType } from "./model";
import {db, eq, asc} from "@repo/database"
import {formsTable} from "@repo/database/models/form"
import {formFieldsTable} from "@repo/database/models/form-field"

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

    public async getFormById(payload: GetFormByIdInputType) {
        const {formId} = await getFormByIdInput.parseAsync(payload);

        const rows = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,
                field: {
                    id: formFieldsTable.id,
                    formId: formFieldsTable.formId,
                    label: formFieldsTable.label,
                    labelKey: formFieldsTable.labelKey,
                    description: formFieldsTable.description,
                    placeholder: formFieldsTable.placeholder,
                    isRequired: formFieldsTable.isRequired,
                    index: formFieldsTable.index,
                    type: formFieldsTable.type,
                    createdAt: formFieldsTable.createdAt,
                    updatedAt: formFieldsTable.updatedAt,
                },
            })
            .from(formsTable)
            .leftJoin(formFieldsTable, eq(formsTable.id, formFieldsTable.formId))
            .where(eq(formsTable.id, formId))
            .orderBy(asc(formFieldsTable.index));

        if (!rows || rows.length === 0) throw new Error('Form not found');

        const first = rows[0]!;
        const fields = rows
            .filter((r) => r.field?.id != null)
            .map((r) => ({
                ...r.field!,
                index: Number(r.field!.index),
                isRequired: r.field!.isRequired ?? false,
            }));

        return {
            id: first.id,
            title: first.title,
            description: first.description,
            createdAt: first.createdAt,
            updatedAt: first.updatedAt,
            fields,
        };
    }
}

export default FormService