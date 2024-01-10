import { gql, useQuery } from "@apollo/client";

interface Todo {
  id: string;
  title: string;
  user: {
    name: string;
  };
}

const query = gql`
  query GetTasksWithUser {
    getTasks {
      id
      title
      user {
        name
      }
    }
  }
`;

export default function App() {
  const { data, loading } = useQuery(query);

  if (loading) return <h1>Loading...</h1>;

  return (
    <div>
      <ul>
        {data.getTasks.map((todo: Todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
