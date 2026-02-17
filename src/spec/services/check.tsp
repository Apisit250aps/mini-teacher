using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.ChecksApi;

@route("/check")
@tag("Check")
interface Check {
  /** Create a check date */
  @post create(@body body: CreateCheckDateBody): ApiResponse<CheckDate>;

  /** Update a check date */
  @route("{checkDateId}")
  @put
  update(
    @path checkDateId: string,
    @body body: UpdateCheckDateBody,
  ): ApiResponse<CheckDate>;

  /** Delete a check date */
  @route("{checkDateId}")
  @delete
  delete(@path checkDateId: string): ApiResponse<EmptyData>;

  /** Get check dates by class id */
  @get listByClassId(@query classId: string): ApiResponse<CheckDate[]>;
}
