const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
const tasks = [];
let calls = 0;

server.use((req, res, next) => {
  calls++;
  console.log(`Number of calls: ${calls}`);
  return next();
});

function checkProjectExistence(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) {
    return res.status(400).json({ error: "Project doesn't exists." });
  }
  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExistence, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(projects);
});

server.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", (req, res) => {
  const { id } = req.params;

  const projectIdx = projects.findIndex(p => p.id == id);

  projects.splice(projectIdx, 1);

  return res.send();
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.listen(3000);
