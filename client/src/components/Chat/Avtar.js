export default function Avatar({ username, userId, isOnline, avatarLink }) {
  const colors = ["#90CDF4","#F56565","#D6BCFA","#BC85E0","#7F9CF5","#F6AD55","#F687B3","#68D391","#FBBF24","#4299E1"];

  const safeUserId = userId || "000000000000000000000000";
  const userIdBase10 = parseInt(safeUserId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  const squircleStyles = {
    "--squircle-bg-color": color,
  };

  return (
    <div className="squircle relative text-black" style={squircleStyles}>
      <div className="squircle__inline text-xl text-white uppercase">
        {avatarLink ? (
          <img
            src={avatarLink}
            className="h-10"
            alt={username || "avatar"}
          />
        ) : (
          <span>{username?.[0] || "?"}</span>
        )}
      </div>
    </div>
  );
}