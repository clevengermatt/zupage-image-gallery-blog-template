import React, { Component } from "react";
import "./App.css";
import zupage from "zupage";
import Gallery from "react-photo-gallery";
import Lightbox from "react-images";
import { Container, Image } from "semantic-ui-react";

class App extends Component {
  state = {
    author: {},
    colorPalette: [],
    currentImage: 0,
    images: [],
    paragraphs: [],
    title: ""
  };
  async componentDidMount() {
    const postResponse = await zupage.getCurrentPost();

    const date = new Date(
      postResponse.published_time * 1000
    ).toLocaleDateString("en-US");

    this.setState({
      author: postResponse.creator,
      colorPalette: postResponse.page.color_palette,
      date: date,
      images: postResponse.images,
      paragraphs: this.paragraphs(postResponse),
      title: postResponse.title
    });
  }

  paragraphs = post => {
    if (post.body) {
      var body = post.body;
      body = body.substr(post.title.length, body.length);
      body = body.trim();
      return body.match(/[^\r\n]+/g);
    }
    return [];
  };

  photos = () => {
    const { images } = this.state;

    let photoArray = [];

    images.forEach(function(image) {
      photoArray.push({
        caption: image.caption,
        src: image.url,
        width: image.width,
        height: image.height
      });
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

  renderAuthor = () => {
    const { author, date } = this.state;
    return (
      <div className="Author">
        <Image className="Author-Image" src={author.profile_image_url} avatar />
        <span className="Author-Text">{author.name}</span>
        <p className="Date">{date}</p>
      </div>
    );
  };

  renderParagraphs = () => {
    const { paragraphs } = this.state;

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
  };

  render() {
    const { title } = this.state;
    return (
      <div className="Template">
        <Container text>
          <div className="Title-Text">
            <p>{title}</p>
            {this.renderAuthor()}
          </div>
          <Gallery photos={this.photos()} onClick={this.openLightbox} />
          <Lightbox
            images={this.photos()}
            onClose={this.closeLightbox}
            onClickPrev={this.gotoPrevious}
            onClickNext={this.gotoNext}
            currentImage={this.state.currentImage}
            isOpen={this.state.lightboxIsOpen}
          />
          <div className="Body-Text">{this.renderParagraphs()}</div>
        </Container>
      </div>
    );
  }
}

export default App;
