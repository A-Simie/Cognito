import { cn } from "@/lib/utils/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  avatar?: string;
}

export function MessageBubble({
  role,
  content,
  timestamp,
  avatar,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "w-8 h-8 rounded-full shrink-0 flex items-center justify-center self-end mb-1 overflow-hidden",
          isUser
            ? "bg-blue-100 text-blue-600 font-bold text-xs border border-blue-200"
            : "bg-primary/20",
        )}
      >
        {isUser ? (
          "YOU"
        ) : avatar ? (
          <img
            src={avatar}
            alt="Ajibade"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-primary font-bold">A</span>
        )}
      </div>
      <div
        className={cn("flex flex-col gap-1 max-w-[85%]", isUser && "items-end")}
      >
        {timestamp && (
          <span
            className={cn("text-xs text-gray-500", isUser ? "mr-1" : "ml-1")}
          >
            {!isUser && "Ajibade • "}
            {timestamp}
          </span>
        )}
        <div
          className={cn(
            "p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed",
            isUser
              ? "bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-br-none"
              : "bg-primary text-white rounded-bl-none",
          )}
        >
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}
