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
  const progress = todo.tasks.length > 0 ? (completedTasks / todo.tasks.length) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
            >
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleUpdate}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                className="flex-1 px-3 py-1.5 text-lg font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
              />
            ) : (
              <h3
                className="text-lg font-semibold text-slate-900 cursor-pointer truncate hover:text-purple-600 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                {todo.title}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {todo.tasks.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {completedTasks}/{todo.tasks.length}
                </span>
              </div>
            )}
            <button
              onClick={handleDelete}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete todo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-5 py-4">
          {/* Tasks List */}
          {todo.tasks.length > 0 && (
            <div className="space-y-1 mb-4">
              {todo.tasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  todoId={todo.id}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}

          {/* Add Task Form */}
          <form onSubmit={handleAddTask}>
            <div className="flex items-center gap-2 group">
              <div className="w-5 h-5 flex items-center justify-center text-slate-300 group-focus-within:text-purple-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task..."
                className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-transparent rounded-lg placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-200 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
