using System.Security.Claims;

namespace GodGraceHomeProducts.API.Common;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var claim = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var userId)
            ? userId
            : throw new UnauthorizedAccessException("Invalid user token.");
    }
}
