using System.Text.RegularExpressions;

namespace GodGraceHomeProducts.Application.Helpers;

public static class SlugHelper
{
    public static string Generate(string value)
    {
        var slug = value.Trim().ToLowerInvariant();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-");
        slug = Regex.Replace(slug, "-{2,}", "-");
        return slug.Trim('-');
    }
}
