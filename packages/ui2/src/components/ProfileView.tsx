import { User } from "common-utils/types";

export default function ProfileView({ profile }: { profile?: User }) {
  if (!profile) return <div className="box list">Loading Profile</div>;
  return (
    <div className="box list">
      <div>{profile.name}</div>
      <div>{profile.email}</div>
      <img
        src={profile.picUrl}
        alt="No Image"
        style={{ width: "50px", height: "50px" }}
      />
    </div>
  );
}
