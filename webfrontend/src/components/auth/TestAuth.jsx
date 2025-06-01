import { gql, useQuery } from '@apollo/client';

const TEST_QUERY = gql`
  query TestQuery {
    allCategories {
      _id
      name
    }
  }
`;

export default function TestAuth() {
  const { loading, error, data } = useQuery(TEST_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Test Categories:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
} 