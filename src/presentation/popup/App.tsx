import { useState } from "react";
import { useScraps } from "./hooks/useScraps";
import { SearchBar } from "./components/SearchBar";
import { ScrapCard } from "./components/ScrapCard";
import { EmptyState } from "./components/EmptyState";
import { SettingsPanel } from "./components/SettingsPanel";
import { ScrollArea } from "./components/ui/scroll-area";
import { Button } from "./components/ui/button";
import { Settings } from "lucide-react";

export default function App() {
  const { scraps, loading, deleteScrap, searchScraps } = useScraps();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="w-[360px] h-[500px] flex flex-col bg-background">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div>
          <h1 className="text-lg font-bold">Fetch Boy</h1>
          <p className="text-xs text-muted-foreground">강아지 창고</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* 검색바 */}
      <div className="px-4 pb-2">
        <SearchBar onSearch={searchScraps} />
      </div>

      {/* 설정 패널 */}
      {showSettings && <SettingsPanel />}

      {/* 콘텐츠 영역 */}
      <ScrollArea className="flex-1 px-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">불러오는 중...</p>
          </div>
        ) : scraps.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2 pb-4">
            {scraps.map((scrap) => (
              <ScrapCard
                key={scrap.id}
                scrap={scrap}
                onDelete={deleteScrap}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
