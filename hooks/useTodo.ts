import { TODO_CONSTANTS } from "@/constants/todo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { TodoItemProps } from "../types";

export function useTodos() {
  const [todos, setTodos] = useState<TodoItemProps[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoItemProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem("my-todo");
        const parsed = savedTodos ? JSON.parse(savedTodos) : TODO_CONSTANTS;
        setTodos(parsed);
        setFilteredTodos(parsed);
        if (!savedTodos) {
          await AsyncStorage.setItem("my-todo", JSON.stringify(TODO_CONSTANTS));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getTodos();
  }, []);

  const filterTodos = (query: string, list = todos) => {
    const filtered = list.filter((todo) =>
      todo.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTodos(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterTodos(text);
  };

  const addTodo = async (title: string) => {
    if (!title.trim()) return;
    const newTodo = {
      id: Math.random(),
      title,
      isDone: false,
    };
    const updated = [...todos, newTodo];
    setTodos(updated);
    filterTodos(searchQuery, updated);
    await AsyncStorage.setItem("my-todo", JSON.stringify(updated));
  };

  const deleteTodo = async (id: number) => {
    const updated = todos.filter((todo) => todo.id !== id);
    setTodos(updated);
    filterTodos(searchQuery, updated);
    await AsyncStorage.setItem("my-todo", JSON.stringify(updated));
  };

  const toggleTodo = async (id: number) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
    );
    setTodos(updated);
    filterTodos(searchQuery, updated);
    await AsyncStorage.setItem("my-todo", JSON.stringify(updated));
  };

  return {
    todos,
    filteredTodos,
    searchQuery,
    handleSearch,
    addTodo,
    deleteTodo,
    toggleTodo,
  };
}
