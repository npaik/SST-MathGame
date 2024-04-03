namespace CSharp.Models;
public class Quiz
{
    public int Id { get; set; }
    public string Content { get; set; }
    public string Solution { get; set; }
    public int DifficultyLevel { get; set; }
}