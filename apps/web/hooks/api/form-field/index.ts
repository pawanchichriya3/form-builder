import {trpc} from "~/trpc/client";

export const useCreateField = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createFieldAsync,
        mutate: createField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.form.createField.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    })

    return {
        createFieldAsync,
        createField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useUpdateField = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: updateFieldAsync,
        mutate: updateField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.form.updateField.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    })

    return {
        updateFieldAsync,
        updateField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useDeleteField = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: deleteFieldAsync,
        mutate: deleteField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.form.deleteField.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    })

    return {
        deleteFieldAsync,
        deleteField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useGetFields = (formId: string) => {
    const {data: fields, error, isError, isLoading} = trpc.form.getFields.useQuery({formId})
    return {
        fields,
        error,
        isError,
        isLoading,
    }
}
