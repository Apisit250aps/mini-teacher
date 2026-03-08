using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.CheckApi;

@route("/check-date")
@tag("Check Dates")
interface CheckDates {
  @post create(
    @body body: CheckDateCreateBody,
  ): ApiResponse<CheckDateData> | ApiError;

  @route("{id}")
  @get
  getById(@path id: string): ApiResponse<CheckDateWithStudents> | ApiError;

  #suppress "@typespec/http/patch-implicit-optional" ""
  @route("{id}")
  @patch
  update(
    @path id: string,
    @body body: CheckDateUpdateBody,
  ): ApiResponse<CheckDateData> | ApiError;

  @route("{id}")
  @delete
  delete(@path id: string): ApiResponse<EmptyData> | ApiError;

  @route("by-class/{classId}")
  @get
  getByClassId(
    @path classId: string,
    @query filter?: string,
  ): ApiResponse<CheckDateWithStudents[]> | ApiError;
}

@route("/check-student")
@tag("Check Students")
interface CheckStudents {
  @post create(
    @body body: CheckStudentCreateBody,
  ): ApiResponse<CheckStudentData> | ApiError;

  @route("{id}")
  @get
  getById(@path id: string): ApiResponse<CheckStudentWithRelations> | ApiError;

  #suppress "@typespec/http/patch-implicit-optional" ""
  @route("{id}")
  @patch
  update(
    @path id: string,
    @body body: CheckStudentUpdateBody,
  ): ApiResponse<CheckStudentData> | ApiError;

  @route("{id}")
  @delete
  delete(@path id: string): ApiResponse<EmptyData> | ApiError;

  @route("unique")
  @get
  getUnique(
    @query checkDateId: string,
    @query studentId: string,
  ): ApiResponse<CheckStudentWithRelations | null> | ApiError;

  @route("by-check-date/{checkDateId}")
  @get
  getByCheckDateId(
    @path checkDateId: string,
    @query filter?: string,
  ): ApiResponse<CheckStudentWithRelations[]> | ApiError;
}
