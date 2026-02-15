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
  @route("{classId}")
  @put
  update(
    @path yearId: string,
    @path classId: string,
    @body body: UpdateClassBody,
  ): ApiResponse<Class>;

  /** Delete a class */
  @route("{classId}")
  @delete
  delete(@path yearId: string, @path classId: string): ApiResponse<EmptyData>;

  @route("{classId}")
  @get
  getById(@path yearId: string, @path classId: string): ApiResponse<Class>;

  @route("{classId}/member")
  @put
  addOrRemoveMember(
    @path yearId: string,
    @path classId: string,
    @body body: PatchClassMemberBody,
  ): ApiResponse<EmptyData>;

  @route("{classId}/member")
  @post
  addMember(
    @path yearId: string,
    @path classId: string,
    @body body: CreateStudentBody,
  ): ApiResponse<EmptyData>;

  @route("{classId}/member")
  @get
  getMembers(
    @path yearId: string,
    @path classId: string,
  ): ApiResponse<ClassMemberDetail[]>;
}
