import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LiveSports() {
  const navigate = useNavigate();

  const userToken = localStorage.getItem("userToken");
  const adminToken = localStorage.getItem("token");
  const token = userToken || adminToken;

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [field, setField] = useState("");
  const [image, setImage] = useState(null);
  const [sports, setSports] = useState([]);

  useEffect(() => {
  fetchSports();

  const interval = setInterval(() => {
    fetchSports();
  }, 5000); // 5 seconds

  return () => clearInterval(interval);
}, []);


  const fetchSports = async () => {
    const res = await fetch("http://localhost:3001/api/live-sports");
    const data = await res.json();
    setSports(data);
  };

  const handleSubmit = async () => {
    if (!title || !location || !field || !image) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("field", field);
    formData.append("image", image);

    const response = await fetch("http://localhost:3001/api/live-sports", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    setTitle("");
    setLocation("");
    setField("");
    setImage(null);

    fetchSports();
  };

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: "420px", margin: "0 auto" }}>

        <h2>Live Sports</h2>

        {/* Upload Section */}
        <h3 style={{ marginTop: "20px" }}>Post Live Match</h3>

        <input
          placeholder="Match Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          placeholder="Field Name"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          className="full-btn"
          style={{ backgroundColor: "#8AC926", color: "white", marginTop: "10px" }}
          onClick={handleSubmit}
        >
          Go Live
        </button>

        <hr style={{ margin: "30px 0" }} />

        {/* Display Section */}
        <h3>Ongoing Matches</h3>

        {sports.length === 0 && <p>No live matches</p>}

        {sports.map((sport) => (
          <div key={sport._id} className="event-card">
            <strong>{sport.title}</strong>
            <p>{sport.location} • {sport.field}</p>
            <p>Posted by: {sport.userId?.name}</p>

            <img
              src={`http://localhost:3001/uploads/${sport.image}`}
              alt="live"
              style={{ width: "100%", borderRadius: "10px", marginTop: "10px" }}
            />
          </div>
        ))}

        <button
          onClick={() => navigate(-1)}
          className="small-btn"
          style={{ marginTop: "20px", backgroundColor: "#FF595E", color: "white" }}
        >
          Back
        </button>

      </div>
    </div>
  );
}

export default LiveSports;
