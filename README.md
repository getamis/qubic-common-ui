# react-native-cask-ui

### Demo
```
$ yarn storybook
```

### TODO
1. **Storyboard:** Add storybook example for every ui components.
2. **Hooks:** Replace class component by functional component with `React.memo`.
3. **useMemoStyle:** Use `useMemoStyle` or other memorized methods to improve performance.
4. **Remove T:** Remove the `T` prefix of each component props.
5. **Interface:** Replace the `type` definition of each component props by `interface`.
6. **Renderer:** Separate logic and pure renderer.

|                      | Storybook | Hooks | useMemoStyle | Remove T | Interface | Renderer |
| -------------------- | :-------: | :---: | :----------: | :------: | :-------: | :------: |
| Alert                | -         | ✔️     | -            | ✔️        | ✔️         | -        |
| Badge                | ✔️         | ✔️     | ✔️            | ✔️        | ✔️         |          |
| Button               | ✔️         | ✔️     | ✔️            | ✔️        | ✔️         |          |
| Card                 | ✔️         | ✔️     | ✔️            | ✔️        | ✔️         |          |
| Flex                 | ✔️         | ✔️     | ✔️            | ✔️        | ✔️         | -        |
| HeaderButtons        |           | ✔️     |              | ✔️        |           |          |
| KeyboardAvoidingView | App Only  | ✔️     | -            | ✔️        | ✔️         | -        |
| Image                | ✔️         | ✔️     | ✔️            | ✔️        | ✔️         |          |
| InputSpinner         |           | ✔️     | ✔️            |          |           |          |
| List                 | ✔️         | ✔️     |              | ✔️        |           |          |
| ListItem             |           | ✔️     | ✔️            | ✔️        |           |          |
| LoadingSpinner       |           | ✔️     |              | ✔️        |           | ✔️        |
| Modal                |           | ✔️     |              |          |           |          |
| Rating               |           | ✔️     | ✔️            | ✔️        |           |          |
| ReadMore             |           | ✔️     | ✔️            | ✔️        |           |          |
| Screen               | -         | ✔️     | ✔️            | ✔️        | ✔️         |          |
| SearchBar            |           | ✔️     | ✔️            | ✔️        |           | ✔️        |
| Separator            |           | ✔️     | ✔️            | ✔️        |           |          |
| Stack                | ✔️         | ✔️     | ✔️            | ✔️        | ✔️         | -        |
| Text                 | ✔️         | ✔️     | ✔️            | ✔️        | ✔️         |          |
| TextInput            | ✔️         | ✔️     | ✔️            | ✔️        | ✔️         |          |
| Toolbar              |           | ✔️     | ✔️            | ✔️        |           |          |

### Important

**DON'T** use `defaultProps` for any UI Component. It will break the `overrides` effect.

### How to set overrides

overrides should be something like this

```
const overrides = {
  Badge: {
    default: {
      props: {
        color: palette.primaryColor,
      },
      styles: StyleSheet.create({
        text: {
          color: 'white',
        },
      }),
    },
    slim: {
      styles: StyleSheet.create({
        badge: {
          ...someProps,
        },
        text: {
          fontSize: 13,
        },
      }),
    },
  },
  Button: {
    ...someProps,
  },
  Card: {
    ...
  },
  ...
}
```

check /storybook/theme/light/overrides.ts for example

### How to add variant



make sure your override object is "as const" literal typed
```
import { ExtractVariantKeys } from '@qubic-js/react-native-cask-ui-theme';
const overrides = {...} as const;
type ComponentVariantKeys = ExtractVariantKeys<overrides>;
```

if overrides is a function, make sure to `ReturnType<typeof overrides>`
```
const getOverrides = (palette) => {...} as const;
type ComponentVariantKeys = ExtractVariantKeys<ReturnType<typeof getOverrides>>;
```

create a theme.d.ts
```
declare module '@qubic-js/react-native-cask-ui-theme' {
  interface ComponentVariants extends ComponentVariantKeys {}
}
```
