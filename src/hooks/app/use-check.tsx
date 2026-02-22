'use client'

import { useGetClassCheckDates } from '../queries/use-check'
import { useGetClassMembers } from '../queries/use-class'

export function useStudentCheck() {
  const checkDateQuery = useGetClassCheckDates()
  const classMembersQuery = useGetClassMembers()
  const isLoading = checkDateQuery.isPending || classMembersQuery.isPending
  return {
    checkDates: checkDateQuery.data ?? [],
    classMembers: classMembersQuery.data ?? [],
    isLoading,
  }
}
