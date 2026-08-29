---
title: 雕塑练习
description: 一组 2 小时的限时雕刻练习：从球体到头部，记录 Dyntopo 与多级细分的取舍。
date: 2025-06-08
category: blender
tags:
  - Blender
  - 雕刻
  - 练习
cover: /covers/sculpt-study.svg
featured: false
role: 独立练习
links: []
---

# 雕塑练习

一组限时雕刻练习：每次 2 小时，从基础球体开始，尽量做出一个有辨识度的头部。

## 工作流

1. **粗形**（30min）：Dyntopo + Clay Strips 铺大形，只关心比例
2. **结构**（45min）：Crease 定眼眶、鼻底、嘴角的转折
3. **细节**（45min）：最后用 Dam Standard 收紧，加皮肤纹理

```python
# 快速切换细分
import bpy
for obj in bpy.context.selected_objects:
    mods = [m for m in obj.modifiers if m.type == "MULTIRES"]
    if mods:
        mods[0].levels = (mods[0].levels + 1) % 4
```

## 心得

雕刻最难的不是手，是**判断**：什么时候该停下。2 小时的限制反而让我学会了在"完成度 80%"的地方收手——那通常是最好的状态。

::tip
给新手：先雕 20 个粗糙的球，再雕 1 个精细的头。数量优先。
::

> 工具：Blender 4 · Dyntopo · Multires
