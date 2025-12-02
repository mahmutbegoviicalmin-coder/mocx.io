interface MockupCardProps {
  title: string;
  imageUrl: string;
  prompt: string;
}

export function MockupCard({ title, imageUrl, prompt }: MockupCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] cursor-pointer">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        {/* Using a simple div for now, would be Next/Image in production */}
        <div 
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {prompt}
        </p>
      </div>
    </div>
  );
}

