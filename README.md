# GSAP Story Blocks

一套基于 **React + GSAP** 的声明式互动动画基座，目标是让 AI 通过组合“积木”与步骤（Step）生成富有层次的财经故事动画，而不是手写繁琐的时间轴代码。

## 项目结构

- **案例总览页**：自动扫描 `src/stories/data/*.json`，每个 JSON 即一个案例。新增案例只需放入符合 schema 的文件。
- **案例详情页**：根据 JSON 渲染 `<StoryStage>` 与布局组件（人物节点、标签气泡、交易弧线、指标胶囊等），形成真正的互动金融舞台。

## 快速开始

```bash
npm install
npm run dev
```

端口被占用时，可执行 `npm run dev -- --port 5174` 指定其它端口。

## 核心概念

### StepDefinition

```ts
type TimelineAction =
  | { type: 'animate-in'; target: string; preset?: AnimationPreset; vars?: Record<string, unknown> }
  | { type: 'animate-out'; target: string; preset?: AnimationPreset; vars?: Record<string, unknown> }
  | { type: 'set-text'; target: string; text: string }
  | { type: 'counter'; target: string; from?: number; to: number; duration?: number; prefix?: string; suffix?: string; precision?: number }
  | { type: 'wait'; duration: number }
  | { type: 'call'; handler: (ctx) => void };
```

把 `StepDefinition[]` 传入 `<StoryStage steps={steps} />` 就能驱动动画。`call` 动作可以执行定制逻辑，如描边交易路径、脉冲发光等效果。

### `StoryStage` 属性

- `autoAdvance`：设为 `true` 时，时间轴完成后自动进入下一步。
- `autoAdvanceDelay`：全局默认延迟（秒），也可在单个步骤 `autoAdvanceDelay` 覆盖。

### 案例 JSON 结构

每个案例放在 `src/stories/data/*.json`，示例片段：

```json
{
  "id": "bun-shop",
  "title": "烧饼店估值故事",
  "stageTheme": "stage-theme-night",
  "layout": [
    { "type": "SceneBubble", "id": "label-store", "position": { "x": 50, "y": 22 }, "tone": "primary", "size": "lg", "text": "烧饼铺" },
    { "type": "MetricPill", "id": "metric-profit", "valueId": "metric-profit-value", "label": "年利润", "position": { "x": 50, "y": 86 }, "suffix": " 元" }
  ],
  "steps": [
    {
      "id": "baseline-profit",
      "title": "基准利润",
      "actions": [
        { "type": "animate-in", "target": "metric-profit", "preset": "fade-in-up" },
        { "type": "counter", "target": "metric-profit-value", "from": 0, "to": 10, "duration": 0.6, "suffix": " 元" }
      ]
    },
    {
      "id": "deal-price",
      "title": "成交价公布",
      "actions": [
        { "type": "animate-in", "target": "metric-price", "preset": "fade-in-up" },
        {
          "type": "call",
          "handler": "drawPath",
          "options": { "elementId": "flow-transfer", "selector": "#flow-transfer-path", "duration": 0.9, "ease": "power2.out" }
        }
      ]
    }
  ]
}
```

- `layout`：描述舞台组件及定位（百分比坐标）。`type` 对应现有 React 组件（如 `SceneBubble`、`PersonaNode`、`FlowArc`、`MetricPill` 等）。
- `steps`：声明式动作序列。`call` 动作通过字符串 `handler` 触发内置动效，目前支持：
  - `drawPath`：描边 SVG 路径（需提供 `elementId`，可选 `selector`、`duration`、`ease`）。
  - `pulseScale`：元素缩放/透明度脉冲（提供 `elementId`，可选 `from`、`to`、`duration`、`ease`）。

### 组件积木

| 组件 | 作用 |
| --- | --- |
| `FloatingElement` | 将任意元素定位到舞台百分比坐标，可指定锚点与层级。|
| `PersonaNode` | 人物/角色节点，带徽章、姓名、身份标签。|
| `SceneBubble` | 文案气泡，支持多种色彩与尺寸预设。|
| `FlowArc` | SVG 交易弧线，自带渐变与箭头，搭配 `drawPath` 实现流动感。|
| `StoreEmblem` | 店铺/主体标识图形。|
| `MetricPill` | 指标胶囊，内置数值节点，搭配 `counter` 实现数字滚动。|

所有组件内部都会注册 `StoryElement`，因此步骤中的 `target` 只需填 id 即可。

## 案例亮点

- **自由布局**：JSON 中直接保存坐标与组件类型，舞台渲染时自动组合，避免僵硬的卡片排布。
- **指标联动**：`counter` 动作驱动利润、价格、ROE 等指标随剧情同步变化。
- **自定义动效**：`call` 钩子支持路径描边、缩放脉冲等预设，后续可继续扩展更多 handler。
- **金融质感背景**：内置 `stage-theme-night`、`stage-theme-grid`、`stage-theme-mesh` 三套深色纹理背景，通过 JSON 的 `stageTheme` 字段一键切换。

## 扩展建议

1. **预设库**：补充 `stagger-list`、`pulse`、`spotlight` 等动作预设，进一步降低 AI 拼装成本。
2. **图表积木**：新增柱状图、资金流向、对比条等组件，覆盖更多金融指标场景。
3. **模版化生成**：沉淀“估值拆解”“增长路线”等 Step Builder，模型只需提供数据即可生成步骤。
4. **Schema 校验**：完善 JSON Schema 与验证流程，便于后端或大模型直接输出合法案例文件。

欢迎继续提出想要的模块或动效，我们可以一起把它打造为 AI 驱动的互动动画积木箱。

