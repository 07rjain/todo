import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserTodos, saveUserTodos, getTimestamp } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ todoId: string; taskId: string }>;
}

// GET a specific task
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { todoId, taskId } = await params;
  const todos = getUserTodos(userId);
  const todo = todos.find((t) => t.id === todoId);
  
  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  
  const task = todo.tasks.find((t) => t.id === taskId);
  
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  
  return NextResponse.json(task);
}

// PUT update a task
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { todoId, taskId } = await params;
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
  
  const now = getTimestamp();
  
  if (title !== undefined) {
    todos[todoIndex].tasks[taskIndex].title = title;
  }
  if (completed !== undefined) {
    todos[todoIndex].tasks[taskIndex].completed = completed;
  }
  todos[todoIndex].tasks[taskIndex].updatedAt = now;
  todos[todoIndex].updatedAt = now;
  
  saveUserTodos(userId, todos);
  
  return NextResponse.json(todos[todoIndex].tasks[taskIndex]);
}

// DELETE a task
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { todoId, taskId } = await params;
  const todos = getUserTodos(userId);
  const todoIndex = todos.findIndex((t) => t.id === todoId);
  
  if (todoIndex === -1) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  
  const taskIndex = todos[todoIndex].tasks.findIndex((t) => t.id === taskId);
  
  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  
  todos[todoIndex].tasks.splice(taskIndex, 1);
  todos[todoIndex].updatedAt = getTimestamp();
  saveUserTodos(userId, todos);
  
  return NextResponse.json({ message: "Task deleted" });
}
