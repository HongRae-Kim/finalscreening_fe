interface GameDataCardProps {
  title: string;
  children: React.ReactNode;
}

export default function GameDataCard({ title, children }: GameDataCardProps) {
  return (
    <>
      <div className="bg-bg-primary flex w-full flex-col items-center justify-center rounded-xl px-12 py-6">
        <h4 className="text-content-primary text-xl font-semibold">{title}</h4>
        {children}
      </div>
    </>
  );
}
