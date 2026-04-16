export default function PetMessage({ text }) {
  if (!text) return null;

  return (
    <div className="bubble">
      {text}
    </div>
  );
}