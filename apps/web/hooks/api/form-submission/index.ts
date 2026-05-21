import {trpc} from "~/trpc/client";

export const useSubmitForm = () => {
    const {
        mutateAsync: submitFormAsync,
        mutate: submitForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.form.submitForm.useMutation()

    return {
        submitFormAsync,
        submitForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useGetSubmissions = (formId: string) => {
    const {data: submissions, error, isError, isLoading} = trpc.form.getSubmissions.useQuery({formId}, {enabled: !!formId})
    return {
        submissions,
        error,
        isError,
        isLoading,
    }
}
