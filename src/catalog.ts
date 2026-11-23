import Papa from 'papaparse'

export type Category = { id: string; name: string; active: boolean; order: number }
export type Product = {
  id: string
  categoryId: string
  category: string
  name: string
  description: string
  price: number
  image: string
  active: boolean
  available: boolean
  featured: boolean
  order: number
  tag?: string
}
export type Catalog = { categories: Category[]; products: Product[] }

const productCsv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkakvtMQeJdwTRBoXp28THIVGy-jJwWbgNLVqNC25qVt-O16M8MWEW4uowIjslcmhjJXzwEvo-Fw0g/pub?gid=473521427&single=true&output=csv'
const categoryCsv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkakvtMQeJdwTRBoXp28THIVGy-jJwWbgNLVqNC25qVt-O16M8MWEW4uowIjslcmhjJXzwEvo-Fw0g/pub?gid=440336368&single=true&output=csv'
const cacheKey = 'blu-go-business-catalog-v1'

const key = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
const cell = (row: Record<string, string>, ...names: string[]) => {
  const entries = Object.entries(row)
  for (const name of names) {
    const found = entries.find(([column]) => key(column) === key(name))?.[1]
    if (found !== undefined) return found.trim()
  }
  return ''
}
const yes = (value: string) => ['si', 'yes', 'true', '1', 'activo', 'disponible'].includes(key(value))
const orderNumber = (value: string) => Number.isFinite(Number(value)) ? Number(value) : 0
const parsePrice = (value: string) => {
  let cleaned = value.replace(/[^\d,.-]/g, '')
  const lastSeparator = Math.max(cleaned.lastIndexOf(','), cleaned.lastIndexOf('.'))
  if (lastSeparator >= 0) {
    const decimals = cleaned.length - lastSeparator - 1
    const hasBothSeparators = cleaned.includes(',') && cleaned.includes('.')
    if (hasBothSeparators && decimals > 0 && decimals <= 2) {
      cleaned = `${cleaned.slice(0, lastSeparator).replace(/[,.]/g, '')}.${cleaned.slice(lastSeparator + 1)}`
    } else if (!hasBothSeparators && decimals > 0 && decimals <= 2) {
      cleaned = `${cleaned.slice(0, lastSeparator)}.${cleaned.slice(lastSeparator + 1)}`
    } else cleaned = cleaned.replace(/[,.]/g, '')
  }
  return Number(cleaned)
}
const parseRows = (csv: string) => {
  const parsed = Papa.parse<Record<string, string>>(csv.replace(/^\uFEFF/, ''), { header: true, skipEmptyLines: 'greedy', transformHeader: (header) => header.trim() })
  if (parsed.errors.some((error) => error.type === 'Delimiter')) throw new Error('No se pudieron leer las columnas del CSV.')
  return parsed.data.filter((row) => Object.values(row).some((value) => value?.trim()))
}

function normalizeCatalog(categoryCsvText: string, productCsvText: string): Catalog {
  const categories = parseRows(categoryCsvText).map((row) => ({
    id: cell(row, 'id', 'id_categoria', 'categoria_id'),
    name: cell(row, 'nombre', 'nombre_categoria', 'categoria', 'categoría', 'name'),
    active: yes(cell(row, 'activo', 'activa', 'active')),
    order: orderNumber(cell(row, 'orden', 'order')),
  })).filter((item) => item.id && item.name && item.active)
  const categoryById = new Map(categories.map((item) => [key(item.id), item]))
  const categoryByName = new Map(categories.map((item) => [key(item.name), item]))
  const seen = new Set<string>()
  const products = parseRows(productCsvText).flatMap((row): Product[] => {
    const id = cell(row, 'id', 'id_producto', 'producto_id', 'codigo_producto')
    const name = cell(row, 'nombre', 'nombre_producto', 'name')
    const rawCategory = cell(row, 'categoria_id', 'id_categoria', 'categoria_producto', 'categoria', 'categoría', 'category', 'category_id')
    const linked = categoryById.get(key(rawCategory)) ?? categoryByName.get(key(rawCategory))
    const price = parsePrice(cell(row, 'precio', 'price', 'precio_cop', 'valor'))
    if (!id || !name || seen.has(key(id)) || !linked || !Number.isSafeInteger(price) || price < 0) return []
    seen.add(key(id))
    const active = yes(cell(row, 'activo', 'active'))
    const available = yes(cell(row, 'disponible', 'available'))
    const featured = yes(cell(row, 'destacado', 'featured'))
    return [{ id, categoryId: linked.id, category: linked.name, name, description: cell(row, 'descripcion', 'descripcion_producto', 'descripción', 'description'), price, image: cell(row, 'imagen', 'url_imagen', 'url de imagen', 'image', 'foto', 'imagen_url'), active, available, featured, order: orderNumber(cell(row, 'orden', 'order')), tag: featured ? 'Destacado' : undefined }]
  }).filter((product) => product.active && product.categoryId)
  return { categories: categories.sort((a, b) => a.order - b.order), products: products.sort((a, b) => a.order - b.order) }
}

export function readCachedCatalog(): Catalog | null {
  try {
    const value = localStorage.getItem(cacheKey)
    if (!value) return null
    const catalog = JSON.parse(value) as Catalog
    return Array.isArray(catalog.categories) && Array.isArray(catalog.products) ? catalog : null
  } catch { return null }
}

export async function fetchCatalog(): Promise<Catalog> {
  const fetchCsv = async (url: string) => {
    const response = await fetch(`${url}&_=${Date.now()}`, { cache: 'no-store' })
    if (!response.ok) throw new Error(`Google Sheets respondió ${response.status}.`)
    return response.text()
  }
  const [products, categories] = await Promise.all([fetchCsv(productCsv), fetchCsv(categoryCsv)])
  const catalog = normalizeCatalog(categories, products)
  if (!catalog.categories.length || !catalog.products.length) throw new Error('Las hojas no contienen un catálogo válido. Revisa los encabezados, IDs y categorías.')
  try { localStorage.setItem(cacheKey, JSON.stringify(catalog)) } catch { /* El catálogo sigue disponible en memoria. */ }
  return catalog
}
