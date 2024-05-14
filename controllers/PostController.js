import PostModel from '../models/Post.js';

export const postGetAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    
    res.json(posts);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get articles"
    });    
  }
};

export const postGetOne = (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    )
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      res.json(doc);
    })
    .catch((err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Error return article",
        });
      }
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get articles"
    });    
  }
};

export const postCreate = async (req, res) => {
  try {
    const doc = new PostModel({
      user: req.userId,
      text: req.body.text,
      tags: req.body.tags,
      title: req.body.title,
      imgUrl: req.body.imgUrl,
    });

    const post = await doc.save();

    res.json(post);    
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: 'Failed to create article!'
    });
  }
}

export const postRemove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId,
    }).then(doc => res.json({
      message: 'Article has been deleted'
    }))

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: 'Failed to get articles'
    });
  }
}

export const postUpdate = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne({
      _id: postId,
    }, {
      user: req.userId,
      text: req.body.text,
      tags: req.body.tags,
      title: req.body.title,
      imgUrl: req.body.imgUrl,
    })

    res.json({
      message: 'Article has been updated'
    });
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: 'Failed to update article'
    });
  }
}