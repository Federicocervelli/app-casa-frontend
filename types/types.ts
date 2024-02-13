type Chore = {
  id: string;
  users: string[];
  house: string;
  start: number;
  end: number;
  done_at?: number | null;
  name: string;
  desc?: string | null;
  is_done: boolean;
  is_periodic: boolean;
  cyclicality: "Giornaliera" | "Settimanale" | "Mensile";
  day_of_week?: number | null;
  day_of_month?: number | null;
  created_by: string;
  created_at: number;
};

type User = {
  avatar_url: string;
  display_name: string;
  house: string;
  id: string;
};

// Export each type individually
export { Chore, User };
