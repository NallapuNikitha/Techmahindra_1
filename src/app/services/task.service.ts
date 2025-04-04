import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadTasks();
  }

  private loadTasks(): void {
    if (this.isBrowser) {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        this.tasks = parsedTasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }));
        this.tasksSubject.next(this.tasks);
      }
    }
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Omit<Task, 'id'>): void {
    const newTask: Task = {
      ...task,
      id: Date.now()
    };
    this.tasks.push(newTask);
    this.updateTasks();
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.updateTasks();
    }
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.updateTasks();
  }

  private updateTasks(): void {
    this.tasksSubject.next(this.tasks);
    if (this.isBrowser) {
      const tasksToStore = this.tasks.map(task => ({
        ...task,
        dueDate: task.dueDate.toISOString()
      }));
      localStorage.setItem('tasks', JSON.stringify(tasksToStore));
    }
  }
} 