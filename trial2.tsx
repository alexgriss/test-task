import React, { useEffect, useState } from "react";

const wrapperStyles = {
  width: "375px",
  padding: "16px",
  backgroundColor: "#fafafd",
};

interface IWrapper {
  children: React.ReactNode;
}

const Wrapper = ({ children }: IWrapper) => (
  <div style={wrapperStyles}>{children}</div>
);

const userRoleStyles = {
  display: "flex",
  alignItems: "center",
  fontSize: "11px",
  fontWeight: "600",
};

const roleSpanStyles = {
  paddingLeft: "4px",
};

interface IUserRole {
  icon: React.ReactNode;
  role: string;
}

const UserRole = ({ icon, role }: IUserRole) => (
  <div style={userRoleStyles}>
    {icon}
    <span style={roleSpanStyles}>{role}</span>
  </div>
);

const usersGroupStyles = {
  backgroundColor: "#fff",
  borderRadius: "16px",
  padding: "0 16px",
  margin: "16px 0",
};

interface IUsersGroup {
  children: React.ReactNode;
}

const UsersGroup = ({ children }: IUsersGroup) => (
  <div style={usersGroupStyles}>{children}</div>
);

const invitedStatusStyles = {
  borderRadius: "24px",
  padding: "10px",
  backgroundColor: "#eeeff2",
};

const InvitedStatus = () => <div style={invitedStatusStyles}>Invited</div>;

const userStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const userRightSideStyles = {
  display: "flex",
  alignItems: "center",
};

interface IUser {
  userName: string;
  isInvited: boolean;
}

const User = ({ userName, isInvited }: IUser) => (
  <div style={userStyles}>
    <span>{userName}</span>
    <div style={userRightSideStyles}>
      {isInvited && <InvitedStatus />}
      <ChevronRightIcon />
    </div>
  </div>
);

const useUsers = () => {
  const [administrators, setAdministrators] = useState(null);
  const [standardUsers, setStandardUsers] = useState(null);

  const [isUsersLoading, setIsUsersLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    setAdministrators(null);
    setStandardUsers(null);

    setIsUsersLoading(true);

    Promise.all([getUsers(), getInvites()]).then(
      ([usersResponse, invitesResponse]) => {
        if (!ignore) {
          const usersAdministrators = usersResponse
            .filter((teamMember) => teamMember.role === "Administrator")
            .map((teamMember) => ({
              id: teamMember.id,
              userName: `${teamMember.user.name} ${teamMember.user.lastName}`,
              isInvited: false,
            }));

          const invitesAdministrators = invitesResponse
            .filter((invite) => invite.role === "Administrator")
            .map((invite) => ({
              id: invite.id,
              userName: invite.phone,
              isInvited: true,
            }));

          const administrators = [
            ...usersAdministrators,
            ...invitesAdministrators,
          ];

          setAdministrators(administrators);

          const usersStandardUsers = usersResponse
            .filter((teamMember) => teamMember.role === "Standard")
            .map((teamMember) => ({
              id: teamMember.id,
              userName: `${teamMember.user.name} ${teamMember.user.lastName}`,
              isInvited: false,
            }));

          const invitesStandardUsers = invitesResponse
            .filter((invite) => invite.role === "Standard")
            .map((invite) => ({
              id: invite.id,
              userName: invite.phone,
              isInvited: true,
            }));

          const standardUsers = [
            ...usersStandardUsers,
            ...invitesStandardUsers,
          ];

          setStandardUsers(standardUsers);

          setIsUsersLoading(false);
        }
      }
    );

    return () => {
      ignore = true;
    };
  }, []);

  return {
    administrators,
    standardUsers,
    isUsersLoading,
  };
};

export const Users = () => {
  const { administrators, standardUsers, isUsersLoading } = useUsers();

  if (isUsersLoading) return <Loader />;

  return (
    <Wrapper>
      {administrators && administrators.length && (
        <>
          <UserRole icon={<AdminIcon />} role="Administrators" />
          <UsersGroup>
            {administrators.map(({ id, userName, isInvited }) => (
              <User key={id} userName={userName} isInvited={isInvited} />
            ))}
          </UsersGroup>
        </>
      )}

      {standardUsers && standardUsers.length && (
        <>
          <UserRole icon={<StandardUserIcon />} role="Standard Users" />
          <UsersGroup>
            {standardUsers.map(({ id, userName, isInvited }) => (
              <User key={id} userName={userName} isInvited={isInvited} />
            ))}
          </UsersGroup>
        </>
      )}
    </Wrapper>
  );
};
