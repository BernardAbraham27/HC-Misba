namespace GodGraceHomeProducts.Application.Common;

public class ApiResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
    public object? Errors { get; set; }

    public static ApiResponse Ok(object? data, string message = "Request completed successfully.")
        => new() { Success = true, Message = message, Data = data };

    public static ApiResponse Fail(string message, object? errors = null)
        => new() { Success = false, Message = message, Errors = errors };
}
