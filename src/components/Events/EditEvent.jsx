/** @format */

import { Link, useNavigate, useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { fetchEventDetails } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEventDetails({ signal, id }),
  });

  function handleSubmit(formData) {}

  function handleClose() {
    navigate("../");
  }

  let content;
  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load events"
          message={error.info?.message || "Failed to load events. Please check inputs and retry"}
        />
        <div className="form-actions">
          <Link to="../" className="button">
            {" "}
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }
  return (
    <Modal onClose={handleClose}>
    {content}
    </Modal>
  );
}
