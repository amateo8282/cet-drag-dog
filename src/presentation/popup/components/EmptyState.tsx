export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4" aria-hidden="true">
        {/* CSS로 그린 리트리버 대기 모습 */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 몸통 */}
          <ellipse cx="40" cy="52" rx="22" ry="16" fill="#D4A574" />
          {/* 머리 */}
          <circle cx="40" cy="30" r="16" fill="#C49A6C" />
          {/* 귀 왼쪽 */}
          <ellipse cx="26" cy="24" rx="8" ry="12" fill="#B8895C" transform="rotate(-15 26 24)" />
          {/* 귀 오른쪽 */}
          <ellipse cx="54" cy="24" rx="8" ry="12" fill="#B8895C" transform="rotate(15 54 24)" />
          {/* 눈 */}
          <circle cx="34" cy="28" r="2.5" fill="#333" />
          <circle cx="46" cy="28" r="2.5" fill="#333" />
          {/* 코 */}
          <ellipse cx="40" cy="34" rx="3" ry="2" fill="#333" />
          {/* 혀 */}
          <ellipse cx="40" cy="38" rx="3" ry="4" fill="#E88B8B" />
          {/* 꼬리 */}
          <path d="M62 48 Q72 36 68 28" stroke="#D4A574" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <p className="text-muted-foreground text-sm">
        아직 물어온 텍스트가 없어요!
      </p>
      <p className="text-muted-foreground text-xs mt-1">
        웹페이지에서 텍스트를 드래그하고 Fetch! 버튼을 눌러보세요
      </p>
    </div>
  );
}
