import "@typespec/http";
import "@typespec/rest";
// models
import "./models/common.tsp";
// prisma
import "./models/prisma-models.tsp";
// entities
import "./models/user.tsp";
import "./models/year.tsp";
import "./models/class.tsp";
import "./models/student.tsp";
import "./models/check.tsp";
import "./models/score.tsp";
import "./models/document.tsp";
// services
import "./services/admin.tsp";
import "./services/user.tsp";
import "./services/year.tsp";
import "./services/class.tsp";
import "./services/student.tsp";
import "./services/check.tsp";
import "./services/score.tsp";
import "./services/document.tsp";

@service(#{ title: "Mini Teacher Service" })
namespace MiniTeacherService;
