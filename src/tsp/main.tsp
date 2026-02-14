import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{ title: "Mini Teacher Service" })
namespace MiniTeacherService;

model ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

model Year {
  id: string;
  user: string;
  year: int32;
  term: int32;
  isActive: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model CreateYearBody {
  year: int32;
  term: int32;
  isActive?: boolean;
}

model UpdateYearBody {
  user?: string;
  year?: int32;
  term?: int32;
  isActive?: boolean;
  updatedAt?: utcDateTime;
}

model EmptyData {}

namespace YearsApi {
  @route("/year")
  @tag("Years")
  interface Years {
    /** List years */
    @get list(): ApiResponse<Year[]>;

    /** Create a year */
    @post create(@body body: CreateYearBody): ApiResponse<Year>;

    /** Update a year */
    @put update(
      @path yearId: string,
      @body body: UpdateYearBody,
    ): ApiResponse<Year>;

    /** Set active year */
    @patch setActive(@path yearId: string): ApiResponse<EmptyData>;

    /** Delete a year */
    @delete delete(@path yearId: string): ApiResponse<EmptyData>;
  }
}

model Class {
  id: string;
  year: string;
  name: string;
  subject: string;
  isActive: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model CreateClassBody {
  year: string;
  name: string;
  subject: string;
  isActive?: boolean;
}

model UpdateClassBody {
  year?: string;
  name?: string;
  subject?: string;
  isActive?: boolean;
  updatedAt?: utcDateTime;
}

namespace ClassesApi {
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
    @route("/year/{yearId}/class/{classId}")
    @put
    update(
      @path yearId: string,
      @path classId: string,
      @body body: UpdateClassBody,
    ): ApiResponse<Class>;

    /** Delete a class */
    @route("/year/{yearId}/class/{classId}")
    @delete
    delete(@path yearId: string, @path classId: string): ApiResponse<EmptyData>;

    @route("/year/{yearId}/class/{classId}")
    @get
    getById(@path yearId: string, @path classId: string): ApiResponse<Class>;
  }
}
