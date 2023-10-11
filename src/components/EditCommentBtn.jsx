import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function EditCommentBtn(props) {
  return <Link to={`/comments/${props.id}`}>Edit Comment</Link>;
}
