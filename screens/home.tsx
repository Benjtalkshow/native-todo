import { TodoItem } from "@/components/todo-item";
import { useTodos } from "@/hooks/useTodo";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/styles";

export default function HomeScreen() {
  const {
    filteredTodos,
    searchQuery,
    handleSearch,
    addTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos();

  const [todoText, setTodoText] = useState("");

  const handleAddTodo = async () => {
    await addTodo(todoText);
    setTodoText("");
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => alert("Menu pressed")}>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Profile pressed")}>
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
        <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
          <Ionicons name="add" size={34} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
