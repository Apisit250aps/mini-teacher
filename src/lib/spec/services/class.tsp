using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.ClassesApi;

@route("/class")
@tag("Classes")
interface Classes {
  @post create(@body body: ClassCreateBody): ApiResponse<ClassData> | ApiError;

  @route("{id}")
  @get
  getById(@path id: string): ApiResponse<ClassWithDetails> | ApiError;

  #suppress "@typespec/http/patch-implicit-optional" ""
  @route("{id}")
  @patch
  update(
    @path id: string,
    @body body: ClassUpdateBody,
  ): ApiResponse<ClassData> | ApiError;

  @route("{id}")
  @delete
  delete(@path id: string): ApiResponse<EmptyData> | ApiError;

  @route("by-year/{yearId}")
  @get
  getByYearId(
    @path yearId: string,
    @query filter?: string,
  ): ApiResponse<ClassWithMembers[]> | ApiError;

  @route("by-year/{yearId}/{classId}")
  @get
  getByYearAndClassId(
    @path yearId: string,
    @path classId: string,
  ): ApiResponse<ClassWithDetails> | ApiError;
}

@route("/class-member")
@tag("Class Members")
interface ClassMembers {
  @post create(
    @body body: ClassMemberCreateBody,
  ): ApiResponse<ClassMemberData> | ApiError;

  @delete delete(
    @body body: ClassMemberDeleteBody,
  ): ApiResponse<EmptyData> | ApiError;

  @route("by-class/{classId}")
  @get
  getByClassId(
    @path classId: string,
    @query filter?: string,
  ): ApiResponse<ClassMemberWithStudent[]> | ApiError;
}
