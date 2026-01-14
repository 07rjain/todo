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
    <div className="group/subtask flex items-center gap-2 py-1.5 px-1 -mx-1 rounded hover:bg-slate-50 transition-colors">
      {/* Checkbox */}
      <button
        onClick={handleToggleComplete}
        className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
          subtask.completed 
            ? 'bg-purple-500 border-purple-500' 
            : 'border-slate-300 hover:border-purple-400'
        }`}
      >
        {subtask.completed && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Title */}
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
          className="flex-1 px-1.5 py-0.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 text-xs cursor-pointer transition-colors ${
            subtask.completed 
              ? "line-through text-slate-400" 
              : "text-slate-600 hover:text-slate-800"
          }`}
          onClick={() => setIsEditing(true)}
        >
          {subtask.title}
        </span>
      )}

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="flex-shrink-0 p-0.5 opacity-0 group-hover/subtask:opacity-100 text-slate-400 hover:text-red-500 rounded transition-all"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
