import {NDKKind} from '@nostr-dev-kit/ndk';
import {useInfiniteQuery} from '@tanstack/react-query';

import {useNostrContext} from '../../context/NostrContext';

export type UseRootNotesOptions = {
  authors?: string[];
  search?: string;
  kinds?: NDKKind[];
};

export const useGetVideos = (options?: UseRootNotesOptions) => {
  const {ndk} = useNostrContext();

  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['getVideos', options?.authors, options?.search, ndk],
    getNextPageParam: (lastPage: any, allPages, lastPageParam) => {
      if (!lastPage?.length) return undefined;

      const pageParam = lastPage[lastPage.length - 1].created_at - 1;

      if (!pageParam || pageParam === lastPageParam) return undefined;
      return pageParam;
    },
    queryFn: async ({pageParam}) => {
      const notes = await ndk.fetchEvents({
        kinds: options?.kinds ?? [NDKKind.HorizontalVideo, NDKKind.VerticalVideo],
        authors: options?.authors,
        search: options?.search,
        until: pageParam || Math.round(Date.now() / 1000),
        limit: 20,
      });

      return [...notes];
    },
    placeholderData: {pages: [], pageParams: []},
  });
};
