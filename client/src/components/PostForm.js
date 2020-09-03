import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

const PostForm = () => {
  const { onSubmit, onChange, values } = useForm(createPostCallback, {
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts] },
      });
      values.body = '';
    },
    onError(err) {},
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      {' '}
      <Form onSubmit={onSubmit}>
        <h2> Create post</h2>
        <Form.Input
          placeholder='ChatX'
          name='body'
          onChange={onChange}
          value={values.body}
          error={error ? true : false}
        />
        <Button type='submit' color='purple'>
          Submit post
        </Button>
      </Form>
      {error && (
        <div style={{ marginBottom: 20 }} className='ui error message'>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

export default PostForm;
