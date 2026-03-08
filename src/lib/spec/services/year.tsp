using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.YearsApi;

@route("/year")
@tag("Years")
interface Years {
  @get list(@query filter?: string): ApiResponse<YearWithClasses[]> | ApiError;

  @post create(@body body: YearCreateBody): ApiResponse<YearData> | ApiError;

  @route("{id}")
  @get
  getById(@path id: string): ApiResponse<YearWithOwnerAndClasses> | ApiError;

  #suppress "@typespec/http/patch-implicit-optional" ""
  @route("{id}")
  @patch
  update(
    @path id: string,
    @body body: YearUpdateBody,
  ): ApiResponse<YearData> | ApiError;

  @route("{id}")
  @delete
  delete(@path id: string): ApiResponse<EmptyData> | ApiError;

  @route("active")
  @get
  getActiveByUser(
    @query userId: string,
  ): ApiResponse<YearData | null> | ApiError;

  #suppress "@typespec/http/patch-implicit-optional" ""
  @route("active")
  @patch
  setActive(@body body: SetActiveYearBody): ApiResponse<EmptyData> | ApiError;

  @route("unique")
  @get
  getUnique(
    @query userId: string,
    @query year: int32,
    @query term: int32,
  ): ApiResponse<YearData | null> | ApiError;
}
