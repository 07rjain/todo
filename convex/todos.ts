import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all todos for a user with their tasks and subtasks
export const getUserTodos = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Fetch tasks and subtasks for each todo
    const todosWithTasks = await Promise.all(
      todos.map(async (todo) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("by_todo", (q) => q.eq("todoId", todo._id))
          .collect();

        const tasksWithSubtasks = await Promise.all(
          tasks.map(async (task) => {
            const subtasks = await ctx.db
              .query("subtasks")
              .withIndex("by_task", (q) => q.eq("taskId", task._id))
              .collect();

            return {
              id: task._id,
              title: task.title,
              completed: task.completed,
              subtasks: subtasks.map((s) => ({
                id: s._id,
                title: s.title,
                completed: s.completed,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
              })),
              createdAt: task.createdAt,
              updatedAt: task.updatedAt,
            };
          })
        );

        return {
          id: todo._id,
          userId: todo.userId,
          title: todo.title,
          tasks: tasksWithSubtasks,
          createdAt: todo.createdAt,
          updatedAt: todo.updatedAt,
        };
      })
    );

    return todosWithTasks;
  },
});

// Create a new todo
export const createTodo = mutation({
  args: { userId: v.string(), title: v.string() },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const todoId = await ctx.db.insert("todos", {
      userId: args.userId,
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });
    return todoId;
  },
});

// Update a todo
export const updateTodo = mutation({
  args: { todoId: v.id("todos"), title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.todoId, {
      title: args.title,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Delete a todo and all its tasks/subtasks
export const deleteTodo = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, args) => {
    // Delete all subtasks for all tasks
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_todo", (q) => q.eq("todoId", args.todoId))
      .collect();

    for (const task of tasks) {
      const subtasks = await ctx.db
        .query("subtasks")
        .withIndex("by_task", (q) => q.eq("taskId", task._id))
        .collect();

      for (const subtask of subtasks) {
        await ctx.db.delete(subtask._id);
      }
      await ctx.db.delete(task._id);
    }

    await ctx.db.delete(args.todoId);
  },
});

// Create a new task
export const createTask = mutation({
  args: { todoId: v.id("todos"), userId: v.string(), title: v.string() },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const taskId = await ctx.db.insert("tasks", {
      todoId: args.todoId,
      userId: args.userId,
      title: args.title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    // Update todo's updatedAt
    await ctx.db.patch(args.todoId, { updatedAt: now });

    return taskId;
  },
});

// Update a task
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (args.title !== undefined) updates.title = args.title;
    if (args.completed !== undefined) updates.completed = args.completed;

    await ctx.db.patch(args.taskId, updates);
  },
});

// Delete a task and its subtasks
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const subtasks = await ctx.db
      .query("subtasks")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    for (const subtask of subtasks) {
      await ctx.db.delete(subtask._id);
    }

    await ctx.db.delete(args.taskId);
  },
});

// Create a new subtask
export const createSubtask = mutation({
  args: { taskId: v.id("tasks"), userId: v.string(), title: v.string() },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const subtaskId = await ctx.db.insert("subtasks", {
      taskId: args.taskId,
      userId: args.userId,
      title: args.title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    // Update task's updatedAt
    await ctx.db.patch(args.taskId, { updatedAt: now });

    return subtaskId;
  },
});

// Update a subtask
export const updateSubtask = mutation({
  args: {
    subtaskId: v.id("subtasks"),
    title: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (args.title !== undefined) updates.title = args.title;
    if (args.completed !== undefined) updates.completed = args.completed;

    await ctx.db.patch(args.subtaskId, updates);
  },
});

// Delete a subtask
export const deleteSubtask = mutation({
  args: { subtaskId: v.id("subtasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.subtaskId);
  },
});
