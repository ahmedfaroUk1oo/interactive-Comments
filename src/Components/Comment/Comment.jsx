import React, { useState } from "react";
import styles from "./Comment.module.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { deleteCommentApi } from "../data";

import { cuurentUser } from "../data";
import CommentForm from "./../CommentForm/CommentForm";

export default function Comment({
  comment,
  cuurentUser,
  replies,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId = null,
  currentUserId,
  
}) {
  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";
  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";

  const canDelete = currentUserId === comment.userId && replies.length === 0;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.userId;
  const replyId = parentId ? parentId : comment.id;
  const createdAt = new Date(comment.createdAt).toLocaleDateString();
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [time, setTime] = useState(new Date());



  const Time = () => {
    TimeAgo.addLocale(en);

 
    const timeAgo = new TimeAgo("en-US");
    const inSeconds = new Date(time).getTime();
    const minutesAgo = timeAgo.format(inSeconds - 60 * 1000);

    return <p className="text-muted p-0 m-0 me-2">{minutesAgo}</p>;
  };



  const [number, setNumber] = useState(comment.score);
  const [ShowPlus, setShowPlus] = useState(true);
  const [ShowMinus, setShowMinus] = useState(true);

  const old = comment.score;
  const newScorePlus = parseInt(comment.score) + 1;
  const newScoreMinus = parseInt(comment.score + 1) - 1;

  return (
    <>
      <div className={`col-md-1 ${styles.width}`}>
        <div className={` ${styles.score} bg-white rounded-2 `}>
          <button
            className="border-0 bg-transparent"
            onClick={() => {
         


              if (parseInt(number) <= parseInt(comment.score)) {
                setNumber(parseInt(number) + 1);
              } else if(parseInt(number)> parseInt(comment.score)){
                setNumber(parseInt(comment.score) + 1);
              }
            }}
          >
            <i className="fa-solid fa-plus fs-4"></i>
          </button>
          <p className="m-0 p-0 py-2 fw-bold fs-3">
    
            {number}

          </p>
          <button
            className="border-0 bg-transparent"
            onClick={() => {
        
              if(parseInt(number)>=parseInt(comment.score)){
                if(comment.score === 0) {
                  setNumber(parseInt(comment.score))
                }else {

                  setNumber(parseInt(number) -1);
                }
                
              }else if (parseInt(number)<= parseInt(comment.score) -2) {

                setNumber(parseInt(comment.score) - 1);
                
              }
     
            }}
          >
            {" "}
            <i className="fa-solid fa-minus  fs-4"></i>
          </button>
        </div>
      </div>
      <div className="col-md-11">
        <div className="info d-flex justify-content-between align-items-center flex-wrap">
          <div className="name d-flex justify-content-start align-items-center flex-wrap">
            <img
              src={comment.user.image}
              alt=""
              className="img-fluid rounded-circle me-2"
            />
            <h4 className="me-5 fw-bold">{comment.user.username}</h4>
            {comment.user.username === "juliusomo" ? (
              <span className="text-white bg-blue rounded-2 p-2 mb-1 me-2">
                You
              </span>
            ) : (
              ""
            )}
            <Time />
          </div>
          <div className="comment-actions d-flex align-items-center flex-wrap">
            {canReply && (
              <div
                className="comment-action fw-bold me-4"
                onClick={() =>
                  setActiveComment({ id: comment.id, type: "replying" })
                }
              >
                Reply
              </div>
            )}

            {canEdit && (
              <div
                className="comment-action btn btn-success me-4"
                onClick={() =>
                  setActiveComment({ id: comment.id, type: "editing" })
                }
              >
                Edit
              </div>
            )}

            {canDelete && (
              <div
                className="comment-action btn btn-danger"
                onClick={() => deleteComment(comment.id)}
              >
                Delete
              </div>
            )}
          </div>
        </div>
        <div className="rootComment ">
          <p className="mt-2 fs-5 text-muted text-break p-2">
        
            {comment.content}
          </p>
        </div>
      </div>

      {!isEditing && <div className="comment-text">{comment.body}</div>}
      {isEditing && (
        <CommentForm
          submitLabel="Update"
          hasCancelButton
          initialText={comment.body}
          handleSubmit={(text) => updateComment(text, comment.id)}
          handleCancel={() => {
            setActiveComment(null);
          }}
          cuurentUser={cuurentUser}
        />
      )}

      {isReplying && (
        <CommentForm
          submitLabel="Reply"
          handleSubmit={(text) => addComment(text, replyId)}
          cuurentUser={cuurentUser}
        />
      )}

      {replies.length > 0 && (
        <div className="container border-start border-start-1 border-light ms-4 mt-2">
          {replies.map((reply) => (
            <>
              {" "}
              <div className="container  mt-2 ">
                <div className="row mb-3 ms-3 ">
                  <Comment
                    comment={reply}
                    key={reply.id}
                    setActiveComment={setActiveComment}
                    activeComment={activeComment}
                    updateComment={updateComment}
                    deleteComment={deleteComment}
                    addComment={addComment}
                    parentId={comment.id}
                    replies={[]}
                    currentUserId={currentUserId}
                  />
                </div>
              </div>
            </>
          ))}
        </div>
      )}
    </>
  );
}
