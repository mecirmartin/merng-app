import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/graphql';

const DeleteButton = ({ postId, commentId, callback }) => {
  const [open, setOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      if (!commentId) {
        setOpen(false);
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        const resPosts = data.getPosts.filter(p => p.id !== postId);
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: [...resPosts] },
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <Popup
        inverted
        content={`Delete a ${commentId ? 'comment' : 'post'}`}
        trigger={
          <Button
            as='div'
            color='red'
            floated='right'
            onClick={() => setOpen(true)}
          >
            <Icon name='trash' style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
