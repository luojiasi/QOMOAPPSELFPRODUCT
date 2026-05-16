import { ref, computed } from 'vue'
import { useEditorStore } from '../stores/editorStore'
import type { SurfaceEntity, EditorEntity } from '../commons/types'
import type { InspectorSection } from '../shares/types'

export type InspectedEntity = SurfaceEntity<EditorEntity>

export function useInspectorPanel() {
  const store = useEditorStore()
  const activeSection = ref<InspectorSection>('params')

  const selectedEntity = computed<InspectedEntity | null>(() => {
    if (store.selectedIds.length === 0) return null
    return store.entities.find(e => e.id === store.selectedIds[0]) ?? null
  })

  function updateField(field: string, value: number | boolean) {
    const entity = selectedEntity.value
    if (!entity) return

    const dotIndex = field.indexOf('.')
    if (dotIndex !== -1) {
      const parent = field.substring(0, dotIndex)
      const child = field.substring(dotIndex + 1)
      const current = (entity as Record<string, unknown>)[parent]
      store.updateEntity(entity.id, {
        [parent]: { ...(current as Record<string, unknown>), [child]: value },
      } as Partial<SurfaceEntity<EditorEntity>>)
    } else {
      store.updateEntity(entity.id, { [field]: value } as Partial<SurfaceEntity<EditorEntity>>)
    }
  }

  return { activeSection, selectedEntity, updateField }
}
