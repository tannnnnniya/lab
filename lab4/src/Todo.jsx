import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleComplete, deleteTodo } from "./todoSlice";

const Todo = () => {
    const [text, setText] = useState("");
    const [deadline, setDeadline] = useState("");
    const [filter, setFilter] = useState("all");
    const todos = useSelector((state) => state.todos);
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleDeadlineChange = (e) => {
        setDeadline(e.target.value);
    };

    const handleAddTodo = () => {
      if (text.trim() && deadline) {
          dispatch(addTodo({ text, deadline }));
          setText("");
          setDeadline("");
        }
    }; 

    const filteredTodos = todos.filter((todo) => {
      if (filter === "active") {
        return !todo.completed;
      }
      if (filter === "completed"){
        return todo.completed;
      }
      return true;
    });

    const groupedTodos = filteredTodos.reduce((acc, todo) => {
      const date = new Date(todo.id).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(todo);
      return acc;
    }, {});

    const getDeadlineStyle = (deadline) => {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diffHours = (deadlineDate - now) / (1000 * 60 * 60);

      if (diffHours <= 0){
        return { color: "red", fontWeight: "bold" };
      }
      if (diffHours <= 24){
        return { color: "orange", fontWeight: "bold" };
      }
      return { color: "green", fontWeight: "bold" };
    };

    return (
      <div>
        <input type="text" value={text} onChange={handleInputChange} placeholder="Введите задачу" />
        <input type="datetime-local" value={deadline} onChange={handleDeadlineChange} />
        <button onClick={handleAddTodo}>Добавить</button>
        
        <div>
          <button onClick={() => setFilter("all")}>Все</button>
          <button onClick={() => setFilter("active")}>Активные</button>
          <button onClick={() => setFilter("completed")}>Завершенные</button>
        </div>

        {Object.keys(groupedTodos).map((date) => (
          <div key={date}>
            <h3>{date}</h3>
            <ul>
              {groupedTodos[date].map((todo) => (
                <li key={todo.id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                  <input type="checkbox" checked={todo.completed} onChange={() => dispatch(toggleComplete(todo.id))} />
                  {todo.text}
                  {!todo.completed ? (
                    <span style={getDeadlineStyle(todo.deadline)}> (Дедлайн: {new Date(todo.deadline).toLocaleString()})</span>
                  ) : (
                    <span style={{ color: "gray" }}> (Завершено: {new Date(todo.completedAt).toLocaleString()})</span>
                  )}
                  <button onClick={() => dispatch(deleteTodo(todo.id))}> Удалить </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );      
};

export default Todo;