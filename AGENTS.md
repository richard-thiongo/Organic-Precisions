<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:organic-precisions-agent-rules -->
## Organic Precisions project rules

### Product and tone
- **Product**: Organic Precisions is a professional platform for shop management and organic products.
- **Tone**: Maintain a clean, professional, and efficient tone.
- **No emojis**: Do not use emojis anywhere (UI strings, docs, commit messages).

### UI and styling
- **No inline CSS**: All styling must be handled via Tailwind CSS utility classes or dedicated CSS files. Inline `style` attributes are strictly prohibited.
- **Tailwind only**: Use Tailwind CSS utilities only. Do not add other styling systems.
- **Icons**: Use `lucide-react` icons only. No icon animations.

### Responsiveness (required)
- **100% responsive**: Every component must work on all screen sizes (mobile → desktop) with no horizontal scroll, clipped content, or overlapping UI.
- **Mobile-first**: Start from small screens, then add `sm:`/`md:`/`lg:` enhancements.
- **Overflow safety**: Use `min-w-0`, wrapping, `truncate`, and responsive grids to prevent layout breakage with long text.

### Folder Structure
- **Lightweight DDD**: Follow a Domain-Driven Design approach.
  - `src/domain/<bounded-context>/`: Business logic and concepts.
  - `src/app/`: Next.js App Router structure.
  - `src/ui/`: Reusable UI components.
- **Clarity over Taxonomy**: Prefer feature-based folders over generic `utils/`.

### Comments (required where logic exists)
- **Rule**: Where there is logic (non-trivial conditionals, parsing, transformations, state transitions, business rules), add a **short comment** explaining the intent.
- **Why, not What**: Comment *why* the logic exists or what constraint it satisfies, rather than narrating the code.
- **Keep it short**: One line is usually sufficient.

### Clean and Logical Code
- **Naming**: Use clear, domain-specific terms. Avoid ambiguous names like `data`, `item`, or `temp`.
- **Small units**: Keep components and functions small and single-purpose. Extract helpers for distinct logic blocks.
- **Validate inputs**: Guard against `null/undefined`, empty strings, and unexpected shapes before using values.
- **Preserve invariants**: Enforce business rules in the domain layer; fail fast when invariants are violated.
- **Explicit over clever**: Prefer readable code to “smart” one-liners.
- **Consistent patterns**: Follow existing project conventions; don't introduce new patterns without coordination.
<!-- END:organic-precisions-agent-rules -->
