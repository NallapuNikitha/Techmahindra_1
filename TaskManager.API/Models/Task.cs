using System.ComponentModel.DataAnnotations;

namespace TaskManager.API.Models
{
    public class Task
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public TaskPriority Priority { get; set; }

        [Required]
        public TaskStatus Status { get; set; }

        public DateTime DueDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

        // Foreign key
        public int UserId { get; set; }

        // Navigation property
        public User User { get; set; }
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High
    }

    public enum TaskStatus
    {
        Todo,
        InProgress,
        Completed
    }
} 