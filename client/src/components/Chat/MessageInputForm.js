import { useState } from "react";
import api from "../../Api";

const MessageInputForm = ({ newMessage, setNewMessage, sendMessage, selectedUserId }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    setPreview({ url: URL.createObjectURL(file), type: file.type });
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Send via socket after upload
      sendMessage(null, {
        mediaUrl: data.url,
        publicId: data.publicId,
        mediaType: data.mediaType,
      });

      setPreview(null);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 p-2">
      {/* Preview */}
      {preview && (
        <div className="relative w-32">
          {preview.type.startsWith("image") ? (
            <img src={preview.url} className="w-32 rounded-lg opacity-70" />
          ) : (
            <video src={preview.url} className="w-32 rounded-lg opacity-70" />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xs">Uploading...</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 items-center">
        {/* File upload button */}
        {selectedUserId && (
          <>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              📎
            </label>
          </>
        )}

        {/* Text input */}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
          placeholder={selectedUserId ? "Type a message..." : "Select a user"}
          disabled={!selectedUserId || uploading}
          className="flex-1 p-2 rounded-full bg-gray-700 text-white outline-none"
        />

        <button
          onClick={sendMessage}
          disabled={!selectedUserId || uploading || !newMessage.trim()}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default MessageInputForm;