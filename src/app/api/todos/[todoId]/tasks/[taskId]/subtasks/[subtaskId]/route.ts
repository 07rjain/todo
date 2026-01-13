import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserTodos, saveUserTodos, getTimestamp } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ todoId: string; taskId: string; subtaskId: string }>;
}

// PUT update a subtask
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { todoId, taskId, subtaskId } = await params;
  const body = await request.json();
  const { title, completed } = body;
  
  const todos = getUserTodos(userId);
  const todoIndex = todos.findIndex((t) => t.id === todoId);
  
  if (todoIndex === -1) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  
  const taskIndex = todos[todoIndex].tasks.findIndex((t) => t.id === taskId);
  
  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  
  const subtaskIndex = todos[todoIndex].tasks[taskIndex].subtasks.findIndex(
    (s) => s.id === subtaskId
  );
  
  if (subtaskIndex === -1) {
    return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
  }
  
  const now = getTimestamp();
  
  if (title !== undefined) {
    todos[todoIndex].tasks[taskIndex].subtasks[subtaskIndex].title = title;
  }
  if (completed !== undefined) {
    todos[todoIndex].tasks[taskIndex].subtasks[subtaskIndex].completed = completed;
  }
  todos[todoIndex].tasks[taskIndex].subtasks[subtaskIndex].updatedAt = now;
  todos[todoIndex].tasks[taskIndex].updatedAt = now;
  todos[todoIndex].updatedAt = now;
  
  saveUserTodos(userId, todos);
  
  return NextResponse.json(todos[todoIndex].tasks[taskIndex].subtasks[subtaskIndex]);
}

// DELETE a subtask
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { todoId, taskId, subtaskId } = await params;
  const todos = getUserTodos(userId);
  const todoIndex = todos.findIndex((t) => t.id === todoId);
  
  if (todoIndex === -1) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  
  const taskIndex = todos[todoIndex].tasks.findIndex((t) => t.id === taskId);
  
  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  
  const subtaskIndex = todos[todoIndex].tasks[taskIndex].subtasks.findIndex(
    (s) => s.id === subtaskId
  );
  
  if (subtaskIndex === -1) {
    return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
  }
  
  todos[todoIndex].tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
  todos[todoIndex].tasks[taskIndex].updatedAt = getTimestamp();
  todos[todoIndex].updatedAt = getTimestamp();
  saveUserTodos(userId, todos);
  
  return NextResponse.json({ message: "Subtask deleted" });
}
