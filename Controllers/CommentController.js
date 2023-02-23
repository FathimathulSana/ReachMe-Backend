import CommentModel from "../Models/CommentModel.js";

export const createComment = async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  try {
    const comment = new CommentModel({
      userId: userId,
      postId: postId,
      comment: req.body.comment,
    });
    await comment.save();
    const newComment = await CommentModel.findById(comment._id).populate('userId');
    res.status(200).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getComments = async (req, res) => {
  const postId = req.params.id;
  try {
    const response = await CommentModel.find({ postId: postId }).populate({
      path: "userId",
      select: { firstname: 1, lastname: 1 },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

//delete comment 
export const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  try {
    const comment = await CommentModel.findById(commentId)
    if (comment) {
      await comment.deleteOne();
      res.status(200).json("comment deleted successfully")
    } else {
      res.status(403).json("Action forbidden")
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

export const editComment = async (req, res) => {
  try {
    const data = await CommentModel.findOneAndUpdate({ _id: req.body.commentId }, { $set: { comment: req.body.comment } })
    res.status(200).json({ data })
  } catch (error) {
    res.status(500).send(error)
  }
}