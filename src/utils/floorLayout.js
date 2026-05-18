/**
 * Возвращает массив плашек с координатами центра и углом поворота вокруг Y.
 * @param {number} roomWidth   - ширина комнаты (X)
 * @param {number} roomLength  - длина комнаты (Z)
 * @param {'straight'|'herringbone'} type
 * @param {number} plankLength - длина плашки
 * @param {number} plankWidth  - ширина плашки
 * @returns {{pos: [x,0,z], rot: number}[]}
 */
export function getPlankPositions(roomWidth, roomLength, type, plankLength, plankWidth, plankOffset) {
  if (type === 'straight') {
    return generateStraight(roomWidth, roomLength, plankLength, plankWidth, plankOffset)
  } else {
    return generateHerringbone(roomWidth, roomLength, plankLength, plankWidth, plankOffset)
  }
}

function generateStraight(roomWidth, roomLength, plankLength, plankWidth, plankOffset) {
  const positions = []
  const halfW = roomWidth / 2
  const halfL = roomLength / 2
  // Заполняем с небольшим запасом, стены скроют лишнее
  for (let x = -halfW; x <= halfW; x += plankWidth + plankOffset) {
    for (let z = -halfL ; z <= halfL; z += plankLength + plankOffset) {
      const cx = z + plankLength/2
      const cz = x + plankWidth/2
      const {scale, newX} = computeConstrainedScale(cx, cz, 0, plankLength, plankWidth, halfW, halfL)
      positions.push({
        pos: [newX, 0, cz],
        rot: 0,
        scale: [scale, 1, 1],
      })
    }
  }
  return positions
}

function generateHerringbone(roomWidth, roomLength, plankLength, plankWidth, plankOffset) {
  const positions = []
  
  // Размеры плашки: длинная сторона L, короткая W
  const L = plankLength
  const W = plankWidth
  
  // Шаг в направлении, перпендикулярном рядам плашек (по диагонали)
  // Для классической ёлочки расстояние между рядами = W * sqrt(2)
  const rowSpacing = (W + plankOffset) * Math.SQRT2
  
  // Шаг в направлении ряда (вдоль гребня ёлочки)
  // Расстояние между центрами соседних плашек в одном ряду = L * sqrt(2)
  const colSpacing = (L + plankOffset) * Math.SQRT2
  
  // Половины размеров комнаты
  const halfW = (roomWidth) / 2
  const halfL = (roomLength) / 2

  const minU = -halfW - W * 3;
  const maxU =  halfW + W * 2;
  const minV = -halfL - L;
  const maxV =  halfL + L;

  
  // Перебираем диагональные "строки"
  let aa = 0;
  for (let v = minV; v <= maxV ; v += colSpacing / 2) {
    aa++;
    const rowParity = aa % 2 === 0  // чётность ряда
      // Чередуем угол: в чётных рядах начинаем с +45°, в нечётных с -45°
    const angle = rowParity ? Math.PI/4 : -Math.PI/4
    for (let u = minU; u <= maxU; u += rowSpacing) {
        // Определяем начальное смещение в ряду для чередования углов
        let x = v;
        let z = u;
        if (rowParity) {
            z += rowSpacing / 2
        }
      // Проверяем, попадает ли центр плашки в комнату (с небольшим запасом)
      if (z > -halfW - L/2 && z < halfW + L/2 && x > -halfL - L/2 && x < halfL + L/2) {
        const {scale, newX, newZ} = computeConstrainedScale(x, z, angle, plankLength, plankWidth, halfW, halfL)
        positions.push({
          pos: [newX, 0, newZ],
          rot: angle,  // поворот вокруг Y в радианах
          scale: [scale, 1, 1],
        })
      }
    }
  }
  
  return positions
}

/**
 * Вычисляет масштаб по длине (s), чтобы плашка (L*s × W) полностью
 * поместилась в прямоугольник ±halfW, ±halfL.
 * Возвращает s от 0 до 1.
 */
function computeConstrainedScale(cx, cz, angle, L, W, halfW, halfL) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const hW = W / 2   // половина ширины (не меняется)
  const hL = L / 2

  const posEndX = cx + hL * cos;
  const posEndZ = cz + hL * sin;
  const negEndX = cx - hL * cos;
  const negEndZ = cz - hL * sin;

  const isPosOut = Math.abs(posEndX) > halfL || Math.abs(posEndZ) > halfW;
  const isNegOut = Math.abs(negEndX) > halfL || Math.abs(negEndZ) > halfW;

  // Уже внутри
  if (!isPosOut && !isNegOut) {
    return { scale: 1, newX: cx, newZ: cz };
  }

  // let sign = Math.sign(sin)
  // let sign2 = Math.sign(cos)

  let {maxOverhang, signx, signz} = analyzePlank(cx, cz, angle, L, W, halfW + 0.1, halfL + 0.1);
  let scale = Math.max(0, (L - Math.abs(maxOverhang) / cos) / L)

  // return { scale : 1, newX: cx, newZ: cz};
  return { scale, newX: cx + signx * (maxOverhang / 2), newZ: cz + signz * (maxOverhang / 2)};
}

/**
 * Анализирует плашку (прямоугольник) и определяет максимальное выступание за границы комнаты.
 * @param {number} cx, cz – центр плашки
 * @param {number} angle – угол поворота вокруг Y (радианы)
 * @param {number} L – длина плашки (вдоль локальной оси X после поворота)
 * @param {number} W – ширина плашки (вдоль локальной оси Z)
 * @param {number} halfL – половина длины комнаты (граница по X)
 * @param {number} halfW – половина ширины комнаты (граница по Z)
 * @returns {{
 *   maxOverhang: number,
 *   vertices: Array<{x: number, z: number, overhang: number, closestWall: string}>
 * }}
 */
function analyzePlank(cx, cz, angle, L, W, halfL, halfW) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const hL = L / 2;
  const hW = W / 2;

  // Локальные координаты углов (центр в 0,0)
  const localCorners = [
    [-hL, -hW],
    [ hL, -hW],
    [ hL,  hW],
    [-hL,  hW],
  ];

  let maxOverhang = 0;
  let signx = 1;
  let signz = 1;

  for (const [lx, lz] of localCorners) {
    const worldX = cx + lx * cos - lz * sin;
    const worldZ = cz + lx * sin + lz * cos;

    if (Math.abs(worldX) <= halfW && Math.abs(worldZ) <= halfL)
      continue;

    // Превышения по осям (0, если внутри)
    const overX = Math.max(0, Math.abs(worldX) - halfW);
    const overZ = Math.max(0, Math.abs(worldZ) - halfL);

    // Расстояние до ближайшей стены – минимальное из превышений (т.к. стены параллельны осям)
    const overhang = Math.max(overX, overZ); // если одно 0, то другое

    if (overhang > maxOverhang) {
      if (worldX > halfW && overX > overZ){
        signx = -1
        signz = Math.sign(sin) < 0 ? -1 : 1
      }
      else if (worldZ > halfL && overX < overZ){
        signx = Math.sign(sin) < 0 ? -1 : 1
        signz = -1
      }
      else if (worldZ < -halfL && overX < overZ){
        signx = Math.sign(sin) < 0 ? 1 : -1
        signz = 1
      }
      else if (worldX < -halfW && overX > overZ){
        signx = 1
        signz = -1
      }

      maxOverhang = overhang;
    }

  }
  return {maxOverhang, signx, signz};
}