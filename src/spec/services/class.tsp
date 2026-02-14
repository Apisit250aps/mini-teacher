using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.ClassesApi;

@route("/class")
@tag("Classes")
interface Classes {
  /** List classes in a year */
  @get list(@query yearId: string): ApiResponse<Class[]>;

  /** Create a class */
  @post create(@body body: CreateClassBody): ApiResponse<Class>;

  /** Update a class */
  @route("{classId}")
  @put
  update(
    @path classId: string,
    @body body: UpdateClassBody,
  ): ApiResponse<Class>;

  /** Delete a class */
  @route("{classId}")
  @delete
  delete(@path classId: string): ApiResponse<EmptyData>;

  @route("{classId}")
  @get
  getById(@path classId: string): ApiResponse<Class>;
}
