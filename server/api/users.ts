const users: {
  id: number,
  name: string,
  age: number,
}[] = [
    {
      id: 1,
      name: 'Danila',
      age: 24
    }
  ]

let lastId = users.length ? Math.max(...users.map(u => u.id)) : 0;


export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const method = event.method

  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 5;
  const start = (page - 1) * limit

  switch (method) {
    case "GET": {
      const queryId = Number(query.id)
      const queryAge = Number(query.age)

      if (!isNaN(queryId)) {
        const user = users.find(user => user.id === query.id)
        if (!user) {
          throw createError({ statusCode: 404, statusMessage: "Пользователь не найден" })
        }
        return user
      }

      const filteredUsers = query.age ? users.filter(users => users.age === queryAge) : users
    
      return {
        users: filteredUsers.slice(start, start + limit),
        total: filteredUsers.length
      }

    }
    case "POST": {
      const body = await readBody(event)
      const bodyName = String(body.name).trim()
      const bodyAge = Number(body.age)

      if (bodyName !== '' || isNaN(bodyAge)) {
        throw createError({ statusCode: 400, statusMessage: "Поля ввода имени и возраста обязательны!" })
      }

      const newUser = {
        id: lastId + 1,
        name: bodyName,
        age: bodyAge,
      }

      users.push(newUser)
      lastId = newUser.id
      return newUser
    }
    case "PUT": {
      const body = await readBody(event)
      const queryId = Number(query.id)

      if (isNaN(queryId)) {
        throw createError({ statusCode: 400, statusMessage: "Айди пользователя указан не корректно" })
      }

      const userIndex = users.findIndex(user => user.id === queryId)

      if (userIndex === -1) {
        throw createError({ statusCode: 404, statusMessage: "Пользователь не найден" })
      }

      users.splice(userIndex, 1, body)
      return users[userIndex]
    }
    case "DELETE": {
      const queryId = Number(query.id)
      if (isNaN(queryId)) { throw createError({ statusCode: 404, statusMessage: "Айди пользователя указан не корректно" }) }

      const userIndex = users.findIndex(user => user.id === queryId)

      if (userIndex === -1) {
        throw createError({ statusCode: 404, statusMessage: "Пользователь не найден" })
      }

      users.splice(userIndex, 1)
      return "OK"
    }

    default: throw createError({ statusCode: 405, statusMessage: "Метод не найден" })
  }
})