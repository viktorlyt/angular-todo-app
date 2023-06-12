import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, switchMap } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { TodosService } from 'src/app/services/todos.service';
import { Status } from 'src/app/types/status';
import { Todo } from 'src/app/types/todo';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrls: ['./todos-page.component.scss'],
})
export class TodosPageComponent implements OnInit {
  todos$ = this.todosService.todos$;
  activeTodos$ = this.todos$.pipe(
    distinctUntilChanged(),
    map((todos) => todos.filter((todo) => !todo.completed))
  );
  completedTodos$ = this.todos$.pipe(
    map((todos) => todos.filter((todo) => todo.completed))
  );
  activeCount$ = this.activeTodos$.pipe(map((todos) => todos.length));
  visibleTodos$ = this.route.params.pipe(
    switchMap((params) => {
      switch (params['status'] as Status) {
        case 'active':
          return this.activeTodos$;
        case 'completed':
          return this.completedTodos$;
        default:
          return this.todos$;
      }
    })
  );

  constructor(
    private todosService: TodosService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params);
    });
    this.todosService.loadTodos().subscribe({
      error: () => this.messageService.showMessage('Unable to load todos'),
    });
  }

  trackById(i: number, todo: Todo) {
    return todo.id;
  }

  addTodo(newtitle: string) {
    this.todosService.createTodo(newtitle).subscribe({
      error: () => this.messageService.showMessage('Unable to add todo'),
    });
  }

  renameTodo(todo: Todo, title: string) {
    this.todosService.updateTodo({ ...todo, title }).subscribe({
      error: () => this.messageService.showMessage('Unable to update todo'),
    });
  }

  deleteTodo(todo: Todo) {
    this.todosService.deleteTodo(todo).subscribe({
      error: () => this.messageService.showMessage('Unable to delete todo'),
    });
  }

  toggleTodo(todo: Todo) {
    this.todosService
      .updateTodo({
        ...todo,
        completed: !todo.completed,
      })
      .subscribe({
        error: () => this.messageService.showMessage('Unable to update todo'),
      });
  }
}
