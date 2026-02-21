namespace Cinestream.Application.DTOs.WatchHistory;

public class WatchHistoryDto
{
    public string MovieId { get; set; } = string.Empty;
    public string? Episode { get; set; }
    public int WatchedTimeInSeconds { get; set; }
    public bool IsCompleted { get; set; }
}
