import React from 'react';
import { useNavigate } from 'react-router-dom';

const Users = ({ users, lastMess }) => {
  const navigate = useNavigate();
  console.log('lastMess', lastMess);

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
           {lastMess && lastMess["receiver_id"] === user.id ? (
                <p>{user.username} - {lastMess["message"]}</p>
            ) : (
                <p>{user.username}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
