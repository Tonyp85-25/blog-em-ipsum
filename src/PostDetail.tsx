import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { Post } from "./types";

async function fetchComments(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", body: '{ title: "REACT QUERY FOREVER!!!!" }' }
  );
  return response.json();
}

interface Comment {
  id: number;
  email: string;
  body: string;
}

export function PostDetail({ post }: { post: Post }) {
  const { data, isLoading, isError, error }: UseQueryResult<Comment[], Error> =
    useQuery({
      queryKey: ["comments", post.id],
      queryFn: () => fetchComments(post.id),
    });

  const deleteMutation = useMutation<Comment[], Error, number>({
    mutationFn: (postId: number) => deletePost(postId),
  });

  const updateMutation = useMutation<Comment[], Error, number>({
    mutationFn: (postId: number) => updatePost(postId),
  });

  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  if (isError) {
    return (
      <>
        <h3>Oops! Something went wrong!</h3>
        <p>{error.message}</p>
      </>
    );
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>

      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isLoading && (
        <p style={{ color: "purple" }}>Deleting...</p>
      )}
      {deleteMutation.isError && (
        <p style={{ color: "red" }}>{deleteMutation.error.message}</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>(not)Deleted!</p>
      )}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {updateMutation.isLoading && (
        <p style={{ color: "purple" }}>Updating...</p>
      )}
      {updateMutation.isError && (
        <p style={{ color: "red" }}>{updateMutation.error.message}</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: "green" }}>(not)Updated!</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
