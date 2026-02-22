import { useGetClassMembers } from '../queries/use-class'
import { useGetScoreAssigns, useScoreQueries } from '../queries/use-score'

export const useStudentScore = () => {
  const scoreQueries = useScoreQueries()
  const scoreAssignQuery = useGetScoreAssigns()
  const classMembersQuery = useGetClassMembers()
  const isLoading = scoreAssignQuery.isPending || classMembersQuery.isPending
  return {
    scoreAssigns: scoreAssignQuery.data,
    scoreStudent: scoreQueries.scoreStudent,
    classMembers: classMembersQuery.data,
    isLoading,
  }
}
