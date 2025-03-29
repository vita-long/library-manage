export interface Stream {
  id: number;
  liveId: string;
  liveName: string;
  status: 'live' | 'offline';
  streamKey: string;
  createdAt: string;
}
