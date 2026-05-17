// =============================================================================
// useDrawInteraction — 绘制状态机
// 管理"点击画布→填写参数→完成实体"的节拍驱动流程。
// 策略定义与几何构造委托给 drawStrategies.ts。

import { computed, ref, watch } from "vue";
import { EntityKind, Point2D } from "../../commons/types";
import { DrawStrategyDef, FieldDef } from "./drawStrategies";
import { useEditorStore } from "../../stores/editorStore";
import { getDefaultStrategy } from "./drawStrategies";
// ── 字段运行时值 ────────────────────────────────────────

type FieldValue =
  | { kind: 'point';     value: Point2D }
  | { kind: 'number';    value: number }
  | { kind: 'multiPoint'; points: Point2D[] }
  | { kind: 'toggle';    value: boolean }

/** 当前绘制会话 */
export interface DrawSession {
    kind: EntityKind
    strategy: DrawStrategyDef
    values: FieldValue[]
    activeIdx: number           // 当前等待输入的字段索引
  } 
// ── 辅助 ───────────────────────────────────────────────

/** 根据 FieldDef 创建对应的空值 */
function _emptyValue(def: FieldDef): FieldValue {
    switch (def.kind) {
      case 'point':      return { kind: 'point',     value: { X: 0, Y: 0 } }
      case 'number':     return { kind: 'number',    value: (def.default as number) ?? 0 }
      case 'multiPoint': return { kind: 'multiPoint', points: [] }
      case 'toggle':     return { kind: 'toggle',    value: (def.default as boolean) ?? false }
    }
  }
// =============================================================================
export function useDrawInteraction() {
    const store = useEditorStore()
    // ── 响应式状态 ──
    const session = ref<DrawSession | null>(null)
    // ── 派生 ──
    const isActive = computed(() => session.value !== null)
    // ── 内部方法 ──

    /** 启动新会话 */
    function _start(kind: EntityKind) {
      const strategy = getDefaultStrategy(kind)
      session.value = {
        kind,                                    // 图元类型
        strategy,                                // 策略
        values: strategy.fields.map(_emptyValue), // 字段值
        activeIdx: 0,                            // 当前等待输入的字段索引
      }
    }
    /** 推进到下一个字段；全部走完则 auto commit */
    function _advance() {
        const s = session.value
        if (!s) return
        s.activeIdx++
        if (s.activeIdx >= s.strategy.fields.length) _commit();
    }
    function _commit() {
        const s = session.value
        if (!s) return
        const kind = s.kind
        const v = s.values
        console.log('kind', kind)
        console.log('v', v)
    }

    // ── 公开 API ──
    /** 画布点击：将世界坐标填入当前 point/multiPoint 字段 */
    function handleCanvasClick(world: Point2D){
        const s = session.value
        console.log('s', s)
        if (!s) return
        const fieldDef = s.strategy.fields[s.activeIdx]
        const val = s.values[s.activeIdx]
        if (!fieldDef || !val) return
        switch (fieldDef.kind) {
            case 'point':
                (val as { kind: 'point'; value: Point2D }).value = { X: world.X, Y: world.Y }
                _advance()
                break
        }
    }
    /** 取消当前绘制 */
    function cancel() {
      session.value = null
    }
    // ── 监听 ──
    // 切换到 DRAW 模式时启动会话
    watch(() => store.activeTool, (tool) => {
      if (tool !== 'DRAW') cancel();
    })
    // drawSubTool 变化时切换图元类型，记住之前的策略
    watch(() => store.drawSubTool, (kind) => {
      if (store.activeTool === 'DRAW' && kind) _start(kind);
    })
    return {
        session,
        isActive,
        handleCanvasClick
    }
}