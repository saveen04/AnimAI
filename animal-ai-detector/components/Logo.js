export default function Logo({ className = "w-10 h-10", glowColor = "rgba(99,102,241,0.4)" }) {
  return (
    <div className={`relative flex items-center justify-center select-none transition-all duration-500 ${className}`}>
      <img 
        src="/Modern_Emblem-Style_Logo_for_AnimAi-removebg-preview.png" 
        alt="ANIMAI"
        className="w-full h-full object-contain filter drop-shadow-[0_0_15px_var(--glow)] brightness-110"
        style={{ '--glow': glowColor }}
      />
    </div>
  );
}
