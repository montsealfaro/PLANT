export default function Background({ mood, children }) {
  return (
    <div className={`background background-${mood}`}>
      {children}
    </div>
  )
}
