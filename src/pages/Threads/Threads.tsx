import React, { useEffect, useState } from "react";
import { DropInThread } from "../../model/DropInThread";
import { CreateThreadForm, DropInThreadFormValues } from "../../components/Form/CreateThreadForm";
import { handleGetDropInThreads, handleCreateDropInThread } from "../../services/dropInThreadsService";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import "./Threads.css";
import { useNavigate } from "react-router-dom";

export const ThreadsPage: React.FC = () => {
  const [threads, setThreads] = useState<DropInThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth(); // get user info for creator fields
  var navigate = useNavigate();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await handleGetDropInThreads();
        setThreads(data);
      } catch (err) {
        console.error("Error fetching threads:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const handleCreateThread = async (values: DropInThreadFormValues) => {
    setIsLoading(true);
    try {
      const newThread: DropInThread = {
        id: "", // backend generates
        title: values.title,
        body: values.body,
        creatorName: user?.username || values.creatorName,
        creatorId: user?.id || values.creatorId,
        creatorImageUrl: "",
        createdAt: new Date().toISOString(),
        comments: [],
        likes: [],
        commentCount: 0,
        likeCount: 0,
        extraFields: {},
      };

      const success = await handleCreateDropInThread(newThread);
      if (success) {
        setThreads((prev) => [newThread, ...prev]); // prepend new thread
      }
    } catch (err) {
      console.error("Error creating thread:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="threads-page">
        <div className="threads-header">
      <h1>Threads</h1>
      <button
      onClick={() => setShowCreateForm(true)}
      disabled={!user}
      className="create-thread-btn"
      data-tooltip={user ? undefined : "Login to post"}
        >
      Start a Thread
        </button>

    
    </div>
    {showCreateForm && <CreateThreadForm
        formId="create-thread-form"
        initialValues={{
          title: "",
          body: "",
          creatorName: user?.username || "",
          creatorId: user?.id || "",
          creatorImageUrl: "",
        }}
        onSubmit={handleCreateThread}
      />
    }
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="threads-list">
          {threads.map((thread) => (
            <div key={thread.id} className="thread-card" onClick={() => {
                if (thread.id) {
                  navigate(`/threads/${thread.id}`);
                } else {
                  console.warn("Thread ID is missing, cannot navigate");
                }
              }}>
              <h3>{thread.title}</h3>
              <p>{thread.body}</p>
              <small>
                By {thread.creatorName} on {new Date(thread.createdAt).toLocaleString()}
              </small>
              <div>
                Likes: {thread.likeCount} | Comments: {thread.commentCount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
