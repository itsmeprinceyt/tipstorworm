"use client";
import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import getAxiosErrorMessage from "../../../../utils/Variables/getAxiosError.util";
import { uploadToImageKit } from "../../../../utils/Imagekit/ImageKit.upload";
import type { UploadButtonProps } from "../../../../types/ImageKit/UploadButton.type";

/**
 * @description
 * A client-side component that allows users to select and upload a file (image or video)
 * to ImageKit. It supports:
 * - File selection via hidden input
 * - Upload progress visualization with a modern UI
 * - Canceling an ongoing upload
 * - Callback invocation after upload completes or fails
 * - Disabled state handling
 * - Custom button rendering via render prop
 *
 * @workflow
 * 1. Allows custom button rendering via renderButton prop or uses default button
 * 2. Handles file selection and uploads the file to ImageKit with a progress bar
 * 3. Shows a detailed progress card during upload with cancel option
 * 4. Allows the user to cancel the upload at any time
 * 5. Invokes the `onUploaded` callback with the uploaded file info on success, or `null` on failure/cancel
 *
 * @props
 * - `folder` (string): Destination folder in ImageKit
 * - `isPrivateFile` (boolean): Indicates whether the file should be private
 * - `onUploaded` (function): Callback invoked after upload with uploaded file info or null
 * - `disabled` (boolean): Optionally disable the upload button
 * - `text` (string): Button text for default button
 * - `renderButton` (function): Render prop for custom button - receives { onClick, disabled, busy }
 */
export default function UploadButton({
  folder,
  isPrivateFile,
  onUploaded,
  disabled,
  text = "Upload Document",
  renderButton,
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const [busy, setBusy] = useState<boolean>(false);

  const handlePick = () => inputRef.current?.click();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      const result = await uploadToImageKit(file, {
        folder,
        isPrivateFile,
        onProgress: setProgress,
        abortSignal: abortControllerRef.current.signal,
      });

      if (result) {
        onUploaded?.(result);
      }
    } catch (err: unknown) {
      toast.error(
        getAxiosErrorMessage(err, "Something went wrong while uploading.")
      );
      onUploaded?.(null);
    } finally {
      setBusy(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  /** Cancel ongoing upload */
  const handleCancel = () => {
    abortControllerRef.current?.abort();
    toast.error("Upload cancelled");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/*,video/*"
        onChange={handleChange}
      />

      {!busy && (
        <>
          {renderButton ? (
            renderButton({
              onClick: handlePick,
              disabled: disabled || busy,
              busy,
            })
          ) : (
            <button
              type="button"
              onClick={handlePick}
              disabled={disabled || busy}
              className="flex items-center gap-2 backdrop-blur-xl bg-blue-500/20 border border-blue-400/50 rounded-xl px-4 py-3 shadow-2xl hover:bg-blue-500/30 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {disabled ? (
                <Loader2 size={16} className="animate-spin text-blue-400" />
              ) : (
                <Upload
                  size={16}
                  className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                />
              )}
              <span className="text-blue-300 group-hover:text-blue-200 font-medium text-sm transition-colors duration-300">
                {text}
              </span>
            </button>
          )}
        </>
      )}

      {busy && (
        <div className="w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-3">
              <div className="text-xs">
                <p className="font-medium text-white">Uploading...</p>
                <p className="text-white/60">{progress.toFixed(2)}% complete</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="p-2 backdrop-blur-xl bg-red-500/20 border border-red-400/50 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-all duration-300 group"
              title="Cancel upload"
            >
              <X
                size={18}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/40 backdrop-blur-sm border border-white/20 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2.5 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
