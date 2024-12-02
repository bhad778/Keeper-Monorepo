import { useStyles } from './ViewUsersStyles';

type ViewUsersComponentProps = {
  users: any[];
};

const ViewUsersComponent = ({ users }: ViewUsersComponentProps) => {
  const styles = useStyles();

  const onSubmit = () => {};

  return (
    <div style={styles.container}>
      {users.map((user: any) => {
        return <div>{user.name}</div>;
      })}
    </div>
  );
};

export default ViewUsersComponent;
