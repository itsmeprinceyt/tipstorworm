import { uploadToImageKit } from "../../utils/Imagekit/ImageKit.upload";

export interface UploadButtonProps {
  folder?: string;
  isPrivateFile?: boolean;
  onUploaded?: (result: Awaited<ReturnType<typeof uploadToImageKit>>) => void;
  disabled?: boolean;
  text?: string;
  renderButton?: (props: {
    onClick: () => void;
    disabled: boolean;
    busy: boolean;
  }) => React.ReactNode;
}
