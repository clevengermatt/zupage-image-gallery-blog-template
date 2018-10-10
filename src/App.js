import React, { Component } from "react";
import "./App.css";
import zupage from "zupage";
import Gallery from "react-photo-gallery";
import Lightbox from "react-images";
import { Container, Image } from "semantic-ui-react";
import Linkify from "react-linkify";

class App extends Component {
  state = {
    creator: {},
    body: "",
    colorPalette: [],
    currentImage: 0,
    photos: [],
    title: ""
  };
  async componentDidMount() {
    const postResponse = await zupage.getCurrentPost();

    const date = new Date(
      postResponse.published_time * 1000
    ).toLocaleDateString("en-US");

    const body = postResponse.body.slice(postResponse.title.length);

    this.setState({
      body: body,
      creator: postResponse.creator,
      colorPalette: postResponse.page.color_palette,
      date: date,
      photos: this.formatPhotos(postResponse.images),
      title: postResponse.title
    });
  }

  formatPhotos = images => {
    let photoArray = [];

    let index = 0;

    images.forEach(function(image) {
      photoArray.push({
        id: image.id,
        index: index,
        caption: image.caption,
        src: image.url,
        width: image.width,
        height: image.height
      });
      index++;
    });

    return photoArray;
  };

  openLightbox = (event, obj) => {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true
    });
  };

  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    });
  };

  gotoPrevious = () => {
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  };

  gotoNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  };

  renderCreator = () => {
    const { creator, date } = this.state;
    return (
      <div className="Creator">
        <Image
          className="Creator-Image"
          src={creator.profile_image_url}
          avatar
        />
        <span className="Creator-Text">{creator.name}</span>
        <p className="Date">{date}</p>
      </div>
    );
  };

  renderParagraphs = () => {
    const { body } = this.state;
    let paragraphs = body.match(/[^\r\n]+/g);
    if (paragraphs) {
      return paragraphs.map((paragraph, i) => {
        if (i === 0) {
          const firstLetter = paragraph.charAt(0);
          const p = paragraph.substr(1, paragraph.length);
          return (
            <p key={i}>
              <span className="First-Character">{firstLetter}</span>
              {p}
            </p>
          );
        }
        return <p key={i}>{paragraph}</p>;
      });
    }
    return <p />;
  };

  render() {
    const { title, photos } = this.state;
    return (
      <div className="Template">
        <Container text>
          <div className="Title-Text">
            <p>{title}</p>
            {this.renderCreator()}
          </div>
          <Gallery photos={photos} onClick={this.openLightbox} />
          <br />
          <Linkify className="Body-Text">{this.renderParagraphs()}</Linkify>
        </Container>
        <Lightbox
          className="Lightbox"
          images={photos}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={this.state.currentImage}
          isOpen={this.state.lightboxIsOpen}
        />
      </div>
    );
  }
}

export default App;
