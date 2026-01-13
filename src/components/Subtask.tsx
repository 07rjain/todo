"use client";

import { useState } from "react";
import { Subtask as SubtaskType } from "@/types/todo";

interface SubtaskProps {
  subtask: SubtaskType;
  todoId: string;
  taskId: string;
  onUpdate: () => void;
}

export default function Subtask({ subtask, todoId, taskId, onUpdate }: SubtaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(subtask.title);

  const handleToggleComplete = async () => {
    await fetch(`/api/todos/${todoId}/tasks/${taskId}/subtasks/${subtask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !subtask.completed }),
    });
    onUpdate();
  };

  const handleUpdate = async () => {
    if (!title.trim()) return;
    await fetch(`/api/todos/${todoId}/tasks/${taskId}/subtasks/${subtask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = async () => {
    await fetch(`/api/todos/${todoId}/tasks/${taskId}/subtasks/${subtask.id}`, {
      method: "DELETE",
    });
    onUpdate();
  };

  return (
    <div className="flex items-center gap-2 py-1 pl-8 group">
      <input
        type="checkbox"
        checked={subtask.completed}
        onChange={handleToggleComplete}
        className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
          className="flex-1 px-1 py-0.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 text-sm cursor-pointer ${
            subtask.completed ? "line-through text-gray-400" : "text-gray-600"
          }`}
          onClick={() => setIsEditing(true)}
        >
          {subtask.title}
        </span>
      )}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs px-1"
      >
        x
      </button>
    </div>
  );
}
