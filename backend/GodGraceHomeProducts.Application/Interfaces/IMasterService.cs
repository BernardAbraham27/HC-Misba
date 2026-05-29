using GodGraceHomeProducts.Application.DTOs.Masters;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IMasterService
{
    Task<IReadOnlyCollection<MasterValueDto>> GetPublicAsync(string masterType);
    Task<IReadOnlyCollection<MasterValueDto>> GetAdminAsync(string masterType);
    Task<MasterValueDto> CreateAsync(string masterType, MasterValueRequestDto request);
    Task<MasterValueDto> UpdateAsync(string masterType, int id, MasterValueRequestDto request);
    Task<MasterValueDto> SetStatusAsync(string masterType, int id, bool isActive);
    Task DeleteAsync(string masterType, int id);
}
