import { useState } from "react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { PostDetail } from "./PostDetail";
import { Post } from "./types";
const maxPostPage = 10;

async function fetchPosts(pageNumber: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNumber}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // replace with useQuery
  const { data, isError, error, isLoading }: UseQueryResult<Post[], Error> =
    useQuery({
      queryKey: ["posts", currentPage],
      queryFn: () => fetchPosts(currentPage),
      staleTime: 2000,
    });
  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Oops something went wrong</h3>
        <p>{error.message}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
