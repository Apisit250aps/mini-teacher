using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.ClassesApi;

@route("/year/{yearId}/class")
@tag("Classes")
interface Classes {
  /** List classes in a year */
  @get list(@path yearId: string): ApiResponse<Class[]>;

  /** Create a class */
  @post create(
    @path yearId: string,
    @body body: CreateClassBody,
  ): ApiResponse<Class>;

  /** Update a class */
  @route("/year/{yearId}/class/{classId}")
  @put
  update(
    @path yearId: string,
    @path classId: string,
    @body body: UpdateClassBody,
  ): ApiResponse<Class>;

  /** Delete a class */
  @route("/year/{yearId}/class/{classId}")
  @delete
  delete(@path yearId: string, @path classId: string): ApiResponse<EmptyData>;

  @route("/year/{yearId}/class/{classId}")
  @get
  getById(@path yearId: string, @path classId: string): ApiResponse<Class>;
}
