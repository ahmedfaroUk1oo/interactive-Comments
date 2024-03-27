import React, { useState } from 'react'
import styles from './CommentForm.module.css';
import img1 from '../../Assets/images/avatars/image-juliusomo.png'

export default function CommentForm({ name,handleSubmit,
  submitLabel,
  hasCancelButton = false,
  handleCancel,
  initialText = "",cuurentUser}) {
    const [text, setText] = useState(initialText);
    const isTextareaDisabled = text.length === 0;
    const onSubmit = (event) => {
      event.preventDefault();
      handleSubmit(text);
      setText("");
    };

  return (
    <>
      <form onSubmit={onSubmit} >
      <div className="commment w-75 m-auto d-flex justify-content-between align-items-center py-4 flex-wrap">
      <img src={img1} alt="user" className='mb-2' />
      <textarea name="" value={text} onChange={(e)=> setText(e.target.value)} id="" cols="100" rows="5" className='resize rounded-2 p-2 mb-2'  placeholder='Add a comment...'></textarea>
      <button className='btn btn-success'disabled={isTextareaDisabled} >{submitLabel}</button>
      {hasCancelButton && (
         <button className='btn btn-success' onClick={handleCancel}  type="button">Cancel</button> )}
    </div>
      </form>
    </>
  )
}
