import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/styles";
import { TodoItemProps } from "../types";

export function TodoItem({
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
