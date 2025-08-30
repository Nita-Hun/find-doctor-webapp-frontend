declare module 'react-file-icon' {
  export const FileIcon: React.FC<{
    extension?: string;
    type?: string;
    labelColor?: string;
    labelTextColor?: string;
    labelUppercase?: boolean;
    glyphColor?: string;
    color?: string;
    [key: string]: any;
  }>;

  export const defaultStyles: Record<string, any>;
}