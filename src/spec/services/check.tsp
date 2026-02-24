using TypeSpec.Http;

namespace MiniTeacherService.ChecksApi;

@route("class/{classId}/check")
@tag("Check")
interface Check {
  /** Create a check date */
  @post create(
    @path classId: string,
    @body body: CheckDateCreate,
  ): ApiResponse<CheckDate> | ApiError;

  /** Update a check date */
  @route("{checkDateId}")
  @put
  update(
    @path classId: string,
    @path checkDateId: string,
    @body body: CheckDateUpdate,
  ): ApiResponse<CheckDate> | ApiError;

  /** Delete a check date */
  @route("{checkDateId}")
  @delete
  delete(
    @path classId: string,
    @path checkDateId: string,
  ): ApiResponse<EmptyData> | ApiError;

  /** Get check dates by class id */
  @get listByClassId(
    @path classId: string,
  ): ApiResponse<CheckDateDetail[]> | ApiError;

  /** Update a check student */
  @route("{checkDateId}/student")
  @put
  checkStudent(
    @path classId: string,
    @path checkDateId: string,
    @body body: CheckStudentCreate,
  ): ApiResponse<CheckStudent> | ApiError;
}
