import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Modal,
  Button,
  Form,
  Dropdown,
  Container,
  Header,
  Icon,
  Grid,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "../App.css";

const initialTasks = [
  { id: uuid(), name: "Task 1", state: "To-Do", date: new Date() },
  { id: uuid(), name: "Task 2", state: "In-Progress", date: new Date() },
  { id: uuid(), name: "Task 3", state: "Done", date: new Date() },
];

const Formapp = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskState, setTaskState] = useState("To-Do");
  const [taskDate, setTaskDate] = useState(new Date());
  const [editTaskId, setEditTaskId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  //   useEffect(() => {
  //     const storedTasks = localStorage.getItem("tasks");
  //     if (storedTasks) {
  //       setTasks(JSON.parse(storedTasks));
  //     } else {
  //       setTasks(initialTasks);
  //     }
  //   }, []);

  //   useEffect(() => {
  //     localStorage.setItem("tasks", JSON.stringify(tasks));
  //   }, [tasks]);

  const toggleSidebar = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleCreateTask = () => {
    const newTask = {
      id: uuid(),
      name: taskName,
      state: taskState,
      date: taskDate,
    };
    setTasks([...tasks, newTask]);
    setModalOpen(false);
    setTaskName("");
    setTaskState("To-Do");
    setTaskDate(new Date());
    setIsEditMode(false);
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    setTaskName(task.name);
    setTaskState(task.state);
    setTaskDate(task.date);
    setEditTaskId(taskId);
    setModalOpen(true);
    setIsEditMode(true);
  };

  const handleUpdateTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editTaskId
        ? { ...task, name: taskName, state: taskState, date: taskDate }
        : task
    );
    setTasks(updatedTasks);
    setModalOpen(false);
    setTaskName("");
    setTaskState("To-Do");
    setTaskDate(new Date());
    setEditTaskId(null);
    setIsEditMode(false);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    setModalOpen(false);
    setIsEditMode(false);
  };

  const handleTaskDrop = (taskId, newTaskState) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, state: newTaskState } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div>
      <nav className={`sidebar ${isNavCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2>Task Manager</h2>
        </div>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Tasks</a>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
        </ul>
        <button className="collapse-button" onClick={toggleSidebar}>
          {isNavCollapsed ? <Icon name="bars" /> : <Icon name="times" />}
        </button>
      </nav>

      <div className={`content ${isNavCollapsed ? "collapsed" : ""}`}>
        <header className="sticky">
          <Container>
            <Grid verticalAlign="middle" columns={2}>
              <Grid.Column>
                <Header as="h2" icon textAlign="center">
                  <Icon name="user circle" />
                  Task Manager
                </Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
                <Button
                  primary
                  onClick={() => {
                    setModalOpen(true);
                    setIsEditMode(false);
                  }}
                >
                  Create Task
                </Button>
              </Grid.Column>
            </Grid>
          </Container>
        </header>

        <Container>
          <Grid columns={3}>
            {["To-Do", "In-Progress", "Done"].map((state) => (
              <Grid.Column key={state} className={state}>
                <h3>{state}</h3>
                <div
                  className="droppable"
                  onDrop={(e) => {
                    const taskId = e.dataTransfer.getData("text/plain");
                    handleTaskDrop(taskId, state);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {tasks
                    .filter((task) => task.state === state)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="draggable"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", task.id);
                        }}
                        onClick={() => {
                          handleEditTask(task.id);
                        }}
                      >
                        <p>Your Task {task.name}</p>
                        <p>Date - {task.date.toLocaleDateString()}</p>
                      </div>
                    ))}
                </div>
              </Grid.Column>
            ))}
          </Grid>
        </Container>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="tiny">
          <Modal.Header>
            {isEditMode ? "Edit Task" : "Create Task"}
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <Form.Field>
                <label>Task State</label>
                <Dropdown
                  selection
                  options={[
                    { key: "to-do", value: "To-Do", text: "To-Do" },
                    {
                      key: "in-progress",
                      value: "In-Progress",
                      text: "In-Progress",
                    },
                    { key: "done", value: "Done", text: "Done" },
                  ]}
                  value={taskState}
                  onChange={(e, { value }) => setTaskState(value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Task Date</label>
                <DatePicker
                  selected={taskDate}
                  onChange={(date) => setTaskDate(date)}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            {isEditMode && (
              <Button color="red" onClick={() => handleDeleteTask(editTaskId)}>
                Delete
              </Button>
            )}
            <Button
              color="green"
              onClick={isEditMode ? handleUpdateTask : handleCreateTask}
            >
              {isEditMode ? "Update" : "Create"}
            </Button>
            <Button
              onClick={() => {
                setModalOpen(false);
                setIsEditMode(false);
              }}
            >
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
        <footer className="footer">
          <Container textAlign="center">
            <p>&copy; 2023 Task Manager. All rights reserved.</p>
          </Container>
        </footer>
      </div>
    </div>
  );
};

export default Formapp;
