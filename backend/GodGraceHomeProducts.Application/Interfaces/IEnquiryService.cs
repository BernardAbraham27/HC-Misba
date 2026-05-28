using GodGraceHomeProducts.Application.DTOs.Enquiries;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IEnquiryService
{
    Task<EnquiryResponseDto> CreateAsync(EnquiryRequestDto request);
    Task<IReadOnlyCollection<EnquiryResponseDto>> GetAllAsync();
    Task<EnquiryResponseDto> GetByIdAsync(int id);
    Task<EnquiryResponseDto> UpdateStatusAsync(int id, UpdateEnquiryStatusDto request);
    Task<EnquiryResponseDto> UpdateRemarksAsync(int id, UpdateEnquiryRemarksDto request);
    Task DeleteAsync(int id);
}
