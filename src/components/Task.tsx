"use client";

import { useState } from "react";
import { Task as TaskType } from "@/types/todo";
import Subtask from "./Subtask";

interface TaskProps {
  task: TaskType;
  todoId: string;
  onUpdate: () => void;
}

export default function Task({ task, todoId, onUpdate }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [newSubtask, setNewSubtask] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(true);

  const handleToggleComplete = async () => {
    await fetch(`/api/todos/${todoId}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    onUpdate();
  };

  const handleUpdate = async () => {
    if (!title.trim()) return;
    await fetch(`/api/todos/${todoId}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = async () => {
    await fetch(`/api/todos/${todoId}/tasks/${task.id}`, {
      method: "DELETE",
    });
    onUpdate();
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    await fetch(`/api/todos/${todoId}/tasks/${task.id}/subtasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newSubtask }),
    });
    setNewSubtask("");
    onUpdate();
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  return (
    <div className="border-l-2 border-gray-200 pl-3 py-2">
      <div className="flex items-center gap-2 group">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span
            className={`flex-1 cursor-pointer ${
              task.completed ? "line-through text-gray-400" : "text-gray-700"
            }`}
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </span>
        )}
        {task.subtasks.length > 0 && (
          <span className="text-xs text-gray-400">
            {completedSubtasks}/{task.subtasks.length}
          </span>
        )}
        <button
          onClick={() => setShowSubtasks(!showSubtasks)}
          className="text-gray-400 hover:text-gray-600 text-sm px-1"
        >
          {showSubtasks ? "-" : "+"}
        </button>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm px-1"
        >
          x
        </button>
      </div>

      {showSubtasks && (
        <div className="mt-1">
          {task.subtasks.map((subtask) => (
            <Subtask
              key={subtask.id}
              subtask={subtask}
              todoId={todoId}
              taskId={task.id}
              onUpdate={onUpdate}
            />
          ))}
          <form onSubmit={handleAddSubtask} className="pl-8 mt-1">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add subtask..."
              className="w-full px-2 py-1 text-sm border border-dashed border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </form>
        </div>
      )}
    </div>
  );
}
