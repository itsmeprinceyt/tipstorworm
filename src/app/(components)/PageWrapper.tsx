export default function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-black relative">
            <div className="relative z-1">
                {children}
            </div>
            {/* Dark White Dotted Grid Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px)`,
                    backgroundSize: "50px 50px",
                    backgroundPosition: "0 0",
                }}
            />
        </div>
    )
}