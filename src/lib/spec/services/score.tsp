using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.ScoreApi;

@route("/score-assign")
@tag("Score Assigns")
interface ScoreAssigns {
  @post create(
    @body body: ScoreAssignCreateBody,
  ): ApiResponse<ScoreAssignData> | ApiError;

  #suppress "@typespec/http/patch-implicit-optional" ""
  @route("{id}")
  @patch
  update(
    @path id: string,
    @body body: ScoreAssignUpdateBody,
  ): ApiResponse<ScoreAssignData> | ApiError;

  @route("{id}")
  @delete
  delete(@path id: string): ApiResponse<EmptyData> | ApiError;

  @route("by-class/{classId}")
  @get
  getByClassId(
    @path classId: string,
    @query filter?: string,
  ): ApiResponse<ScoreAssignWithScores[]> | ApiError;

  @route("by-class/{classId}/{assignId}")
  @get
  getById(
    @path classId: string,
    @path assignId: string,
  ): ApiResponse<ScoreAssignWithScores> | ApiError;
}

@route("/score-student")
@tag("Score Students")
interface ScoreStudents {
  @post create(
    @body body: ScoreStudentCreateBody,
  ): ApiResponse<ScoreStudentData> | ApiError;

  #suppress "@typespec/http/patch-implicit-optional" ""
  @route("{id}")
  @patch
  update(
    @path id: string,
    @body body: ScoreStudentUpdateBody,
  ): ApiResponse<ScoreStudentData> | ApiError;

  @route("{id}")
  @delete
  delete(@path id: string): ApiResponse<EmptyData> | ApiError;

  @route("unique")
  @get
  getUnique(
    @query assignmentId: string,
    @query studentId: string,
  ): ApiResponse<ScoreStudentData | null> | ApiError;

  @route("by-assignment/{assignmentId}")
  @get
  getByAssignmentId(
    @path assignmentId: string,
    @query filter?: string,
  ): ApiResponse<ScoreStudentWithStudent[]> | ApiError;
}
