"use client";

import { useState } from "react";
import { Todo } from "@/types/todo";
import Task from "./Task";

interface TodoCardProps {
  todo: Todo;
  onUpdate: () => void;
}

export default function TodoCard({ todo, onUpdate }: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [newTask, setNewTask] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = async () => {
    if (!title.trim()) return;
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this todo?")) return;
    await fetch(`/api/todos/${todo.id}`, {
      method: "DELETE",
    });
    onUpdate();
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await fetch(`/api/todos/${todo.id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    });
    setNewTask("");
    onUpdate();
  };

  const completedTasks = todo.tasks.filter((t) => t.completed).length;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? "v" : ">"}
            </button>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleUpdate}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                className="flex-1 px-2 py-1 text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <h3
                className="text-lg font-semibold text-gray-800 cursor-pointer flex-1"
                onClick={() => setIsEditing(true)}
              >
                {todo.title}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            {todo.tasks.length > 0 && (
              <span className="text-sm text-gray-500">
                {completedTasks}/{todo.tasks.length} tasks
              </span>
            )}
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="space-y-2">
            {todo.tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                todoId={todo.id}
                onUpdate={onUpdate}
              />
            ))}
          </div>

          <form onSubmit={handleAddTask} className="mt-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
        </div>
      )}
    </div>
  );
}
