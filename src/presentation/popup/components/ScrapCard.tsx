import type { ScrapItem } from "@/domain/ScrapItem";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Trash2, ExternalLink } from "lucide-react";

interface ScrapCardProps {
  scrap: ScrapItem;
  onDelete: (id: string) => void;
}

export function ScrapCard({ scrap, onDelete }: ScrapCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(scrap.text);
  };

  const handleOpenSource = () => {
    chrome.tabs.create({ url: scrap.sourceUrl });
  };

  const formattedDate = new Date(scrap.createdAt).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="group">
      <CardContent className="p-3">
        <p className="text-sm line-clamp-3 mb-2">{scrap.text}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <button
            onClick={handleOpenSource}
            className="flex items-center gap-1 hover:text-foreground truncate max-w-[180px] cursor-pointer"
            title={scrap.sourceTitle}
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{scrap.sourceTitle}</span>
          </button>
          <span className="shrink-0">{formattedDate}</span>
        </div>
        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
            <Copy className="h-3 w-3 mr-1" />
            복사
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(scrap.id)}
            className="h-7 px-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            삭제
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
