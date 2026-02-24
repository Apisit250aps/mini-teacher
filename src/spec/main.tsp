import "@typespec/http";
import "@typespec/rest";
// models
import "./models/common.tsp";
// generated domain models (one-time prepared; manually enable when needed)
import "./models/user.tsp";
import "./models/years.tsp";
import "./models/classes.tsp";
import "./models/students.tsp";
import "./models/class-members.tsp";
import "./models/check-dates.tsp";
import "./models/check-students.tsp";
import "./models/score-assigns.tsp";
import "./models/score-students.tsp";
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
