import { fileURLToPath } from 'url'
// Путь к конфигу Tailwind явный: dev-сервер стартует из корня nzt, и без него
// Tailwind не находит tailwind.config.js и не генерирует утилиты (17.09.2026).
export default {
  plugins: {
    tailwindcss: { config: fileURLToPath(new URL('./tailwind.config.js', import.meta.url)) },
    autoprefixer: {},
  },
}
