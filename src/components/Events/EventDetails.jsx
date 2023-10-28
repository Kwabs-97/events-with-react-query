/** @format */

import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import Header from "../Header.jsx";
import { deleteEvent, fetchEventDetails } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEventDetails({ signal, id: params.id }),
  });

  const { mutate } = useMutation({
    mutationFn: deleteEvent,
  });

  function deleteEventHandler() {
    const proceed = window.confirm("Are you sure you want to delete event?");
    if (proceed) {
      mutate({ id: params.id });
    }

    navigate('/')
  }

  let content;
  if (isPending) {
    content = (
      <div className="center" id="event-details-content">
        <p>Fetching event details...</p>{" "}
      </div>
    );
  }
  if (isError) {
    content = (
      <div className="center" id="event-details-content">
        <ErrorBlock
          title="failed to load event"
          message={error.info?.message || "Failed to fetch event data. Please try again later"}
        />
      </div>
    );
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    content = (
      <>
        <header>
          <h1>{data.title} </h1>
          <nav>
            <button onClick={deleteEventHandler}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formattedDate} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
