import { useActionState } from 'react'

/**
 * StateFull Form的Action
 */
export type ActionResponse<T = null> = {
  error?: Error
  data?: T
}

/**
 * 封装了自动转换Error为ActionResponse的useActionStateFull
 * @param action
 * @returns
 */
export function useActionStateFull<T>(
  action: (formData: FormData) => Promise<T>,
  permalink?: string,
) {
  return useActionState(
    async (_pre: ActionResponse<T>, formData: FormData) => {
      try {
        const data = await action(formData)
        return { data }
      } catch (error) {
        return {
          error: error as Error,
        }
      }
    },
    {} as ActionResponse<T>,
    permalink,
  )
}
