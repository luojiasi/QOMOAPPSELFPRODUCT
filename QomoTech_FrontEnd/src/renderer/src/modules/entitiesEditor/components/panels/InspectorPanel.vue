<script setup lang="ts">
import { useInspectorPanel, type InspectedEntity } from '../../composables/useInspectorPanel'

defineProps<{
  entity?: InspectedEntity | null
}>()

const emit = defineEmits<{
  'update': [field: string, value: number | boolean]
}>()

const { activeSection } = useInspectorPanel()
</script>

<template>
  <div class="inspector-panel">
    <div class="panel-header">属性</div>
    <div class="panel-body">
      <div v-if="!entity" class="empty-hint">选择实体以编辑属性</div>

      <template v-else>
        <div class="entity-kind">
          {{ entity.kind }}
          <span class="entity-id">{{ entity.id.slice(0, 8) }}</span>
        </div>

        <div class="section-tabs">
          <button
            :class="{ active: activeSection === 'params' }"
            @click="activeSection = 'params'"
          >参数</button>
          <button
            :class="{ active: activeSection === 'transform' }"
            @click="activeSection = 'transform'"
          >变换</button>
        </div>

        <!-- ═══ 参数 Tab ═══ -->
        <div v-if="activeSection === 'params'" class="fields">

          <!-- ── LINE ── -->
          <template v-if="entity.kind === 'LINE'">
            <div class="section-label">几何 · 线段</div>
            <label class="field"><span>起点 X</span>
              <input type="number" :value="entity.start.X" step="1"
                @input="emit('update', 'start.X', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>起点 Y</span>
              <input type="number" :value="entity.start.Y" step="1"
                @input="emit('update', 'start.Y', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>终点 X</span>
              <input type="number" :value="entity.end.X" step="1"
                @input="emit('update', 'end.X', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>终点 Y</span>
              <input type="number" :value="entity.end.Y" step="1"
                @input="emit('update', 'end.Y', +($event.target as HTMLInputElement).value)" />
            </label>
          </template>

          <!-- ── ARC ── -->
          <template v-else-if="entity.kind === 'ARC'">
            <div class="section-label">几何 · 圆弧</div>
            <label class="field"><span>圆心 X</span>
              <input type="number" :value="entity.center.X" step="1"
                @input="emit('update', 'center.X', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>圆心 Y</span>
              <input type="number" :value="entity.center.Y" step="1"
                @input="emit('update', 'center.Y', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>半径</span>
              <input type="number" :value="entity.radius" step="1" min="0.1"
                @input="emit('update', 'radius', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>起始角 °</span>
              <input type="number" :value="entity.startAngle" step="1"
                @input="emit('update', 'startAngle', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>终止角 °</span>
              <input type="number" :value="entity.endAngle" step="1"
                @input="emit('update', 'endAngle', +($event.target as HTMLInputElement).value)" />
            </label>
          </template>

          <!-- ── CIRCLE ── -->
          <template v-else-if="entity.kind === 'CIRCLE'">
            <div class="section-label">几何 · 圆</div>
            <label class="field"><span>圆心 X</span>
              <input type="number" :value="entity.center.X" step="1"
                @input="emit('update', 'center.X', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>圆心 Y</span>
              <input type="number" :value="entity.center.Y" step="1"
                @input="emit('update', 'center.Y', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>半径</span>
              <input type="number" :value="entity.radius" step="1" min="0.1"
                @input="emit('update', 'radius', +($event.target as HTMLInputElement).value)" />
            </label>
          </template>

          <!-- ── ELLIPSE ── -->
          <template v-else-if="entity.kind === 'ELLIPSE'">
            <div class="section-label">几何 · 椭圆</div>
            <label class="field"><span>圆心 X</span>
              <input type="number" :value="entity.center.X" step="1"
                @input="emit('update', 'center.X', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>圆心 Y</span>
              <input type="number" :value="entity.center.Y" step="1"
                @input="emit('update', 'center.Y', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>长轴端点 X</span>
              <input type="number" :value="entity.majorAxisEnd.X" step="1"
                @input="emit('update', 'majorAxisEnd.X', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>长轴端点 Y</span>
              <input type="number" :value="entity.majorAxisEnd.Y" step="1"
                @input="emit('update', 'majorAxisEnd.Y', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>短轴比例</span>
              <input type="number" :value="entity.minorAxisRatio" step="0.01" min="0.01" max="1"
                @input="emit('update', 'minorAxisRatio', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>起始角 °</span>
              <input type="number" :value="entity.startParamDeg" step="1"
                @input="emit('update', 'startParamDeg', +($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field"><span>终止角 °</span>
              <input type="number" :value="entity.endParamDeg" step="1"
                @input="emit('update', 'endParamDeg', +($event.target as HTMLInputElement).value)" />
            </label>
          </template>

          <!-- ── POLYLINE ── -->
          <template v-else-if="entity.kind === 'POLYLINE'">
            <div class="section-label">几何 · 多段线</div>
            <label class="field">
              <span>闭合</span>
              <input type="checkbox" :checked="entity.closed"
                @change="emit('update', 'closed', ($event.target as HTMLInputElement).checked)" />
            </label>
            <div class="field readonly">
              <span>顶点数</span>
              <span class="readonly-value">{{ entity.vertices.length }}</span>
            </div>
          </template>

          <!-- ── BEZIER ── -->
          <template v-else-if="entity.kind === 'BEZIER'">
            <div class="section-label">几何 · 贝塞尔曲线</div>
            <div class="field readonly">
              <span>控制点数</span>
              <span class="readonly-value">{{ entity.controlPoints.length }}</span>
            </div>
          </template>

          <!-- ── 挤出参数（所有实体共用） ── -->
          <div class="section-label">挤出参数</div>
          <label class="field">
            <span>高度</span>
            <input type="number" :value="entity.height" step="0.1" min="0"
              @input="emit('update', 'height', +($event.target as HTMLInputElement).value)" />
          </label>
          <label class="field">
            <span>开口尺寸</span>
            <input type="number" :value="entity.openSize" step="0.1" min="0"
              @input="emit('update', 'openSize', +($event.target as HTMLInputElement).value)" />
          </label>
          <label class="field">
            <span>倾斜角度 °</span>
            <input type="number" :value="entity.tiltAngleDeg" step="0.5"
              @input="emit('update', 'tiltAngleDeg', +($event.target as HTMLInputElement).value)" />
          </label>
        </div>

        <!-- ═══ 变换 Tab ═══ -->
        <div v-if="activeSection === 'transform'" class="fields">
          <div class="empty-hint">变换参数（待开发）</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.inspector-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #d4d4d8;
  font-size: 13px;
}
.panel-header {
  padding: 8px 10px;
  border-bottom: 1px solid #27272a;
  font-weight: 500;
  flex-shrink: 0;
}
.panel-body { flex: 1; overflow-y: auto; }
.empty-hint {
  padding: 24px 10px;
  text-align: center;
  color: #52525b;
  font-size: 12px;
}
.entity-kind {
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 14px;
}
.entity-id { color: #52525b; font-size: 11px; font-weight: 400; }
.section-tabs {
  display: flex;
  border-bottom: 1px solid #27272a;
}
.section-tabs button {
  flex: 1;
  padding: 5px 0;
  font-size: 12px;
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}
.section-tabs button.active {
  color: #e4e4e7;
  border-bottom-color: #3b82f6;
}
.fields { padding: 8px 10px; }

.section-label {
  padding: 10px 0 4px;
  font-size: 11px;
  font-weight: 500;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.section-label:first-child { padding-top: 2px; }

.field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.field span { font-size: 12px; color: #a1a1aa; }
.field input[type="number"] {
  width: 72px;
  padding: 3px 6px;
  font-size: 12px;
  background: #18181b;
  border: 1px solid #3f3f46;
  border-radius: 4px;
  color: #d4d4d8;
  text-align: right;
}
.field input[type="number"]:focus { outline: none; border-color: #3b82f6; }

.field input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.field.readonly { cursor: default; }
.readonly-value {
  color: #a1a1aa;
  font-variant-numeric: tabular-nums;
}
</style>
