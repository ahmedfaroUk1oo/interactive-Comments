import React, { useEffect, useState } from 'react'
import styles from './Comments.module.css';


import {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "../data";
import {cuurentUser} from '../data';
import Comment from './../Comment/Comment';
import CommentForm from './../CommentForm/CommentForm';

export default function Comments({currentUserId}) {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [userContent, setUserContent] = useState({});

  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );


  const getReplies = (commentId) =>
    backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  const addComment = (text, parentId) => {

    createCommentApi(text, parentId ).then((comment) => {
      setBackendComments([ ...backendComments,comment]);
      setActiveComment(null);
    });
  };

  const updateComment = (text, commentId) => {
    updateCommentApi(text).then(() => {
      const updatedBackendComments = backendComments.map((backendComment) => {
        if (backendComment.id === commentId) {
          return { ...backendComment, content: text };
        }
        return backendComment;
      });
      setBackendComments(updatedBackendComments);
      setActiveComment(null);
    });
  };
  const deleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      deleteCommentApi().then(() => {
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment.id !== commentId
        );
        setBackendComments(updatedBackendComments);
      });
    }
  };

  useEffect(() => {
    getCommentsApi().then((data) => {
      setBackendComments(data);
    });
    setUserContent(cuurentUser);
  }, []);


 
  return (<>
    <div className="container">
       {rootComments &&  rootComments.map((rootComment) => <div key={String(rootComment.id)} className={`row my-4 p-2 bg-body-secondary rounded-2 w-75 m-auto`}>
     
          <Comment  key={String(rootComment.id)}
      comment={rootComment}
      cuurentUser={userContent}
      replies={getReplies(rootComment.id)}
      activeComment={activeComment}
      setActiveComment={setActiveComment}
      addComment={addComment}
      deleteComment={deleteComment}
      updateComment={updateComment}
      currentUserId={currentUserId} 
   />
   
 
    </div>)}


<CommentForm submitLabel="Write" cuurentUser={userContent} handleSubmit={addComment}  />
    </div>
    </>
  )
}
