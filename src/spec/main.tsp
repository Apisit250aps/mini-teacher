import "@typespec/http";
import "@typespec/rest";
// models
import "./models/common.tsp";
// entities
import "./models/year.tsp";
import "./models/class.tsp";
import "./models/student.tsp";
import "./models/check.tsp";
import "./models/score.tsp";
// services
import "./services/year.tsp";
import "./services/class.tsp";
import "./services/student.tsp";
import "./services/check.tsp";
import "./services/score.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{ title: "Mini Teacher Service" })
namespace MiniTeacherService;
