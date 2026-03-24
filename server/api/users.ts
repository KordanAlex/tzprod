const users: {
  id: number,
  name: string,
  age: number,
}[] = [
    { id: 1, name: 'Danila', age: 24 },
    { id: 2, name: 'Ivan', age: 30 },
    { id: 3, name: 'Maria', age: 22 },
    { id: 4, name: 'Alex', age: 28 },
    { id: 5, name: 'Olga', age: 35 },
    { id: 6, name: 'Dmitry', age: 19 },
    { id: 7, name: 'Anna', age: 27 },
    { id: 8, name: 'Sergei', age: 41 },
    { id: 9, name: 'Elena', age: 33 },
    { id: 10, name: 'Nikita', age: 21 },
    { id: 11, name: 'Tatiana', age: 29 },
    { id: 12, name: 'Pavel', age: 26 },
    { id: 13, name: 'Ksenia', age: 23 },
    { id: 14, name: 'Andrei', age: 38 },
    { id: 15, name: 'Viktor', age: 45 },
    { id: 16, name: 'Natalia', age: 31 },
    { id: 17, name: 'Roman', age: 20 },
    { id: 18, name: 'Darya', age: 25 },
    { id: 19, name: 'Maxim', age: 34 },
    { id: 20, name: 'Irina', age: 37 },
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
        const user = users.find(user => user.id === queryId)
        if (!user) {
          throw createError({ statusCode: 404, statusMessage: "Пользователь не найден" })
        }
        return user
      }

      let filteredUsers = query.age ? users.filter(user => user.age === queryAge) : users

      if (query.search) {
        const search = String(query.search).toLowerCase()
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(search)
        )

        return {
          users: filteredUsers.slice(start, start + limit).map(u => ({
            ...u,
            position: users.indexOf(u)
          })),
          total: filteredUsers.length
        }
      }

      return {
        users: filteredUsers.slice(start, start + limit),
        total: filteredUsers.length
      }

    }
    case "POST": {
      const body = await readBody(event)
      const bodyName = String(body.name).trim()
      const bodyAge = Number(body.age)

      if (bodyName === '' || isNaN(bodyAge) || bodyAge <= 0) {
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

      const bodyName = String(body.name).trim()
      const bodyAge = Number(body.age)

      if (bodyName === '' || isNaN(bodyAge)) {
        throw createError({ statusCode: 400, statusMessage: "Поля ввода имени и возраста обязательны!" })
      }

      const updatedUser = {
        id: queryId,
        name: bodyName,
        age: bodyAge,
      }

      users.splice(userIndex, 1, updatedUser)
      return updatedUser
    }
    case "DELETE": {
      const queryId = Number(query.id)
      if (isNaN(queryId)) { throw createError({ statusCode: 400, statusMessage: "Айди пользователя указан не корректно" }) }

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