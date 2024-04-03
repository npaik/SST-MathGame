using Microsoft.EntityFrameworkCore;

namespace CSharp.Models 
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<UserProgress> UserProgresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<UserProgress>()
        .HasOne(up => up.User)
        .WithMany()
        .HasForeignKey(up => up.UserId)
        .IsRequired();

    modelBuilder.Entity<UserProgress>()
        .HasOne(up => up.Quiz)
        .WithMany()
        .HasForeignKey(up => up.QuizId)
        .IsRequired(); 
        }
    }
}
