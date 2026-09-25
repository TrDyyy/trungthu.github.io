export interface Wish {
  id: string;
  name?: string;
  message: string;
  createdAt: string;
}

export interface Greeting {
  id?: string;
  sender: string;
  receiver?: string;
  message: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface MoonMessage {
  text: string;
}
