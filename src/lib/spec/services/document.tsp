using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService.DocumentsApi;

@route("/document")
@tag("Documents")
interface Documents {
  @get list(@query filter?: string): ApiResponse<DocumentData[]> | ApiError;

  @get
  @route("latest")
  getLatestByType(
    @query latestType: PrismaModels.DocumentType,
  ): ApiResponse<DocumentData | null> | ApiError;

  @post create(
    @body body: DocumentCreateBody,
  ): ApiResponse<DocumentData> | ApiError;

  @route("{id}")
  @get
  getById(@path id: string): ApiResponse<DocumentWithAcceptances> | ApiError;

  #suppress "@typespec/http/patch-implicit-optional" ""
  @route("{id}")
  @patch
  update(
    @path id: string,
    @body body: DocumentUpdateBody,
  ): ApiResponse<DocumentData> | ApiError;

  @route("{id}")
  @delete
  delete(@path id: string): ApiResponse<EmptyData> | ApiError;
}
