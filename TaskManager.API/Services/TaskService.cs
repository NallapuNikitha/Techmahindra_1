using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.Models;

namespace TaskManager.API.Services
{
    public class TaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Task>> GetUserTasks(int userId)
        {
            return await _context.Tasks
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.Priority)
                .ThenBy(t => t.DueDate)
                .ToListAsync();
        }

        public async Task<Task> GetTaskById(int taskId, int userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
            {
                throw new Exception("Task not found");
            }

            return task;
        }

        public async Task<Task> CreateTask(Task task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<Task> UpdateTask(Task task)
        {
            var existingTask = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == task.Id && t.UserId == task.UserId);

            if (existingTask == null)
            {
                throw new Exception("Task not found");
            }

            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.Priority = task.Priority;
            existingTask.Status = task.Status;
            existingTask.DueDate = task.DueDate;

            if (task.Status == TaskStatus.Completed && existingTask.Status != TaskStatus.Completed)
            {
                existingTask.CompletedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return existingTask;
        }

        public async Task DeleteTask(int taskId, int userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
            {
                throw new Exception("Task not found");
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }
    }
} 