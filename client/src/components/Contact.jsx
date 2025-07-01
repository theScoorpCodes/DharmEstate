import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Contact({ listing }) {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => setMessage(e.target.value);

  useEffect(() => {
    const getLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) return;
        setLandLord(data);
      } catch (error) {
        console.log(error);
      }
    };
    getLandLord();
  }, [listing.userRef]);
  return (
    <>
      {landLord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact: <span className="font-semibold">{landLord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            className="w-full border p-3 rounded-lg"
            placeholder="Type your message here..."
          ></textarea>
          <Link to={`mailto:${landLord.email}?Subject=${listing.name}&body=${message}`} className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">Send the message</Link>
        </div>
      )}
    </>
  );
}

export default Contact;
