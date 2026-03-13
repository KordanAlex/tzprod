const users: {
  id: number,
  name: string,
  age: number,
}[] =
  [
    { "id": 0, "name": "Zalupka", "age": 5 },
    { "id": 1, "name": "Alice Johnson", "age": 28 },
    { "id": 2, "name": "Bob Smith", "age": 34 },
    { "id": 3, "name": "Charlie Brown", "age": 22 },
    { "id": 4, "name": "Diana Prince", "age": 29 },
    { "id": 5, "name": "Ethan Hunt", "age": 41 },
    { "id": 6, "name": "Fiona Gallagher", "age": 25 },
    { "id": 7, "name": "George Costanza", "age": 38 },
    { "id": 8, "name": "Hannah Baker", "age": 19 },
    { "id": 9, "name": "Ian Malcolm", "age": 52 },
    { "id": 10, "name": "Julia Roberts", "age": 33 }
  ]

const lastId = users.length > 0 ? users.length + -1 : 0;

export default defineEventHandler(async (event) => {
  const queries = getQuery(event)
  const method = event.method

  const queryId = Number(queries.id)
  const newId = lastId + 1
  const page = queries.page ? Number(queries.page) : 1
  const limit = queries.limit ? Number(queries.limit) : 5
  const start = (page - 1) * limit


  switch (method) {
    case 'GET':
      if (!isNaN(queryId)) {
        const user = users.find(user => user.id === queryId)
        if (!user) throw createError({ statusCode: 404, statusMessage: "Пользователь не найден" })
        return user
      }
      return users.slice(start, start + limit)

    case 'POST':
      const body = await readBody(event)
      if (!body.name || !body.age) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Fields id, name, age are required',
        })
      }
      const newUser = {
        id: newId,
        name: body.name,
        age: Number(body.age)
      }
      users.push(newUser)
      return body

    case 'DELETE':
      if (!isNaN(queryId)) {
        const userIndex = users.findIndex(user => user.id === queryId)

        if (userIndex === -1) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Элемент не найден',
          });
        }
        users.splice(userIndex, 1)
      }
      return "OK";

    default:
      throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }
})