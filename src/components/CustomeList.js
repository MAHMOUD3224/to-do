import { useParams } from "react-router-dom";
import { useTodo } from "../contexts/TodoContext";
import { Checkbox } from "@mui/material";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import PageNotFound from "./pageNotFound";

export default function CustomList() {
  let { sectionId } = useParams();
  const { sections, tasks, taskCompleted, addTask, removeTask } = useTodo();

  // تحقق لو القسم مش موجود
  if (!sections[sectionId]) {
    return <PageNotFound />;
  }

  // لو مفيش مهام بعد
  if (!tasks[sectionId]) {
    return (
      <div
        style={{
          position: "absolute",
          background: "#0000007d",
          backdropFilter: "blur(4px)",
          borderRadius: "10px",
          textAlign: "center",
          top: "50%",
          color: "white",
          direction: "ltr",
          width: "90%",
          maxWidth: "400px",
          padding: "20px 15px",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h2>Add Task here</h2>
      </div>
    );
  }

  // دالة لطباعة (للتحقق فقط)
  const print = (e) => {
    e.preventDefault();
    console.log("s");
  };

  // دالة لتحديد المهمة كمكتملة
  const checkAsCompleted = (sectionName, taskId) => {
    console.log(sectionName, taskId);
    taskCompleted(sectionName, taskId);
  };

  // إعدادات الـ Checkbox
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // جلب اسم القسم لاستخدامه في الـ title
  const sectionName = sections[sectionId]?.name || 'قائمة غير معرفه'; // افتراضي لو مفيش اسم

  return (

      <ul className="task-list">
        {tasks[sectionId].map((task) => (
          <li
            className={task.completed ? "completed" : ""}
            onContextMenu={(e) => print(e)}
            key={task.id}
            id={`task-${task.id}`}
          >
            <div className="task-item">
              <Checkbox
                {...label}
                style={{ color: "#1976D2" }}
                checked={task.completed}
                onChange={() => checkAsCompleted(sectionId, task.id)}
              />
              <p>
                {task.title.match(/.{1,45}/g)?.map((chunk, index, arr) => (
                  <span key={index}>
                    {chunk}
                    {index < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
            <span style={{ display: "grid" }}>
              <StarBorderPurple500OutlinedIcon
                style={{ color: task.important ? "deeppink" : 'lightgray', cursor: "pointer" }}
              />
            </span>
          </li>
        ))}
      </ul>
  );
}