# TS-Zone-file
This module is designed for manaing a BIND name server.

Written in typescript and compiled to pure javascript. No extrernal dependencies
Full Examples can be found in the git repo.

It takes inspiration from [zone-file]()

# Usage
## Parsing zonefile
Loading
```ts
import { parseZoneFile } from 'ts-zone-file';
import { readFile } from 'fs-extras'
const file = await readFile('/zones/example.com');
const zone = await parseZoneFile(file.toString())
```

Appending
```ts
import { parseZoneFile } from 'ts-zone-file';
import { readFile, writeFile } from 'fs-extras'
const file = await readFile('/zones/example.com');
const zone = await parseZoneFile(zoneFileString.toString())
zone.a.push({ host: 'www', value: '1.1.1.1' })
const zoneString = await generateZoneFile(zone)
await writeFile('./example.com', zoneString)
```

## Creating Zonefile Text
```ts
import { generateZoneFile } from 'ts-zone-file';
import { writeFile } from 'fs-extras'
const string = await generateZoneFile(zone);
await writeFile('/zones/example.com', string)
```

## Parse named.conf
```ts
import { parseBINDConfig } from 'ts-zone-file';
import { readFile } from 'fs-extras'
const file = await readFile('/named.conf');
const zone = await parseBINDConfig(file.toString())
```

## Generate named.conf
```ts
import { generateConfig } from 'ts-zone-file';
import { writeFile } from 'fs-extras'
const string = await generateConfig(SAMPLE2OBJ)
await writeFile('/named.conf', string)
```