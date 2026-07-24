export type Category = "Tech" | "Cultural" | "Business" | "Sports" | "Other";
export type InterestStatus = "new" | "in-talks" | "confirmed";

export interface UserRef {
  _id: string;
  name: string;
  org?: string;
  email?: string;
}

export interface EventRecord {
  _id: string;
  organizer: UserRef | string;
  name: string;
  college: string;
  location: string;
  date: string;
  attendees?: string;
  category: Category;
  budget?: string;
  description?: string;
  images: string[];
  stallTypes: string[];
  sponsorsRequired: string[];
  highlights: string[];
  status: "Live" | "Draft" | "Closed";
  createdAt: string;
  updatedAt: string;
}

export interface SponsorProfileRecord {
  _id: string;
  user: UserRef | string;
  name: string;
  category: string;
  location: string;
  budget?: string;
  rating: number;
  description?: string;
  interests: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InterestRecord {
  _id: string;
  event: EventRecord | string;
  organizer: UserRef | string;
  sponsor: UserRef | string;
  initiatedBy: "organizer" | "sponsor";
  message?: string;
  amount?: string;
  status: InterestStatus;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageRecord {
  _id: string;
  interest: string;
  sender: UserRef | string;
  text: string;
  createdAt: string;
}
