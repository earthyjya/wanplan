import "../scss/AttModal.scss";
import React, { Component } from "react";
import { Modal, ModalBody } from "reactstrap";
import { Carousel, CarouselItem, CarouselControl } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class AttModal extends Component {
  state = {
    activeIndex: 0,
    animating: false
  };

  componentDidMount() {
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  next() {
    this.setState({ activeIndex: (this.state.activeIndex + 1) % 3 });
  }

  previous() {
    this.setState({ activeIndex: this.state.activeIndex === 0 ? 2 : this.state.activeIndex - 1 });
  }

  getCarouselItems() {
    var progress = [];
    progress.push(
      <CarouselItem className="attmodal-carousel-item" key={0}>
        <img src="https://via.placeholder.com/300x200" alt="First slide" />
      </CarouselItem>
    );
    progress.push(
      <CarouselItem className="attmodal-carousel-item" key={1}>
        <img src="https://via.placeholder.com/300x200" alt="second slide" />
      </CarouselItem>
    );
    progress.push(
      <CarouselItem className="attmodal-carousel-item" key={2}>
        <img src="https://via.placeholder.com/300x200" alt="Third slide" />
      </CarouselItem>
    );
    return progress;
  }

  render() {
    if (!this.props.detail) return <React.Fragment></React.Fragment>;
    const {
      attraction_name,
      attraction_link,
      attraction_description,
      open_time,
      close_time
    } = this.props.detail;
    return (
      <React.Fragment>
        <Modal
          centered={true}
          backdrop={true}
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          size="md"
        >
          <ModalBody className="attmodal" style={{ padding: 0 }}>
            <Carousel className="attmodal-carousel" activeIndex={this.state.activeIndex}>
              {this.getCarouselItems()}
              <CarouselControl
                direction="prev"
                directionText="Previous"
                onClickHandler={this.previous}
              />
              <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
            </Carousel>
            <div class="attmodal-description-container">
              <div class="name"> {attraction_name} </div>
              <div class="type"> sightseeing place </div>
              <div class="time-container">
                <div class="opening">
                  <span>
                    {" "}
                    <FontAwesomeIcon icon="clock" />
                    opening:
                  </span>
                  <span>{open_time + " - " + close_time}</span>
                </div>
                <div class="peak">
                  <span>
                    {" "}
                    <FontAwesomeIcon icon="calendar-alt" />
                    peak:
                  </span>
                  <span> 8:00 - 16:00 </span>
                </div>
                <div class="link">
                  <span>
                    {" "}
                    <FontAwesomeIcon icon="link" />
                  </span>
                  <a href={attraction_link}>link</a>
                </div>
              </div>
              <div class="description">{attraction_description}</div>
            </div>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

export default AttModal;
