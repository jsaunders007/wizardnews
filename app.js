const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  const posts = postBank.list();
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          (post) => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
        )
        .join("")}
    </div>
  </body>
</html>`);
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    throw new Error("Not Found");
  }
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
  <div class='news-item'>
    <p>
      <span class="news-position">${post.id}. ▲</span>${post.title}
      <small>(by ${post.name})</small><br></br>
    </p>
    <small class="news-info">
      ${post.content}<br></br>${post.date}
    </small>
  </div>`);
});

app.use(express.static("public"));
const { PORT = 1337 } = process.env;

// app.use((req, res, next) => {
//   res.status(404).send("<h1>Page Not Found!</h1>");
// });
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send("Not Found!");
});

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
