using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManager.API.Models;
using TaskManager.API.Services;
using TaskManager.API.Data;
using Microsoft.EntityFrameworkCore;

namespace TaskManager.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _taskService;
        private readonly ApplicationDbContext _context;

        public TaskController(TaskService taskService, ApplicationDbContext context)
        {
            _taskService = taskService;
            _context = context;
        }

        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                // Try to access the database
                var userCount = await _context.Users.CountAsync();
                return Ok(new { message = "Database connection successful", userCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Database connection failed", error = ex.Message });
            }
        }

        [HttpGet("add-test-data")]
        public async Task<IActionResult> AddTestData()
        {
            try
            {
                // Add a test user if none exists
                if (!await _context.Users.AnyAsync())
                {
                    var user = new User
                    {
                        Email = "test@example.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                        FirstName = "Test",
                        LastName = "User"
                    };
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();

                    // Add some test tasks
                    var tasks = new List<Task>
                    {
                        new Task
                        {
                            Title = "Complete Project",
                            Description = "Finish the Task Manager project",
                            Priority = TaskPriority.High,
                            Status = TaskStatus.Todo,
                            DueDate = DateTime.UtcNow.AddDays(7),
                            UserId = user.Id
                        },
                        new Task
                        {
                            Title = "Review Code",
                            Description = "Review the backend code",
                            Priority = TaskPriority.Medium,
                            Status = TaskStatus.InProgress,
                            DueDate = DateTime.UtcNow.AddDays(3),
                            UserId = user.Id
                        }
                    };

                    _context.Tasks.AddRange(tasks);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Test data added successfully" });
                }

                return Ok(new { message = "Test data already exists" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to add test data", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<Task>>> GetUserTasks()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var tasks = await _taskService.GetUserTasks(userId);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Task>> GetTask(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            try
            {
                var task = await _taskService.GetTaskById(id, userId);
                return Ok(task);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Task>> CreateTask(Task task)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            task.UserId = userId;
            task.Status = TaskStatus.Todo;
            var createdTask = await _taskService.CreateTask(task);
            return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Task>> UpdateTask(int id, Task task)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (id != task.Id)
            {
                return BadRequest();
            }

            task.UserId = userId;
            try
            {
                var updatedTask = await _taskService.UpdateTask(task);
                return Ok(updatedTask);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            try
            {
                await _taskService.DeleteTask(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
} 