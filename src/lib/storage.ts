import { kv } from "@vercel/kv";
import { Todo } from "@/types/todo";

// Key prefix for user todos
function getUserKey(userId: string): string {
  return `todos:${userId}`;
}

// Read all todos for a user
export async function getUserTodos(userId: string): Promise<Todo[]> {
  try {
    const todos = await kv.get<Todo[]>(getUserKey(userId));
    return todos || [];
  } catch (error) {
    console.error("Error reading todos from KV:", error);
    return [];
  }
}

// Save todos for a user
export async function saveUserTodos(userId: string, todos: Todo[]): Promise<void> {
  try {
    await kv.set(getUserKey(userId), todos);
  } catch (error) {
    console.error("Error saving todos to KV:", error);
    throw error;
  }
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get current timestamp
export function getTimestamp(): string {
  return new Date().toISOString();
}
