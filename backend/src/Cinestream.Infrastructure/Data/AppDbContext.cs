using Microsoft.EntityFrameworkCore;
using Cinestream.Domain.Entities;

namespace Cinestream.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<WatchHistory> WatchHistories { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<AppSetting> AppSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<WatchHistory>()
            .HasOne(w => w.User)
            .WithMany(u => u.WatchHistories)
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.Entity<Favorite>()
            .HasIndex(f => new { f.UserId, f.MovieId }).IsUnique();

        builder.Entity<WatchHistory>()
            .HasIndex(w => new { w.UserId, w.MovieSlug, w.Episode }).IsUnique();
    }
}
