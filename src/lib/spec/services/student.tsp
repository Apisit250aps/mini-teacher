using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.StudentsApi;

@route("/student")
@tag("Students")
interface Students {
  /** List students in a class */
  @get list(): ApiResponse<Student[]> | ApiError;

  /** Create a student */
  @post create(@body body: CreateStudentBody): ApiResponse<Student> | ApiError;

  /** Update a student */
  @route("{studentId}")
  @put
  update(
    @path studentId: string,
    @body body: UpdateStudentBody,
  ): ApiResponse<Student> | ApiError;

  /** Delete a student */
  @route("{studentId}")
  @delete
  delete(@path studentId: string): ApiResponse<EmptyData> | ApiError;

  @route("{studentId}")
  @get
  getById(@path studentId: string): ApiResponse<Student> | ApiError;

  
}
