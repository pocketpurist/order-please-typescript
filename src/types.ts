export type FoodGroupId =
  | 'starters'
  | 'mains'
  | 'pizza_pasta'
  | 'sides'
  | 'drinks'
  | 'desserts'
  | 'specials';

export interface FoodGroup {
  id: FoodGroupId;
  name: string;
  iconEmoji: string;
  iconName: string;
  themeColor: string; // Hex color
  bgColor: string;
  borderColor: string;
  hoverColor: string;
  textColor: string;
  tagline: string;
  itemCount: number;
}

export interface ModifierOption {
  name: string;
  priceDelta?: number;
}

export interface ModifierGroup {
  name: string;
  required: boolean;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  groupId: FoodGroupId;
  name: string;
  description: string;
  price: number;
  dietary?: ('GF' | 'V' | 'VG' | 'SPICY' | 'CHEF' | string)[];
  modifiers?: ModifierGroup[];
  availableModifiers?: string[];
  popular?: boolean;
  isSoldOut?: boolean;
}

export type DishItem = MenuItem;

export interface OrderItem {
  id: string; // unique instance id in cart
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedModifiers?: string[];
  note?: string;
  seatNumber?: number;
}

export interface TableDetails {
  id?: string;
  tableNumber: number;
  section: string;
  guestCount: number;
  status: 'active' | 'ordered' | 'billing' | 'vacant';
}
