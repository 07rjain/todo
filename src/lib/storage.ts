import fs from "fs";
import path from "path";
import { Todo } from "@/types/todo";

const DATA_DIR = path.join(process.cwd(), "data");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Get file path for a user's todos
function getUserFilePath(userId: string): string {
  return path.join(DATA_DIR, `${userId}.json`);
}

// Read all todos for a user
export function getUserTodos(userId: string): Todo[] {
  ensureDataDir();
  const filePath = getUserFilePath(userId);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Save todos for a user
export function saveUserTodos(userId: string, todos: Todo[]): void {
  ensureDataDir();
  const filePath = getUserFilePath(userId);
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get current timestamp
export function getTimestamp(): string {
  return new Date().toISOString();
}
