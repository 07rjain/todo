import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserTodos, saveUserTodos, generateId, getTimestamp } from "@/lib/storage";
import { Todo } from "@/types/todo";

// GET all todos for the authenticated user
export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const todos = getUserTodos(userId);
  return NextResponse.json(todos);
}

// POST create a new todo
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const body = await request.json();
  const { title } = body;
  
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  
  const todos = getUserTodos(userId);
  const now = getTimestamp();
  
  const newTodo: Todo = {
    id: generateId(),
    userId,
    title,
    tasks: [],
    createdAt: now,
    updatedAt: now,
  };
  
  todos.push(newTodo);
  saveUserTodos(userId, todos);
  
  return NextResponse.json(newTodo, { status: 201 });
}
