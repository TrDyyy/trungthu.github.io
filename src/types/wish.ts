export interface Wish {
  id: string;
  name?: string;
  message: string;
  createdAt: string;
}

export interface Greeting {
  sender: string;
  receiver?: string;
  message: string;
}

export interface MoonMessage {
  text: string;
}
