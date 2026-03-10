import { useState } from "react";

interface ThreeDViewerProps {
  src: string;
  title?: string;
}

const ThreeDViewer = ({ src, title = "3D Model Viewer" }: ThreeDViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-border bg-card/50 backdrop-blur-sm">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/80">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-muted-foreground text-sm">جاري تحميل النموذج...</span>
          </div>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/80">
          <span className="text-destructive text-sm">فشل تحميل النموذج ثلاثي الأبعاد</span>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        className="w-full h-full border-none"
        style={{ background: "transparent" }}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; display-capture; geolocation; gyroscope; microphone; midi; speaker; vr; web-share"
        sandbox="allow-scripts allow-same-origin allow-popups"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

export default ThreeDViewer;
