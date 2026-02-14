import "@typespec/http";
import "@typespec/rest";
// models
import "./models/common.tsp";
// entities
import "./models/year.tsp";
import "./models/class.tsp";
import "./models/student.tsp";
// services
import "./services/year.tsp";
import "./services/class.tsp";
import "./services/student.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{ title: "Mini Teacher Service" })
namespace MiniTeacherService;
