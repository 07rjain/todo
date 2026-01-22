import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_user", ["userId"]),

  tasks: defineTable({
    todoId: v.id("todos"),
    userId: v.string(),
    title: v.string(),
    completed: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_todo", ["todoId"]),

  subtasks: defineTable({
    taskId: v.id("tasks"),
    userId: v.string(),
    title: v.string(),
    completed: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_task", ["taskId"]),
});
