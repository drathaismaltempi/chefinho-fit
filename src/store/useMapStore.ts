import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MapFoodItem, FoodCard } from '../types'

interface MapStoreState {
  food_items: MapFoodItem[]
  inventory: FoodCard[]
  player_lat: number
  player_lng: number
  setFoodItems: (items: MapFoodItem[]) => void
  captureItem: (id: string) => FoodCard | null
  setPosition: (lat: number, lng: number) => void
  addToInventory: (card: FoodCard) => void
}

export const useMapStore = create<MapStoreState>()(
  persist(
    (set, get) => ({
      food_items: [],
      inventory: [],
      player_lat: -23.55,
      player_lng: -46.63,
      setFoodItems: (food_items) => set({ food_items }),
      captureItem: (id) => {
        const item = get().food_items.find(f => f.id === id)
        if (!item || item.captured) return null
        set({
          food_items: get().food_items.map(f => f.id === id ? { ...f, captured: true } : f),
          inventory: [...get().inventory, item],
        })
        return item
      },
      setPosition: (lat, lng) => set({ player_lat: lat, player_lng: lng }),
      addToInventory: (card) => set({ inventory: [...get().inventory, card] }),
    }),
    { name: 'chefinho-map' }
  )
)
