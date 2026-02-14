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
  term: string;
  isActive: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model AnalyzeResult {
  id: string;
  analysis: string;
}

model EmptyData {}

@route("/api")
namespace YearsApi {
  @route("/year")
  @tag("Years")
  interface Years {
    /** List years */
    @get list(): ApiResponse<Year[]>;

    /** Read year */
    @get read(@path id: string): ApiResponse<Year>;

    /** Create a year */
    @post create(@body body: Year): ApiResponse<Year>;

    /** Update a year */
    @patch update(
      @path id: string,
      @body body: MergePatchUpdate<Year>,
    ): ApiResponse<Year>;

    /** Delete a year */
    @delete delete(@path id: string): ApiResponse<EmptyData>;

    /** Analyze a year */
    @route("{id}/analyze")
    @post
    analyze(@path id: string): ApiResponse<AnalyzeResult>;
  }
}
