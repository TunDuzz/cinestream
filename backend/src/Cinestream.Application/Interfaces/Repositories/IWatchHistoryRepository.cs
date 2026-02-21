using Cinestream.Domain.Entities;

namespace Cinestream.Application.Interfaces.Repositories;

public interface IWatchHistoryRepository
{
    Task<WatchHistory?> GetByUserIdAndEpisodeAsync(Guid userId, string movieId, string? episode);
    Task<IEnumerable<WatchHistory>> GetUserHistoryAsync(Guid userId);
    Task AddAsync(WatchHistory history);
    Task UpdateAsync(WatchHistory history);
}
