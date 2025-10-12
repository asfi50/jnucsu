// Subscriber interface for API responses
export interface Subscriber {
  id: string;
  email: string;
  status: "published" | "draft" | "archived";
  is_active: boolean;
  date_created: string;
  date_updated?: string;
}

// API request types
export interface SubscribeRequest {
  email: string;
}

export interface UpdateSubscriberRequest {
  id?: string;
  email?: string;
  status?: "published" | "draft" | "archived";
  is_active?: boolean;
  action?: "activate" | "deactivate" | "block";
}

export interface BulkSubscriberRequest {
  action: "activate" | "deactivate" | "block" | "delete";
  subscriber_ids?: string[];
  emails?: string[];
}

// API response types
export interface SubscribeResponse {
  message: string;
  subscriber: Subscriber;
  action: "created" | "reactivated" | "existing";
}

export interface GetSubscribersResponse {
  subscribers: Subscriber[];
  meta: {
    total: number;
    filtered: number;
    limit: number;
    offset: number;
  };
}

export interface UpdateSubscriberResponse {
  message: string;
  subscriber: Subscriber;
  action: string;
}

export interface BulkOperationResponse {
  message: string;
  updated_count?: number;
  deleted_count?: number;
  total_count: number;
  action: string;
}

export interface SubscriberStats {
  overview: {
    total_subscribers: number;
    active_subscribers: number;
    inactive_subscribers: number;
    activity_rate: string;
  };
  status_breakdown: {
    published: number;
    draft: number;
    archived: number;
  };
  growth_analytics: {
    last_30_days: number;
    weekly_breakdown: Array<{
      week: string;
      start_date: string;
      end_date: string;
      new_subscribers: number;
    }>;
    average_weekly_growth: string;
  };
  recent_subscribers: Array<{
    id: string;
    email: string;
    date_created: string;
    status: string;
    is_active: boolean;
  }>;
  generated_at: string;
}

export interface ExportResponse {
  subscribers?: Subscriber[];
  data?: any[];
  exported_at?: string;
  total_count?: number;
  filename?: string;
  format?: string;
  filters_applied?: {
    status: string;
    active_only: boolean;
  };
}

// Query parameters for GET requests
export interface GetSubscribersParams {
  status?: "published" | "draft" | "archived" | "all";
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ExportParams {
  format?: "json" | "csv" | "xlsx";
  status?: "published" | "draft" | "archived" | "all";
  active_only?: boolean;
}

// Error response type
export interface ApiError {
  error: string;
  message?: string;
  details?: string;
}
