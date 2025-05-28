type Priority = "low" | "medium" | "high";

const priorityLevels = {
  low: 1,
  medium: 2,
  high: 3,
} as const;

const priorityColors = {
  low: "text-yellow-500",
  medium: "text-orange-500",
  high: "text-red-500",
} as const;

export const ArrowStack = ({ level }: { level: Priority }) => (
  <div
    className={`flex flex-col leading-[0.6rem] items-center text-sm font-bold ${
      priorityColors[level]
    }`}
  >
    {Array(priorityLevels[level])
      .fill("^")
      .map((c, i) => (
        <span key={i}>{c}</span>
      ))}
  </div>
);
// export const ArrowStackWithText = ({
//   level,
//   text,
// }: {
//   level: Priority;
//   text: string;
// }) => (
//   <div className="flex items-center gap-1">
//     <ArrowStack level={level} />
//     <span className="text-xs font-medium">{text}</span>
//   </div>
// );