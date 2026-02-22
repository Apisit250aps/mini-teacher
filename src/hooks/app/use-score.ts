import { useGetClassMembers } from '../queries/use-class'
import { useGetScoreAssigns, useScoreQueries } from '../queries/use-score'

export const useStudentScore = () => {
  
  const scoreAssignQuery = useGetScoreAssigns()
  const classMembersQuery = useGetClassMembers()
  const isLoading = scoreAssignQuery.isPending || classMembersQuery.isPending
  return {
    scoreStudent: scoreAssignQuery,
    classMembers: classMembersQuery.data,
    isLoading,
  }
}
