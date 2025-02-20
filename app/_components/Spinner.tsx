export { Spinner };

function Spinner() {
  return (
    <div className="is-flex is-justify-content-center is-align-items-center" style={{"height": "100%"}}>
      <span className="icon">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
      </span>
    </div>
  );
}
