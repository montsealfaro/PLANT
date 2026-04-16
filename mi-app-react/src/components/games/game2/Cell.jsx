export default function Cell({
  color,
  selected,
  onMouseDown,
  onMouseEnter,
  onTouchStart
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
      style={{
        width: 50,
        height: 50,
        margin: 2,
        backgroundColor: color,
        border: selected ? "3px solid white" : "1px solid black",
        opacity: selected ? 0.7 : 1
      }}
    />
  )
}