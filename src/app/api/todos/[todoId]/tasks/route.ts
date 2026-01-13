import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserTodos, saveUserTodos, generateId, getTimestamp } from "@/lib/storage";
import { Task } from "@/types/todo";

interface RouteParams {
  params: Promise<{ todoId: string }>;
}

// GET all tasks for a todo
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { todoId } = await params;
  const todos = getUserTodos(userId);
  const todo = todos.find((t) => t.id === todoId);
  
  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  
  return NextResponse.json(todo.tasks);
}

// POST create a new task
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { todoId } = await params;
  const body = await request.json();
  const { title } = body;
  
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  
  const todos = getUserTodos(userId);
  const todoIndex = todos.findIndex((t) => t.id === todoId);
  
  if (todoIndex === -1) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  
  const now = getTimestamp();
  const newTask: Task = {
    id: generateId(),
    title,
    completed: false,
    subtasks: [],
    createdAt: now,
    updatedAt: now,
  };
  
  todos[todoIndex].tasks.push(newTask);
  todos[todoIndex].updatedAt = now;
  saveUserTodos(userId, todos);
  
  return NextResponse.json(newTask, { status: 201 });
}
