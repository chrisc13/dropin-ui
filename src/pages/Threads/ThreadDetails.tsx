import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { Comment, DropInThread, Like } from "../../model/DropInThread";
import { handleAddThreadComment, handleAddThreadLike, handleGetDropInThreadById, handleRemoveThreadLike } from "../../services/dropInThreadsService";
import { useParams } from "react-router-dom";
import { CreateCommentForm, CommentFormValues } from "../../components/Form/CreateCommentForm";
import { useAuth } from "../../context/AuthContext";
import "./ThreadDetails.css";

export const ThreadDetails: React.FC = () =>{
    const { id } = useParams<{ id: string }>(); // read :id from URL
    const [thread, setThread] = useState<DropInThread>();
    const [isLoading, setIsLoading] = useState(true);
    const [showThreadCommentForm, setShowThreadCommentForm] = useState(false);
    const { user } = useAuth(); // get user info for creator fields

    useEffect(() => {
        if (!id) return;

        const fetchThread = async () =>{
            try{
                const data = await handleGetDropInThreadById(id);
                setThread(data)
            }catch (err){
                console.log(err)
            }finally{
                setIsLoading(false)
            }
        }
        fetchThread();
    }
    ,[])

    const updateStateWithComment = (newComment: Comment) =>{
        if (!thread) return;
        setThread({
            ...thread,
            comments: [newComment, ...(thread.comments ?? [])], // prepend safely
            title: thread.title ?? "",                           // required string
            body: thread.body ?? "",
            creatorName: thread.creatorName ?? "Anonymous",
            creatorId: thread.creatorId ?? "",
            creatorImageUrl: thread.creatorImageUrl ?? "",
            createdAt: thread.createdAt ?? new Date().toISOString(),
            likes: thread.likes ?? [],
            commentCount: (thread.commentCount ?? 0) + 1,       // update count
            likeCount: thread.likeCount ?? 0,
            extraFields: thread.extraFields ?? {},
          });
        
    }

    const handleAddComment = async (values: CommentFormValues) => {
        if (!id) return;

        setIsLoading(true);
        try {
          const newComment: Comment = {
            id: "",
            threadId: id,
            body: values.body,
            username: user?.username || values.username,
            userId: user?.id || values.userId,
            userImageUrl: "",
            createdAt: new Date().toISOString()
          };
    
          const success = await handleAddThreadComment(newComment, id);
          if (success) {
            updateStateWithComment(newComment)
          }
        } catch (err) {
          console.error("Error creating thread:", err);
        } finally {
          setIsLoading(false);
          setShowThreadCommentForm(false);
        }
    };
    const handleLike = async (isUpvote: boolean) => {
        if (!thread || !id || !user) return;
      
        // Determine if user has already liked
        const existingLike = thread.likes.find((l) => l.username === user.username);
      
        try {
          if (isUpvote) {
            // Only allow like if not already liked
            if (!existingLike) {
              const newLike: Like = {
                username: user.username,
                userId: user.id,
                createdAt: new Date().toISOString(),
              };
      
              const success = await handleAddThreadLike(newLike, id);
              if (success) {
                setThread({
                  ...thread,
                  likes: [...thread.likes, newLike],
                  likeCount: thread.likeCount + 1,
                });
              }
            }
          } else {
            // Downvote = remove like if exists
            if (existingLike && existingLike.id) {
              const success = await handleRemoveThreadLike(existingLike.id);
              if (success) {
                setThread({
                  ...thread,
                  likes: thread.likes.filter((l) => l.userId !== user.id),
                  likeCount: Math.max(0, thread.likeCount - 1),
                });
              }
            }
          }
        } catch (err) {
          console.error("Error updating like:", err);
        }
      };
      
    
    return (
        <div className="thread-details-wrapper">
          {isLoading || !thread ? (
            <LoadingSpinner />
          ) : (
            <div key={thread.id} className="thread-details-card">
              <div className="thread-layout">
                {/* LEFT VOTE COLUMN */}
                <div className="vote-column">
                  <button
                    className="vote-btn"
                    onClick={() => handleLike(true)}
                    disabled={!user}
                    title={user ? "Upvote" : "Login to vote"}
                  >
                    <img src="/images/up-arrow.png" alt="Upvote" />
                  </button>
                  <div className="vote-count">{thread.likeCount || 0}</div>
                  <button
                    className="vote-btn"
                    onClick={() => handleLike(false)}
                    disabled={!user}
                    title={user ? "Downvote" : "Login to vote"}
                  >
                    <img src="/images/down-arrow.png" alt="Downvote" />
                  </button>
                </div>
      
                {/* MAIN THREAD CONTENT */}
                <div className="thread-main">
                  <h3>{thread.title}</h3>
                  <p>{thread.body}</p>
                  <small>
                    By {thread.creatorName} on{" "}
                    {new Date(thread.createdAt).toLocaleString()}
                  </small>
                  <div className="thread-meta">
                    💬 {thread.commentCount} comments
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
                onClick={() => setShowThreadCommentForm(true)}
                disabled={!user}
                className="create-thread-btn"
                data-tooltip={user ? undefined : "Login to comment"}
        >
            Add Comment
        </button>
          {showThreadCommentForm && id && (
            <CreateCommentForm
              formId="add-thread-comment-form"
              initialValues={{
                username: user?.username || "",
                userId: user?.id || "",
                threadId: id,
                body: "",
                userImageUrl: "",
              }}
              onSubmit={handleAddComment}
            />
          )}

        {thread?.comments?.length ? (
        <div className="comments-wrapper">
            {thread.comments.map((comment, index) => (
            <div key={index} className="comment-card">
                <div className="comment-header">
                {comment.userImageUrl && (
                    <img
                    src={comment.userImageUrl}
                    alt={comment.username}
                    className="comment-avatar"
                    />
                )}
                <strong>{comment.username}</strong>
                <small>{new Date(comment.createdAt || "").toLocaleString()}</small>
                </div>
                <p className="comment-body">{comment.body}</p>
            </div>
            ))}
        </div>
        ) : (
        <p className="no-comments">No comments yet.</p>
        )}
        </div>
      );
}