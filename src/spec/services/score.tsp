using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.ScoresApi;

@route("class/{classId}/score")
@tag("Scores")
interface Scores {
  /** List score assignments in a class */
  @get list(@path classId: string): ApiResponse<ScoreAssignDetail[]> | ApiError;

  /** Create a score assignment */
  @post create(
    @path classId: string,
    @body body: CreateScoreAssign,
  ): ApiResponse<ScoreAssign> | ApiError;

  /** Update a score assignment */
  @route("{scoreAssignId}")
  @put
  update(
    @path classId: string,
    @path scoreAssignId: string,
    @body body: UpdateScoreAssign,
  ): ApiResponse<ScoreAssign> | ApiError;

  /** Delete a score assignment */
  @route("{scoreAssignId}")
  @delete
  delete(
    @path classId: string,
    @path scoreAssignId: string,
  ): ApiResponse<EmptyData> | ApiError;

  /** Get a score assignment by id */
  @route("{scoreAssignId}")
  @get
  getById(
    @path classId: string,
    @path scoreAssignId: string,
  ): ApiResponse<ScoreAssignDetail> | ApiError;

  /** Create or update a score for a student */
  @route("{scoreAssignId}/student")
  @put
  upsertScoreStudent(
    @path classId: string,
    @path scoreAssignId: string,
    @body body: CreateScoreStudent | UpdateScoreStudent,
  ): ApiResponse<ScoreStudent> | ApiError;
}
