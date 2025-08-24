import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({children}) => {
  return (
    <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;