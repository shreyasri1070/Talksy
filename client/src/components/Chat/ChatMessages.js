import React, { useEffect, useRef } from "react";

const MessageBubble = ({ message }) => {
  const renderMedia = () => {
    if (!message.mediaUrl) return null;

    if (message.mediaType === "image") {
      return (
        <a href={message.mediaUrl} target="_blank" rel="noreferrer">
          <img
            src={message.mediaUrl}
            alt="media"
            className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 mb-1"
          />
        </a>
      );
    }
    if (message.mediaType === "video") {
      return (
        <video
          src={message.mediaUrl}
          controls
          className="max-w-xs rounded-lg mb-1"
        />
      );
    }
    if (message.mediaType === "audio") {
      return <audio src={message.mediaUrl} controls className="w-48 mb-1" />;
    }
    if (message.mediaType === "file") {
      return (
        <a
          href={message.mediaUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-300 underline flex items-center gap-1 mb-1"
        >
          📄 Download File
        </a>
      );
    }
  };

  return (
    <>
      {renderMedia()}
      {message.text && (
        <div
          style={{ wordWrap: "breakWord" }}
          className="flex flex-wrap max-w-[500px] overflow-auto"
        >
          {message.text}
        </div>
      )}
    </>
  );
};

const ChatMessages = ({ messages, userDetails, selectedUserId }) => {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, messagesContainerRef]);

  return (
    <div
      className="absolute bottom-24 w-full px-7 lg:px-20 left-1/2 transform -translate-x-1/2 overflow-auto max-h-[90vh] pt-28 h-full"
      ref={messagesContainerRef}
    >
      {!!selectedUserId && (
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`text-white ${
                message.sender !== userDetails._id
                  ? "bg-primary self-start rounded-r-2xl"
                  : "bg-primarySecond self-end rounded-l-2xl"
              } relative group rounded-b-2xl px-5 py-3`}
            >
              {/* ✅ replaced {message.text} with MessageBubble */}
              <MessageBubble message={message} />

              <div
                className={`absolute top-0 w-0 h-0 ${
                  message.sender !== userDetails._id
                    ? "border-r-primary -left-4 border-r-[20px]"
                    : "rounded-l-lg -right-4 border-l-primarySecond border-l-[20px]"
                } border-b-[20px] border-b-transparent`}
              ></div>
            </div>
          ))}
        </div>
      )}
      {selectedUserId && !messages.length && (
        <div className="text-gray-500 flex items-end justify-center h-full">
          Start a conversation
        </div>
      )}
    </div>
  );
};

export default ChatMessages;