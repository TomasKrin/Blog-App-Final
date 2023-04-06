require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

const { URI } = process.env;

const client = new MongoClient(URI, {
  connectTimeoutMS: 90000,
  maxIdleTimeMS: 90000,
});

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    if (
      req.body.name
      && req.body.last_name
      && req.body.email
      && req.body.nickname
      && req.body.password
    ) {
      const con = await client.connect();
      const userExists = await con
        .db("BlogProject")
        .collection("users")
        .findOne({
          email: req.body.email,
          nickname: req.body.nickname,
        });
      if (userExists) {
        await con.close();
        res.status(409).send("User already exists");
      } else {
        const data = await con.db("BlogProject").collection("users").insertOne({
          name: req.body.name,
          last_name: req.body.last_name,
          email: req.body.email,
          nickname: req.body.nickname,
          password: req.body.password,
          disliked_posts: [],
          liked_posts: [],
        });
        await con.close();
        res.send(data);
      }
    } else {
      res.status(400).send("Bad Request");
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post("/login", async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      const con = await client.connect();
      const data = await con
        .db("BlogProject")
        .collection("users")
        .aggregate([
          {
            $match: { email: req.body.email, password: req.body.password },
          },
          {
            $lookup: {
              from: "questions",
              localField: "_id",
              foreignField: "user_id",
              as: "questions",
            },
          },
          {
            $lookup: {
              from: "answers",
              localField: "_id",
              foreignField: "user_id",
              as: "answers",
            },
          },
          {
            $project: {
              password: 0,
            },
          },
        ])
        .toArray();
      await con.close();
      if (data.length !== 0) {
        res.send(data);
      } else {
        res.status(400).send("User doesn't exist");
      }
    } else {
      res.status(400).send("Bad Request");
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const key = req.params.id;
    const con = await client.connect();
    const data = await con
      .db("BlogProject")
      .collection("users")
      .aggregate([
        {
          $match: { _id: new ObjectId(key) },
        },
        {
          $lookup: {
            from: "questions",
            localField: "_id",
            foreignField: "user_id",
            as: "questions",
          },
        },
        {
          $lookup: {
            from: "answers",
            localField: "_id",
            foreignField: "user_id",
            as: "answers",
          },
        },
        {
          $project: {
            password: 0,
          },
        },
      ])
      .toArray();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.patch("/user/:id/posts/:post_id/likes", async (req, res) => {
  if (req.body.type && req.params.post_id) {
    const userId = req.params.id;
    const postId = req.params.post_id;
    const newLikedPost = { postId: new ObjectId(postId), type: req.body.type };
    try {
      const con = await client.connect();
      const user = await con
        .db("BlogProject")
        .collection("users")
        .findOne({ _id: new ObjectId(userId) });

      const likedPostCheck = user.liked_posts.some(
        (post) => post.postId.toString() === postId,
      );
      const dislikedPostCheck = user.disliked_posts.some(
        (post) => post.postId.toString() === postId,
      );
      if (!likedPostCheck) {
        await con
          .db("BlogProject")
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $push: { liked_posts: newLikedPost } },
          );

        if (dislikedPostCheck) {
          await con
            .db("BlogProject")
            .collection("users")
            .updateOne(
              { _id: new ObjectId(userId) },
              { $pull: { disliked_posts: { postId: new ObjectId(postId) } } },
            );
        }
        res.send("Post has been added to liked posts.");
      } else {
        await con
          .db("BlogProject")
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { liked_posts: { postId: new ObjectId(postId) } } },
          );
        res.send("Post has been removed from liked posts.");
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  } else {
    res.status(400).send("Bad request");
  }
});

app.patch("/user/:id/posts/:post_id/dislikes", async (req, res) => {
  if (req.body.type && req.params.post_id) {
    const userId = req.params.id;
    const postId = req.params.post_id;
    const newDislikedPost = {
      postId: new ObjectId(postId),
      type: req.body.type,
    };
    try {
      const con = await client.connect();
      const user = await con
        .db("BlogProject")
        .collection("users")
        .findOne({ _id: new ObjectId(userId) });

      const likedPostCheck = user.liked_posts.some(
        (post) => post.postId.toString() === postId,
      );
      const dislikedPostCheck = user.disliked_posts.some(
        (post) => post.postId.toString() === postId,
      );
      if (!dislikedPostCheck) {
        await con
          .db("BlogProject")
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $push: { disliked_posts: newDislikedPost } },
          );

        if (likedPostCheck) {
          await con
            .db("BlogProject")
            .collection("users")
            .updateOne(
              { _id: new ObjectId(userId) },
              { $pull: { liked_posts: { postId: new ObjectId(postId) } } },
            );
        }
        res.send("Post has been added to disliked posts.");
      } else {
        await con
          .db("BlogProject")
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { disliked_posts: { postId: new ObjectId(postId) } } },
          );
        res.send("Post has been removed from disliked posts.");
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  } else {
    res.status(400).send("Bad request");
  }
});

