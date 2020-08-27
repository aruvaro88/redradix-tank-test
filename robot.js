async function main(tank) {
  let range = 0
  let missileRange = 700
  let angle = 0
  let normalSpeed = 50
  let maxSpeed = 100
  let posX = await tank.getX()

  if (posX <= 670) angle = 0 //comprobacion de la posicion inicial para posicionar el escaneo hacia un lado u otro
  if (posX > 670) angle = 180

  const limit = {
    //establecimiento de los limites por los que se mueve el tanque
    top: 850,
    left: 150,
    bottom: 150,
    right: 1190,
  }

  while (true) {
    if ((await tank.scan(angle, 10)) !== 0) {
      //si al escanear encuentra un enemigo
      range = await tank.scan(angle, 10) //verifica la distancia del enemigo para disparar
      if (range > 10) {
        await tank.shoot(angle, missileRange)
        if (range > 150) {
          // si el enemigo esta muy lejos, se dirige hasta su ultima posicion
          await tank.drive(angle, maxSpeed)
        } else {
          //si no encuentra enemigo, el tanque se queda parado escaneando
          if (
            (await tank.getX()) > limit.left &&
            (await tank.getX()) < limit.right &&
            (await tank.getY()) > limit.top &&
            (await tank.getY()) < limit.bottom
          ) {
            await tank.drive(angle, 0)
          }
        }
      }
      angle -= 20 //movemos el angulo en direccion contraria para enfocar mejor al enemigo en caso de moverse
    } else {
      angle += 20 //movimiento normal del radar
      if ((await tank.getX()) <= limit.left) {
        //ifs que detectan si el tanque se acerca a los limites,
        //si lo hace, reduce de velodidad y se mueve en direccion contraria
        if ((await tank.getSpeed()) > normalSpeed) {
          speed = normalSpeed
        }
        await tank.drive(0, normalSpeed)
      }
      if ((await tank.getX()) >= limit.right) {
        if ((await tank.getSpeed()) > normalSpeed) {
        }
        await tank.drive(180, normalSpeed)
      }
      if ((await tank.getY()) >= limit.top) {
        if ((await tank.getSpeed()) > normalSpeed) {
        }
        await tank.drive(359, normalSpeed)
      }
      if ((await tank.getY()) <= limit.bottom) {
        if ((await tank.getSpeed()) > normalSpeed) {
          speed = normalSpeed
        }
        await tank.drive(90, normalSpeed)
      }
    }
  }
}
