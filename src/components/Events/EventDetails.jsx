/** @format */

import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

import Header from "../Header.jsx";
import { deleteEvent, fetchEventDetails, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEventDetails({ signal, id: params.id }),
  });

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      });
      navigate("/");
    },
  });

  //function to handle starting to deletion
  function startDeleteHandler() {
    setIsDeleting(true);
  }

  //function to handle stopping deletion
  function stopDeleteHandler() {
    setIsDeleting(false);
  }
  function deleteEventHandler() {
    {
      mutate({ id: params.id });
    }
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
            <button onClick={startDeleteHandler}>Delete</button>
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
      {isDeleting && (
        <Modal onClose={stopDeleteHandler}>
          <h2>Are you sure?</h2>
          <p>Are you really sure you want to delete Event? Changes cannot be undone</p>
          <div className="form-actions">
            {isPendingDeletion ? (
              <p>Deleting Event ...</p>
            ) : (
              <>
                <button onClick={stopDeleteHandler} className="button-text">
                  Cancel
                </button>
                <button onClick={deleteEventHandler} className="button">
                  Delete
                </button>
              </>
            )}
          </div>

          {isErrorDeleting && (
            <ErrorBlock
              title="failed to delete event"
              message={
                deleteError.info?.message || "Failed to delete event. Please try again later"
              }
            />
          )}
        </Modal>
      )}
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
