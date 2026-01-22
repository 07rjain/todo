import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserTodos, saveUserTodos, getTimestamp } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ todoId: string }>;
}

// GET a specific todo
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { todoId } = await params;
    const todos = await getUserTodos(userId);
    const todo = todos.find((t) => t.id === todoId);
    
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update a todo
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { todoId } = await params;
    const body = await request.json();
    const { title } = body;
    
    const todos = await getUserTodos(userId);
    const todoIndex = todos.findIndex((t) => t.id === todoId);
    
    if (todoIndex === -1) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    if (title) {
      todos[todoIndex].title = title;
    }
    todos[todoIndex].updatedAt = getTimestamp();
    
    await saveUserTodos(userId, todos);
    
    return NextResponse.json(todos[todoIndex]);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a todo
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { todoId } = await params;
    const todos = await getUserTodos(userId);
    const todoIndex = todos.findIndex((t) => t.id === todoId);
    
    if (todoIndex === -1) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    todos.splice(todoIndex, 1);
    await saveUserTodos(userId, todos);
    
    return NextResponse.json({ message: "Todo deleted" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
