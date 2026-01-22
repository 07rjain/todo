import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserTodos, saveUserTodos, generateId, getTimestamp } from "@/lib/storage";
import { Subtask } from "@/types/todo";

interface RouteParams {
  params: Promise<{ todoId: string; taskId: string }>;
}

// GET all subtasks for a task
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { todoId, taskId } = await params;
    const todos = await getUserTodos(userId);
    const todo = todos.find((t) => t.id === todoId);
    
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    const task = todo.tasks.find((t) => t.id === taskId);
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    return NextResponse.json(task.subtasks);
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create a new subtask
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { todoId, taskId } = await params;
    const body = await request.json();
    const { title } = body;
    
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    
    const todos = await getUserTodos(userId);
    const todoIndex = todos.findIndex((t) => t.id === todoId);
    
    if (todoIndex === -1) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    const taskIndex = todos[todoIndex].tasks.findIndex((t) => t.id === taskId);
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    const now = getTimestamp();
    const newSubtask: Subtask = {
      id: generateId(),
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    
    todos[todoIndex].tasks[taskIndex].subtasks.push(newSubtask);
    todos[todoIndex].tasks[taskIndex].updatedAt = now;
    todos[todoIndex].updatedAt = now;
    await saveUserTodos(userId, todos);
    
    return NextResponse.json(newSubtask, { status: 201 });
  } catch (error) {
    console.error("Error creating subtask:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
