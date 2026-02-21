using System.Text.Json.Serialization;

namespace Cinestream.Application.DTOs.MovieApi;

public class MovieDetailResponse
{
    [JsonPropertyName("status")]
    [JsonConverter(typeof(FlexibleBoolConverter))]
    public bool Status { get; set; }
    
    [JsonPropertyName("movie")]
    public MovieDetailDto? Movie { get; set; }

    [JsonPropertyName("episodes")]
    public List<MovieEpisodeServerDto> Episodes { get; set; } = new List<MovieEpisodeServerDto>();
}

public class MovieDetailDto : MovieItemDto
{
    [JsonPropertyName("tmdb")]
    public TmdbDto? Tmdb { get; set; }

    [JsonPropertyName("imdb")]
    public ImdbDto? Imdb { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;
    
    [JsonPropertyName("trailer_url")]
    public string TrailerUrl { get; set; } = string.Empty;
    
    [JsonPropertyName("view")]
    public int View { get; set; }

    [JsonPropertyName("actor")]
    public List<string> Actor { get; set; } = new List<string>();

    [JsonPropertyName("director")]
    public List<string> Director { get; set; } = new List<string>();

    [JsonPropertyName("episodes")]
    public List<MovieEpisodeServerDto> Episodes { get; set; } = new List<MovieEpisodeServerDto>();
}