app.get("/questions", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("BlogProject")
      .collection("questions")
      .aggregate([
        {
          $lookup: {
            from: "answers",
            localField: "_id",
            foreignField: "question_id",
            as: "answers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: "$_id",
            date: "$date",
            title: "$title",
            question: "$question",
            edited: "$edited",
            type: "$type",
            user: {
              nickname: "$user.nickname",
              _id: "$user_id",
            },
            answers: "$answers",
          },
        },
        { $unwind: "$user" },
        { $unwind: "$user.nickname" },
        { $unwind: "$user._id" },
      ])
      .toArray();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post("/questions", async (req, res) => {
  try {
    if (
      req.body.question
      && req.body.user_id
      && req.body.title
      && req.body.type
    ) {
      const con = await client.connect();
      const data = await con
        .db("BlogProject")
        .collection("questions")
        .insertOne({
          date: new Date().toLocaleDateString("lt", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          title: req.body.title,
          question: req.body.question,
          user_id: new ObjectId(req.body.user_id),
          type: req.body.type,
          edited: false,
        });

      await con.close();
      res.send(data);
    } else {
      res.status(400).send("Bad Request");
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.patch("/questions/:id", async (req, res) => {
  const key = req.params.id;
  try {
    if (req.body.question && req.body.title) {
      const con = await client.connect();
      const data = await con
        .db("BlogProject")
        .collection("questions")
        .updateOne(
          { _id: new ObjectId(key) },
          {
            $set: {
              title: req.body.title,
              question: req.body.question,
              edited: true,
            },
          },
        );
      await con.close();
      res.send(data);
    } else {
      res.status(400).send("Bad Request");
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.delete("/questions/:id", async (req, res) => {
  const questionId = req.params.id;
  try {
    const con = await client.connect();
    const answers = await con
      .db("BlogProject")
      .collection("answers")
      .deleteMany({ question_id: new ObjectId(questionId) });
    const question = await con
      .db("BlogProject")
      .collection("questions")
      .deleteOne({ _id: new ObjectId(questionId) });
    const usersCollection = con.db("BlogProject").collection("users");
    await usersCollection.updateMany(
      {},
      {
        $pull: {
          liked_posts: { postId: new ObjectId(questionId) },
          disliked_posts: { postId: new ObjectId(questionId) },
        },
      },
    );
    res.send({
      message: `Deleted question ${question} and ${answers.deletedCount} corresponding answers`,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post("/questions/:id/answers", async (req, res) => {
  try {
    if (req.body.answer && req.body.user_id && req.body.type) {
      const key = req.params.id;
      const con = await client.connect();
      const data = await con
        .db("BlogProject")
        .collection("answers")
        .insertOne({
          date: new Date().toLocaleDateString("lt", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          answer: req.body.answer,
          question_id: new ObjectId(key),
          user_id: new ObjectId(req.body.user_id),
          user_nickname: req.body.user_nickname,
          type: req.body.type,
          edited: false,
        });
      await con.close();
      res.send(data);
    } else {
      res.status(400).send("Bad Request");
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.patch("/answers/:id", async (req, res) => {
  const key = req.params.id;
  try {
    if (req.body.answer) {
      const con = await client.connect();
      const data = await con
        .db("BlogProject")
        .collection("answers")
        .updateOne(
          { _id: new ObjectId(key) },
          {
            $set: {
              answer: req.body.answer,
              edited: true,
            },
          },
        );
      await con.close();
      res.send(data);
    } else {
      res.status(400).send("Bad Request");
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.delete("/answers/:id", async (req, res) => {
  const key = req.params.id;
  try {
    const con = await client.connect();
    const answersCollection = con.db("BlogProject").collection("answers");
    const usersCollection = con.db("BlogProject").collection("users");
    const data = await answersCollection.deleteOne({ _id: new ObjectId(key) });
    await usersCollection.updateMany(
      {},
      {
        $pull: {
          liked_posts: { postId: new ObjectId(key) },
          disliked_posts: { postId: new ObjectId(key) },
        },
      },
    );
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(PORT, () => {
  console.log(`It works on ${PORT} port`);
});
