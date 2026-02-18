using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.YearsApi;

@route("/year")
@tag("Years")
interface Years {
  /** List years */
  @get list(): ApiResponse<Year[]> | ApiError;

  /** Create a year */
  @post create(@body body: CreateYearBody): ApiResponse<Year> | ApiError;

  /** Update a year */
  @put update(
    @path yearId: string,
    @body body: UpdateYearBody,
  ): ApiResponse<Year> | ApiError;

  /** Set active year */
  @patch setActive(@path yearId: string): ApiResponse<EmptyData> | ApiError;

  /** Delete a year */
  @delete delete(@path yearId: string): ApiResponse<EmptyData> | ApiError;
}
