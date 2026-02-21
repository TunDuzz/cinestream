using Microsoft.AspNetCore.Mvc;
using Cinestream.Application.Interfaces.Services;

namespace Cinestream.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MoviesController : ControllerBase
{
    private readonly IMovieService _movieService;

    public MoviesController(IMovieService movieService)
    {
        _movieService = movieService;
    }

    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestMovies([FromQuery] int page = 1)
    {
        var result = await _movieService.GetNewMoviesAsync(page);
        if (result == null || !result.Status) return StatusCode(500, new { Message = "Error fetching movies" });
        return Ok(result);
    }

    [HttpGet("detail/{slug}")]
    public async Task<IActionResult> GetMovieDetail(string slug)
    {
        var result = await _movieService.GetMovieDetailAsync(slug);
        if (result == null || !result.Status) return NotFound(new { Message = "Movie not found" });
        return Ok(result);
    }

    [HttpGet("type/{type}")]
    public async Task<IActionResult> GetMoviesByType(string type, [FromQuery] int page = 1, [FromQuery] string? category = null, [FromQuery] string? country = null, [FromQuery] int? year = null)
    {
        var result = await _movieService.GetMoviesByTypeAsync(type, page, category, country, year);
        if (result == null || !result.Status) return StatusCode(500, new { Message = "Error fetching movies by type" });
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchMovies(
        [FromQuery] string keyword, 
        [FromQuery] int page = 1,
        [FromQuery] string? category = null,
        [FromQuery] string? country = null,
        [FromQuery] int? year = null,
        [FromQuery] string? type = null)
    {
        var result = await _movieService.SearchMoviesAsync(keyword, page, category, country, year, type);
        if (result == null || !result.Status) return StatusCode(500, new { Message = "Error searching movies" });
        return Ok(result);
    }

    [HttpGet("category/{slug}")]
    public async Task<IActionResult> GetMoviesByCategory(string slug, [FromQuery] int page = 1, [FromQuery] string? country = null, [FromQuery] int? year = null)
    {
        var result = await _movieService.GetMoviesByCategoryAsync(slug, page, country, year);
        if (result == null || !result.Status) return StatusCode(500, new { Message = "Error fetching movies by category" });
        return Ok(result);
    }

    [HttpGet("country/{slug}")]
    public async Task<IActionResult> GetMoviesByCountry(string slug, [FromQuery] int page = 1, [FromQuery] string? category = null, [FromQuery] int? year = null)
    {
        var result = await _movieService.GetMoviesByCountryAsync(slug, page, category, year);
        if (result == null || !result.Status) return StatusCode(500, new { Message = "Error fetching movies by country" });
        return Ok(result);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var result = await _movieService.GetCategoriesAsync();
        if (result == null || !result.Status) return StatusCode(500, new { Message = "Error fetching categories" });
        return Ok(result);
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries()
    {
        var result = await _movieService.GetCountriesAsync();
        if (result == null || !result.Status) return StatusCode(500, new { Message = "Error fetching countries" });
        return Ok(result);
    }
}
