using Microsoft.AspNetCore.Identity;

namespace GodGraceHomeProducts.Application.Helpers;

public class PasswordHasher
{
    private readonly PasswordHasher<string> _hasher = new();

    public string Hash(string password) => _hasher.HashPassword("GodGraceHomeProducts", password);

    public bool Verify(string hash, string password)
    {
        var result = _hasher.VerifyHashedPassword("GodGraceHomeProducts", hash, password);
        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}
