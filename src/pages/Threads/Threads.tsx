import React, { useEffect, useState } from "react";
import { DropInThread } from "../../model/DropInThread";
import { CreateThreadForm, DropInThreadFormValues } from "../../components/Form/CreateThreadForm";
import { handleGetDropInThreads, handleCreateDropInThread } from "../../services/dropInThreadsService";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import "./Threads.css";

export const ThreadsPage: React.FC = () => {
  const [threads, setThreads] = useState<DropInThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // get user info for creator fields

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
      <h1>Community Threads</h1>

      {user ? <CreateThreadForm
        formId="create-thread-form"
        initialValues={{
          title: "",
          body: "",
          creatorName: user?.username || "",
          creatorId: user?.id || "",
          creatorImageUrl: "",
        }}
        onSubmit={handleCreateThread}
      /> : <button
      className="create-thread-btn"
      data-tooltip={user ? "" : "Login to post"}
    >
      Start a Thread
    </button>
    }

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="threads-list">
          {threads.map((thread) => (
            <div key={thread.id} className="thread-card">
              <h3>{thread.title}</h3>
              <p>{thread.body}</p>
              <small>
                By {thread.creatorName} on {new Date(thread.createdAt).toLocaleString()}
              </small>
              <div>
                Likes: {thread.likes?.length || 0} | Comments: {thread.comments?.length || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
