import {formFieldsTable} from "@repo/database/models/form-field";
import {createFieldInput, CreateFieldInputType, deleteFieldInput, DeleteFieldInputType, getFieldsInput, GetFieldsInputType, updateFieldInput, UpdateFieldInputType} from "./model";
import { eq, db, max} from "@repo/database";

function toLabelKey(label: string): string {
    return label.toLocaleLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
}

class FormFieldService {
    
    private async getNextIndex(formId: string) {
        const result = await db.select({maxIndex: max(formFieldsTable.index)}).from(formFieldsTable).where(eq(formFieldsTable.formId, formId));
        const maxIndex = Number(result[0]?.maxIndex ?? 0);
        const next = maxIndex + 1;
        return next.toFixed(2);
    }

    public async createField(payload: CreateFieldInputType) {
        const {formId, label, type, isRequired, description, placeholder} = createFieldInput.parse(payload);
        const labelKey = toLabelKey(label);
        const index = await this.getNextIndex(formId);
        const result = await db.insert(formFieldsTable).values({formId, label, labelKey, type, isRequired, description, placeholder, index}).returning();
        if (!result || result.length === 0) throw new Error("Failed to create field");
        const created = result[0];
        if (!created) throw new Error("Failed to create field");
        return {id: created.id, labelKey, index};
    }

    public async updateField(payload: UpdateFieldInputType) {
        const {fieldId, label, type, isRequired, description, placeholder} = updateFieldInput.parse(payload);
        const fieldToUpdate: Partial<{label: string, labelKey: string, type: string, isRequired: boolean, description: string, placeholder: string}> = {};
        if (label !== undefined) {
            fieldToUpdate.label = label;
            fieldToUpdate.labelKey = toLabelKey(label);
        }
        if (type !== undefined) fieldToUpdate.type = type;
        if (isRequired !== undefined) fieldToUpdate.isRequired = isRequired;
        if (description !== undefined) fieldToUpdate.description = description;
        if (placeholder !== undefined) fieldToUpdate.placeholder = placeholder;

        // drizzle's generated types are stricter than our partial payload; cast to any
        const result = await db.update(formFieldsTable).set(fieldToUpdate as any).where(eq(formFieldsTable.id, fieldId)).returning();
        if (!result || result.length === 0) throw new Error("Failed to update field");
        const updated = result[0];
        if (!updated) throw new Error("Failed to update field");
        return updated;
    }

    public async deleteField(payload: DeleteFieldInputType) {
        const {fieldId} = deleteFieldInput.parse(payload);
        const result = await db.delete(formFieldsTable).where(eq(formFieldsTable.id, fieldId)).returning();
        if (!result || result.length === 0) throw new Error("Failed to delete field");
        const deleted = result[0];
        if (!deleted) throw new Error("Failed to delete field");
        return {id: deleted.id};
    }

    public async getFieldsByFormId(payload: GetFieldsInputType) {
        const {formId} = getFieldsInput.parse(payload);
        const result = await db.select().from(formFieldsTable).where(eq(formFieldsTable.formId, formId));
        return result;
    }

}

export default FormFieldService;