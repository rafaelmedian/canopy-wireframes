# Mock Database Structure

Esta carpeta contiene todos los datos mock organizados como una base de datos relacional, con archivos JSON separados que se relacionan por IDs.

## Estructura de Archivos

```
src/data/
├── chains.json          # Tabla principal de chains
├── holders.json         # Holders relacionados por chainId
├── transactions.json    # Transacciones relacionadas por chainId
├── blocks.json          # Bloques relacionados por chainId
├── price-history.json   # Historial de precios relacionado por chainId
├── milestones.json      # Milestones/logros relacionados por chainId
└── db.js               # Funciones helper para queries (como un ORM)
```

## Schema de la Base de Datos

### chains.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "name": "Onchain ENS",
  "ticker": "OENS",
  "creator": "0x742d...",     // Wallet address del creador (quien deployó)
  "creatorName": "Team Name",
  "owner": "0x742d...",       // Wallet address del dueño actual
  "genesisBlock": 1250432,
  "genesisHash": "0x8f5c...",
  "currentBlock": 45789,
  "totalTransactions": 152847,
  ...
}
```

### holders.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "chainId": 1,               // FOREIGN KEY -> chains.id
  "address": "0x742d...",
  "balance": 150000000
}
```

### transactions.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "chainId": 1,               // FOREIGN KEY -> chains.id
  "hash": "0x742d...",
  "from": "0x8626...",
  "to": "0xdD2F...",
  "amount": 2500,
  "status": "success",
  "blockNumber": 45789        // Relacionado con blocks
}
```

### blocks.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "chainId": 1,               // FOREIGN KEY -> chains.id
  "number": 45789,
  "hash": "0x8f5c...",
  "transactions": 156,
  "timestamp": 15
}
```

### price-history.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "chainId": 1,               // FOREIGN KEY -> chains.id
  "time": "00:00",
  "price": 0.0098
}
```

### milestones.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "chainId": 1,               // FOREIGN KEY -> chains.id
  "type": "holders",          // holders | transactions | marketcap
  "title": "First 10 Holders",
  "description": "Reach your first 10 token holders",
  "requirement": 10,
  "current": 21,
  "completed": true,
  "completedAt": "2024-01-15T10:30:00Z"
}
```

## Uso de las Funciones Query (db.js)

### Queries Simples

```javascript
import {
  getChainById,
  getHoldersByChainId,
  getRecentTransactions
} from '@/data/db'

// Obtener un chain por ID
const chain = getChainById(1)

// Obtener todos los holders de un chain
const holders = getHoldersByChainId(1)

// Obtener las últimas 10 transacciones
const recentTxs = getRecentTransactions(1, 10)
```

### Queries Complejas (JOINs)

```javascript
import { getChainDetails, getHolderDetails, getBlockDetails } from '@/data/db'

// Obtener chain con TODOS sus datos relacionados
// Similar a: SELECT * FROM chains
//            JOIN holders ON holders.chainId = chains.id
//            JOIN transactions ON transactions.chainId = chains.id
//            JOIN blocks ON blocks.chainId = chains.id
const fullChain = getChainDetails(1)
// Retorna: { ...chain, holders: [...], priceHistory: [...], explorer: {...} }

// Obtener holder con su historial de transacciones
const holderInfo = getHolderDetails(1, '0x742d...')
// Retorna: { ...holder, transactions: [...] }

// Obtener bloque con todas sus transacciones
const blockInfo = getBlockDetails(1, 45789)
// Retorna: { ...block, transactions: [...] }
```

### Queries por Filtros

```javascript
import {
  getChainsByCreator,
  getVirtualChains,
  getGraduatedChains,
  getTopHolders,
  getTransactionsByAddress
} from '@/data/db'

// WHERE creator = '0x...'
const myChains = getChainsByCreator('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199')

// WHERE owner = '0x...' (chains que posees)
const myOwnedChains = getChainsByOwner('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199')

// WHERE isVirtual = true
const virtualChains = getVirtualChains()

// WHERE isGraduated = true
const graduatedChains = getGraduatedChains()

// ORDER BY balance DESC LIMIT 10
const topHolders = getTopHolders(1, 10)

// WHERE (from = '0x...' OR to = '0x...')
const myTransactions = getTransactionsByAddress(1, '0x742d...')
```

## Relaciones entre Tablas

```
chains (id)
  │
  ├── ONE TO MANY ──> holders (chainId)
  │
  ├── ONE TO MANY ──> transactions (chainId)
  │                      │
  │                      └── MANY TO ONE ──> blocks (blockNumber)
  │
  ├── ONE TO MANY ──> blocks (chainId)
  │
  ├── ONE TO MANY ──> price-history (chainId)
  │
  └── ONE TO MANY ──> milestones (chainId)
```

## IDs de los Chains

- **ID 1**: Onchain ENS (Virtual, público, 21 holders)
- **ID 2**: MyGameChain (Virtual, owner, 1 holder, recién lanzado)
- **ID 3**: Social Connect (Graduated, 5k+ holders)
- **ID 4**: DeFi Protocol (Draft, no desplegado todavía)

## Ejemplo de Uso en Componentes

**Antes** (data hardcodeada):
```javascript
const mockChainData = {
  name: 'Onchain ENS',
  // ... 200 líneas más
}
```

**Ahora** (data relacional):
```javascript
import { getChainDetails } from '@/data/db'

// Obtener chain con todos sus datos relacionados
const chainData = getChainDetails(1)

// Acceder a datos relacionados
console.log(chainData.holders)           // Array de holders
console.log(chainData.priceHistory)      // Array de precios
console.log(chainData.milestones)        // Array de milestones
console.log(chainData.explorer.recentBlocks)  // Últimos bloques
console.log(chainData.explorer.recentTransactions) // Últimas transacciones
```

## Ventajas de esta Estructura

1. **Normalización**: No hay data duplicada
2. **Relaciones Claras**: Como en una DB real con foreign keys
3. **Queries Flexibles**: Puedes filtrar, ordenar, limitar resultados
4. **Fácil de Extender**: Agregar nuevos chains/transactions es simple
5. **Preparado para API Real**: Las funciones query son idénticas a lo que haría una API

## Migración a API Real

Cuando tengas una API real, solo necesitas cambiar las importaciones:

```javascript
// Antes (mock DB):
import { getChainDetails } from '@/data/db'
const chain = getChainDetails(1)

// Después (API real):
import { getChainDetails } from '@/api/chains'
const chain = await getChainDetails(1)
```

Las funciones tienen la misma firma, solo agregas `async/await`.
