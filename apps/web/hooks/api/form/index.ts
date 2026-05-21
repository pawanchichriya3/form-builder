import {trpc} from "~/trpc/client";

export const useCreateForm = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    })

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useListForms = () => {
    const {data: forms, error, isError, isLoading} = trpc.form.listForms.useQuery()
    return {
        forms,
        error,
        isError,
        isLoading,
        status
    }
}

export const useGetFormById = (formId: string) => {
    const {data: form, error, isError, isLoading} = trpc.form.getFormById.useQuery({formId}, {enabled: !!formId})
    return {
        form,
        error,
        isError,
        isLoading,
    }
}