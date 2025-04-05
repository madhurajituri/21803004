const express = require("express");
const dotenv = require("dotenv");
const { getUsersData, getPostsData, getCommentsData } = require("./utils");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9876;

app.get("/users", async (req, res) => {
  try {
    const users = await getUsersData();
    const posts = await getPostsData();

    const postCount = {};
    posts.forEach(post => {
      postCount[post.userId] = (postCount[post.userId] || 0) + 1;
    });

    const topUsers = Object.entries(postCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, count]) => {
        const user = users.find(u => u.id == userId);
        return { id: user.id, name: user.name, postCount: count };
      });

    res.json({ topUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/posts", async (req, res) => {
  const type = req.query.type;

  try {
    const posts = await getPostsData();

    if (type === "latest") {
      const latestPosts = posts
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

      return res.json({ latestPosts });
    }

    if (type === "popular") {
      const comments = await getCommentsData();

      const commentCount = {};
      comments.forEach(c => {
        commentCount[c.postId] = (commentCount[c.postId] || 0) + 1;
      });

      const maxCount = Math.max(...Object.values(commentCount));
      const popularPostIds = Object.entries(commentCount)
        .filter(([_, count]) => count === maxCount)
        .map(([postId]) => parseInt(postId));

      const popularPosts = posts.filter(p => popularPostIds.includes(p.id));
      return res.json({ popularPosts });
    }

    return res.status(400).json({ error: "Invalid type. Use ?type=latest or ?type=popular" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
