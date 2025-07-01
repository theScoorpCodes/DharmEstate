import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

function Listing() {
  const params = useParams();
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`, {
          method: "GET",
        });
        const data = await res.json();
        console.log(data);

        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        setLoading(false);
        setError("Something went wrong");
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="text-center my-2 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-2 text-2xl">
          Something went wrong!{" "}
          <Link className="text-blue-600" to="/">
            Go to home page
          </Link>
        </p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url, index) => (
                
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{ background: `url(${url}) center no-repeat`, backgroundSize: "cover" }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
      {/* {listing && !loading && !error && (
        <>
        {console.log(listing.imageUrls)
        }
        </>
        )} */}
    </main>
  );
}

export default Listing;
