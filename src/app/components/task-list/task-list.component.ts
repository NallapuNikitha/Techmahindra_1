import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Task Manager</h2>
      
      <!-- Add Task Form -->
      <div class="add-task-form">
        <h3>Add New Task</h3>
        <form (ngSubmit)="addTask()">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" [(ngModel)]="newTask.title" name="title" required>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" [(ngModel)]="newTask.description" name="description" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="dueDate">Due Date</label>
            <input type="date" id="dueDate" [(ngModel)]="newTask.dueDate" name="dueDate" required>
          </div>
          
          <div class="form-group">
            <label for="priority">Priority</label>
            <select id="priority" [(ngModel)]="newTask.priority" name="priority" required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <button type="submit">Add Task</button>
        </form>
      </div>

      <!-- Task List -->
      <div class="task-list">
        <h3>Tasks</h3>
        <div *ngFor="let task of tasks" class="task-card">
          <div class="task-header">
            <h4>{{ task.title }}</h4>
            <div class="task-actions">
              <button (click)="openEditModal(task)">Edit</button>
              <button (click)="deleteTask(task.id)">Delete</button>
            </div>
          </div>
          <p>{{ task.description }}</p>
          <div class="task-details">
            <span>Due: {{ task.dueDate | date }}</span>
            <span class="priority" [ngClass]="task.priority">Priority: {{ task.priority }}</span>
            <span class="status" [ngClass]="task.status">Status: {{ task.status }}</span>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div class="modal" *ngIf="showEditModal && editingTask">
        <div class="modal-content">
          <h3>Edit Task</h3>
          <form (ngSubmit)="saveEdit()">
            <div class="form-group">
              <label for="edit-title">Title</label>
              <input type="text" id="edit-title" [(ngModel)]="editingTask.title" name="edit-title" required>
            </div>
            
            <div class="form-group">
              <label for="edit-description">Description</label>
              <textarea id="edit-description" [(ngModel)]="editingTask.description" name="edit-description" required></textarea>
            </div>
            
            <div class="form-group">
              <label for="edit-dueDate">Due Date</label>
              <input type="date" id="edit-dueDate" [(ngModel)]="editingTask.dueDate" name="edit-dueDate" required>
            </div>
            
            <div class="form-group">
              <label for="edit-priority">Priority</label>
              <select id="edit-priority" [(ngModel)]="editingTask.priority" name="edit-priority" required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div class="form-group">
              <label for="edit-status">Status</label>
              <select id="edit-status" [(ngModel)]="editingTask.status" name="edit-status" required>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div class="modal-actions">
              <button type="submit">Save</button>
              <button type="button" (click)="closeEditModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .add-task-form {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    input, textarea, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
    }

    button:hover {
      background: #0056b3;
    }

    .task-list {
      margin-top: 20px;
    }

    .task-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      margin-bottom: 10px;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .task-details {
      display: flex;
      gap: 15px;
      margin-top: 10px;
      font-size: 0.9em;
    }

    .priority {
      padding: 2px 8px;
      border-radius: 3px;
    }

    .priority.low {
      background: #d4edda;
      color: #155724;
    }

    .priority.medium {
      background: #fff3cd;
      color: #856404;
    }

    .priority.high {
      background: #f8d7da;
      color: #721c24;
    }

    .status {
      padding: 2px 8px;
      border-radius: 3px;
    }

    .status.pending {
      background: #e2e3e5;
      color: #383d41;
    }

    .status.in-progress {
      background: #cce5ff;
      color: #004085;
    }

    .status.completed {
      background: #d4edda;
      color: #155724;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 5px;
      width: 90%;
      max-width: 500px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Omit<Task, 'id'> = {
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'medium',
    status: 'pending'
  };
  showEditModal = false;
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask(): void {
    this.taskService.addTask(this.newTask);
    this.newTask = {
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'medium',
      status: 'pending'
    };
  }

  openEditModal(task: Task): void {
    this.editingTask = { ...task };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingTask = null;
  }

  saveEdit(): void {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask);
      this.closeEditModal();
    }
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId);
    }
  }
} 