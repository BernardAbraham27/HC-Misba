using System.Net;
using GodGraceHomeProducts.Application.Common;

namespace GodGraceHomeProducts.API.Middleware;

public class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "Resource not found");
            await WriteAsync(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Business rule violation");
            await WriteAsync(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized");
            await WriteAsync(context, HttpStatusCode.Forbidden, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error");
            await WriteAsync(context, HttpStatusCode.InternalServerError, "An unexpected server error occurred.");
        }
    }

    private static async Task WriteAsync(HttpContext context, HttpStatusCode code, string message)
    {
        context.Response.StatusCode = (int)code;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(ApiResponse.Fail(message));
    }
}
