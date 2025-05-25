import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TodoItemProps = {
  id: number;
  title: string;
  isDone: boolean;
};

export default function Index() {
  const TODO_CONSTANTS: TodoItemProps[] = [
    { id: 1, title: "Finish homework", isDone: false },
    { id: 2, title: "Buy groceries", isDone: true },
    { id: 3, title: "Call the dentist", isDone: false },
    { id: 4, title: "Read 10 pages of a book", isDone: false },
    { id: 5, title: "Clean the desk", isDone: true },
    { id: 6, title: "Workout for 30 minutes", isDone: false },
    { id: 7, title: "Reply to emails", isDone: true },
    { id: 8, title: "Water the plants", isDone: false },
    { id: 9, title: "Update portfolio website", isDone: false },
    { id: 10, title: "Organize project files", isDone: true },
  ];

  const [todos, setTodos] = useState<TodoItemProps[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoItemProps[]>([]);
  const [todoText, setTodoText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const addTodo = async () => {
    if (!todoText.trim()) return;
    const newTodo = {
      id: Math.random(),
      title: todoText,
      isDone: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    filterTodos(searchQuery, updatedTodos);
    await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTodos));
    setTodoText("");
    Keyboard.dismiss();
  };

  const deleteTodo = async (id: number) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    filterTodos(searchQuery, newTodos);
    await AsyncStorage.setItem("my-todo", JSON.stringify(newTodos));
  };

  const toggleTodo = async (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
    );
    setTodos(updatedTodos);
    filterTodos(searchQuery, updatedTodos);
    await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTodos));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => alert("Iphone 12 pro!!")}>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("hello")}>
          <Image
            source={{
              uri: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Photos.png",
            }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={24} color="#000" />
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={[...filteredTodos].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem todo={item} onDelete={deleteTodo} onToggle={toggleTodo} />
        )}
      />

      <KeyboardAvoidingView
        style={styles.footer}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <TextInput
          placeholder="Add new Todo"
          placeholderTextColor="#999"
          style={styles.newTodoInput}
          onChangeText={(text) => setTodoText(text)}
          value={todoText}
        />
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Ionicons name="add" size={34} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TodoItem({
  todo,
  onDelete,
  onToggle,
}: {
  todo: TodoItemProps;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) {
  return (
    <View style={styles.todoContainer}>
      <View style={styles.todoInfoContainer}>
        <Checkbox
          value={todo.isDone}
          onValueChange={() => onToggle(todo.id)}
          color={todo.isDone ? "#4630EB" : undefined}
        />
        <Text
          style={[
            styles.todoText,
            todo.isDone && { textDecorationLine: "line-through" },
          ]}
        >
          {todo.title}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(todo.id)}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  search: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 8,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
    alignItems: "center"
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  todoContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  todoInfoContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  todoText: {
    fontSize: 16,
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newTodoInput: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: "#000",
  },
  addButton: {
    backgroundColor: "#4630EB",
    padding: 8,
    borderRadius: 10,
    marginLeft: 20,
  },
});
