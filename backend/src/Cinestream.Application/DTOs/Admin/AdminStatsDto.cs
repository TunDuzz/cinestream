namespace Cinestream.Application.DTOs.Admin;

public class AdminStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalViews { get; set; }
    public int TotalFavorites { get; set; }
    public int ActiveUserCount { get; set; }
    public List<MovieStatDto> TopMovies { get; set; } = new();
}

public class MovieStatDto
{
    public string MovieId { get; set; } = string.Empty;
    public string MovieName { get; set; } = string.Empty;
    public string MovieSlug { get; set; } = string.Empty;
    public string MovieThumbUrl { get; set; } = string.Empty;
    public int ViewCount { get; set; }
}
