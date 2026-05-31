import type { MapFoodItem } from '../types'
import { HEALTHY_CARDS, CHAOS_CARDS, ALL_FOOD_CARDS } from '../data/foodCards'

function randomOffset(range: number): number {
  return (Math.random() - 0.5) * range
}

export function spawnFoodItems(centerLat: number, centerLng: number, count = 12): MapFoodItem[] {
  const now = Date.now()
  const items: MapFoodItem[] = []

  // 70% healthy, 10% chaos, 20% neutral
  const healthyCount = Math.floor(count * 0.7)
  const chaosCount = Math.floor(count * 0.1)
  const neutralCount = count - healthyCount - chaosCount

  const pick = (pool: typeof ALL_FOOD_CARDS) => pool[Math.floor(Math.random() * pool.length)]

  for (let i = 0; i < healthyCount; i++) {
    items.push({ ...pick(HEALTHY_CARDS), id: `spawn-h-${i}-${now}`, lat: centerLat + randomOffset(0.008), lng: centerLng + randomOffset(0.008), spawned_at: now, expires_at: now + 30 * 60 * 1000, captured: false })
  }
  for (let i = 0; i < chaosCount; i++) {
    items.push({ ...pick(CHAOS_CARDS), id: `spawn-c-${i}-${now}`, lat: centerLat + randomOffset(0.008), lng: centerLng + randomOffset(0.008), spawned_at: now, expires_at: now + 30 * 60 * 1000, captured: false })
  }
  for (let i = 0; i < neutralCount; i++) {
    items.push({ ...pick(HEALTHY_CARDS), id: `spawn-n-${i}-${now}`, lat: centerLat + randomOffset(0.012), lng: centerLng + randomOffset(0.012), spawned_at: now, expires_at: now + 30 * 60 * 1000, captured: false })
  }

  return items
}
