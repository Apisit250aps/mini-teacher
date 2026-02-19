using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.ScoresApi;

@route("/year/{yearId}/class/{classId}/score")
@tag("Scores")
interface Scores {
  /** List score assignments in a class */
  @get list(
    @path yearId: string,
    @path classId: string,
  ): ApiResponse<ScoreAssignDetail[]> | ApiError;

  /** Create a score assignment */
  @post create(
    @path yearId: string,
    @path classId: string,
    @body body: CreateScoreAssignBody,
  ): ApiResponse<ScoreAssign> | ApiError;

  /** Update a score assignment */
  @route("{scoreAssignId}")
  @put
  update(
    @path yearId: string,
    @path classId: string,
    @path scoreAssignId: string,
    @body body: UpdateScoreAssignBody,
  ): ApiResponse<ScoreAssign> | ApiError;

  /** Delete a score assignment */
  @route("{scoreAssignId}")
  @delete
  delete(
    @path yearId: string,
    @path classId: string,
    @path scoreAssignId: string,
  ): ApiResponse<EmptyData> | ApiError;

  /** Get a score assignment by id */
  @route("{scoreAssignId}")
  @get
  getById(
    @path yearId: string,
    @path classId: string,
    @path scoreAssignId: string,
  ): ApiResponse<ScoreAssignDetail> | ApiError;
}
