import { gql, useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';

const TEST_QUERY = gql`
  query TestConnection {
    _empty
  }
`;

export default function TestConnection() {
  const { loading, error, data } = useQuery(TEST_QUERY, {
    onError: (error) => {
      console.error('GraphQL Error:', error);
      toast.error(`Lỗi kết nối: ${error.message}`);
    },
    onCompleted: (data) => {
      console.log('GraphQL Response:', data);
      toast.success('Kết nối thành công!');
    }
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Kết Nối GraphQL</h2>
      <div className="space-y-2">
        <div>
          <strong>Trạng thái:</strong>{' '}
          {loading ? 'Đang kết nối...' : error ? 'Lỗi' : 'Đã kết nối'}
        </div>
        {error && (
          <div className="text-red-500">
            <strong>Lỗi:</strong> {error.message}
          </div>
        )}
        {data && (
          <div className="bg-gray-100 p-2 rounded">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 