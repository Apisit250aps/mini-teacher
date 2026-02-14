import "@typespec/http";
import "@typespec/rest";
import "./models/common.tsp";
import "./models/year.tsp";
import "./models/class.tsp";
import "./services/year.tsp";
import "./services/class.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{ title: "Mini Teacher Service" })
namespace MiniTeacherService;
