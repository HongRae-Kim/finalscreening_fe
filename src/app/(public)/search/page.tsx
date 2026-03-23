"use client";

import SearchInput from "@/components/common/SearchInput";
import { Link, UserRoundSearch } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SearchUserList from "@/components/search/SearchUserList";
import { useQuery } from "@tanstack/react-query";
import { UserList } from "@/types/userList";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingBouncy from "@/components/common/loading/LoadingBouncy";
import { useMenuStore } from "@/stores/menuStore";

export default function SearchPage() {
  const { setMenu } = useMenuStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialNickname = useMemo(() => searchParams.get("nickname") ?? "", []);

  const [nickname, setNickname] = useState(initialNickname);
  const debounced = useDebouncedValue(nickname, 300);

  const enabled = debounced.trim().length > 0;

  // 디바운스 값이 바뀔 때만 URL을 replace
  useEffect(() => {
    setMenu("search");

    const nickname = debounced.trim();
    const current = searchParams.get("nickname") ?? "";

    // 값이 같으면 아무것도 하지 않기(무한루프 방지)
    if (nickname === current) return;

    // 빈값이면 파라미터 제거
    if (!nickname) {
      router.replace("/search");
      return;
    }

    router.replace(`/search?nickname=${encodeURIComponent(nickname)}`);
  }, [debounced, router, searchParams]);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["search", debounced], // 입력값 기반 캐싱 키
    queryFn: () => fetchSearch(debounced),
    enabled, // 빈 값이면 요청 안 함
    staleTime: 30_000,
    gcTime: 5 * 60_000, // 캐시 보관 시간(5분)
  });

  const userListData = data ?? null;

  const isSearching = isLoading || isFetching;
  const hasResult = userListData && userListData.totalCount > 0;
  const isEmpty = enabled && !isSearching && userListData?.totalCount === 0;

  return (
    <section className="flex h-full w-full flex-col items-center justify-center px-(--global-padding)">
      <div className="flex flex-col items-center gap-4">
        <Link size={50} className="text-accent" />
        <p className="text-content-main text-5xl font-bold max-md:text-4xl">
          유저 검색
        </p>
        {nickname.trim() === "" && (
          <p className="text-content-secondary flex gap-1 text-xl max-md:hidden">
            매치마이듀오 닉네임으로 유저의
            <span className="text-accent">리그오브레전드</span> 전적과 리뷰를
            검색해보세요.
          </p>
        )}
        {nickname.trim() === "" && (
          <div className="text-content-secondary flex flex-col items-center justify-center gap-1 text-xl max-md:text-lg md:hidden">
            <span>매치마이듀오 닉네임으로</span>
            <p>
              <span className="text-accent">리그오브레전드 </span>
              <span>전적과 리뷰를 검색해보세요.</span>
            </p>
          </div>
        )}
      </div>
      <SearchInput
        inputSize="lg"
        placeholder="매치마이듀오 닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="border-border-primary mt-11 border max-md:mt-6 max-md:h-15 max-md:min-w-60"
      />

      {isSearching && <LoadingBouncy />}

      {(isEmpty || !!error) && (
        <div className="leading-1.4 mt-11 justify-items-center">
          <UserRoundSearch
            strokeWidth={1}
            className="text-content-tertiary h-42 w-42 max-md:h-35 max-md:w-35"
          />
          <p className="text-content-primary mt-10.5 text-[32px] font-semibold max-md:mt-6 max-md:text-2xl">
            검색된 유저가 없습니다
          </p>
          <p className="text-content-secondary mt-2 text-2xl font-semibold max-md:text-xl">
            다른 검색어로 다시 시도해보세요
          </p>
        </div>
      )}

      {hasResult && <SearchUserList userListData={userListData} />}
    </section>
  );
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

async function fetchSearch(keyword: string) {
  const res = await fetch(
    `/api/search?nickname=${encodeURIComponent(keyword)}`,
  );
  if (!res.ok) throw new Error("검색 실패");
  return (await res.json()) as UserList;
}
