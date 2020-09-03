import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Label, Icon, Popup } from 'semantic-ui-react';

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
  const [liked, setLiked] = useState(false);
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [likes, user]);

  const likeButton = user ? (
    liked ? (
      <Button color='purple'>
        <Icon name='heart' />
        Like
      </Button>
    ) : (
      <Button color='purple' basic>
        <Icon name='heart' />
        Like
      </Button>
    )
  ) : (
    <Button color='purple' basic as={Link} to='/login'>
      <Icon name='heart' />
      Like
    </Button>
  );

  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
      <Popup
        inverted
        content={liked ? 'Unlike' : 'Like'}
        trigger={likeButton}
      />
      <Label as='a' basic color='purple' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
