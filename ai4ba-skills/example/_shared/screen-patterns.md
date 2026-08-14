# Shared Screen Patterns‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Common UI states reused across screens. Per-screen specs reference these via wikilink instead of duplicating.
>
> If a screen genuinely deviates from these defaults, override in that screen's `## 2. States` section and note the reason.

## Loading‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> While initial data is being fetched.

__Default pattern:__
- Show skeleton (gray placeholder shapes matching the final layout) for content area
- Show spinner only for short asynchronous actions (e.g. button click, < 2s wait)
- Disable interactive controls
- Don't unmount the previous screen — fade in the new content

__Variant — full-page transition:__
- Use a centered logo + spinner only on app cold-start or auth redirect

## Empty‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> When there's no data to show on a screen that lists things.

__Default pattern:__
- Friendly illustration (or icon) centered
- Headline: 1 line, e.g. *"Nothing here yet"*
- Subtext: 1-2 lines explaining why and how to fix
- Primary CTA button to add the first item

__Variant — empty after filter:__
- Same layout but the headline says *"No results match your filter"* and the CTA is *"Clear filter"*

## Error‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> When a backend call fails or the screen can't load.

__Default pattern:__
- Inline banner at top of content area (red, with icon)
- Headline matches the error code's `User-facing Message` from the feature's Error Matrix
- "Try again" button that retries the original action
- Link to support/help if available

__Variant — full-page error (e.g. 500, network down):__
- Centered illustration + message + retry button‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
- Show the error code (e.g. E-login-003) in small text for support reference

## Success‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> When an action completes successfully.

__Default pattern:__
- Toast at top-right, auto-dismiss after 3s
- Icon (checkmark) + 1-line message
- Optional "Undo" link if the action is reversible

__Variant — destination redirect:__
- For multi-step flows, navigate to the next screen and surface a success toast there

__Variant — inline confirmation:__
- For settings changes, show a green checkmark next to the field that changed

## Validation (inline)

> Field-level errors during input.

__Default pattern:__
- Red border on the invalid field
- Red helper text below the field, max 80 chars
- Validate on blur (not on every keystroke) for typed input
- Validate on change for radio/checkbox/select

## Disabled / Read-only

> Controls the user can see but not interact with.

__Default pattern:__
- 60% opacity, no hover effect
- Cursor: `not-allowed` on hover
- Tooltip explaining why it's disabled if the reason isn't obvious

***

## Change Log

| Date | Change | Source |
|------|--------|--------|
| 2026-05-09 | Initial pattern set | Manual |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
