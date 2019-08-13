import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { equals, is, update, remove } from 'ramda';
import interact from 'interactjs';
import { DeleteIcon, NumberIcon } from './Icons';

class Crop extends Component {
  static cropStyle = coordinate => {
    const { x, y, width, height } = coordinate;

    return {
      // border: '1px dotted rgba(153,153,153,1)',
      // background: 'rgba(153,153,153,0.3)',
      display: 'inline-block',
      position: 'absolute',
      width,
      height,
      top: y,
      left: x, 
      boxShadow: '0 0 4px #000',
      background: '#FAAD14',
      opacity: 0.5,
    };
  };

  componentDidMount() {
    interact(this.crop)
      .draggable({})
      .resizable({
        edges: {
          left: true,
          right: true,
          bottom: true,
          top: true,
        },
      })
      .on('dragmove', this.handleDragMove)
      .on('dragend', this.handleDragEnd);
    // .on('resizemove', this.handleResizeMove)
    // .on('resizeend', this.handleResizeEnd);
  }

  shouldComponentUpdate(nextProps) {
    const { coordinate, index } = this.props;
    return !equals(nextProps.coordinate, coordinate) || nextProps.index !== index;
  }

  componentWillUnmount() {
    interact(this.crop).unset();
  }

  handleResizeMove = e => {
    const {
      index,
      coordinate,
      coordinate: { x, y },
      coordinates,
      onResize,
      onChange,
    } = this.props;
    const { width, height } = e.rect;
    const { left, top } = e.deltaRect;

    const nextCoordinate = {
      ...coordinate,
      x: x + left,
      y: y + top,
      width,
      height,
    };
    const nextCoordinates = update(index, nextCoordinate)(coordinates);
    if (is(Function, onResize)) {
      onResize(nextCoordinate, index, nextCoordinates);
    }
    if (is(Function, onChange)) {
      onChange(nextCoordinate, index, nextCoordinates);
    }
  };

  /*  handleResizeEnd = e => {
    const {
      index,
      coordinate,
      coordinate: { x, y },
      coordinates,
      onUpdate,
    } = this.props;
    console.log(e);
    const { width, height, left, top } = e.rect;

    const nextCoordinate = {
      ...coordinate,
      x: x + left,
      y: y + top,
      width,
      height,
    };
    const nextCoordinates = update(index, nextCoordinate)(coordinates);
    if (is(Function, onUpdate)) {
      onUpdate(nextCoordinate, index, nextCoordinates);
    }
  }; */

  handleDragMove = e => {
    const {
      index,
      coordinate,
      coordinate: { x, y },
      coordinates,
      onDrag,
      onChange,
    } = this.props;
    const { dx, dy } = e;
    const nextCoordinate = { ...coordinate, x: x + dx, y: y + dy };
    const nextCoordinates = update(index, nextCoordinate)(coordinates);
    if (is(Function, onDrag)) {
      onDrag(nextCoordinate, index, nextCoordinates);
    }

    if (is(Function, onChange)) {
      onChange(nextCoordinate, index, nextCoordinates);
    }
  };

  handleDragEnd = e => {
    const {
      index,
      coordinate,
      coordinate: { x, y },
      coordinates,
      onUpdate,
    } = this.props;
    const { dx, dy } = e;
    const nextCoordinate = { ...coordinate, x: x + dx, y: y + dy };
    const nextCoordinates = update(index, nextCoordinate)(coordinates);

    if (is(Function, onUpdate)) {
      onUpdate(nextCoordinate, index, nextCoordinates);
    }
  };

  handleDelete = () => {
    const { index, coordinate, onDelete, coordinates } = this.props;
    const nextCoordinates = remove(index, 1)(coordinates);
    if (is(Function, onDelete)) {
      onDelete(coordinate, index, nextCoordinates);
    }
  };

  render() {
    const { coordinate, index } = this.props;
    return (
      <div
        style={Crop.cropStyle(coordinate)}
        ref={crop => {
          this.crop = crop;
        }}
      >
        <NumberIcon number={index + 1} />
        <DeleteIcon onClick={this.handleDelete} />
      </div>
    );
  }
}

export const coordinateType = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
});

Crop.propTypes = {
  coordinate: coordinateType.isRequired,
  index: PropTypes.number.isRequired,
  onResize: PropTypes.func, // eslint-disable-line
  onDrag: PropTypes.func, // eslint-disable-line
  onDelete: PropTypes.func, // eslint-disable-line
  onChange: PropTypes.func, // eslint-disable-line
  coordinates: PropTypes.array, // eslint-disable-line
};

export default Crop;
