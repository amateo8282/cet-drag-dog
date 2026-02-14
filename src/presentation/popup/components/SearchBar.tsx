import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [query, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="스크랩 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-8 h-9"
      />
    </div>
  );
}
