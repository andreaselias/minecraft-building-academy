import type { Blueprint } from '../domain/blueprint'
import { houseUpgrade } from './house-upgrade'
import { starterHouse } from './starter-house'

export const blueprintRegistry: Record<string, Blueprint> = {
  [starterHouse.id]: starterHouse,
  [houseUpgrade.id]: houseUpgrade,
}
