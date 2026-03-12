using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.AdminApi;

@route("/admin")
@tag("Admin")
interface Admin {
  @route("users")
  @get
  listUsers(): ApiResponse<UserData[]> | ApiError;
}
