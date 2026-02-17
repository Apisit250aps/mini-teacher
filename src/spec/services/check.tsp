using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.ChecksApi;

@route("/year/{yearId}/class/{classId}/check")
@tag("Check")
interface Check {
  /** Create a check date */
  @post create(
    @path yearId: string,
    @path classId: string,
    @body body: CreateCheckDateBody,
  ): ApiResponse<CheckDate>;

  /** Update a check date */
  @route("{checkDateId}")
  @put
  update(
    @path yearId: string,
    @path classId: string,
    @path checkDateId: string,
    @body body: UpdateCheckDateBody,
  ): ApiResponse<CheckDate>;

  /** Delete a check date */
  @route("{checkDateId}")
  @delete
  delete(
    @path yearId: string,
    @path classId: string,
    @path checkDateId: string,
  ): ApiResponse<EmptyData>;

  /** Get check dates by class id */
  @get listByClassId(
    @path yearId: string,
    @path classId: string,
  ): ApiResponse<CheckDate[]>;
}
