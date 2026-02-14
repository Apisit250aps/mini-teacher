using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.ClassesApi;

@route("/year/{yearId}")
@tag("Classes")
interface Classes {
  /** List classes in a year */
  @route("/class")
  @get list(@path yearId: string): ApiResponse<Class[]>;

  /** Create a class */
  @route("/class")
  @post create(
    @path yearId: string,
    @body body: CreateClassBody,
  ): ApiResponse<Class>;

  /** Update a class */
  @route("/class/{classId}")
  @put
  update(
    @path yearId: string,
    @path classId: string,
    @body body: UpdateClassBody,
  ): ApiResponse<Class>;

  /** Delete a class */
  @route("/class/{classId}")
  @delete
  delete(@path yearId: string, @path classId: string): ApiResponse<EmptyData>;

  @route("/class/{classId}")
  @get
  getById(@path yearId: string, @path classId: string): ApiResponse<Class>;
}
