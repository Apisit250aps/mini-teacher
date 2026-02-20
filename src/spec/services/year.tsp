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

  /** Get a year by id */
  @route("{yearId}")
  @get getById(@path yearId: string): ApiResponse<Year> | ApiError;

  /** Get classes in a year */
  @route("{yearId}/class")
  @get getClasses(@path yearId: string): ApiResponse<Class[]> | ApiError;
}
