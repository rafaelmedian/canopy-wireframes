# Mock Data - Estructura de Base de Datos

Toda la data mock está organizada como una base de datos relacional con archivos JSON separados que se relacionan por IDs.

## Archivos

### Datos (JSON - como tablas de DB)
- **chains.json** - Tabla principal de chains (4 chains)
- **holders.json** - Holders relacionados por `chainId`
- **transactions.json** - Transacciones relacionadas por `chainId`
- **blocks.json** - Bloques relacionados por `chainId`
- **price-history.json** - Historial de precios por `chainId`
- **milestones.json** - Logros/milestones por `chainId`

### Queries (JS - como un ORM)
- **db.js** - Funciones helper para hacer queries relacionales
- **mock-chains.js** - Data para el launchpad (usa db.js)
- **mock-config.js** - Constantes de configuración (hardcoded, OK así)

### Documentación
- **DATABASE.md** - Documentación completa del schema y queries

## Uso Básico

```javascript
import { getChainDetails } from '@/data/db'

// Obtener chain con TODOS sus datos relacionados
const chain = getChainDetails(1)

// Acceder a datos relacionados
console.log(chain.holders)        // Array de holders
console.log(chain.transactions)   // En chain.explorer.recentTransactions
console.log(chain.milestones)     // Array de milestones
console.log(chain.priceHistory)   // Array de precios
```

## IDs de los Chains

- **ID 1**: Onchain ENS (Virtual, público, 21 holders)
- **ID 2**: MyGameChain (Virtual, owner, 1 holder)
- **ID 3**: Social Connect (Graduated, 5k+ holders)
- **ID 4**: DeFi Protocol (Draft, no desplegado)

## Queries Disponibles

Ver `DATABASE.md` para lista completa de queries y ejemplos de uso.

Ejemplos:
- `getChainById(1)` - Obtener un chain
- `getHoldersByChainId(1)` - Obtener holders de un chain
- `getRecentTransactions(1, 10)` - Últimas 10 transacciones
- `getMilestonesByChainId(1)` - Milestones de un chain
- `getChainsByCreator('0x...')` - Chains de un creator

## Estructura como DB Real

```
chains (id)
  ├── holders (chainId → chains.id)
  ├── transactions (chainId → chains.id)
  ├── blocks (chainId → chains.id)
  ├── price-history (chainId → chains.id)
  └── milestones (chainId → chains.id)
```

Cada archivo JSON es una tabla, y se relacionan por foreign keys (chainId).
