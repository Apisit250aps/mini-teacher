using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.YearsApi;

@route("/year")
@tag("Years")
interface Years {
  /** List years */
  @get list(): ApiResponse<Year[]>;

  /** Create a year */
  @post create(@body body: CreateYearBody): ApiResponse<Year>;

  /** Update a year */
  @put update(
    @path yearId: string,
    @body body: UpdateYearBody,
  ): ApiResponse<Year>;

  /** Set active year */
  @patch setActive(@path yearId: string): ApiResponse<EmptyData>;

  /** Delete a year */
  @delete delete(@path yearId: string): ApiResponse<EmptyData>;
}
