using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.StudentsApi;

@route("/student")
@tag("Students")
interface Students {
  @post create(
    @body body: StudentCreateBody,
  ): ApiResponse<StudentData> | ApiError;

  @route("{id}")
  @get
  getById(@path id: string): ApiResponse<StudentWithRelations> | ApiError;

  #suppress "@typespec/http/patch-implicit-optional" ""
  @route("{id}")
  @patch
  update(
    @path id: string,
    @body body: StudentUpdateBody,
  ): ApiResponse<StudentData> | ApiError;

  @route("{id}")
  @delete
  delete(@path id: string): ApiResponse<EmptyData> | ApiError;

  @route("by-teacher/{teacherId}")
  @get
  getAllByTeacher(
    @path teacherId: string,
    @query filter?: string,
  ): ApiResponse<StudentData[]> | ApiError;
}
