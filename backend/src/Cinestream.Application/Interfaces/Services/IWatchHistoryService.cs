using Cinestream.Application.DTOs.WatchHistory;

namespace Cinestream.Application.Interfaces.Services;

public interface IWatchHistoryService
{
    Task SaveProgressAsync(Guid userId, WatchHistoryDto dto);
    Task<IEnumerable<WatchHistoryDto>> GetUserHistoryAsync(Guid userId);
}
