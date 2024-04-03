namespace CSharp.Models;
public class UserProgress
{
   public int Id { get; set; }
    public int UserId { get; set; } 
    public User User { get; set; } 
    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } 
    public bool IsCorrect { get; set; }
    public int Score { get; set; }
    public DateTime Date { get; set; }
}