using GodGraceHomeProducts.Application.DTOs.Dashboard;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetAdminDashboardAsync();
}
