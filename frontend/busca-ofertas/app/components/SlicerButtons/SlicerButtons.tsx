import "./SlicerButtons.css";

interface SlicerButtonsProps {
  onLeft: () => void;
  onRight: () => void;
}

const SlicerButtons = ({ onLeft, onRight }: SlicerButtonsProps) => {
  return (
    <div className="d-flex gap-2">
      <button className="slicer-buttons" onClick={onLeft}>
        <i className="bi bi-arrow-left-circle"></i>
      </button>

      <button className="slicer-buttons" onClick={onRight}>
        <i className="bi bi-arrow-right-circle"></i>
      </button>
    </div>
  );
};

export default SlicerButtons;
