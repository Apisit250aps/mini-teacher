using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.UsersApi;

@route("/user")
@tag("Users")
interface Users {
  @post create(@body body: UserCreateBody): ApiResponse<UserData> | ApiError;

  @route("{id}")
  @get
  getById(@path id: string): ApiResponse<UserWithYears> | ApiError;

  #suppress "@typespec/http/patch-implicit-optional" ""
  @route("{id}")
  @patch
  update(
    @path id: string,
    @body body: UserUpdateBody,
  ): ApiResponse<UserData> | ApiError;

  @route("{id}")
  @delete
  delete(@path id: string): ApiResponse<EmptyData> | ApiError;

  @route("by-email")
  @get
  getByEmail(@query email: string): ApiResponse<UserWithYears> | ApiError;
}
