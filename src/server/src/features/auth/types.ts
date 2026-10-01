export interface SyncUserRequest {
  username: string;
  photo: string;
}

export interface UserRecord {
  id: string;
  username: string;
  photo: string;
  lastSyncedAt: string;
}
