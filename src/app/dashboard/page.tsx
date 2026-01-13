import { UserButton } from "@clerk/nextjs";
import TodoList from "@/components/TodoList";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="py-8 px-4">
        <TodoList />
      </main>
    </div>
  );
}
