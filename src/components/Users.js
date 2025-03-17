import React from 'react';
import { useNavigate } from 'react-router-dom';

const Users = ({ users }) => {
  const navigate = useNavigate();

  return (
    <div className='all-users'>
      <h2>All Users</h2>
      <ul>
        {users?.map(user => (
          <li
            key={user.id}
            onClick={() =>
              navigate('/chat', {
                state: { userId: user.id, username: user.username, users },
              })
            }
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
