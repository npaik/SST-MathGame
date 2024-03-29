namespace MathQuizApp
{
        public class User
        {
                public int Id { get; set; }
                public string Username { get; set; }
                public string PasswordHash { get; set; }
                public string Email { get; set; }
                public string FirstName { get; set; }
                public string LastName { get; set; }
                public int Age { get; set; }
                public string AvatarURL { get; set; }
                public int Score { get; set; }
                public List<Quiz> Quizzes { get; set; }
        }
        public class Quiz
        {
                public int Id { get; set; }
                public string Content { get; set; }
                public string Solution { get; set; }
                public int DifficultyLevel { get; set; }
                public bool IsCorrect { get; set; } = false;
        }

        public class UserProgress
        {
                public int Id { get; set; }
                public int UserId { get; set; }
                public int QuizId { get; set; }
                public int Score { get; set; }
                public DateTime Date { get; set; }
        }
}