import { useState, useEffect, useCallback } from 'react'
import { Plus, Check, Trash2, Circle, CheckCircle2, List, Clock, CheckSquare } from 'lucide-react'
import { cn } from './lib/utils'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((e) => {
    e.preventDefault()
    if (!input.trim()) return

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    setTodos(prev => [newTodo, ...prev])
    setInput('')
  }, [input])

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] mb-4 shadow-lg">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent mb-2">
            할 일 관리
          </h1>
          <p className="text-gray-600">오늘 해야 할 일을 체크해보세요</p>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-6 animate-in fade-in slide-in-from-top duration-700 delay-100">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="새로운 할 일을 입력하세요..."
              className="w-full px-6 py-4 pr-14 rounded-2xl border-2 border-gray-200 focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/10 outline-none transition-all duration-200 text-lg bg-white/80 backdrop-blur-sm shadow-sm"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white flex items-center justify-center transition-all duration-200 shadow-md",
                input.trim() 
                  ? "hover:scale-110 hover:shadow-lg active:scale-95" 
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 animate-in fade-in slide-in-from-top duration-700 delay-200">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <List className="w-4 h-4 text-[#6366f1]" />
              <span className="text-sm text-gray-600">전체</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-[#8b5cf6]" />
              <span className="text-sm text-gray-600">진행중</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#ec4899]" />
              <span className="text-sm text-gray-600">완료</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 animate-in fade-in slide-in-from-top duration-700 delay-300">
          {[
            { key: 'all', label: '전체' },
            { key: 'active', label: '진행중' },
            { key: 'completed', label: '완료' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                filter === key
                  ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg scale-105"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-2 border-gray-100 hover:border-gray-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16 animate-in fade-in duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                <CheckCircle2 className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                {filter === 'active' && '진행중인 할 일이 없습니다'}
                {filter === 'completed' && '완료된 할 일이 없습니다'}
                {filter === 'all' && '할 일을 추가해보세요'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-100 hover:border-[#6366f1]/30 hover:shadow-md transition-all duration-200 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                      todo.completed
                        ? "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] border-[#6366f1] scale-110"
                        : "border-gray-300 hover:border-[#6366f1] hover:scale-110"
                    )}
                  >
                    {todo.completed ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Circle className="w-3 h-3 text-transparent" />
                    )}
                  </button>

                  <span
                    className={cn(
                      "flex-1 text-lg transition-all duration-200",
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-900"
                    )}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 animate-in fade-in duration-700 delay-500">
            {stats.completed > 0 && (
              <p>
                🎉 총 {stats.completed}개의 할 일을 완료했습니다!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App