import { formSubmissionTable } from "@repo/database/models/form-submission";
import { submitFormInput, SubmitFormInputType, getSubmissionsInput, GetSubmissionsInputType } from "./model";
import { eq, db, desc } from "@repo/database";

class FormSubmissionService {
    public async submitForm(payload: SubmitFormInputType) {
        const { formId, values } = submitFormInput.parse(payload);

        const result = await db
            .insert(formSubmissionTable)
            .values({ formId, value: values })
            .returning({ id: formSubmissionTable.id });

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error("Failed to submit form");

        return { id: result[0].id };
    }

    public async getSubmissionsByFormId(payload: GetSubmissionsInputType) {
        const { formId } = getSubmissionsInput.parse(payload);

        const result = await db
            .select()
            .from(formSubmissionTable)
            .where(eq(formSubmissionTable.formId, formId))
            .orderBy(desc(formSubmissionTable.createdAt));

        return result;
    }
}

export default FormSubmissionService;
