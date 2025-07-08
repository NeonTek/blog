/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative w-24 h-24 animate-pulse">
        <img
          src="/icon.png"
          alt="Loading..."
          className="w-full h-full object-contain brightness-125 animate-glow"
        />
      </div>
    </div>
  );
}
