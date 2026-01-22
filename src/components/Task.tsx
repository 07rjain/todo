"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Subtask from "./Subtask";

interface TaskType {
  id: Id<"tasks">;
  title: string;
  completed: boolean;
  subtasks: {
    id: Id<"subtasks">;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface TaskProps {
  task: TaskType;
  todoId: Id<"todos">;
}

export default function Task({ task, todoId }: TaskProps) {
  const { userId } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [newSubtask, setNewSubtask] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(true);

  const updateTask = useMutation(api.todos.updateTask);
  const deleteTask = useMutation(api.todos.deleteTask);
  const createSubtask = useMutation(api.todos.createSubtask);

  const handleToggleComplete = async () => {
    await updateTask({ taskId: task.id, completed: !task.completed });
  };

  const handleUpdate = async () => {
    if (!title.trim()) return;
    await updateTask({ taskId: task.id, title });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteTask({ taskId: task.id });
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim() || !userId) return;
    await createSubtask({ taskId: task.id, userId, title: newSubtask });
    setNewSubtask("");
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  return (
    <div className="group/task">
      {/* Task Row */}
      <div className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
            task.completed 
              ? 'bg-purple-600 border-purple-600' 
              : 'border-slate-300 hover:border-purple-400'
          }`}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="flex-1 px-2 py-1 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            autoFocus
          />
        ) : (
          <span
            className={`flex-1 text-sm cursor-pointer transition-colors ${
              task.completed 
                ? "line-through text-slate-400" 
                : "text-slate-700 hover:text-slate-900"
            }`}
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </span>
        )}

        {/* Subtask Count Badge */}
        {task.subtasks.length > 0 && (
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <svg className={`w-3 h-3 transition-transform ${showSubtasks ? 'rotate-0' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {completedSubtasks}/{task.subtasks.length}
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex-shrink-0 p-1 opacity-0 group-hover/task:opacity-100 text-slate-400 hover:text-red-500 rounded transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Subtasks */}
      {showSubtasks && (
        <div className="ml-8 pl-3 border-l-2 border-slate-100">
          {task.subtasks.map((subtask) => (
            <Subtask
              key={subtask.id}
              subtask={subtask}
            />
          ))}
          
          {/* Add Subtask Form */}
          <form onSubmit={handleAddSubtask} className="py-1">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add subtask..."
              className="w-full px-2 py-1.5 text-xs text-slate-600 bg-transparent border-none placeholder:text-slate-400 focus:outline-none focus:bg-slate-50 rounded transition-colors"
            />
          </form>
        </div>
      )}
    </div>
  );
}
