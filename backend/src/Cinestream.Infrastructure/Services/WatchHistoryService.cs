using Cinestream.Application.DTOs.WatchHistory;
using Cinestream.Application.Interfaces.Services;
using Cinestream.Application.Interfaces.Repositories;
using Cinestream.Domain.Entities;

namespace Cinestream.Infrastructure.Services;

public class WatchHistoryService : IWatchHistoryService
{
    private readonly IWatchHistoryRepository _watchHistoryRepository;

    public WatchHistoryService(IWatchHistoryRepository watchHistoryRepository)
    {
        _watchHistoryRepository = watchHistoryRepository;
    }

    public async Task SaveProgressAsync(Guid userId, WatchHistoryDto dto)
    {
        var history = await _watchHistoryRepository.GetByUserIdAndEpisodeAsync(userId, dto.MovieId, dto.Episode);

        if (history == null)
        {
            history = new WatchHistory
            {
                UserId = userId,
                MovieId = dto.MovieId,
                Episode = dto.Episode,
                WatchedTimeInSeconds = dto.WatchedTimeInSeconds,
                IsCompleted = dto.IsCompleted,
                LastWatchedAt = DateTime.UtcNow
            };
            await _watchHistoryRepository.AddAsync(history);
        }
        else
        {
            history.WatchedTimeInSeconds = dto.WatchedTimeInSeconds;
            history.IsCompleted = dto.IsCompleted;
            history.LastWatchedAt = DateTime.UtcNow;
            await _watchHistoryRepository.UpdateAsync(history);
        }
    }

    public async Task<IEnumerable<WatchHistoryDto>> GetUserHistoryAsync(Guid userId)
    {
        var histories = await _watchHistoryRepository.GetUserHistoryAsync(userId);
        return histories.Select(w => new WatchHistoryDto
        {
            MovieId = w.MovieId,
            Episode = w.Episode,
            WatchedTimeInSeconds = w.WatchedTimeInSeconds,
            IsCompleted = w.IsCompleted
        });
    }
}
